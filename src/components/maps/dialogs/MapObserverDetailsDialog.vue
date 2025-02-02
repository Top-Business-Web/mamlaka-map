<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import http from "@/plugins/axios";

interface MapLocation {
  id: number;
  lat: number;
  lng: number;
  name: string;
  user_type: string;
}

interface ComponentProps {
  modelValue: boolean;
  locationDetails: MapLocation | null;
}

interface LocationItem {
  name: string;
  sa_id: number;
}

const props = withDefaults(defineProps<ComponentProps>(), {
  modelValue: false,
  locationDetails: null
});

const emit = defineEmits(["update:modelValue"]);

const toggleDialogVisibility = (status: boolean) => {
  emit("update:modelValue", status);
};

const isLoading = ref<boolean>(true);
const isLoadingTableData = ref<boolean>(true);

const search = ref<string>("");
const headers = [
  { key: "name", title: "اسم الشركة" },
  { key: "permit_no", title: "رقم العقد" },
  { key: "pilgrims", title: "عدد الحجاج" },
  { key: "nationality", title: "جنسية الحجاج" },
  { key: "shift_E", title: "المراقب - E" },
  { key: "shift_L", title: "المراقب - L" },
  { key: "shift_N", title: "المراقب - N" }
];

const tableData = ref<LocationItem[] | []>([]);
const locationTab = ref<number>(1);
const locationInfo = ref();
const counts = ref();

const locationId = computed(() => props.locationDetails?.id);

watch(
  () => props.modelValue,
  (isActive) => {
    if (isActive && locationId.value) {
      getLocationDetails();
    } else {
      locationTab.value = 1;
      locationInfo.value = {};
      counts.value = {};
      tableData.value = [];
    }
  }
);

const getLocationDetails = async () => {
  isLoading.value = true;
  isLoadingTableData.value = true;

  try {
    const { data } = await http.get(`mobility/map/user-info?id=${locationId.value}`);
    locationInfo.value = data?.data || [];
    counts.value = data?.counts;
  } catch (err) {
    console.error(err);
  } finally {
    isLoading.value = false;
    if (locationId.value) {
      getListData();
    }
  }
};

const getListData = async () => {
  try {
    const { data } = await http.get(`mobility/map/entities-list?observer_id=${locationId.value}`);
    tableData.value = data?.data || [];
  } catch (err) {
    console.error(err);
  } finally {
    isLoadingTableData.value = false;
  }
};

const isOperatorDetailsDialog = ref<boolean>(false);
const selectedLocation = ref<MapLocation | null>(null);

const displayOperatorDialog = (operator: any) => {
  selectedLocation.value = operator;
  isOperatorDetailsDialog.value = true;
};

onMounted(() => {
  if (locationId.value) {
    getLocationDetails();
  }
});
</script>

<template>
  <div>
    <v-dialog
      :modelValue="modelValue"
      @update:modelValue="toggleDialogVisibility"
      max-width="75rem"
      height="calc(100vh - 48px)"
      v-if="modelValue"
    >
      <v-card class="h-100 custom-card-variant">
        <v-card-title class="d-flex align-center justify-space-between text-h6 py-3">
          <h2 class="text-h6 font-weight-bold">معلومات المراقب</h2>
          <v-btn color="#666666" icon variant="text" @click="toggleDialogVisibility(false)">
            <v-icon icon="mdi-close"></v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text class="d-flex flex-column pa-0 overflow-hidden">
          <hr />
          <div class="w-100 h-100 d-flex flex-column px-6">
            <div style="height: 8rem" class="w-100 d-flex align-center ga-10 pt-8 pb-4">
              <v-row class="ma-0">
                <v-col cols="3" class="d-flex justify-start">
                  <div class="d-flex justify-center align-center ga-6">
                    <v-avatar v-if="locationInfo && locationInfo.image" size="large">
                      <img
                        style="border-radius: 50%; object-fit: cover"
                        width="100%"
                        height="100%"
                        :src="locationInfo.image"
                      />
                    </v-avatar>
                    <div class="d-flex flex-column ga-3">
                      <span class="font-weight-bold">الاسم</span>
                      <h4 v-if="isLoading">
                        <v-skeleton-loader
                          type="button"
                          height="1.8rem"
                          width="10rem"
                          max-width="100%"
                          max-height="100%"
                          color="#333"
                        ></v-skeleton-loader>
                      </h4>
                      <h4 v-else class="whitespace-nowrap">
                        {{ locationInfo.name }}
                      </h4>
                    </div>
                  </div>
                </v-col>
                <v-col cols="3" class="d-flex justify-center">
                  <div class="d-flex flex-column ga-3">
                    <span class="font-weight-bold">رقم الهوية</span>
                    <h4 v-if="isLoading">
                      <v-skeleton-loader
                        type="button"
                        height="1.8rem"
                        width="10rem"
                        max-width="100%"
                        max-height="100%"
                        color="#333"
                      ></v-skeleton-loader>
                    </h4>
                    <h4 v-else>
                      {{ locationInfo.sa_id }}
                    </h4>
                  </div>
                </v-col>
                <v-col cols="3" class="d-flex justify-center">
                  <div class="d-flex flex-column ga-3">
                    <span class="font-weight-bold">رقم الجوال</span>
                    <h4 v-if="isLoading">
                      <v-skeleton-loader
                        type="button"
                        height="1.8rem"
                        width="10rem"
                        max-width="100%"
                        max-height="100%"
                        color="#333"
                      ></v-skeleton-loader>
                    </h4>
                    <h4 v-else class="d-flex align-center ga-2">
                      <span>{{ locationInfo.phone }}</span>

                      <svg
                        width="10"
                        height="14"
                        viewBox="0 0 10 14"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M9.37819 10.8713L9.08203 10.3838C8.5494 9.51803 7.81431 8.52434 6.85012 8.52434C6.67148 8.52434 6.49458 8.55976 6.31947 8.6315L5.80196 8.85029C5.75469 8.86961 5.70876 8.89158 5.66015 8.91488C5.5277 8.9784 5.3775 9.05032 5.22302 9.05032C4.84193 9.05032 4.40037 8.56141 3.97989 7.67368C3.56722 6.80236 3.59355 6.34558 3.68828 6.11574C3.7928 5.86216 4.03587 5.75374 4.297 5.65631C4.33331 5.64274 4.36611 5.63042 4.398 5.61748L4.92205 5.39995C6.28732 4.83709 5.77941 2.87011 5.61288 2.22523L5.47165 1.67077C5.35092 1.2138 5.03081 0 3.969 0C3.77244 0 3.56274 0.0451474 3.34593 0.134243C3.20368 0.189935 1.24609 0.97771 0.536876 2.36168C-0.310747 4.00903 -0.15402 6.2181 1.00226 8.92612C2.14988 11.6376 3.63806 13.296 5.42548 13.8553C5.73208 13.9514 6.07858 14 6.45545 14H6.45564C7.68916 14 8.90679 13.4826 9.00562 13.4397C9.4309 13.262 9.7058 12.9921 9.82263 12.6373C10.0207 12.0356 9.68844 11.3764 9.37819 10.8713ZM8.90871 12.345C8.88156 12.4274 8.78715 12.5027 8.62831 12.5686C8.62568 12.5697 8.62248 12.5711 8.61979 12.5723C8.60877 12.5771 7.50662 13.053 6.45538 13.0529C6.17728 13.0529 5.92858 13.0192 5.71619 12.9526C4.21034 12.4814 2.9227 11.004 1.88824 8.56008C0.846105 6.11915 0.679577 4.17787 1.39398 2.78948C1.94871 1.70702 3.68539 1.02033 3.70243 1.01377C3.70589 1.01238 3.70928 1.01105 3.71268 1.00966C3.81157 0.968744 3.90021 0.947149 3.969 0.947149C4.18068 0.947149 4.37334 1.27082 4.54077 1.90522L4.68136 2.45735C4.98469 3.63181 4.93851 4.36642 4.55018 4.52655L4.02863 4.74313C4.00788 4.75159 3.98361 4.7605 3.95683 4.77054C3.66874 4.87807 3.06924 5.10172 2.79812 5.75917C2.55211 6.35575 2.65395 7.11309 3.10915 8.07451C3.72222 9.3685 4.41363 9.99754 5.22289 9.99754C5.59847 9.99754 5.89995 9.85307 6.08006 9.76681C6.11323 9.7509 6.14289 9.73631 6.17478 9.72331L6.69307 9.5042C6.74655 9.48222 6.79792 9.47155 6.85005 9.47155C7.09952 9.47155 7.54684 9.7151 8.25919 10.8728L8.55516 11.36C8.91992 11.9537 8.94874 12.2233 8.90871 12.345Z"
                          fill="white"
                        />
                      </svg>
                    </h4>
                  </div>
                </v-col>
                <v-col cols="3" class="d-flex justify-center">
                  <div class="d-flex flex-column ga-3 cursor-pointer">
                    <span class="font-weight-bold"> اسم المشرف </span>
                    <h4 v-if="isLoading">
                      <v-skeleton-loader
                        type="button"
                        height="1.8rem"
                        width="10rem"
                        max-width="100%"
                        max-height="100%"
                        color="#333"
                      ></v-skeleton-loader>
                    </h4>
                    <div v-else>
                      <!-- cursor-pointer -->
                      <div
                        @click="displayOperatorDialog(locationInfo.operator)"
                        v-if="locationInfo.operator"
                        class="d-flex align-center ga-2"
                      >
                        <v-avatar v-if="locationInfo.operator.image" size="small">
                          <img
                            style="border-radius: 50%; object-fit: cover"
                            width="100%"
                            height="100%"
                            :src="locationInfo.operator.image"
                          />
                        </v-avatar>
                        <span v-if="locationInfo.operator.name">
                          {{ locationInfo.operator.name }}
                        </span>
                      </div>
                      <span v-else>--</span>
                    </div>
                  </div>
                </v-col>
              </v-row>
            </div>
            <div style="height: calc(100% - 8rem)" class="d-flex flex-column">
              <div style="height: 3.5625rem">
                <v-tabs v-model="locationTab" color="primary" class="map-tabs">
                  <v-tab :value="1">
                    <strong
                      style="font-size: 1rem"
                      class="d-flex align-center ga-2 pb-3 text-white"
                    >
                      <span>الشركات المسندة </span>
                      <span v-if="counts && counts.entities != undefined"
                        >({{ counts.entities }})</span
                      >
                    </strong>
                  </v-tab>
                </v-tabs>
                <hr />
              </div>

              <div class="h-100 map-tabs-window">
                <v-tabs-window v-model="locationTab">
                  <v-tabs-window-item v-for="n in 3" :key="n" :value="n">
                    <div v-if="n === 1" class="w-100 h-100 d-flex flex-column">
                      <div style="height: 5.5rem" class="w-100 d-flex justify-end py-4">
                        <div style="width: 18rem">
                          <v-text-field
                            class="map-search-input"
                            v-model="search"
                            append-inner-icon="mdi-magnify"
                            hide-details
                            single-line
                            placeholder="أبحث"
                          ></v-text-field>
                        </div>
                      </div>

                      <div class="w-100 h-100 pb-4">
                        <v-data-table-virtual
                          fixed-header
                          class="map-table h-100 bg-transparent"
                          height="calc(100vh - (4.5rem + 8rem + 5.5rem + 3.5625rem + 50px + 1rem))"
                          :headers="headers"
                          :items="tableData"
                          :search="search"
                          :loading="isLoadingTableData"
                          :items-per-page="-1"
                          no-data-text="لا توجد بيانات"
                          hide-default-footer
                        >
                          <template v-slot:loading>
                            <v-skeleton-loader
                              class="loader--no-bg"
                              type="table-row@10"
                            ></v-skeleton-loader>
                          </template>
                          <template v-slot:item.name="{ item }">
                            <div class="d-flex align-center ga-4">
                              <svg
                                width="2rem"
                                height="2rem"
                                viewBox="0 0 58 58"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <rect
                                  x="0.5"
                                  y="0.5"
                                  width="57"
                                  height="57"
                                  rx="28.5"
                                  stroke="white"
                                />
                                <path
                                  d="M40 39.1016C40 39.5978 39.5978 40 39.1016 40H30.2969C29.8006 40 29.3984 39.5978 29.3984 39.1016V22.3457H28.5C28.0038 22.3457 27.6016 21.9435 27.6016 21.4473V20.5488H22.2109V21.4473C22.2109 21.9435 21.8087 22.3457 21.3125 22.3457H20.4141V39.1016C20.4141 39.5978 20.0119 40 19.5156 40H17.8984C17.4022 40 17 39.5978 17 39.1016C17 38.6053 17.4022 38.2031 17.8984 38.2031H18.6172V21.4473C18.6172 20.951 19.0194 20.5488 19.5156 20.5488H20.4141V19.6504C20.4141 19.1541 20.8163 18.752 21.3125 18.752H24.0078V17.8984C24.0078 17.4022 24.41 17 24.9062 17C25.4025 17 25.8047 17.4022 25.8047 17.8984V18.752H28.5C28.9962 18.752 29.3984 19.1541 29.3984 19.6504V20.5488H30.2969C30.3013 20.5488 30.3055 20.5494 30.3099 20.5495C30.4838 20.543 30.6615 20.5871 30.8201 20.6868L36.5208 24.2721C37.6867 25.0054 38.3828 26.2655 38.3828 27.643V31.0156C38.3828 31.5119 37.9806 31.9141 37.4844 31.9141C36.9881 31.9141 36.5859 31.5119 36.5859 31.0156V27.643C36.5859 26.887 36.2039 26.1955 35.5641 25.7931L31.1953 23.0455V38.2031H32.9473V36.7656C32.9473 36.2694 33.3495 35.8672 33.8457 35.8672C34.3419 35.8672 34.7441 36.2694 34.7441 36.7656V38.2031H36.5859V35.4629C36.5859 34.9666 36.9881 34.5645 37.4844 34.5645C37.9806 34.5645 38.3828 34.9666 38.3828 35.4629V38.2031H39.1016C39.5978 38.2031 40 38.6053 40 39.1016ZM23.0645 27.7812C22.5682 27.7812 22.166 28.1834 22.166 28.6797V29.5781C22.166 30.0744 22.5682 30.4766 23.0645 30.4766C23.5607 30.4766 23.9629 30.0744 23.9629 29.5781V28.6797C23.9629 28.1834 23.5607 27.7812 23.0645 27.7812ZM26.6582 27.7812C26.162 27.7812 25.7598 28.1834 25.7598 28.6797V29.5781C25.7598 30.0744 26.162 30.4766 26.6582 30.4766C27.1544 30.4766 27.5566 30.0744 27.5566 29.5781V28.6797C27.5566 28.1834 27.1544 27.7812 26.6582 27.7812ZM23.0645 31.8242C22.5682 31.8242 22.166 32.2264 22.166 32.7227V33.6211C22.166 34.1173 22.5682 34.5195 23.0645 34.5195C23.5607 34.5195 23.9629 34.1173 23.9629 33.6211V32.7227C23.9629 32.2264 23.5607 31.8242 23.0645 31.8242ZM26.6582 31.8242C26.162 31.8242 25.7598 32.2264 25.7598 32.7227V33.6211C25.7598 34.1173 26.162 34.5195 26.6582 34.5195C27.1544 34.5195 27.5566 34.1173 27.5566 33.6211V32.7227C27.5566 32.2264 27.1544 31.8242 26.6582 31.8242ZM26.6582 35.8672C26.162 35.8672 25.7598 36.2694 25.7598 36.7656V37.6641C25.7598 38.1603 26.162 38.5625 26.6582 38.5625C27.1544 38.5625 27.5566 38.1603 27.5566 37.6641V36.7656C27.5566 36.2694 27.1544 35.8672 26.6582 35.8672ZM34.7441 28.6797C34.7441 28.1834 34.3419 27.7812 33.8457 27.7812C33.3495 27.7812 32.9473 28.1834 32.9473 28.6797V29.5781C32.9473 30.0744 33.3495 30.4766 33.8457 30.4766C34.3419 30.4766 34.7441 30.0744 34.7441 29.5781V28.6797ZM33.8457 31.8242C33.3495 31.8242 32.9473 32.2264 32.9473 32.7227V33.6211C32.9473 34.1173 33.3495 34.5195 33.8457 34.5195C34.3419 34.5195 34.7441 34.1173 34.7441 33.6211V32.7227C34.7441 32.2264 34.3419 31.8242 33.8457 31.8242ZM23.0645 35.8672C22.5682 35.8672 22.166 36.2694 22.166 36.7656V37.6641C22.166 38.1603 22.5682 38.5625 23.0645 38.5625C23.5607 38.5625 23.9629 38.1603 23.9629 37.6641V36.7656C23.9629 36.2694 23.5607 35.8672 23.0645 35.8672ZM23.0645 23.7383C22.5682 23.7383 22.166 24.1405 22.166 24.6367V25.5352C22.166 26.0314 22.5682 26.4336 23.0645 26.4336C23.5607 26.4336 23.9629 26.0314 23.9629 25.5352V24.6367C23.9629 24.1405 23.5607 23.7383 23.0645 23.7383ZM26.6582 23.7383C26.162 23.7383 25.7598 24.1405 25.7598 24.6367V25.5352C25.7598 26.0314 26.162 26.4336 26.6582 26.4336C27.1544 26.4336 27.5566 26.0314 27.5566 25.5352V24.6367C27.5566 24.1405 27.1544 23.7383 26.6582 23.7383Z"
                                  fill="white"
                                />
                              </svg>
                              <span>{{ item.name }}</span>
                            </div>
                          </template>
                          <template v-slot:item.shift_E="{ item }">
                            <div v-if="item.shift_E" class="d-flex align-center ga-4">
                              <v-tooltip location="top" color="primary">
                                <template v-slot:activator="{ props }">
                                  <img
                                    v-bind="props"
                                    style="border-radius: 50%; object-fit: cover"
                                    width="40"
                                    height="40"
                                    :src="item.shift_E.image"
                                  />
                                </template>
                                <span v-if="item.shift_E.name">
                                  {{ item.shift_E.name }}
                                </span>
                              </v-tooltip>
                            </div>
                            <span v-else>--</span>
                          </template>

                          <template v-slot:item.shift_L="{ item }">
                            <div v-if="item.shift_L" class="d-flex align-center ga-4">
                              <v-tooltip location="top" color="primary">
                                <template v-slot:activator="{ props }">
                                  <img
                                    v-bind="props"
                                    style="border-radius: 50%; object-fit: cover"
                                    width="40"
                                    height="40"
                                    :src="item.shift_L.image"
                                  />
                                </template>
                                <span v-if="item.shift_L.name">
                                  {{ item.shift_L.name }}
                                </span>
                              </v-tooltip>
                            </div>
                            <span v-else>--</span>
                          </template>

                          <template v-slot:item.shift_N="{ item }">
                            <div v-if="item.shift_N" class="d-flex align-center ga-4">
                              <v-tooltip location="top" color="primary">
                                <template v-slot:activator="{ props }">
                                  <img
                                    v-bind="props"
                                    style="border-radius: 50%; object-fit: cover"
                                    width="40"
                                    height="40"
                                    :src="item.shift_N.image"
                                  />
                                </template>
                                <span v-if="item.shift_N.name">
                                  {{ item.shift_N.name }}
                                </span>
                              </v-tooltip>
                            </div>
                            <span v-else>--</span>
                          </template>
                        </v-data-table-virtual>
                      </div>
                    </div>
                  </v-tabs-window-item>
                </v-tabs-window>
              </div>
            </div>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>

    <div v-if="isOperatorDetailsDialog">
      <MapOperatorDetailsDialog
        v-model="isOperatorDetailsDialog"
        :location-details="selectedLocation"
      />
    </div>
  </div>
</template>

<style lang="scss">
.map-tabs-window {
  .v-tabs-window,
  .v-window__container,
  .v-window-item {
    height: 100%;
  }
}
</style>
