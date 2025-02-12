<script setup>
// import { useMapStore } from "@/stores/MapStore";

// const mapStore = useMapStore();

// onMounted(() => {

// });
</script>

<template>
  <RouterView />
</template>

<style lang="scss">
@import url("https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@100;200;300;400;500;600;700&display=swap");
@import url("https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/css/select2.min.css");
// src: url(@/assets/fonts/Montserrat-Arabic-Regular.ttf);
// @font-face {
//   font-family: 'Montserrat Arabic';
//   src: url(@/assets/fonts/IBMPlexArabic/IBMPlexArabic.ttf);
//   font-weight: 400;
// }

.ibm-plex-sans-arabic {
  font-family: "IBM Plex Sans Arabic", sans-serif;
  font-weight: 400;
  font-style: normal;
}

#app {
  height: 100vh;
  overflow: hidden;
}

html {
  overflow-y: initial !important;
  font-family: "IBM Plex Sans Arabic", sans-serif !important;
}

html,
body {
  * {
    font-family: "IBM Plex Sans Arabic", sans-serif;
    font-weight: 400;
    box-sizing: border-box;
  }

  text.apexcharts-datalabel-value {
    font-weight: bold !important;
  }

  .v-card-title,
  .v-card-title *,
  .text-h1,
  .text-h2,
  .text-h3,
  .text-h4,
  .text-h5,
  .text-h6,
  .v-date-picker__title {
    font-family: "IBM Plex Sans Arabic", sans-serif;
    font-weight: 400;
    letter-spacing: 0;
  }

  .v-picker {
    & > div {
      background-color: #383838;
    }
    .v-picker-title {
      display: none;
    }
  }
}
</style>
