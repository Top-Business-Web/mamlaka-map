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

interface MapReference {
  map: MapInstance;
  ready: boolean;
}

const mapStore = useMapStore();
const mapRef = ref<MapReference | null>(null);
const mapZoom = ref(16);

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
        <CustomMarker @click="displayLoactionDialog(location)" v-for="(location, index) in mapStore.locations"
          :key="index" :options="{ position: location, anchorPoint: 'BOTTOM_CENTER' }">
          <span v-if="location.user_type === 'entity'"
            :style="`width: 2.5rem;height: 2.5rem;display:flex;justify-content:center;align-items:center;border-radius:50%;font-weight:bold;font-size:1rem; animation: pulse-entity 1.5s infinite;background-color: ${getMarkerBgColor(location.user_type)}`">
            <!-- <img
              src="/imgs/entity.svg"
              width="35rem"
              style="margin-top: 8px"
            /> -->
            <svg class="marker-icon-filter" width="2.2rem" height="2.3rem" viewBox="0 0 14 19" fill="none"
              xmlns="http://www.w3.org/2000/svg">
              <path
                d="M6.5625 0C2.93181 0 0 2.92533 0 6.548C0 7.81111 0.404387 9.0172 0.967013 10.0083L5.24385 17.394C5.51197 17.8764 6.05262 18.1176 6.5625 18.1176C7.07242 18.1176 7.58665 17.8764 7.88115 17.394L12.158 10.0127C12.725 9.0215 13.125 7.83733 13.125 6.5523C13.125 2.92971 10.1932 0 6.5625 0ZM6.5625 8.48213C5.24385 8.48213 4.16695 7.40761 4.16695 6.09187C4.16695 4.77613 5.24385 3.70161 6.5625 3.70161C7.88115 3.70161 8.95805 4.77613 8.95805 6.09187C8.95805 7.412 7.88115 8.48213 6.5625 8.48213Z"
                fill="#B49164" />
            </svg>
          </span>
          <span v-else class="marker-icon-filter d-flex justify-center align-center"
            :style="`width: 1.8rem;height: 1.8rem;display:flex;justify-content:center;align-items:center;border-radius:50%;font-weight:bold;font-size:1rem; animation: pulse-${location.user_type} 1.5s infinite;background-color: ${getMarkerBgColor(location.user_type)}`">
            <svg xmlns="http://www.w3.org/2000/svg" width="1.1rem" height="1.1rem" fill="white" viewBox="0 0 16 16">
              <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6" />
            </svg>
          </span>
        </CustomMarker>

        <CustomMarker @click="displayLoactionDialog(location)" v-for="(location, index) in mapStore.entites"
          :key="index" :options="{ position: location, anchorPoint: 'BOTTOM_CENTER' }">
          <span v-if="location.user_type === 'entity'"
            :style="`width: 2.5rem;height: 2.5rem;display:flex;justify-content:center;align-items:center;border-radius:50%;font-weight:bold;font-size:1rem; animation: pulse-entity 1.5s infinite;background-color: ${getMarkerBgColor(location.user_type)}`">
            <!-- <img
              src="/imgs/entity.svg"
              width="35rem"
              style="margin-top: 8px"
            /> -->
            <svg class="marker-icon-filter" width="2.2rem" height="2.3rem" viewBox="0 0 14 19" fill="none"
              xmlns="http://www.w3.org/2000/svg">
              <path
                d="M6.5625 0C2.93181 0 0 2.92533 0 6.548C0 7.81111 0.404387 9.0172 0.967013 10.0083L5.24385 17.394C5.51197 17.8764 6.05262 18.1176 6.5625 18.1176C7.07242 18.1176 7.58665 17.8764 7.88115 17.394L12.158 10.0127C12.725 9.0215 13.125 7.83733 13.125 6.5523C13.125 2.92971 10.1932 0 6.5625 0ZM6.5625 8.48213C5.24385 8.48213 4.16695 7.40761 4.16695 6.09187C4.16695 4.77613 5.24385 3.70161 6.5625 3.70161C7.88115 3.70161 8.95805 4.77613 8.95805 6.09187C8.95805 7.412 7.88115 8.48213 6.5625 8.48213Z"
                fill="#B49164" />
            </svg>
          </span>
          <span v-else class="marker-icon-filter d-flex justify-center align-center"
            :style="`width: 1.8rem;height: 1.8rem;display:flex;justify-content:center;align-items:center;border-radius:50%;font-weight:bold;font-size:1rem; animation: pulse-${location.user_type} 1.5s infinite;background-color: ${getMarkerBgColor(location.user_type)}`">
            <svg xmlns="http://www.w3.org/2000/svg" width="1.1rem" height="1.1rem" fill="white" viewBox="0 0 16 16">
              <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6" />
            </svg>
          </span>
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
