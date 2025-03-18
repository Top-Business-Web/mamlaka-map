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
    &>div {
      background-color: #383838;
    }

    .v-picker-title {
      display: none;
    }
  }
}
</style>

<style>
input,
select {
  box-shadow: none !important;
  outline: none !important;
  border: none !important;
  background-color: #383838 !important;
  padding: 10px 15px;
  border-radius: 8px !important;
  font-size: 14px !important;
  font-weight: 600 !important;
  height: 100% !important;
  width: 100%;
}

option:hover {
  background-color: red !important;
}

input::placeholder {
  color: #fff;
}

select {
  cursor: pointer;
}

.input_wrapper {
  position: relative;
}

.input_wrapper img {
  position: absolute;
  top: 50%;
  right: 15px;
  transform: translateY(-50%);
}

.input_wrapper input {
  padding-inline-start: 45px;
}

.select_wrapper {
  position: relative;
}

.select_wrapper img {
  position: absolute;
  top: 50%;
  left: 15px;
  transform: translateY(-50%);
}

.select_wrapper select {
  padding-inline-end: 45px;
}

input.dark_bg,
select.dark_bg {
  background-color: #303030 !important;
}
</style>
