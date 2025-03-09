<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useDebounceFn } from "@vueuse/core";
import { MapConfigs } from "@/config";
import { GoogleMap, MarkerCluster, CustomMarker } from "vue3-google-map";
import {
  useMapStore,
  type MapLocation,
  type MapInstance,
  type LocationType
} from "@/stores/MapStore";
import MapPanel from "../global/MapPanel.vue";
import stationMarker from "@/assets/imgs/markers-icons/station.svg";
import carStationMarker from "@/assets/imgs/markers-icons/car-station.svg";
import busMarker from "@/assets/imgs/markers-icons/bus-station.svg";
import highwayMarker from "@/assets/imgs/markers-icons/highway.svg";
import trainMarker from "@/assets/imgs/markers-icons/train.svg";
import SupervisorDetailsModal from "./modals/supervisorDetailsModal.vue";
import UserDetailsModal from "./modals/userDetailsModal.vue";
import AreaDetailsModal from "./modals/AreaDetailsModal.vue";
import ReportDetailsModal from "./modals/reportDetailsModal.vue"
import MapFooter from "../global/MapFooter.vue";
import MapTopNavbar from "../global/MapTopNavbar.vue";
import http from "@/plugins/axios";


interface MapReference {
  map: MapInstance;
  ready: boolean;
}

const mapStore = useMapStore();
const mapRef = ref<MapReference | null>(null);
const mapZoom = ref(12);
const areas = ref([]);

async function getAreas(type = "") {
  const res = await http.get(`v1/map/getAreasWithoutAxis`);
  areas.value = res.data.data;
  filterAreaTypes(type)
}

function filterAreaTypes(type = "") {
  if (type == "0") {
    areas.value = areas.value.filter(location => (location.type == "موقف"));
  }
  if (type == "1") {
    areas.value = areas.value.filter(location => (location.type == "باص"));
  }
  if (type == "2") {
    areas.value = areas.value.filter(location => (location.type == "سكة حديدية"));
  }
  if (type == "3") {
    areas.value = areas.value.filter(location => (location.type == "طريق"));
  }
  if (type == "4") {
    areas.value = areas.value.filter(location => (location.type == "محطة"));
  }
}

// init map instance & init locations on the map
watch(
  () => mapRef.value?.ready,
  (isReady) => {
    if (isReady && mapRef.value?.map) {
      mapStore.setMapInstance(mapRef.value?.map);
      setTimeout(() => {
        mapStore.getMapUsers();
        getAreas();
      }, 0);
    }
  }
);

// debounce refresh map as per updating map window
const debouncedFn = useDebounceFn(() => {
  mapStore.updateMapLocations();
}, 800);

watch(
  () => mapStore.visibleCoordinates,
  () => debouncedFn()
);

const isUserDetails = ref<boolean>(false);
const isSupervisorDetails = ref<boolean>(false);
const isAreaDetails = ref<boolean>(false);
const isReportDetails = ref<boolean>(false);
const clickedMarkerId = ref<object | null>(null);
const clickedUserId = ref<object | null>(null);

const displayUserDetails = (markerId) => {
  clickedMarkerId.value = markerId;
  isUserDetails.value = true;
};
const displaySupervisorDetails = (markerId) => {
  clickedMarkerId.value = markerId;
  isSupervisorDetails.value = true;
};
const displayAreaDetails = (markerId) => {
  clickedMarkerId.value = markerId;
  isAreaDetails.value = true;
};
const displayReportDetails = (markerId, userId) => {
  clickedMarkerId.value = markerId;
  clickedUserId.value = userId;
  isReportDetails.value = true;
};

const isUsers = ref<boolean>(true);
const isSupervisors = ref<boolean>(true);
const isAreas = ref<boolean>(true);

function showMarkers(targetInput) {
  if (targetInput.getAttribute("aria-label") == "عرض الموظفين") {
    isUsers.value = targetInput.checked
    return
  }
  if (targetInput.getAttribute("aria-label") == "عرض المشرفين") {
    isSupervisors.value = targetInput.checked
    return
  }
  if (targetInput.getAttribute("aria-label") == "عرض المواقع") {
    isAreas.value = targetInput.checked
    return
  }
}

</script>

<template>

  <div class="interactive-map__wrapper">
    <MapTopNavbar @changeTypeHandler="getAreas" />
    <transition name="scale" mode="out-in">
      <div v-if="mapStore.isMapStatisticsFullscreen" class=""></div>
    </transition>
    <!-- <MapStatisticsPanel /> -->
    <MapPanel />
    <transition name="scale" mode="out-in">
      <MapLoader v-if="mapStore.isMapDataLoading" style="z-index: 99" />
    </transition>

    <GoogleMap ref="mapRef" :api-key="MapConfigs.mapToken" style="width: 100%; height: 500px"
      :center="mapStore.mapCenter" :zoom="mapZoom" :mapTypeControl="false" :streetViewControl="false"
      :fullscreenControl="false" :styles="MapConfigs.mapStyles" class="interactive-map__body" language="ar"
      @bounds_changed="mapStore.updateBoundsLocations">
      <template #default="{ ready, api, map, mapTilesLoaded }">
        <MapLoader v-if="!ready" style="z-index: 98; background-color: #000" />
        <!-- <MarkerCluster> -->
        <CustomMarker v-if="isAreas" v-for="(area, index) in areas" :key="index"
          :options="{ position: { lat: parseFloat(area.location.north), lng: parseFloat(area.location.east) }, anchorPoint: 'BOTTOM_CENTER' }"
          @click="displayAreaDetails(area.id)">
          <img v-if="area.type == 'موقف'" :src="carStationMarker" alt="">
          <img v-if="area.type == 'باص'" :src="busMarker" alt="">
          <img v-if="area.type == 'سكة حديدية'" :src="trainMarker" alt="">
          <img v-if="area.type == 'طريق'" :src="highwayMarker" alt="">
          <img v-if="area.type == 'محطة'" :src="stationMarker" alt="">
        </CustomMarker>
        <CustomMarker v-if="isSupervisors" v-for="(supervisor, index) in mapStore.supervisors" :key="index"
          :options="{ position: { lat: supervisor.lat, lng: supervisor.long }, anchorPoint: 'BOTTOM_CENTER' }"
          @click="displaySupervisorDetails(supervisor.user_id)">
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="20" cy="20" r="15" fill="#35685f" />
            <circle cx="20" cy="20" r="17.5" stroke="#35685f" stroke-opacity="0.3" stroke-width="5" />
            <g clip-path="url(#clip0_1_35095)">
              <path
                d="M19.5 13C17.6099 13 16.0723 14.5377 16.0723 16.4277C16.0723 18.3178 17.6099 19.8555 19.5 19.8555C21.3901 19.8555 22.9277 18.3178 22.9277 16.4277C22.9277 14.5377 21.3901 13 19.5 13Z"
                fill="white" />
              <path
                d="M23.7648 22.0948C22.8263 21.1419 21.5823 20.6172 20.2617 20.6172H18.7383C17.4178 20.6172 16.1737 21.1419 15.2352 22.0948C14.3014 23.043 13.7871 24.2946 13.7871 25.6191C13.7871 25.8295 13.9576 26 14.168 26H24.832C25.0424 26 25.2129 25.8295 25.2129 25.6191C25.2129 24.2946 24.6986 23.043 23.7648 22.0948Z"
                fill="white" />
            </g>
            <defs>
              <clipPath id="clip0_1_35095">
                <rect width="13" height="13" fill="white" transform="translate(13 13)" />
              </clipPath>
            </defs>
          </svg>
        </CustomMarker>
        <CustomMarker v-if="isUsers" v-for="(user, index) in mapStore.users" :key="index"
          :options="{ position: { lat: user.lat, lng: user.long }, anchorPoint: 'BOTTOM_CENTER' }"
          @click="displayUserDetails(user.user_id)">
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="20" cy="20" r="15" fill="#857854" />
            <circle cx="20" cy="20" r="17.5" stroke="#857854" stroke-opacity="0.3" stroke-width="5" />
            <g clip-path="url(#clip0_1_35095)">
              <path
                d="M19.5 13C17.6099 13 16.0723 14.5377 16.0723 16.4277C16.0723 18.3178 17.6099 19.8555 19.5 19.8555C21.3901 19.8555 22.9277 18.3178 22.9277 16.4277C22.9277 14.5377 21.3901 13 19.5 13Z"
                fill="white" />
              <path
                d="M23.7648 22.0948C22.8263 21.1419 21.5823 20.6172 20.2617 20.6172H18.7383C17.4178 20.6172 16.1737 21.1419 15.2352 22.0948C14.3014 23.043 13.7871 24.2946 13.7871 25.6191C13.7871 25.8295 13.9576 26 14.168 26H24.832C25.0424 26 25.2129 25.8295 25.2129 25.6191C25.2129 24.2946 24.6986 23.043 23.7648 22.0948Z"
                fill="white" />
            </g>
            <defs>
              <clipPath id="clip0_1_35095">
                <rect width="13" height="13" fill="white" transform="translate(13 13)" />
              </clipPath>
            </defs>
          </svg>
        </CustomMarker>
        <!-- </MarkerCluster> -->
      </template>
    </GoogleMap>
    <MapFooter @showMarkers="showMarkers" />

    <div v-if="isUserDetails">
      <UserDetailsModal v-model="isUserDetails" :markerId="clickedMarkerId" @reportShowHandler="displayReportDetails" />
    </div>
    <div v-if="isSupervisorDetails">
      <SupervisorDetailsModal v-model="isSupervisorDetails" :markerId="clickedMarkerId"
        @supervisorShowHandler="displaySupervisorDetails" @userShowHandler="displayUserDetails" />
    </div>
    <div v-if="isAreaDetails">
      <AreaDetailsModal v-model="isAreaDetails" :markerId="clickedMarkerId"
        @supervisorShowHandler="displaySupervisorDetails" @userShowHandler="displayUserDetails" />
    </div>
    <div v-if="isReportDetails">
      <ReportDetailsModal v-model="isReportDetails" :markerId="clickedMarkerId" :userId="clickedUserId" />
    </div>
  </div>
</template>

<style lang="scss">
.marker-icon-filter {
  filter: drop-shadow(2px 2px 4px rgba(0, 0, 0, 0.5));
}

body {
  .interactive-map {

    &__wrapper,
    &__body {
      height: 100vh !important;
    }

    &__wrapper {
      position: relative;
      width: 100vw;
    }

    &__overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 9998;
      background: #000;
    }
  }

  .mapboxgl-ctrl-bottom-left,
  .mapboxgl-ctrl-bottom-right {
    display: none !important;
  }

  .gmnoprint {
    display: none;
  }
}

@keyframes pulse-observer {
  0% {
    box-shadow: 0 0 0 0 rgba(180, 145, 100, 0.4);
  }

  25% {
    box-shadow: 0 0 0 10px rgba(180, 145, 100, 0.4);
  }

  50% {
    box-shadow: 0 0 0 15px rgba(180, 145, 100, 0);
  }

  75% {
    box-shadow: 0 0 0 10px rgba(180, 145, 100, 0);
  }

  100% {
    box-shadow: 0 0 0 0 rgba(180, 145, 100, 0);
  }
}

@keyframes pulse-operator {
  0% {
    box-shadow: 0 0 0 0 rgba(95, 166, 166, 0.4);
  }

  25% {
    box-shadow: 0 0 0 10px rgba(95, 166, 166, 0.4);
  }

  50% {
    box-shadow: 0 0 0 15px rgba(95, 166, 166, 0);
  }

  75% {
    box-shadow: 0 0 0 10px rgba(95, 166, 166, 0);
  }

  100% {
    box-shadow: 0 0 0 0 rgba(95, 166, 166, 0);
  }
}

// @keyframes pulse-operator {
//   0% {
//     box-shadow: 0 0 0 0 rgba(167, 136, 255, 0.4);
//   }
//   25% {
//     box-shadow: 0 0 0 10px rgba(167, 136, 255, 0.4);
//   }
//   50% {
//     box-shadow: 0 0 0 15px rgba(167, 136, 255, 0);
//   }
//   75% {
//     box-shadow: 0 0 0 10px rgba(167, 136, 255, 0);
//   }
//   100% {
//     box-shadow: 0 0 0 0 rgba(167, 136, 255, 0);
//   }
// }</style>
