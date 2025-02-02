<script setup>
import { MapConfigs } from "@/config";
import {
  MapboxMap,
  MapboxMarker,
  MapboxImage,
  MapboxImages,
  MapboxCluster,
  MapboxLayer
} from "@studiometa/vue-mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useMapStore } from "@/stores/MapStore";

const mapStore = useMapStore();

// const center = { lat: 21.4230661, lng: 39.8237069 } // for Google map
// lng           // lat
const center = ref([39.8237069, 21.4230661]);

const locations = [
  { lat: 21.435641, lng: 39.8198201 },
  { lat: 21.435641, lng: 39.8198201 },
  { lat: 21.435641, lng: 39.8198201 },
  { lat: 21.4228764, lng: 39.8231598 }
];

// [-103.5917, 40.6699]

const mapboxMap = ref();
const map = computed(() => mapboxMap.value.map);

const images = [
  {
    src: "/imgs/point-observers.png",
    id: "observer"
  },
  {
    src: "/imgs/point-operators.png",
    id: "operator"
  }
];

//   const images = [
//     {
//       src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/70/Dog_silhouette.svg/429px-Dog_silhouette.svg.png',
//       id: 'dog',
//     },
//     {
//       src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/60/Cat_silhouette.svg/400px-Cat_silhouette.svg.png',
//       id: 'cat',
//     },
//   ];

const layerOptions = {
  type: "symbol",
  source: {
    type: "geojson",
    data: {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          properties: {
            icon: "observer"
          },
          geometry: {
            type: "Point",
            coordinates: [39.7170953, 21.415294]
          }
        },
        {
          type: "Feature",
          properties: {
            icon: "operator"
          },
          geometry: {
            type: "Point",
            coordinates: [39.7889298, 21.4197495]
          }
        }
      ]
    }
  },
  layout: {
    "icon-image": ["get", "icon"],
    "icon-size": 0.25
  }
};

const getMarkerBgColor = (locationType) => {
  if (locationType == "entity") return "";

  return locationType == "observer" ? "#B49164" : "#5FA6A6";
};

onMounted(() => {
  mapStore.getMapLocations();
});
</script>

<template>
  <div class="interactive-map__wrapper">
    <transition name="scale" mode="out-in">
      <div v-if="mapStore.isMapStatisticsFullscreen" class="interactive-map__overlay"></div>
    </transition>
    <MapStatisticsPanel />
    <transition name="scale" mode="out-in">
      <MapLoader v-if="mapStore.isMapDataLoading" style="z-index: 99" />
    </transition>
    <MapboxMap
      v-if="mapStore.locations && mapStore.locations.length"
      ref="mapboxMap"
      :access-token="MapConfigs.mapToken"
      :center="center"
      :zoom="11"
      map-style="mapbox://styles/zimam/clwcpmr2e00dp01qrh7t074o1"
      class="interactive-map__body"
    >
      <!-- <MapboxImages :sources="images">
            
            <MapboxCluster
                data="/map/zimam.geojson"
                :clustersPaint="{'circle-color': '#B49164', 'circle-radius': 25}"
                :clusterProperties="{}"
            >
            </MapboxCluster>
        </MapboxImages> -->
      <!-- <MapboxLayer id="pois" :options="layerOptions"/> -->
      <!-- <MapboxCluster
                    data="/map/zimam.geojson"
                    :clustersPaint="{'circle-color': '#B49164', 'circle-radius': 25}"
                    :clusterProperties="{}"
                /> -->
      <!-- <MapboxMarker position="[0, 0]" :lngLat="[39.8237069, 21.4230661]"/> -->
      <!-- :unclustered-point-layout="{
                // 'icon-image': 'pointImg',
                'icon-size': 0.1,
            }" -->
      <!-- :unclustered-point-paint="null" -->
      <!-- box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px; -->
      <!-- unclustered-point-layer-type="symbol" -->
      <!-- <MapboxImages :sources="images">
                <MapboxCluster
                    data="/map/zimam.geojson"
                    :clustersPaint="{'circle-color': '#B49164', 'circle-radius': 25}"
                    :clusterProperties="{}"
                />
            </MapboxImages>-->
      <!-- :clusterProperties="{}" -->
      <!-- <MapboxImage id="pointImg" src="/imgs/point-operators.png">
        <MapboxCluster
          data="/map/zimam.geojson"
          :clustersPaint="{
            'circle-color': '#B49164',
            'circle-radius': 25,
            'circle-shadow': 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px'
          }"
          :unclustered-point-layout="{
            'icon-image': 'pointImg',
            'icon-size': 0.15
          }"
          :unclustered-point-paint="null"
          unclustered-point-layer-type="symbol"
        />
      </MapboxImage> -->
      <MapboxMarker
        v-for="(loc, index) in mapStore.locations"
        :key="index"
        :lngLat="[loc.lng, loc.lat]"
        color="blue"
      >
        <span
          v-if="loc.user_type === 'entity'"
          :style="`width: 2.5rem;height: 2.5rem;display:flex;justify-content:center;align-items:center;border-radius:50%;font-weight:bold;font-size:1rem; animation: pulse-entity 1.5s infinite;background-color: ${getMarkerBgColor(loc.user_type)}`"
        >
          <!-- <img
              src="/imgs/entity.svg"
              width="35rem"
              style="margin-top: 8px"
            /> -->
          <svg
            class="marker-icon-filter"
            width="2.2rem"
            height="2.3rem"
            viewBox="0 0 14 19"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M6.5625 0C2.93181 0 0 2.92533 0 6.548C0 7.81111 0.404387 9.0172 0.967013 10.0083L5.24385 17.394C5.51197 17.8764 6.05262 18.1176 6.5625 18.1176C7.07242 18.1176 7.58665 17.8764 7.88115 17.394L12.158 10.0127C12.725 9.0215 13.125 7.83733 13.125 6.5523C13.125 2.92971 10.1932 0 6.5625 0ZM6.5625 8.48213C5.24385 8.48213 4.16695 7.40761 4.16695 6.09187C4.16695 4.77613 5.24385 3.70161 6.5625 3.70161C7.88115 3.70161 8.95805 4.77613 8.95805 6.09187C8.95805 7.412 7.88115 8.48213 6.5625 8.48213Z"
              fill="#B49164"
            />
          </svg>
        </span>
        <span
          v-else
          class="marker-icon-filter d-flex justify-center align-center"
          :style="`width: 1.8rem;height: 1.8rem;display:flex;justify-content:center;align-items:center;border-radius:50%;font-weight:bold;font-size:1rem; animation: pulse-${loc.user_type} 1.5s infinite;background-color: ${getMarkerBgColor(loc.user_type)}`"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="1.1rem"
            height="1.1rem"
            fill="white"
            viewBox="0 0 16 16"
          >
            <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6" />
          </svg>
        </span>
      </MapboxMarker>
    </MapboxMap>
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
    box-shadow: 0 0 0 5px rgba(180, 145, 100, 0.4);
  }
  50% {
    box-shadow: 0 0 0 10px rgba(180, 145, 100, 0);
  }
  75% {
    box-shadow: 0 0 0 5px rgba(180, 145, 100, 0);
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
    box-shadow: 0 0 0 5px rgba(95, 166, 166, 0.4);
  }
  50% {
    box-shadow: 0 0 0 10px rgba(95, 166, 166, 0);
  }
  75% {
    box-shadow: 0 0 0 5px rgba(95, 166, 166, 0);
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
// }
</style>
