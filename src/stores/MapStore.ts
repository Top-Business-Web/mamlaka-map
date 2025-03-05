import { defineStore } from "pinia";
import http from "@/plugins/axios";
import { db } from "@/plugins/firebase";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  where,
  and,
  onSnapshot,
  limit,
  orderBy,
  query as firestoreQuery
} from "firebase/firestore";
import { toast } from "vue3-toastify";
import { useNProgress } from "@vueuse/integrations/useNProgress";
import "../../node_modules/nprogress/nprogress.css";
import { ref, onValue, query, limitToLast } from "firebase/database";
import { firestoreDB } from "@/plugins/firebase";
import axios from "axios";

const { isLoading } = useNProgress(null, {
  minimum: 0.5,
  easing: "ease-in-out",
  speed: 500
});

export type LocationType = "entity" | "observer" | "operator";
export interface MapLocation {
  id?: number;
  name?: string;
  lat: number;
  lng: number;
  user_type: LocationType;
}

export interface MapInstance {
  getBounds: Function;
  panTo: Function;
}

export type LocationPosition = Pick<MapLocation, "lat" | "lng">;

type VisibleCoordinates = {
  minLat: number;
  maxLat: number;
  minLng: number;
  maxLng: number;
};

// export type MapStatisticsFilterKeys = "start_date" | "shift" | "company" | "type";

// export interface MapStatisticsFilters {
//   start_date: string | null;
//   shift: string | null;
//   company: string | null;
//   type: string | null;
// }

// export interface MapStatisticsFilterResponse {
//   key: MapStatisticsFilterKeys;
//   values: { name: string; value: string }[];
// }

export type MapStatisticsFilterKeys = "search" | "parent" | "period" | "type";

export interface MapStatisticsFilters {
  search: string | null;
  parent: string | null;
  period: string | null;
  type: string | null;
}

export interface MapStatisticsFilterResponse {
  key: MapStatisticsFilterKeys;
  values: { name: string; value: string }[];
}

export interface MapStatisticsAttendance {
  absence_percent: number;
  attendance_percent: number;
  total_absence: number;
  total_attendance: number;
  total_observers: number;
  total_operators: number;
  total_staff: number;
  count_companies: number;
  count_visits: number;
  total_observers_count: number;
}

interface MapStatisticsTask {
  id: number;
  is_count: boolean;
  name: string;
  no: number;
  yes: number;
  count?: number;
}

interface LocationMapType {
  name: string;
  value: string;
  center: { lat: number; lng: number };
}

interface MapStageReports {
  count_audited_buses: number;
  count_highlevel: number;
  count_midlevel: number;
}

interface MapStoreState {
  mapInstance: MapInstance | null;
  mapCenter: LocationPosition;
  isMapDataLoading: boolean;
  locations: MapLocation[];
  entites: MapLocation[];
  displayOperators: boolean;
  displayObservers: boolean;
  displayEntities: boolean;
  unsubscribeRealtime: Function;
  isLoadingLocationDetails: boolean;
  isLoadingMapStatistics: boolean;
  isMapStatisticsError: boolean;
  isMapStatisticsFullscreen: boolean;
  isLoadingMapEntites: boolean;
  visibleCoordinates: VisibleCoordinates;
  mapStatisticsAttendance: MapStatisticsAttendance;
  mapStatisticsFiltersResponse: MapStatisticsFilterResponse[] | [];
  mapStatisticsTasks: MapStatisticsTask[] | [];
  mapStatisticsFilters: MapStatisticsFilters;
  locationMapTypes: LocationMapType[] | [];
  mapStageReports: MapStageReports;
  statsInterval: Function | null;
}

export const useMapStore = defineStore("MapStore", {
  state: (): MapStoreState => ({
    mapInstance: null,
    mapCenter: { lat: 21.4330661, lng: 39.8837069 }, //{ lat: 21.4151879, lng: 39.906732 }, // { lat: 21.4230661, lng: 39.8237069 }, // 21.4151879,39.906732
    isMapDataLoading: true,
    locations: [],
    entites: [],
    displayOperators: true,
    displayObservers: true,
    displayEntities: true,
    isLoadingLocationDetails: false,
    isLoadingMapStatistics: false,
    isMapStatisticsError: false,
    isMapStatisticsFullscreen: false,
    isLoadingMapEntites: false,
    unsubscribeRealtime: () => { },
    visibleCoordinates: {
      minLat: 0,
      maxLat: 0,
      minLng: 0,
      maxLng: 0
    },
    mapStatisticsAttendance: {
      absence_percent: 0,
      attendance_percent: 0,
      total_absence: 0,
      total_attendance: 0,
      total_observers: 0,
      total_operators: 0,
      total_staff: 0,
      count_companies: 0,
      count_visits: 0,
      total_observers_count: 0
    },
    mapStatisticsFiltersResponse: [],
    mapStatisticsTasks: [],
    mapStatisticsFilters: {
      search: null,
      parent: "0",
      period: null,
      type: null
    },
    locationMapTypes: [],
    mapStageReports: {
      count_audited_buses: 0,
      count_highlevel: 0,
      count_midlevel: 0
    },
    statsInterval: null
  }),
  actions: {
    setMapInstance(map: MapInstance) {
      this.mapInstance = map;
    },
    updateBoundsLocations() {
      if (!this.mapInstance) return;

      const { east, north, south, west } = this.mapInstance?.getBounds().toJSON();
      this.visibleCoordinates = {
        minLat: south,
        maxLat: north,
        minLng: west,
        maxLng: east
      };
    },
    getUserTypeParams() {
      const queryUserTypeParams = ["other"]; // 'other' is a dummy param => to fix empty query error
      if (this.displayObservers) queryUserTypeParams.push("observer");
      if (this.displayOperators) queryUserTypeParams.push("operator");
      if (this.displayEntities) queryUserTypeParams.push("entity");

      return queryUserTypeParams;
    },
    async getMapLocations(refreshData: boolean = false) {
      // if (!this.visibleCoordinates?.minLat || !this.visibleCoordinates?.minLng) return;
      const locationsRef = query(ref(db, "tracking")); // limitToLast(800)
      const locationsData: MapLocation[] = [];
      const entitesData: MapLocation[] = [];

      try {
        // this.isMapDataLoading = true;
        // isLoading.value = true;
        // onValue(
        //   locationsRef,
        //   async (snapshot) => {
        //     snapshot.forEach((childSnapshot) => {
        //       const childData = childSnapshot.val();

        //       if (childData && childData.id) {
        //         if (childData.type === "observer" && this.displayObservers) {
        //           locationsData.push({
        //             id: childData.id,
        //             lat: childData.lat,
        //             lng: childData.lng,
        //             user_type: childData.type
        //           });
        //         } else if (childData.type === "operator" && this.displayOperators) {
        //           locationsData.push({
        //             id: childData.id,
        //             lat: childData.lat,
        //             lng: childData.lng,
        //             user_type: childData.type
        //           });
        //         }
        //       }
        //     });

        //     this.locations = locationsData;
        //   },
        //   { onlyOnce: true }
        // );
        // const { minLat, maxLat, minLng, maxLng } = this.visibleCoordinates;
        // const q = query(
        //   collection(db, "locations"),
        //   and(
        //     where("user_type", "in", this.getUserTypeParams()),
        //     where("lat", ">=", minLat),
        //     where("lat", "<=", maxLat),
        //     where("lng", ">=", minLng),
        //     where("lng", "<=", maxLng)
        //   ),
        //   orderBy("lat"),
        //   limit(500)
        // );

        // this.unsubscribeRealtime = onSnapshot(q, (querySnapshot) => {
        //   const locationsData: MapLocation[] = [];

        //   querySnapshot.forEach((doc) => {
        //     locationsData.push(doc.data() as MapLocation);
        //   });

        //   this.locations = locationsData;
        // });
        const res = await axios.get(`api/v1/map/getAreasWithoutAxis`);
        this.locations = res.data.data
      } catch (err) {
        console.error("Error fetching data from reltime firebase DB:", err);
        // toast.error(`<p>حدث خطأ غير متوقع اثناء جلب الإحداثيات على الخريطة</p>`);
      } finally {
        this.isMapDataLoading = false;
        setTimeout(() => {
          isLoading.value = false;
        }, 1000);
      }

      try {
        if (this.displayEntities && !refreshData) {
          // this.getMapEntites();

          const { minLat, maxLat, minLng, maxLng } = this.visibleCoordinates;
          const q = firestoreQuery(
            collection(firestoreDB, "users"),
            and(
              // where("user_type", "in", this.getUserTypeParams()),
              where("lat", ">=", minLat),
              where("lat", "<=", maxLat),
              where("long", ">=", minLng),
              where("long", "<=", maxLng)
            ),
            orderBy("lat"),
            limit(500)
          );
          const querySnapshot = await getDocs(q);
          querySnapshot.forEach((doc) => {
            entitesData.push(doc.data());
          });

          this.entites = entitesData;
        } else {
          this.entites = [];
        }
      } catch (err) {
        console.error("Error fetching data from Firestore:", err);
      }
    },
    async updateMapLocations() {
      // this.unsubscribeRealtime();
      this.getMapLocations();
    },
    async getMapStatistics(needLoading: boolean = true) {
      this.isMapStatisticsError = false;

      if (needLoading) {
        this.isLoadingMapStatistics = true;
      }

      try {
        const res = await http.get("mobility/dashboard/auditing", {
          params: this.mapStatisticsFilters
        });
        const mapSats = res.data;

        if (mapSats) {
          const totalObservers = () => {
            if (!mapSats.attendance || !mapSats.attendance.jobs?.length) return 0;

            return mapSats.attendance.jobs[1]?.total_staff || 0;
          };
          this.mapStatisticsAttendance = {
            ...mapSats.attendance,
            count_companies: mapSats.count_companies,
            count_visits: mapSats.count_visits,
            total_observers_count: totalObservers()
          };
          this.mapStatisticsFiltersResponse =
            mapSats.filters.sort((a: any, b: any) => (a.key === "shift" ? -1 : 1)) || [];
          this.mapStatisticsTasks = mapSats.tasks || [];
          this.mapStageReports = mapSats.reports || {};

          this.locationMapTypes = mapSats.filterTypes?.values || [];
          const currentStageType = this.locationMapTypes.find((type) => type.isCurrent);

          if (currentStageType) {
            this.updateMapStatisticsFilter("type", currentStageType.value);
          }
        }

        if (this.statsInterval) {
          clearInterval(this.statsInterval);
          this.statsInterval = null;
        }

        this.statsInterval = setInterval(() => {
          this.getMapStatistics(false);
        }, 20000);
      } catch (err) {
        console.error(err);
        this.isMapStatisticsError = true;
      } finally {
        this.isLoadingMapStatistics = false;
      }
    },
    async getMapEntites() {
      this.isLoadingMapEntites = true;

      try {
        const { minLat, maxLat, minLng, maxLng } = this.visibleCoordinates;
        if (minLat && minLng) {
          const { data } = await http.get("mobility/map/locations", {
            params: {
              minLat,
              maxLat,
              minLng,
              maxLng
            }
          });
          const entitesLocations = data.data?.locations || [];

          entitesLocations.forEach(async (entityLocation: any) => {
            this.locations.push({
              id: entityLocation.id,
              lat: entityLocation.lat,
              lng: entityLocation.lng,
              user_type: "entity"
            });
            await addDoc(collection(firestoreDB, "locations"), {
              id: entityLocation.id,
              lat: entityLocation.lat,
              lng: entityLocation.lng,
              // name: entityLocation.name,
              user_type: "entity"
            });
          });
        }

        // if (mapSats) {
        //   this.mapStatisticsAttendance = {
        //     ...mapSats.attendance,
        //     count_companies: mapSats.count_companies,
        //     count_visits: mapSats.count_visits
        //   };
        //   this.mapStatisticsFiltersResponse =
        //     mapSats.filters.sort((a: any, b: any) => (a.key === "shift" ? -1 : 1)) || [];
        //   this.mapStatisticsTasks = mapSats.tasks || [];
        // }
      } catch (err) {
        console.error(err);
      } finally {
        this.isLoadingMapEntites = false;
      }
    },
    // resetStatisticsFilters() {
    //   this.mapStatisticsFilters = {
    //     start_date: null,
    //     shift: null,
    //     company: null,
    //     type: "mina_tafweej_readiness"
    //   };
    // },
    resetStatisticsFilters() {
      this.mapStatisticsFilters = {
        search: null,
        parent: "0",
        period: null,
        type: null
      };
    },
    resetMapStatisticsAttendance() {
      this.mapStatisticsAttendance = {
        absence_percent: 0,
        attendance_percent: 0,
        total_absence: 0,
        total_attendance: 0,
        total_observers: 0,
        total_operators: 0,
        total_staff: 0,
        count_companies: 0,
        count_visits: 0,
        total_observers_count: 0
      };
    },
    updateMapStatisticsFilter(key: MapStatisticsFilterKeys, value: string) {
      this.mapStatisticsFilters[key] = value;
    },
    toggleLocationTypeVisibility(
      locationType: "Operators" | "Observers" | "Entities",
      status: boolean
    ) {
      this[`display${locationType}`] = status;
    },
    toggleMapStatisticsFullscreen(status: boolean) {
      this.isMapStatisticsFullscreen = status;
    }
  }
});
