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


interface MapReference {
  map: MapInstance;
  ready: boolean;
}

const mapStore = useMapStore();
const mapRef = ref<MapReference | null>(null);
const mapZoom = ref(12);
const areaMarkerIcon = ref("")

const getMarkerBgColor = (locationType: LocationType) => {
  if (locationType == "entity") return "";

  return locationType == "observer" ? "#B49164" : "#5FA6A6";
};

const mapLocations = computed(() => [...mapStore.locations, ...mapStore.entites]);


// init map instance & init locations on the map
watch(
  () => mapRef.value?.ready,
  (isReady) => {
    if (isReady && mapRef.value?.map) {
      mapStore.setMapInstance(mapRef.value?.map);

      setTimeout(() => {
        // mapStore.getMapEntites();
        mapStore.getMapLocations();
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

const isEntityDetailsDialog = ref<boolean>(false);
const isOperatorDetailsDialog = ref<boolean>(false);
const isObserverDetailsDialog = ref<boolean>(false);
const selectedLocation = ref<MapLocation | null>(null);

const displayLoactionDialog = (loc: MapLocation) => {
  selectedLocation.value = loc;

  if (loc.user_type === "entity") {
    isEntityDetailsDialog.value = true;
    return;
  }

  if (loc.user_type === "operator") {
    isOperatorDetailsDialog.value = true;
    return;
  }

  if (loc.user_type === "observer") {
    isObserverDetailsDialog.value = true;
    return;
  }
};

const isObservers = ref<boolean>(false);
const isUsers = ref<boolean>(false);
const isLocations = ref<boolean>(false);

// watch(isEntityDetailsDialog, (isActive: boolean) => {
//   if (!isActive) {
//     selectedLocation.value = null;
//   }
// });
</script>

<template>
  <div class="interactive-map__wrapper">
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
        <CustomMarker @click="displayLoactionDialog(area)" v-for="(area, index) in mapStore.locations" :key="index"
          :options="{ position: { lat: parseFloat(area.location.north), lng: parseFloat(area.location.east) }, anchorPoint: 'BOTTOM_CENTER' }">
          <img v-if="area.type == 'موقف'" :src="stationMarker" alt="">
          <img v-if="area.type == 'باص'" :src="busMarker" alt="">
          <img v-if="area.type == 'سكة حديدية'" :src="trainMarker" alt="">
          <img v-if="area.type == 'طريق'" :src="highwayMarker" alt="">
          <img v-if="area.type == 'محطة'" :src="stationMarker" alt="">
        </CustomMarker>

        <CustomMarker @click="displayLoactionDialog(location)" v-for="(location, index) in mapStore.entites"
          :key="index" :options="{ position: { lat: location.lat, lng: location.long }, anchorPoint: 'BOTTOM_CENTER' }">
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="20" cy="20" r="15" :fill="location.role == 'مشرف' ? '#35685f' : '#857854'" />
            <circle cx="20" cy="20" r="17.5" :stroke="location.role == 'مشرف' ? '#35685f' : '#857854'"
              stroke-opacity="0.3" stroke-width="5" />
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

    <div v-if="isEntityDetailsDialog">
      <MapEntityDetailsDialog v-model="isEntityDetailsDialog" :location-details="selectedLocation" />
    </div>
    <div v-if="isOperatorDetailsDialog">
      <MapOperatorDetailsDialog v-model="isOperatorDetailsDialog" :location-details="selectedLocation" />
    </div>
    <div v-if="isObserverDetailsDialog">
      <MapObserverDetailsDialog v-model="isObserverDetailsDialog" :location-details="selectedLocation" />
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
