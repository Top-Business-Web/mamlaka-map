<script setup lang="ts">
import { ref, watch } from "vue";
import { useMapStore } from "@/stores/MapStore";

// import { db } from "@/plugins/firebase";
// import { collection, addDoc } from "firebase/firestore";
// // import loctionsData from '@/data/locations.json'
// import homesData from "@/data/homes-data.json";

import selaLogo from "@/assets/imgs/full_royal_comm.png";
import companyLogo from "@/assets/imgs/logo.png";

const mapStore = useMapStore();

// const adding = ref(false);
// const displyOperators = ref(true);
// const displyObservers = ref(true);
// const displayEntities = ref(true);

// watch(displyOperators, (status) => {
//   mapStore.toggleLocationTypeVisibility("Operators", status);
//   mapStore.updateMapLocations();
// });

// watch(displyObservers, (status) => {
//   mapStore.toggleLocationTypeVisibility("Observers", status);
//   mapStore.updateMapLocations();
// });

// watch(displayEntities, (status) => {
//   mapStore.toggleLocationTypeVisibility("Entities", status);
//   mapStore.updateMapLocations();
// });

// const addData = async () => {
//   try {
//     adding.value = true;

//     for (let index = 1401; index < 2500; index++) {
//       const loc = homesData[index];

//       loc.lat = parseFloat(loc.lat);
//       loc.lng = parseFloat(loc.lng);

//       await addDoc(collection(db, "locations"), loc);
//     }
//   } catch (err) {
//     console.error(err);
//   } finally {
//     adding.value = false;
//   }
// };
</script>

<template>
  <v-footer app flat tile elevation="0" class="map-footer bg-transparent pb-2 pt-0 px-8 px-xl-12" style="z-index: 9999">
    <div class="w-100 d-flex align-center justify-space-between">
      <div class="d-flex align-center ga-4 py-2">
        <!-- <v-img src="/imgs/zimam-logo.svg" width="80"></v-img> -->
        <v-img :src="companyLogo" width="110"></v-img>
      </div>

      <transition name="scale">
        <div v-if="!mapStore.isMapStatisticsFullscreen" class="d-flex align-center ga-4">
          <v-switch :model-value="true" label="عرض الموظفين" hide-details inset class="custom-switch" color="#857854"
            @click="$emit('showMarkers', $event.target)"></v-switch>
          <v-switch :model-value="true" label="عرض المشرفين" hide-details inset class="custom-switch" color="#35685F"
            @click="$emit('showMarkers', $event.target)"></v-switch>
          <v-switch :model-value="true" label="عرض المواقع" hide-details inset class="custom-switch" color="#5FA6A6"
            @click="$emit('showMarkers', $event.target)"></v-switch>
        </div>
      </transition>
    </div>
  </v-footer>
</template>