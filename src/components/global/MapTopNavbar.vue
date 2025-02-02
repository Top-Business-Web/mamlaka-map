<script setup lang="ts">
import { ref, computed, watch, onMounted } from "vue";
import { useMapStore, type MapStatisticsFilterKeys } from "@/stores/MapStore";
import dayjs from "dayjs";

import selaIconLogo from "@/assets/imgs/royal_comm.png";

const mapStore = useMapStore();
const isMenuOpen = ref<boolean>(false);
const selectedDate = ref<Date>();

const formattedDate = computed((): string =>
  selectedDate.value ? dayjs(selectedDate.value).format("YYYY-MM-DD") : "اليوم"
);

const handleFilter = (key: MapStatisticsFilterKeys, value: string) => {
  mapStore.updateMapStatisticsFilter(key, value);
  mapStore.getMapStatistics();
};

watch(formattedDate, (date: string) => handleFilter("start_date", date));

const getFilterLabel = (Key: MapStatisticsFilterKeys) => {
  const filterLabels = {
    company: "الشركة",
    shift: "الوردية",
    start_date: "اليوم"
  };

  return filterLabels[Key];
};
</script>

<template>
  <v-app-bar
    flat
    tile
    elevation="0"
    class="bg-transparent px-4 pt-4 pb-0 px-xl-10"
    style="z-index: 9999"
  >
    <template v-slot:prepend>
      <div class="d-flex align-center ga-16">
        <div class="d-flex align-center ga-4">
          <a href="#" class="pa-1">
            <!-- <img width="48rem" :src="selaIconLogo" /> -->
          </a>
          <!-- <span class="font-weight-bold">مشروع إدارة ومراقبة البيانات الميدانية</span> -->
        </div>

        <v-locale-provider rtl locale="ar">
          <transition name="scale" mode="out-in">
            <div
              v-if="mapStore.mapStatisticsFiltersResponse.length && !mapStore.isMapStatisticsError"
              class="d-flex align-center ga-4"
            >
              <v-menu v-model="isMenuOpen">
                <template v-slot:activator="{ props }">
                  <v-btn
                    variant="outlined"
                    v-bind="props"
                    height="auto"
                    rounded="md"
                    style="min-width: 10rem"
                    class="day-filter-btn px-0"
                  >
                    <div class="w-100 d-flex justify-start align-center ga-2 py-2 px-2">
                      <svg
                        width="1.6rem"
                        height="1.6rem"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                      >
                        <path
                          fill="currentColor"
                          d="M15,19.88C15.04,20.18 14.94,20.5 14.71,20.71C14.32,21.1 13.69,21.1 13.3,20.71L9.29,16.7C9.06,16.47 8.96,16.16 9,15.87V10.75L4.21,4.62C3.87,4.19 3.95,3.56 4.38,3.22C4.57,3.08 4.78,3 5,3V3H19V3C19.22,3 19.43,3.08 19.62,3.22C20.05,3.56 20.13,4.19 19.79,4.62L15,10.75V19.88M7.04,5L11,10.06V15.58L13,17.58V10.05L16.96,5H7.04Z"
                        />
                      </svg>
                      <span class="font-weight-bold">
                        {{ formattedDate }}
                      </span>
                    </div>
                  </v-btn>
                </template>
                <!-- hide-actions -->
                <v-date-picker
                  v-model="selectedDate"
                  header="اختر التاريخ"
                  rounded="xl"
                  color="#383838"
                />
              </v-menu>

              <div class="d-flex align-center ga-4">
                <div
                  v-for="(filter, index) in mapStore.mapStatisticsFiltersResponse"
                  :key="index"
                  class="position-relative d-inline-block"
                >
                  <!-- clearable -->
                  <v-autocomplete
                    class="map-select-input"
                    :placeholder="getFilterLabel(filter.key)"
                    :items="filter.values"
                    item-title="name"
                    item-value="value"
                    variant="outlined"
                    rounded="md"
                    no-data-text="لا توجد بيانات"
                    prepend-inner-icon="mdi-filter-outline"
                    @update:modelValue="handleFilter(filter.key, $event)"
                  ></v-autocomplete>
                  <!-- <v-menu width="500px">
                    <template v-slot:activator="{ props }">
                      <v-btn
                        variant="outlined"
                        v-bind="props"
                        height="auto"
                        rounded="md"
                        style="min-width: 5rem"
                      >
                        <div class="d-flex align-center ga-4 py-2 px-2">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="1rem"
                            height="1rem"
                            viewBox="0 0 15 16"
                            fill="none"
                          >
                            <path
                              d="M0 0V4.62116L5.22466 10.1941V16L9.49936 14.4801V10.1941L14.724 4.62116V0H0ZM13.2991 3.99159L8.07445 9.56456V13.3847L6.64954 13.8913V9.56456L1.42491 3.99159V1.51991H13.2991V3.99159Z"
                              fill="currentColor"
                            />
                          </svg>
                          <span class="font-weight-bold">
                            {{ getFilterLabel(filter.key) }}
                          </span>
                        </div>
                      </v-btn>
                    </template>

                    <v-list width="300">
                      <v-list-item
                        @click="handleFilter(filter.key, filterValue.value)"
                        href="#"
                        v-for="(filterValue, index) in filter.values"
                        :key="index"
                      >
                        <v-list-item-title>
                          {{ filterValue.name }}
                        </v-list-item-title>
                      </v-list-item>
                    </v-list>
                  </v-menu> -->
                </div>
              </div>
            </div>
          </transition>
        </v-locale-provider>
      </div>
    </template>

    <template v-slot:append>
      <div>
        <v-menu>
          <template v-slot:activator="{ props }">
            <v-btn icon variant="outlined" class="" v-bind="props">
              <svg
                width="1rem"
                height="1.1rem"
                viewBox="0 0 14 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M13.1484 18C12.7601 18 12.4453 17.6852 12.4453 17.2969C12.4453 14.5442 10.2058 12.3047 7.45312 12.3047H6.39844C3.64574 12.3047 1.40625 14.5442 1.40625 17.2969C1.40625 17.6852 1.09146 18 0.703125 18C0.314789 18 0 17.6852 0 17.2969C0 13.7688 2.87033 10.8984 6.39844 10.8984H7.45312C10.9812 10.8984 13.8516 13.7688 13.8516 17.2969C13.8516 17.6852 13.5368 18 13.1484 18Z"
                  fill="currentColor"
                />
                <path
                  d="M6.85547 9.49219C4.23847 9.49219 2.10938 7.36309 2.10938 4.74609C2.10938 2.1291 4.23847 0 6.85547 0C9.47247 0 11.6016 2.1291 11.6016 4.74609C11.6016 7.36309 9.47247 9.49219 6.85547 9.49219ZM6.85547 1.40625C5.01388 1.40625 3.51562 2.9045 3.51562 4.74609C3.51562 6.58768 5.01388 8.08594 6.85547 8.08594C8.69706 8.08594 10.1953 6.58768 10.1953 4.74609C10.1953 2.9045 8.69706 1.40625 6.85547 1.40625Z"
                  fill="currentColor"
                />
              </svg>
            </v-btn>
          </template>

          <v-list width="200">
            <v-list-item href="#">
              <v-list-item-title> الملف الشخصي </v-list-item-title>
            </v-list-item>
            <v-list-item href="#">
              <v-list-item-title> تسجيل الخروج </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </div>
    </template>
  </v-app-bar>
</template>

<style lang="scss">
.v-menu > .v-overlay__content > .v-list {
  border-radius: 15px;
  background-color: #383838; // #383838
}
</style>
