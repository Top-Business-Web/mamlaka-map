<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';

const windowHeight = ref<number>(0);
const columnHeight = computed(() => windowHeight.value / 3 - 20 + 'px');
const largeColumnHeight = computed(() => windowHeight.value - windowHeight.value / 3 - 24 + 'px');
const isLoading = ref<boolean>(true);
const pageNumber = ref<number>(1);

const onResize = () => {
  windowHeight.value = window.innerHeight - 112;
};

const series = [
  {
    name: 'Inflation',
    data: [30, 70]
  }
];
const langSeries = [
  {
    name: 'Inflation',
    data: [30, 70, 20, 100, 50]
  }
];
const chartOptions = {
  chart: {
    type: 'bar',
    width: 85,
    height: 35,
    sparkline: {
      enabled: true
    }
  },
  tooltip: {
    enabled: false
  },
  plotOptions: {
    bar: {
      borderRadius: 7,
      dataLabels: {
        position: 'top' // top, center, bottom
      },
      columnWidth: '60%'
    }
  },
  //   colors: ['#E7C394', '#6F7277'],
  fill: {
    colors: ['#E7C394', '#6F7277']
  },
  dataLabels: {
    enabled: true,
    formatter: function (val) {
      return val + '%';
    },
    offsetY: -15,
    style: {
      fontSize: '12px',
      colors: ['#fff']
    }
  },
  legend: {
    show: false
  },
  xaxis: {
    categories: ['ksa', 'nonksa'],
    position: 'top',
    axisBorder: {
      show: false
    },
    axisTicks: {
      show: false
    },
    crosshairs: {
      width: 1
    }
  },
  yaxis: {
    axisBorder: {
      show: false
    },
    axisTicks: {
      show: false
    },
    labels: {
      show: false,
      formatter: function (val) {
        return val + '%';
      }
    }
  }
};

const langChartOptions = {
  chart: {
    type: 'bar',
    width: 100,
    height: 350,
    sparkline: {
      enabled: true
    }
  },
  plotOptions: {
    bar: {
      borderRadius: 4,
      borderRadiusApplication: 'end',
      horizontal: true
    }
  },
  tooltip: {
    enabled: false
  },
  fill: {
    colors: ['#E7C394', '#6F7277']
  },
  dataLabels: {
    enabled: true,
    formatter: function (val) {
      return val + '%';
    },
    // offsetX: 0,
    offsetY: 0,
    style: {
      fontSize: '12px',
      colors: ['#fff']
    }
  },
  xaxis: {
    categories: ['18-24', '25-34', '35-44', '45-54', '55+'],
    position: 'top',
    axisBorder: {
      show: false
    },
    axisTicks: {
      show: false
    },
    crosshairs: {
      width: 0.5,
      height: 0.5
    }
  },
  yaxis: {
    axisBorder: {
      show: false
    },
    axisTicks: {
      show: false
    },
    crosshairs: {
      width: 0.5,
      height: 0.5
    },
    labels: {
      show: false,
      formatter: function (val) {
        return val + '%';
      }
    }
  }
};

onMounted(() => {
  setTimeout(() => {
    isLoading.value = false;
  }, 3000);
});
</script>

<template>
  <v-container fluid>
    <div class="pt-6">
      <Transition>
        <div
          v-if="isLoading"
          style="height: calc(100vh - 120px)"
          class="d-flex justify-center align-center"
        >
          <!-- bg-color="#B49164" -->
          <v-progress-circular
            :size="70"
            :width="7"
            color="#E7C394"
            indeterminate
          ></v-progress-circular>
        </div>
        <div v-else>
          <v-row v-if="pageNumber === 1" align="stretch" no-gutters v-resize="onResize">
            <v-col cols="12" md="5" class="h-100">
              <draggable class="v-row v-row--no-gutters w-100">
                <v-col cols="12" class="position-relative">
                  <span class="drag-icon"
                    ><svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="1.5rem"
                      height="1.5rem"
                      viewBox="0 0 14 14"
                    >
                      <path
                        fill="none"
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="m13.478 11.832l-.46-2.757a2.573 2.573 0 0 0-2.961-2.114l-2.171.362l-.683-4.09a1.194 1.194 0 0 0-1.374-.98v0c-.65.108-1.09.723-.98 1.374l.894 5.36l-.363.133a1.715 1.715 0 0 0-.643 2.803l.184.19l.954.988M1.75.5L.5 1.75L1.75 3M.5 1.75h3M10.25.5l1.25 1.25L10.25 3m1.25-1.25h-3"
                      /></svg
                  ></span>
                  <v-card :height="largeColumnHeight" class="card-rounded ma-2 pa-4">
                    <div class="h-100 d-flex flex-column">
                      <div class="position-absolute left-20 top-20">
                        <v-chip dir="ltr" class="px-4">+250</v-chip>
                      </div>
                      <div class="h-100 d-flex flex-column align-center justify-center">
                        <h2 class="text-h2 font-inherit mb-3 font-weight-bold" dir="ltr">30,000</h2>
                        <h4>إجمالي عدد الإستبيانات</h4>
                      </div>
                    </div>
                  </v-card>
                </v-col>
                <!-- <v-col cols="12" class="position-relative">
                  <span class="drag-icon"
                    ><svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="1.5rem"
                      height="1.5rem"
                      viewBox="0 0 14 14"
                    >
                      <path
                        fill="none"
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="m13.478 11.832l-.46-2.757a2.573 2.573 0 0 0-2.961-2.114l-2.171.362l-.683-4.09a1.194 1.194 0 0 0-1.374-.98v0c-.65.108-1.09.723-.98 1.374l.894 5.36l-.363.133a1.715 1.715 0 0 0-.643 2.803l.184.19l.954.988M1.75.5L.5 1.75L1.75 3M.5 1.75h3M10.25.5l1.25 1.25L10.25 3m1.25-1.25h-3"
                      /></svg
                  ></span>
                  <v-card :height="largeColumnHeight" class="card-rounded ma-2 pa-4">
                    <div class="d-flex ga-2 mb-2 ps-3">
                      <span>هدف التوظيف والمتحقق منه</span>
                      <v-btn icon size="sm">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          viewBox="0 0 18 18"
                          fill="none"
                        >
                          <circle cx="9" cy="9" r="9" fill="#484B4F" />
                          <path
                            d="M8.89 9.77V9.07C8.63667 9.04333 8.39667 8.98 8.17 8.88C7.94333 8.78 7.74333 8.64667 7.57 8.48C7.39667 8.31333 7.25667 8.12 7.15 7.9C7.05 7.68 7 7.44 7 7.18C7 6.84667 7.05333 6.54667 7.16 6.28C7.27333 6.00667 7.43333 5.77667 7.64 5.59C7.84667 5.39667 8.09 5.25 8.37 5.15C8.65667 5.05 8.97667 5 9.33 5C9.67 5 9.97 5.04667 10.23 5.14C10.4967 5.22667 10.7267 5.34333 10.92 5.49C11.12 5.63667 11.29 5.80333 11.43 5.99C11.57 6.17 11.6867 6.35333 11.78 6.54L10.41 7.25C10.3767 7.17 10.3267 7.09 10.26 7.01C10.2 6.93 10.12 6.86 10.02 6.8C9.92 6.73333 9.80333 6.68 9.67 6.64C9.53667 6.59333 9.38333 6.57 9.21 6.57C8.95 6.57 8.72667 6.63 8.54 6.75C8.35333 6.86333 8.26 7.03667 8.26 7.27C8.26 7.42333 8.29333 7.56 8.36 7.68C8.42667 7.79333 8.53333 7.89 8.68 7.97C8.83333 8.05 9.03 8.11333 9.27 8.16C9.51 8.20667 9.80333 8.23333 10.15 8.24V9.77H8.89ZM9.53 12.21C9.23 12.21 9.00667 12.1367 8.86 11.99C8.72 11.8367 8.65 11.6433 8.65 11.41V11.21C8.65 10.9767 8.72 10.7867 8.86 10.64C9.00667 10.4867 9.23 10.41 9.53 10.41C9.83 10.41 10.05 10.4867 10.19 10.64C10.3367 10.7867 10.41 10.9767 10.41 11.21V11.41C10.41 11.6433 10.3367 11.8367 10.19 11.99C10.05 12.1367 9.83 12.21 9.53 12.21Z"
                            fill="white"
                          />
                        </svg>
                        <v-tooltip activator="parent" location="top">
                          معلومات افتراضية تعرض هنا
                        </v-tooltip>
                      </v-btn>
                    </div>
                  </v-card>
                </v-col> -->
              </draggable>
            </v-col>
            <v-col cols="12" md="7" class="h-100">
              <!-- <v-row align="stretch" no-gutters> -->
              <!-- :list="list" -->
              <draggable class="v-row v-row--no-gutters align-stretch w-100">
                <!-- nationality -->
                <v-col cols="12" md="6" class="position-relative">
                  <span class="drag-icon"
                    ><svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="1.5rem"
                      height="1.5rem"
                      viewBox="0 0 14 14"
                    >
                      <path
                        fill="none"
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="m13.478 11.832l-.46-2.757a2.573 2.573 0 0 0-2.961-2.114l-2.171.362l-.683-4.09a1.194 1.194 0 0 0-1.374-.98v0c-.65.108-1.09.723-.98 1.374l.894 5.36l-.363.133a1.715 1.715 0 0 0-.643 2.803l.184.19l.954.988M1.75.5L.5 1.75L1.75 3M.5 1.75h3M10.25.5l1.25 1.25L10.25 3m1.25-1.25h-3"
                      /></svg
                  ></span>
                  <v-card :height="columnHeight" class="card-rounded ma-2 pa-4">
                    <div class="h-100 d-flex flex-column">
                      <div class="d-flex justify-center ga-2 mb-6 ps-3">
                        <span>السعوديين والأجانب</span>
                        <v-btn icon size="sm">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 18 18"
                            fill="none"
                          >
                            <circle cx="9" cy="9" r="9" fill="#484B4F" />
                            <path
                              d="M8.89 9.77V9.07C8.63667 9.04333 8.39667 8.98 8.17 8.88C7.94333 8.78 7.74333 8.64667 7.57 8.48C7.39667 8.31333 7.25667 8.12 7.15 7.9C7.05 7.68 7 7.44 7 7.18C7 6.84667 7.05333 6.54667 7.16 6.28C7.27333 6.00667 7.43333 5.77667 7.64 5.59C7.84667 5.39667 8.09 5.25 8.37 5.15C8.65667 5.05 8.97667 5 9.33 5C9.67 5 9.97 5.04667 10.23 5.14C10.4967 5.22667 10.7267 5.34333 10.92 5.49C11.12 5.63667 11.29 5.80333 11.43 5.99C11.57 6.17 11.6867 6.35333 11.78 6.54L10.41 7.25C10.3767 7.17 10.3267 7.09 10.26 7.01C10.2 6.93 10.12 6.86 10.02 6.8C9.92 6.73333 9.80333 6.68 9.67 6.64C9.53667 6.59333 9.38333 6.57 9.21 6.57C8.95 6.57 8.72667 6.63 8.54 6.75C8.35333 6.86333 8.26 7.03667 8.26 7.27C8.26 7.42333 8.29333 7.56 8.36 7.68C8.42667 7.79333 8.53333 7.89 8.68 7.97C8.83333 8.05 9.03 8.11333 9.27 8.16C9.51 8.20667 9.80333 8.23333 10.15 8.24V9.77H8.89ZM9.53 12.21C9.23 12.21 9.00667 12.1367 8.86 11.99C8.72 11.8367 8.65 11.6433 8.65 11.41V11.21C8.65 10.9767 8.72 10.7867 8.86 10.64C9.00667 10.4867 9.23 10.41 9.53 10.41C9.83 10.41 10.05 10.4867 10.19 10.64C10.3367 10.7867 10.41 10.9767 10.41 11.21V11.41C10.41 11.6433 10.3367 11.8367 10.19 11.99C10.05 12.1367 9.83 12.21 9.53 12.21Z"
                              fill="white"
                            />
                          </svg>
                          <v-tooltip activator="parent" location="top">
                            معلومات افتراضية تعرض هنا
                          </v-tooltip>
                        </v-btn>
                      </div>
                      <v-row class="h-100">
                        <v-col cols="7" class="d-flex flex-column justify-center ps-6">
                          <div class="mb-4">
                            <h3>25,000</h3>
                            <div class="d-flex align-center ga-2">
                              <v-badge class="mb-1" dot color="primary"></v-badge>
                              <span class="text-caption">السعوديين</span>
                            </div>
                          </div>
                          <div class="">
                            <h3>5,000</h3>
                            <div class="d-flex align-center ga-2">
                              <v-badge class="mb-1" dot color="secondary"></v-badge>
                              <span class="text-caption">الأجانب</span>
                            </div>
                          </div>
                        </v-col>
                        <v-col cols="5" class="d-flex flex-column justify-center pa-0">
                          <apexchart
                            type="bar"
                            :height="120"
                            :width="120"
                            :options="chartOptions"
                            :series="series"
                          ></apexchart>
                        </v-col>
                      </v-row>
                    </div>
                  </v-card>
                </v-col>
                <!-- gender -->
                <v-col cols="12" md="6">
                  <span class="drag-icon"
                    ><svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="1.5rem"
                      height="1.5rem"
                      viewBox="0 0 14 14"
                    >
                      <path
                        fill="none"
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="m13.478 11.832l-.46-2.757a2.573 2.573 0 0 0-2.961-2.114l-2.171.362l-.683-4.09a1.194 1.194 0 0 0-1.374-.98v0c-.65.108-1.09.723-.98 1.374l.894 5.36l-.363.133a1.715 1.715 0 0 0-.643 2.803l.184.19l.954.988M1.75.5L.5 1.75L1.75 3M.5 1.75h3M10.25.5l1.25 1.25L10.25 3m1.25-1.25h-3"
                      /></svg
                  ></span>
                  <v-card :height="columnHeight" class="card-rounded ma-2 pa-4">
                    <div class="h-100 d-flex flex-column">
                      <div class="d-flex justify-center ga-2 mb-6 ps-3">
                        <span>الذكور والاناث</span>
                        <v-btn icon size="sm">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 18 18"
                            fill="none"
                          >
                            <circle cx="9" cy="9" r="9" fill="#484B4F" />
                            <path
                              d="M8.89 9.77V9.07C8.63667 9.04333 8.39667 8.98 8.17 8.88C7.94333 8.78 7.74333 8.64667 7.57 8.48C7.39667 8.31333 7.25667 8.12 7.15 7.9C7.05 7.68 7 7.44 7 7.18C7 6.84667 7.05333 6.54667 7.16 6.28C7.27333 6.00667 7.43333 5.77667 7.64 5.59C7.84667 5.39667 8.09 5.25 8.37 5.15C8.65667 5.05 8.97667 5 9.33 5C9.67 5 9.97 5.04667 10.23 5.14C10.4967 5.22667 10.7267 5.34333 10.92 5.49C11.12 5.63667 11.29 5.80333 11.43 5.99C11.57 6.17 11.6867 6.35333 11.78 6.54L10.41 7.25C10.3767 7.17 10.3267 7.09 10.26 7.01C10.2 6.93 10.12 6.86 10.02 6.8C9.92 6.73333 9.80333 6.68 9.67 6.64C9.53667 6.59333 9.38333 6.57 9.21 6.57C8.95 6.57 8.72667 6.63 8.54 6.75C8.35333 6.86333 8.26 7.03667 8.26 7.27C8.26 7.42333 8.29333 7.56 8.36 7.68C8.42667 7.79333 8.53333 7.89 8.68 7.97C8.83333 8.05 9.03 8.11333 9.27 8.16C9.51 8.20667 9.80333 8.23333 10.15 8.24V9.77H8.89ZM9.53 12.21C9.23 12.21 9.00667 12.1367 8.86 11.99C8.72 11.8367 8.65 11.6433 8.65 11.41V11.21C8.65 10.9767 8.72 10.7867 8.86 10.64C9.00667 10.4867 9.23 10.41 9.53 10.41C9.83 10.41 10.05 10.4867 10.19 10.64C10.3367 10.7867 10.41 10.9767 10.41 11.21V11.41C10.41 11.6433 10.3367 11.8367 10.19 11.99C10.05 12.1367 9.83 12.21 9.53 12.21Z"
                              fill="white"
                            />
                          </svg>
                          <v-tooltip activator="parent" location="top">
                            معلومات افتراضية تعرض هنا
                          </v-tooltip>
                        </v-btn>
                      </div>
                      <v-row class="h-100">
                        <v-col cols="7" class="d-flex flex-column justify-center ps-6">
                          <div class="mb-4">
                            <h3>20,000</h3>
                            <div class="d-flex align-center ga-2">
                              <v-badge class="mb-1" dot color="primary"></v-badge>
                              <span class="text-caption">الذكور</span>
                            </div>
                          </div>
                          <div class="">
                            <h3>10,000</h3>
                            <div class="d-flex align-center ga-2">
                              <v-badge class="mb-1" dot color="secondary"></v-badge>
                              <span class="text-caption">الاناث</span>
                            </div>
                          </div>
                        </v-col>
                        <v-col cols="5" class="d-flex flex-column justify-center pa-0">
                          <apexchart
                            type="bar"
                            :height="120"
                            :width="120"
                            :options="chartOptions"
                            :series="series"
                          ></apexchart>
                        </v-col>
                      </v-row>
                    </div>
                  </v-card>
                </v-col>
                <!-- age -->
                <!-- <v-col cols="12" md="6">
                  <span class="drag-icon"
                    ><svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="1.5rem"
                      height="1.5rem"
                      viewBox="0 0 14 14"
                    >
                      <path
                        fill="none"
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="m13.478 11.832l-.46-2.757a2.573 2.573 0 0 0-2.961-2.114l-2.171.362l-.683-4.09a1.194 1.194 0 0 0-1.374-.98v0c-.65.108-1.09.723-.98 1.374l.894 5.36l-.363.133a1.715 1.715 0 0 0-.643 2.803l.184.19l.954.988M1.75.5L.5 1.75L1.75 3M.5 1.75h3M10.25.5l1.25 1.25L10.25 3m1.25-1.25h-3"
                      /></svg
                  ></span>
                  <v-card :height="columnHeight" class="card-rounded ma-2 pa-4">
                    <div class="d-flex justify-center ga-2 mb-2 ps-3">
                      <span>معدل الأعمار</span>
                      <v-btn icon size="sm">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          viewBox="0 0 18 18"
                          fill="none"
                        >
                          <circle cx="9" cy="9" r="9" fill="#484B4F" />
                          <path
                            d="M8.89 9.77V9.07C8.63667 9.04333 8.39667 8.98 8.17 8.88C7.94333 8.78 7.74333 8.64667 7.57 8.48C7.39667 8.31333 7.25667 8.12 7.15 7.9C7.05 7.68 7 7.44 7 7.18C7 6.84667 7.05333 6.54667 7.16 6.28C7.27333 6.00667 7.43333 5.77667 7.64 5.59C7.84667 5.39667 8.09 5.25 8.37 5.15C8.65667 5.05 8.97667 5 9.33 5C9.67 5 9.97 5.04667 10.23 5.14C10.4967 5.22667 10.7267 5.34333 10.92 5.49C11.12 5.63667 11.29 5.80333 11.43 5.99C11.57 6.17 11.6867 6.35333 11.78 6.54L10.41 7.25C10.3767 7.17 10.3267 7.09 10.26 7.01C10.2 6.93 10.12 6.86 10.02 6.8C9.92 6.73333 9.80333 6.68 9.67 6.64C9.53667 6.59333 9.38333 6.57 9.21 6.57C8.95 6.57 8.72667 6.63 8.54 6.75C8.35333 6.86333 8.26 7.03667 8.26 7.27C8.26 7.42333 8.29333 7.56 8.36 7.68C8.42667 7.79333 8.53333 7.89 8.68 7.97C8.83333 8.05 9.03 8.11333 9.27 8.16C9.51 8.20667 9.80333 8.23333 10.15 8.24V9.77H8.89ZM9.53 12.21C9.23 12.21 9.00667 12.1367 8.86 11.99C8.72 11.8367 8.65 11.6433 8.65 11.41V11.21C8.65 10.9767 8.72 10.7867 8.86 10.64C9.00667 10.4867 9.23 10.41 9.53 10.41C9.83 10.41 10.05 10.4867 10.19 10.64C10.3367 10.7867 10.41 10.9767 10.41 11.21V11.41C10.41 11.6433 10.3367 11.8367 10.19 11.99C10.05 12.1367 9.83 12.21 9.53 12.21Z"
                            fill="white"
                          />
                        </svg>
                        <v-tooltip activator="parent" location="top">
                          معلومات افتراضية تعرض هنا
                        </v-tooltip>
                      </v-btn>
                    </div>
                  </v-card>
                </v-col> -->
                <!-- city -->
                <!-- <v-col cols="12" md="6">
                  <span class="drag-icon"
                    ><svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="1.5rem"
                      height="1.5rem"
                      viewBox="0 0 14 14"
                    >
                      <path
                        fill="none"
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="m13.478 11.832l-.46-2.757a2.573 2.573 0 0 0-2.961-2.114l-2.171.362l-.683-4.09a1.194 1.194 0 0 0-1.374-.98v0c-.65.108-1.09.723-.98 1.374l.894 5.36l-.363.133a1.715 1.715 0 0 0-.643 2.803l.184.19l.954.988M1.75.5L.5 1.75L1.75 3M.5 1.75h3M10.25.5l1.25 1.25L10.25 3m1.25-1.25h-3"
                      /></svg
                  ></span>
                  <v-card :height="columnHeight" class="card-rounded ma-2 pa-4">
                    <div class="d-flex justify-center ga-2 mb-2 ps-3">
                      <span>المدينة</span>
                      <v-btn icon size="sm">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          viewBox="0 0 18 18"
                          fill="none"
                        >
                          <circle cx="9" cy="9" r="9" fill="#484B4F" />
                          <path
                            d="M8.89 9.77V9.07C8.63667 9.04333 8.39667 8.98 8.17 8.88C7.94333 8.78 7.74333 8.64667 7.57 8.48C7.39667 8.31333 7.25667 8.12 7.15 7.9C7.05 7.68 7 7.44 7 7.18C7 6.84667 7.05333 6.54667 7.16 6.28C7.27333 6.00667 7.43333 5.77667 7.64 5.59C7.84667 5.39667 8.09 5.25 8.37 5.15C8.65667 5.05 8.97667 5 9.33 5C9.67 5 9.97 5.04667 10.23 5.14C10.4967 5.22667 10.7267 5.34333 10.92 5.49C11.12 5.63667 11.29 5.80333 11.43 5.99C11.57 6.17 11.6867 6.35333 11.78 6.54L10.41 7.25C10.3767 7.17 10.3267 7.09 10.26 7.01C10.2 6.93 10.12 6.86 10.02 6.8C9.92 6.73333 9.80333 6.68 9.67 6.64C9.53667 6.59333 9.38333 6.57 9.21 6.57C8.95 6.57 8.72667 6.63 8.54 6.75C8.35333 6.86333 8.26 7.03667 8.26 7.27C8.26 7.42333 8.29333 7.56 8.36 7.68C8.42667 7.79333 8.53333 7.89 8.68 7.97C8.83333 8.05 9.03 8.11333 9.27 8.16C9.51 8.20667 9.80333 8.23333 10.15 8.24V9.77H8.89ZM9.53 12.21C9.23 12.21 9.00667 12.1367 8.86 11.99C8.72 11.8367 8.65 11.6433 8.65 11.41V11.21C8.65 10.9767 8.72 10.7867 8.86 10.64C9.00667 10.4867 9.23 10.41 9.53 10.41C9.83 10.41 10.05 10.4867 10.19 10.64C10.3367 10.7867 10.41 10.9767 10.41 11.21V11.41C10.41 11.6433 10.3367 11.8367 10.19 11.99C10.05 12.1367 9.83 12.21 9.53 12.21Z"
                            fill="white"
                          />
                        </svg>
                        <v-tooltip activator="parent" location="top">
                          معلومات افتراضية تعرض هنا
                        </v-tooltip>
                      </v-btn>
                    </div>
                  </v-card>
                </v-col> -->
                <!-- languages -->
                <v-col cols="12" md="6">
                  <span class="drag-icon"
                    ><svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="1.5rem"
                      height="1.5rem"
                      viewBox="0 0 14 14"
                    >
                      <path
                        fill="none"
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="m13.478 11.832l-.46-2.757a2.573 2.573 0 0 0-2.961-2.114l-2.171.362l-.683-4.09a1.194 1.194 0 0 0-1.374-.98v0c-.65.108-1.09.723-.98 1.374l.894 5.36l-.363.133a1.715 1.715 0 0 0-.643 2.803l.184.19l.954.988M1.75.5L.5 1.75L1.75 3M.5 1.75h3M10.25.5l1.25 1.25L10.25 3m1.25-1.25h-3"
                      /></svg
                  ></span>
                  <v-card :height="columnHeight" class="card-rounded ma-2 pa-4">
                    <div class="h-100 d-flex flex-column">
                      <div class="d-flex justify-center ga-2 mb-6 ps-3">
                        <span>اللغات</span>
                        <v-btn icon size="sm">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 18 18"
                            fill="none"
                          >
                            <circle cx="9" cy="9" r="9" fill="#484B4F" />
                            <path
                              d="M8.89 9.77V9.07C8.63667 9.04333 8.39667 8.98 8.17 8.88C7.94333 8.78 7.74333 8.64667 7.57 8.48C7.39667 8.31333 7.25667 8.12 7.15 7.9C7.05 7.68 7 7.44 7 7.18C7 6.84667 7.05333 6.54667 7.16 6.28C7.27333 6.00667 7.43333 5.77667 7.64 5.59C7.84667 5.39667 8.09 5.25 8.37 5.15C8.65667 5.05 8.97667 5 9.33 5C9.67 5 9.97 5.04667 10.23 5.14C10.4967 5.22667 10.7267 5.34333 10.92 5.49C11.12 5.63667 11.29 5.80333 11.43 5.99C11.57 6.17 11.6867 6.35333 11.78 6.54L10.41 7.25C10.3767 7.17 10.3267 7.09 10.26 7.01C10.2 6.93 10.12 6.86 10.02 6.8C9.92 6.73333 9.80333 6.68 9.67 6.64C9.53667 6.59333 9.38333 6.57 9.21 6.57C8.95 6.57 8.72667 6.63 8.54 6.75C8.35333 6.86333 8.26 7.03667 8.26 7.27C8.26 7.42333 8.29333 7.56 8.36 7.68C8.42667 7.79333 8.53333 7.89 8.68 7.97C8.83333 8.05 9.03 8.11333 9.27 8.16C9.51 8.20667 9.80333 8.23333 10.15 8.24V9.77H8.89ZM9.53 12.21C9.23 12.21 9.00667 12.1367 8.86 11.99C8.72 11.8367 8.65 11.6433 8.65 11.41V11.21C8.65 10.9767 8.72 10.7867 8.86 10.64C9.00667 10.4867 9.23 10.41 9.53 10.41C9.83 10.41 10.05 10.4867 10.19 10.64C10.3367 10.7867 10.41 10.9767 10.41 11.21V11.41C10.41 11.6433 10.3367 11.8367 10.19 11.99C10.05 12.1367 9.83 12.21 9.53 12.21Z"
                              fill="white"
                            />
                          </svg>
                          <v-tooltip activator="parent" location="top">
                            معلومات افتراضية تعرض هنا
                          </v-tooltip>
                        </v-btn>
                      </div>
                      <div class="w-100 h-100 d-flex flex-column justify-center ga-2">
                        <div class="w-100 d-flex">
                          <div class="w-100">
                            <apexchart
                              type="bar"
                              :height="115"
                              :options="langChartOptions"
                              :series="langSeries"
                            ></apexchart>
                          </div>
                          <div style="width: 50px" class="d-flex justify-end">
                            <ul
                              style="list-style: none"
                              class="w-auto d-flex flex-column ga-1 ma-0 mt-n1"
                            >
                              <li class="text-caption font-weight-bold">18-24</li>
                              <li class="text-caption font-weight-bold">25-34</li>
                              <li class="text-caption font-weight-bold">35-44</li>
                              <li class="text-caption font-weight-bold">45-54</li>
                              <li class="text-caption font-weight-bold">55+</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </v-card>
                </v-col>
                <!-- qualification -->
                <v-col cols="12" md="6">
                  <span class="drag-icon"
                    ><svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="1.5rem"
                      height="1.5rem"
                      viewBox="0 0 14 14"
                    >
                      <path
                        fill="none"
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="m13.478 11.832l-.46-2.757a2.573 2.573 0 0 0-2.961-2.114l-2.171.362l-.683-4.09a1.194 1.194 0 0 0-1.374-.98v0c-.65.108-1.09.723-.98 1.374l.894 5.36l-.363.133a1.715 1.715 0 0 0-.643 2.803l.184.19l.954.988M1.75.5L.5 1.75L1.75 3M.5 1.75h3M10.25.5l1.25 1.25L10.25 3m1.25-1.25h-3"
                      /></svg
                  ></span>
                  <v-card :height="columnHeight" class="card-rounded ma-2 pa-4">
                    <div class="h-100 d-flex flex-column">
                      <div class="d-flex justify-center ga-2 mb-6 ps-3">
                        <span>المؤهل العلمي</span>
                        <v-btn icon size="sm">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 18 18"
                            fill="none"
                          >
                            <circle cx="9" cy="9" r="9" fill="#484B4F" />
                            <path
                              d="M8.89 9.77V9.07C8.63667 9.04333 8.39667 8.98 8.17 8.88C7.94333 8.78 7.74333 8.64667 7.57 8.48C7.39667 8.31333 7.25667 8.12 7.15 7.9C7.05 7.68 7 7.44 7 7.18C7 6.84667 7.05333 6.54667 7.16 6.28C7.27333 6.00667 7.43333 5.77667 7.64 5.59C7.84667 5.39667 8.09 5.25 8.37 5.15C8.65667 5.05 8.97667 5 9.33 5C9.67 5 9.97 5.04667 10.23 5.14C10.4967 5.22667 10.7267 5.34333 10.92 5.49C11.12 5.63667 11.29 5.80333 11.43 5.99C11.57 6.17 11.6867 6.35333 11.78 6.54L10.41 7.25C10.3767 7.17 10.3267 7.09 10.26 7.01C10.2 6.93 10.12 6.86 10.02 6.8C9.92 6.73333 9.80333 6.68 9.67 6.64C9.53667 6.59333 9.38333 6.57 9.21 6.57C8.95 6.57 8.72667 6.63 8.54 6.75C8.35333 6.86333 8.26 7.03667 8.26 7.27C8.26 7.42333 8.29333 7.56 8.36 7.68C8.42667 7.79333 8.53333 7.89 8.68 7.97C8.83333 8.05 9.03 8.11333 9.27 8.16C9.51 8.20667 9.80333 8.23333 10.15 8.24V9.77H8.89ZM9.53 12.21C9.23 12.21 9.00667 12.1367 8.86 11.99C8.72 11.8367 8.65 11.6433 8.65 11.41V11.21C8.65 10.9767 8.72 10.7867 8.86 10.64C9.00667 10.4867 9.23 10.41 9.53 10.41C9.83 10.41 10.05 10.4867 10.19 10.64C10.3367 10.7867 10.41 10.9767 10.41 11.21V11.41C10.41 11.6433 10.3367 11.8367 10.19 11.99C10.05 12.1367 9.83 12.21 9.53 12.21Z"
                              fill="white"
                            />
                          </svg>
                          <v-tooltip activator="parent" location="top">
                            معلومات افتراضية تعرض هنا
                          </v-tooltip>
                        </v-btn>
                      </div>
                      <div class="w-100 h-100 d-flex flex-column justify-center ga-2">
                        <div class="w-100 d-flex">
                          <div class="w-100">
                            <apexchart
                              type="bar"
                              :height="115"
                              :options="langChartOptions"
                              :series="langSeries"
                            ></apexchart>
                          </div>
                          <div style="width: 50px" class="d-flex justify-end">
                            <ul
                              style="list-style: none"
                              class="w-auto d-flex flex-column ga-1 ma-0 mt-n1"
                            >
                              <li class="text-caption font-weight-bold">18-24</li>
                              <li class="text-caption font-weight-bold">25-34</li>
                              <li class="text-caption font-weight-bold">35-44</li>
                              <li class="text-caption font-weight-bold">45-54</li>
                              <li class="text-caption font-weight-bold">55+</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </v-card>
                </v-col>
              </draggable>
            </v-col>
          </v-row>
          <v-row v-if="pageNumber === 2" align="stretch" no-gutters v-resize="onResize">
            <v-col cols="12" md="5" class="h-100">
              <draggable class="v-row v-row--no-gutters w-100">
                <v-col cols="12" class="position-relative">
                  <span class="drag-icon"
                    ><svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="1.5rem"
                      height="1.5rem"
                      viewBox="0 0 14 14"
                    >
                      <path
                        fill="none"
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="m13.478 11.832l-.46-2.757a2.573 2.573 0 0 0-2.961-2.114l-2.171.362l-.683-4.09a1.194 1.194 0 0 0-1.374-.98v0c-.65.108-1.09.723-.98 1.374l.894 5.36l-.363.133a1.715 1.715 0 0 0-.643 2.803l.184.19l.954.988M1.75.5L.5 1.75L1.75 3M.5 1.75h3M10.25.5l1.25 1.25L10.25 3m1.25-1.25h-3"
                      /></svg
                  ></span>
                  <v-card :height="largeColumnHeight" class="card-rounded ma-2 pa-4">
                    <div class="h-100 d-flex flex-column">
                      <div class="position-absolute left-20 top-20">
                        <v-chip dir="ltr" class="px-4">+250</v-chip>
                      </div>
                      <div class="h-100 d-flex flex-column align-center justify-center">
                        <h2 class="text-h2 font-inherit mb-3 font-weight-bold" dir="ltr">30,520</h2>
                        <h4>متقدم على الوظائف الموسمية</h4>
                      </div>
                    </div>
                  </v-card>
                </v-col>
                <!-- <v-col cols="12" class="position-relative">
                  <span class="drag-icon"
                    ><svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="1.5rem"
                      height="1.5rem"
                      viewBox="0 0 14 14"
                    >
                      <path
                        fill="none"
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="m13.478 11.832l-.46-2.757a2.573 2.573 0 0 0-2.961-2.114l-2.171.362l-.683-4.09a1.194 1.194 0 0 0-1.374-.98v0c-.65.108-1.09.723-.98 1.374l.894 5.36l-.363.133a1.715 1.715 0 0 0-.643 2.803l.184.19l.954.988M1.75.5L.5 1.75L1.75 3M.5 1.75h3M10.25.5l1.25 1.25L10.25 3m1.25-1.25h-3"
                      /></svg
                  ></span>
                  <v-card :height="largeColumnHeight" class="card-rounded ma-2 pa-4">
                    <div class="d-flex ga-2 mb-2 ps-3">
                      <span>هدف التوظيف والمتحقق منه</span>
                      <v-btn icon size="sm">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          viewBox="0 0 18 18"
                          fill="none"
                        >
                          <circle cx="9" cy="9" r="9" fill="#484B4F" />
                          <path
                            d="M8.89 9.77V9.07C8.63667 9.04333 8.39667 8.98 8.17 8.88C7.94333 8.78 7.74333 8.64667 7.57 8.48C7.39667 8.31333 7.25667 8.12 7.15 7.9C7.05 7.68 7 7.44 7 7.18C7 6.84667 7.05333 6.54667 7.16 6.28C7.27333 6.00667 7.43333 5.77667 7.64 5.59C7.84667 5.39667 8.09 5.25 8.37 5.15C8.65667 5.05 8.97667 5 9.33 5C9.67 5 9.97 5.04667 10.23 5.14C10.4967 5.22667 10.7267 5.34333 10.92 5.49C11.12 5.63667 11.29 5.80333 11.43 5.99C11.57 6.17 11.6867 6.35333 11.78 6.54L10.41 7.25C10.3767 7.17 10.3267 7.09 10.26 7.01C10.2 6.93 10.12 6.86 10.02 6.8C9.92 6.73333 9.80333 6.68 9.67 6.64C9.53667 6.59333 9.38333 6.57 9.21 6.57C8.95 6.57 8.72667 6.63 8.54 6.75C8.35333 6.86333 8.26 7.03667 8.26 7.27C8.26 7.42333 8.29333 7.56 8.36 7.68C8.42667 7.79333 8.53333 7.89 8.68 7.97C8.83333 8.05 9.03 8.11333 9.27 8.16C9.51 8.20667 9.80333 8.23333 10.15 8.24V9.77H8.89ZM9.53 12.21C9.23 12.21 9.00667 12.1367 8.86 11.99C8.72 11.8367 8.65 11.6433 8.65 11.41V11.21C8.65 10.9767 8.72 10.7867 8.86 10.64C9.00667 10.4867 9.23 10.41 9.53 10.41C9.83 10.41 10.05 10.4867 10.19 10.64C10.3367 10.7867 10.41 10.9767 10.41 11.21V11.41C10.41 11.6433 10.3367 11.8367 10.19 11.99C10.05 12.1367 9.83 12.21 9.53 12.21Z"
                            fill="white"
                          />
                        </svg>
                        <v-tooltip activator="parent" location="top">
                          معلومات افتراضية تعرض هنا
                        </v-tooltip>
                      </v-btn>
                    </div>
                  </v-card>
                </v-col> -->
              </draggable>
            </v-col>
            <v-col cols="12" md="7" class="h-100">
              <!-- <v-row align="stretch" no-gutters> -->
              <!-- :list="list" -->
              <draggable class="v-row v-row--no-gutters align-stretch w-100">
                <!-- nationality -->
                <v-col cols="12" md="6" class="position-relative">
                  <span class="drag-icon"
                    ><svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="1.5rem"
                      height="1.5rem"
                      viewBox="0 0 14 14"
                    >
                      <path
                        fill="none"
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="m13.478 11.832l-.46-2.757a2.573 2.573 0 0 0-2.961-2.114l-2.171.362l-.683-4.09a1.194 1.194 0 0 0-1.374-.98v0c-.65.108-1.09.723-.98 1.374l.894 5.36l-.363.133a1.715 1.715 0 0 0-.643 2.803l.184.19l.954.988M1.75.5L.5 1.75L1.75 3M.5 1.75h3M10.25.5l1.25 1.25L10.25 3m1.25-1.25h-3"
                      /></svg
                  ></span>
                  <v-card :height="columnHeight" class="card-rounded ma-2 pa-4">
                    <div class="h-100 d-flex flex-column">
                      <div class="d-flex justify-center ga-2 mb-6 ps-3">
                        <span>السعوديين والأجانب</span>
                        <v-btn icon size="sm">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 18 18"
                            fill="none"
                          >
                            <circle cx="9" cy="9" r="9" fill="#484B4F" />
                            <path
                              d="M8.89 9.77V9.07C8.63667 9.04333 8.39667 8.98 8.17 8.88C7.94333 8.78 7.74333 8.64667 7.57 8.48C7.39667 8.31333 7.25667 8.12 7.15 7.9C7.05 7.68 7 7.44 7 7.18C7 6.84667 7.05333 6.54667 7.16 6.28C7.27333 6.00667 7.43333 5.77667 7.64 5.59C7.84667 5.39667 8.09 5.25 8.37 5.15C8.65667 5.05 8.97667 5 9.33 5C9.67 5 9.97 5.04667 10.23 5.14C10.4967 5.22667 10.7267 5.34333 10.92 5.49C11.12 5.63667 11.29 5.80333 11.43 5.99C11.57 6.17 11.6867 6.35333 11.78 6.54L10.41 7.25C10.3767 7.17 10.3267 7.09 10.26 7.01C10.2 6.93 10.12 6.86 10.02 6.8C9.92 6.73333 9.80333 6.68 9.67 6.64C9.53667 6.59333 9.38333 6.57 9.21 6.57C8.95 6.57 8.72667 6.63 8.54 6.75C8.35333 6.86333 8.26 7.03667 8.26 7.27C8.26 7.42333 8.29333 7.56 8.36 7.68C8.42667 7.79333 8.53333 7.89 8.68 7.97C8.83333 8.05 9.03 8.11333 9.27 8.16C9.51 8.20667 9.80333 8.23333 10.15 8.24V9.77H8.89ZM9.53 12.21C9.23 12.21 9.00667 12.1367 8.86 11.99C8.72 11.8367 8.65 11.6433 8.65 11.41V11.21C8.65 10.9767 8.72 10.7867 8.86 10.64C9.00667 10.4867 9.23 10.41 9.53 10.41C9.83 10.41 10.05 10.4867 10.19 10.64C10.3367 10.7867 10.41 10.9767 10.41 11.21V11.41C10.41 11.6433 10.3367 11.8367 10.19 11.99C10.05 12.1367 9.83 12.21 9.53 12.21Z"
                              fill="white"
                            />
                          </svg>
                          <v-tooltip activator="parent" location="top">
                            معلومات افتراضية تعرض هنا
                          </v-tooltip>
                        </v-btn>
                      </div>
                      <v-row class="h-100">
                        <v-col cols="7" class="d-flex flex-column justify-center ps-6">
                          <div class="mb-4">
                            <h3>25,430</h3>
                            <div class="d-flex align-center ga-2">
                              <v-badge class="mb-1" dot color="primary"></v-badge>
                              <span class="text-caption">السعوديين</span>
                            </div>
                          </div>
                          <div class="">
                            <h3>5,212</h3>
                            <div class="d-flex align-center ga-2">
                              <v-badge class="mb-1" dot color="secondary"></v-badge>
                              <span class="text-caption">الأجانب</span>
                            </div>
                          </div>
                        </v-col>
                        <v-col cols="5" class="d-flex flex-column justify-center pa-0">
                          <apexchart
                            type="bar"
                            :height="120"
                            :width="120"
                            :options="chartOptions"
                            :series="series"
                          ></apexchart>
                        </v-col>
                      </v-row>
                    </div>
                  </v-card>
                </v-col>
                <!-- gender -->
                <v-col cols="12" md="6">
                  <span class="drag-icon"
                    ><svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="1.5rem"
                      height="1.5rem"
                      viewBox="0 0 14 14"
                    >
                      <path
                        fill="none"
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="m13.478 11.832l-.46-2.757a2.573 2.573 0 0 0-2.961-2.114l-2.171.362l-.683-4.09a1.194 1.194 0 0 0-1.374-.98v0c-.65.108-1.09.723-.98 1.374l.894 5.36l-.363.133a1.715 1.715 0 0 0-.643 2.803l.184.19l.954.988M1.75.5L.5 1.75L1.75 3M.5 1.75h3M10.25.5l1.25 1.25L10.25 3m1.25-1.25h-3"
                      /></svg
                  ></span>
                  <v-card :height="columnHeight" class="card-rounded ma-2 pa-4">
                    <div class="h-100 d-flex flex-column">
                      <div class="d-flex justify-center ga-2 mb-6 ps-3">
                        <span>الذكور والاناث</span>
                        <v-btn icon size="sm">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 18 18"
                            fill="none"
                          >
                            <circle cx="9" cy="9" r="9" fill="#484B4F" />
                            <path
                              d="M8.89 9.77V9.07C8.63667 9.04333 8.39667 8.98 8.17 8.88C7.94333 8.78 7.74333 8.64667 7.57 8.48C7.39667 8.31333 7.25667 8.12 7.15 7.9C7.05 7.68 7 7.44 7 7.18C7 6.84667 7.05333 6.54667 7.16 6.28C7.27333 6.00667 7.43333 5.77667 7.64 5.59C7.84667 5.39667 8.09 5.25 8.37 5.15C8.65667 5.05 8.97667 5 9.33 5C9.67 5 9.97 5.04667 10.23 5.14C10.4967 5.22667 10.7267 5.34333 10.92 5.49C11.12 5.63667 11.29 5.80333 11.43 5.99C11.57 6.17 11.6867 6.35333 11.78 6.54L10.41 7.25C10.3767 7.17 10.3267 7.09 10.26 7.01C10.2 6.93 10.12 6.86 10.02 6.8C9.92 6.73333 9.80333 6.68 9.67 6.64C9.53667 6.59333 9.38333 6.57 9.21 6.57C8.95 6.57 8.72667 6.63 8.54 6.75C8.35333 6.86333 8.26 7.03667 8.26 7.27C8.26 7.42333 8.29333 7.56 8.36 7.68C8.42667 7.79333 8.53333 7.89 8.68 7.97C8.83333 8.05 9.03 8.11333 9.27 8.16C9.51 8.20667 9.80333 8.23333 10.15 8.24V9.77H8.89ZM9.53 12.21C9.23 12.21 9.00667 12.1367 8.86 11.99C8.72 11.8367 8.65 11.6433 8.65 11.41V11.21C8.65 10.9767 8.72 10.7867 8.86 10.64C9.00667 10.4867 9.23 10.41 9.53 10.41C9.83 10.41 10.05 10.4867 10.19 10.64C10.3367 10.7867 10.41 10.9767 10.41 11.21V11.41C10.41 11.6433 10.3367 11.8367 10.19 11.99C10.05 12.1367 9.83 12.21 9.53 12.21Z"
                              fill="white"
                            />
                          </svg>
                          <v-tooltip activator="parent" location="top">
                            معلومات افتراضية تعرض هنا
                          </v-tooltip>
                        </v-btn>
                      </div>
                      <v-row class="h-100">
                        <v-col cols="7" class="d-flex flex-column justify-center ps-6">
                          <div class="mb-4">
                            <h3>25,430</h3>
                            <div class="d-flex align-center ga-2">
                              <v-badge class="mb-1" dot color="primary"></v-badge>
                              <span class="text-caption">الذكور</span>
                            </div>
                          </div>
                          <div class="">
                            <h3>5,212</h3>
                            <div class="d-flex align-center ga-2">
                              <v-badge class="mb-1" dot color="secondary"></v-badge>
                              <span class="text-caption">الاناث</span>
                            </div>
                          </div>
                        </v-col>
                        <v-col cols="5" class="d-flex flex-column justify-center pa-0">
                          <apexchart
                            type="bar"
                            :height="120"
                            :width="120"
                            :options="chartOptions"
                            :series="series"
                          ></apexchart>
                        </v-col>
                      </v-row>
                    </div>
                  </v-card>
                </v-col>
                <!-- age -->
                <!-- <v-col cols="12" md="6">
                  <span class="drag-icon"
                    ><svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="1.5rem"
                      height="1.5rem"
                      viewBox="0 0 14 14"
                    >
                      <path
                        fill="none"
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="m13.478 11.832l-.46-2.757a2.573 2.573 0 0 0-2.961-2.114l-2.171.362l-.683-4.09a1.194 1.194 0 0 0-1.374-.98v0c-.65.108-1.09.723-.98 1.374l.894 5.36l-.363.133a1.715 1.715 0 0 0-.643 2.803l.184.19l.954.988M1.75.5L.5 1.75L1.75 3M.5 1.75h3M10.25.5l1.25 1.25L10.25 3m1.25-1.25h-3"
                      /></svg
                  ></span>
                  <v-card :height="columnHeight" class="card-rounded ma-2 pa-4">
                    <div class="d-flex justify-center ga-2 mb-2 ps-3">
                      <span>معدل الأعمار</span>
                      <v-btn icon size="sm">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          viewBox="0 0 18 18"
                          fill="none"
                        >
                          <circle cx="9" cy="9" r="9" fill="#484B4F" />
                          <path
                            d="M8.89 9.77V9.07C8.63667 9.04333 8.39667 8.98 8.17 8.88C7.94333 8.78 7.74333 8.64667 7.57 8.48C7.39667 8.31333 7.25667 8.12 7.15 7.9C7.05 7.68 7 7.44 7 7.18C7 6.84667 7.05333 6.54667 7.16 6.28C7.27333 6.00667 7.43333 5.77667 7.64 5.59C7.84667 5.39667 8.09 5.25 8.37 5.15C8.65667 5.05 8.97667 5 9.33 5C9.67 5 9.97 5.04667 10.23 5.14C10.4967 5.22667 10.7267 5.34333 10.92 5.49C11.12 5.63667 11.29 5.80333 11.43 5.99C11.57 6.17 11.6867 6.35333 11.78 6.54L10.41 7.25C10.3767 7.17 10.3267 7.09 10.26 7.01C10.2 6.93 10.12 6.86 10.02 6.8C9.92 6.73333 9.80333 6.68 9.67 6.64C9.53667 6.59333 9.38333 6.57 9.21 6.57C8.95 6.57 8.72667 6.63 8.54 6.75C8.35333 6.86333 8.26 7.03667 8.26 7.27C8.26 7.42333 8.29333 7.56 8.36 7.68C8.42667 7.79333 8.53333 7.89 8.68 7.97C8.83333 8.05 9.03 8.11333 9.27 8.16C9.51 8.20667 9.80333 8.23333 10.15 8.24V9.77H8.89ZM9.53 12.21C9.23 12.21 9.00667 12.1367 8.86 11.99C8.72 11.8367 8.65 11.6433 8.65 11.41V11.21C8.65 10.9767 8.72 10.7867 8.86 10.64C9.00667 10.4867 9.23 10.41 9.53 10.41C9.83 10.41 10.05 10.4867 10.19 10.64C10.3367 10.7867 10.41 10.9767 10.41 11.21V11.41C10.41 11.6433 10.3367 11.8367 10.19 11.99C10.05 12.1367 9.83 12.21 9.53 12.21Z"
                            fill="white"
                          />
                        </svg>
                        <v-tooltip activator="parent" location="top">
                          معلومات افتراضية تعرض هنا
                        </v-tooltip>
                      </v-btn>
                    </div>
                  </v-card>
                </v-col> -->
                <!-- city -->
                <v-col cols="12" md="6">
                  <span class="drag-icon"
                    ><svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="1.5rem"
                      height="1.5rem"
                      viewBox="0 0 14 14"
                    >
                      <path
                        fill="none"
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="m13.478 11.832l-.46-2.757a2.573 2.573 0 0 0-2.961-2.114l-2.171.362l-.683-4.09a1.194 1.194 0 0 0-1.374-.98v0c-.65.108-1.09.723-.98 1.374l.894 5.36l-.363.133a1.715 1.715 0 0 0-.643 2.803l.184.19l.954.988M1.75.5L.5 1.75L1.75 3M.5 1.75h3M10.25.5l1.25 1.25L10.25 3m1.25-1.25h-3"
                      /></svg
                  ></span>
                  <v-card :height="columnHeight" class="card-rounded ma-2 pa-4">
                    <div class="d-flex justify-center ga-2 mb-2 ps-3">
                      <span>المدينة</span>
                      <v-btn icon size="sm">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          viewBox="0 0 18 18"
                          fill="none"
                        >
                          <circle cx="9" cy="9" r="9" fill="#484B4F" />
                          <path
                            d="M8.89 9.77V9.07C8.63667 9.04333 8.39667 8.98 8.17 8.88C7.94333 8.78 7.74333 8.64667 7.57 8.48C7.39667 8.31333 7.25667 8.12 7.15 7.9C7.05 7.68 7 7.44 7 7.18C7 6.84667 7.05333 6.54667 7.16 6.28C7.27333 6.00667 7.43333 5.77667 7.64 5.59C7.84667 5.39667 8.09 5.25 8.37 5.15C8.65667 5.05 8.97667 5 9.33 5C9.67 5 9.97 5.04667 10.23 5.14C10.4967 5.22667 10.7267 5.34333 10.92 5.49C11.12 5.63667 11.29 5.80333 11.43 5.99C11.57 6.17 11.6867 6.35333 11.78 6.54L10.41 7.25C10.3767 7.17 10.3267 7.09 10.26 7.01C10.2 6.93 10.12 6.86 10.02 6.8C9.92 6.73333 9.80333 6.68 9.67 6.64C9.53667 6.59333 9.38333 6.57 9.21 6.57C8.95 6.57 8.72667 6.63 8.54 6.75C8.35333 6.86333 8.26 7.03667 8.26 7.27C8.26 7.42333 8.29333 7.56 8.36 7.68C8.42667 7.79333 8.53333 7.89 8.68 7.97C8.83333 8.05 9.03 8.11333 9.27 8.16C9.51 8.20667 9.80333 8.23333 10.15 8.24V9.77H8.89ZM9.53 12.21C9.23 12.21 9.00667 12.1367 8.86 11.99C8.72 11.8367 8.65 11.6433 8.65 11.41V11.21C8.65 10.9767 8.72 10.7867 8.86 10.64C9.00667 10.4867 9.23 10.41 9.53 10.41C9.83 10.41 10.05 10.4867 10.19 10.64C10.3367 10.7867 10.41 10.9767 10.41 11.21V11.41C10.41 11.6433 10.3367 11.8367 10.19 11.99C10.05 12.1367 9.83 12.21 9.53 12.21Z"
                            fill="white"
                          />
                        </svg>
                        <v-tooltip activator="parent" location="top">
                          معلومات افتراضية تعرض هنا
                        </v-tooltip>
                      </v-btn>
                    </div>
                  </v-card>
                </v-col>
                <!-- languages -->
                <v-col cols="12" md="6">
                  <span class="drag-icon"
                    ><svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="1.5rem"
                      height="1.5rem"
                      viewBox="0 0 14 14"
                    >
                      <path
                        fill="none"
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="m13.478 11.832l-.46-2.757a2.573 2.573 0 0 0-2.961-2.114l-2.171.362l-.683-4.09a1.194 1.194 0 0 0-1.374-.98v0c-.65.108-1.09.723-.98 1.374l.894 5.36l-.363.133a1.715 1.715 0 0 0-.643 2.803l.184.19l.954.988M1.75.5L.5 1.75L1.75 3M.5 1.75h3M10.25.5l1.25 1.25L10.25 3m1.25-1.25h-3"
                      /></svg
                  ></span>
                  <v-card :height="columnHeight" class="card-rounded ma-2 pa-4">
                    <div class="h-100 d-flex flex-column">
                      <div class="d-flex justify-center ga-2 mb-6 ps-3">
                        <span>اللغات</span>
                        <v-btn icon size="sm">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 18 18"
                            fill="none"
                          >
                            <circle cx="9" cy="9" r="9" fill="#484B4F" />
                            <path
                              d="M8.89 9.77V9.07C8.63667 9.04333 8.39667 8.98 8.17 8.88C7.94333 8.78 7.74333 8.64667 7.57 8.48C7.39667 8.31333 7.25667 8.12 7.15 7.9C7.05 7.68 7 7.44 7 7.18C7 6.84667 7.05333 6.54667 7.16 6.28C7.27333 6.00667 7.43333 5.77667 7.64 5.59C7.84667 5.39667 8.09 5.25 8.37 5.15C8.65667 5.05 8.97667 5 9.33 5C9.67 5 9.97 5.04667 10.23 5.14C10.4967 5.22667 10.7267 5.34333 10.92 5.49C11.12 5.63667 11.29 5.80333 11.43 5.99C11.57 6.17 11.6867 6.35333 11.78 6.54L10.41 7.25C10.3767 7.17 10.3267 7.09 10.26 7.01C10.2 6.93 10.12 6.86 10.02 6.8C9.92 6.73333 9.80333 6.68 9.67 6.64C9.53667 6.59333 9.38333 6.57 9.21 6.57C8.95 6.57 8.72667 6.63 8.54 6.75C8.35333 6.86333 8.26 7.03667 8.26 7.27C8.26 7.42333 8.29333 7.56 8.36 7.68C8.42667 7.79333 8.53333 7.89 8.68 7.97C8.83333 8.05 9.03 8.11333 9.27 8.16C9.51 8.20667 9.80333 8.23333 10.15 8.24V9.77H8.89ZM9.53 12.21C9.23 12.21 9.00667 12.1367 8.86 11.99C8.72 11.8367 8.65 11.6433 8.65 11.41V11.21C8.65 10.9767 8.72 10.7867 8.86 10.64C9.00667 10.4867 9.23 10.41 9.53 10.41C9.83 10.41 10.05 10.4867 10.19 10.64C10.3367 10.7867 10.41 10.9767 10.41 11.21V11.41C10.41 11.6433 10.3367 11.8367 10.19 11.99C10.05 12.1367 9.83 12.21 9.53 12.21Z"
                              fill="white"
                            />
                          </svg>
                          <v-tooltip activator="parent" location="top">
                            معلومات افتراضية تعرض هنا
                          </v-tooltip>
                        </v-btn>
                      </div>
                      <div class="w-100 h-100 d-flex flex-column justify-center ga-2">
                        <div class="w-100 d-flex">
                          <div class="w-100">
                            <apexchart
                              type="bar"
                              :height="115"
                              :options="langChartOptions"
                              :series="langSeries"
                            ></apexchart>
                          </div>
                          <div style="width: 50px" class="d-flex justify-end">
                            <ul
                              style="list-style: none"
                              class="w-auto d-flex flex-column ga-1 ma-0 mt-n1"
                            >
                              <li class="text-caption font-weight-bold">18-24</li>
                              <li class="text-caption font-weight-bold">25-34</li>
                              <li class="text-caption font-weight-bold">35-44</li>
                              <li class="text-caption font-weight-bold">45-54</li>
                              <li class="text-caption font-weight-bold">55+</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </v-card>
                </v-col>
                <!-- qualification -->
                <v-col cols="12" md="6">
                  <span class="drag-icon"
                    ><svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="1.5rem"
                      height="1.5rem"
                      viewBox="0 0 14 14"
                    >
                      <path
                        fill="none"
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="m13.478 11.832l-.46-2.757a2.573 2.573 0 0 0-2.961-2.114l-2.171.362l-.683-4.09a1.194 1.194 0 0 0-1.374-.98v0c-.65.108-1.09.723-.98 1.374l.894 5.36l-.363.133a1.715 1.715 0 0 0-.643 2.803l.184.19l.954.988M1.75.5L.5 1.75L1.75 3M.5 1.75h3M10.25.5l1.25 1.25L10.25 3m1.25-1.25h-3"
                      /></svg
                  ></span>
                  <v-card :height="columnHeight" class="card-rounded ma-2 pa-4">
                    <div class="h-100 d-flex flex-column">
                      <div class="d-flex justify-center ga-2 mb-6 ps-3">
                        <span>المؤهل العلمي</span>
                        <v-btn icon size="sm">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 18 18"
                            fill="none"
                          >
                            <circle cx="9" cy="9" r="9" fill="#484B4F" />
                            <path
                              d="M8.89 9.77V9.07C8.63667 9.04333 8.39667 8.98 8.17 8.88C7.94333 8.78 7.74333 8.64667 7.57 8.48C7.39667 8.31333 7.25667 8.12 7.15 7.9C7.05 7.68 7 7.44 7 7.18C7 6.84667 7.05333 6.54667 7.16 6.28C7.27333 6.00667 7.43333 5.77667 7.64 5.59C7.84667 5.39667 8.09 5.25 8.37 5.15C8.65667 5.05 8.97667 5 9.33 5C9.67 5 9.97 5.04667 10.23 5.14C10.4967 5.22667 10.7267 5.34333 10.92 5.49C11.12 5.63667 11.29 5.80333 11.43 5.99C11.57 6.17 11.6867 6.35333 11.78 6.54L10.41 7.25C10.3767 7.17 10.3267 7.09 10.26 7.01C10.2 6.93 10.12 6.86 10.02 6.8C9.92 6.73333 9.80333 6.68 9.67 6.64C9.53667 6.59333 9.38333 6.57 9.21 6.57C8.95 6.57 8.72667 6.63 8.54 6.75C8.35333 6.86333 8.26 7.03667 8.26 7.27C8.26 7.42333 8.29333 7.56 8.36 7.68C8.42667 7.79333 8.53333 7.89 8.68 7.97C8.83333 8.05 9.03 8.11333 9.27 8.16C9.51 8.20667 9.80333 8.23333 10.15 8.24V9.77H8.89ZM9.53 12.21C9.23 12.21 9.00667 12.1367 8.86 11.99C8.72 11.8367 8.65 11.6433 8.65 11.41V11.21C8.65 10.9767 8.72 10.7867 8.86 10.64C9.00667 10.4867 9.23 10.41 9.53 10.41C9.83 10.41 10.05 10.4867 10.19 10.64C10.3367 10.7867 10.41 10.9767 10.41 11.21V11.41C10.41 11.6433 10.3367 11.8367 10.19 11.99C10.05 12.1367 9.83 12.21 9.53 12.21Z"
                              fill="white"
                            />
                          </svg>
                          <v-tooltip activator="parent" location="top">
                            معلومات افتراضية تعرض هنا
                          </v-tooltip>
                        </v-btn>
                      </div>
                      <div class="w-100 h-100 d-flex flex-column justify-center ga-2">
                        <div class="w-100 d-flex">
                          <div class="w-100">
                            <apexchart
                              type="bar"
                              :height="115"
                              :options="langChartOptions"
                              :series="langSeries"
                            ></apexchart>
                          </div>
                          <div style="width: 50px" class="d-flex justify-end">
                            <ul
                              style="list-style: none"
                              class="w-auto d-flex flex-column ga-1 ma-0 mt-n1"
                            >
                              <li class="text-caption font-weight-bold">18-24</li>
                              <li class="text-caption font-weight-bold">25-34</li>
                              <li class="text-caption font-weight-bold">35-44</li>
                              <li class="text-caption font-weight-bold">45-54</li>
                              <li class="text-caption font-weight-bold">55+</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </v-card>
                </v-col>
              </draggable>
            </v-col>
          </v-row>
        </div>
      </Transition>
    </div>
  </v-container>
</template>

<style lang="scss">
.drag-icon {
  position: absolute;
  top: 20px;
  right: 20px;
  color: #e7c394;
  z-index: 9;
  visibility: hidden;
  opacity: 0;
  transition: 300ms cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

[draggable='true'] .drag-icon {
  visibility: visible;
  opacity: 1;
}
</style>
