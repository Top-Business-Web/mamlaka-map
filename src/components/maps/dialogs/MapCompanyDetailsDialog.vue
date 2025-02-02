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
  details: MapLocation | null;
}

interface LocationItem {
  name: string;
  sa_id: number;
}

const props = withDefaults(defineProps<ComponentProps>(), {
  modelValue: false,
  details: null
});

const emit = defineEmits(["update:modelValue"]);

const toggleDialogVisibility = (status: boolean) => {
  emit("update:modelValue", status);
};

const isLoading = ref<boolean>(true);
const isLoadingTableData = ref<boolean>(true);

const search = ref<string>("");
const tableData = ref<LocationItem[] | []>([]);
const observersTableData = ref<LocationItem[] | []>([]);
const companyTab = ref<number>(1);
const companyInfo = ref();
const counts = ref();

const companyId = computed(() => props.details?.id);

const headers = computed(() => [
  { key: "name", title: companyTab.value === 1 ? "اسم المراقب" : "اسم المشرف" },
  { key: "sa_id", title: "رقم الهوية" },
  { key: "phone", title: "رقم الجوال" },
  { key: "count_entities", title: "عدد المشركات المسندة" },
  { key: "shift", title: "الوردية" },
  { key: "latest_attendance_at", title: "وقت الحضور" }
]);

watch(
  () => props.modelValue,
  (isActive) => {
    if (isActive && companyId.value) {
      companyTab.value = 1;
      getCompanyDetails();
    } else {
      companyTab.value = 1;
      companyInfo.value = {};
      counts.value = {};
      tableData.value = [];
    }
  }
);

watch(companyTab, (tabIdx) => {
  tableData.value = [];
  observersTableData.value = [];

  if (tabIdx === 1) {
    getObserversListData();
    return;
  }

  if (tabIdx === 2) {
    getOperatorsListData();
    return;
  }
});

const getCompanyDetails = async () => {
  isLoading.value = true;
  isLoadingTableData.value = true;

  try {
    const { data } = await http.get(`mobility/map/entity-info?id=${companyId.value}`);
    companyInfo.value = data?.data || [];
    counts.value = data?.counts;
  } catch (err) {
    console.error(err);
  } finally {
    isLoading.value = false;
    if (companyId.value) {
      if (companyTab.value === 1) {
        getObserversListData();
        return;
      }

      if (companyTab.value === 2) {
        getOperatorsListData();
        return;
      }
    }
  }
};

const getOperatorsListData = async () => {
  isLoadingTableData.value = true;
  tableData.value = [];

  try {
    const { data } = await http.get(`mobility/map/operators-list?entity_id=${companyId.value}`);
    tableData.value = data?.data || [];
  } catch (err) {
    console.error(err);
  } finally {
    isLoadingTableData.value = false;
  }
};

const getObserversListData = async () => {
  if (!companyInfo.value && !companyInfo.value.id) return;
  isLoadingTableData.value = true;
  observersTableData.value = [];

  try {
    const { data } = await http.get(
      `mobility/map/observers-list?entity_id=${companyInfo.value.id}`
    );
    observersTableData.value = data?.data || [];
  } catch (err) {
    console.error(err);
  } finally {
    isLoadingTableData.value = false;
  }
};

const isEntityDetailsDialog = ref<boolean>(false);
const selectedLocation = ref();

const displayLocationDialog = (id: number) => {
  selectedLocation.value = { id };
  isEntityDetailsDialog.value = true;
};

onMounted(() => {
  if (companyId.value) {
    getCompanyDetails();
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
          <h2 class="text-h6 font-weight-bold">معلومات الشركة</h2>
          <v-btn color="#666666" icon variant="text" @click="toggleDialogVisibility(false)">
            <v-icon icon="mdi-close"></v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text class="d-flex flex-column pa-0 overflow-hidden">
          <hr />
          <div class="w-100 h-100 d-flex flex-column px-6">
            <div style="height: 8rem" class="w-100 d-flex align-center ga-10 pt-8 pb-4">
              <v-row class="ma-0">
                <v-col cols="3" class="d-flex justify-center align-center">
                  <div class="d-flex justify-center align-center ga-6">
                    <svg
                      width="4rem"
                      height="4rem"
                      viewBox="0 0 58 58"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <rect x="0.5" y="0.5" width="57" height="57" rx="28.5" stroke="white" />
                      <path
                        d="M40 39.1016C40 39.5978 39.5978 40 39.1016 40H30.2969C29.8006 40 29.3984 39.5978 29.3984 39.1016V22.3457H28.5C28.0038 22.3457 27.6016 21.9435 27.6016 21.4473V20.5488H22.2109V21.4473C22.2109 21.9435 21.8087 22.3457 21.3125 22.3457H20.4141V39.1016C20.4141 39.5978 20.0119 40 19.5156 40H17.8984C17.4022 40 17 39.5978 17 39.1016C17 38.6053 17.4022 38.2031 17.8984 38.2031H18.6172V21.4473C18.6172 20.951 19.0194 20.5488 19.5156 20.5488H20.4141V19.6504C20.4141 19.1541 20.8163 18.752 21.3125 18.752H24.0078V17.8984C24.0078 17.4022 24.41 17 24.9062 17C25.4025 17 25.8047 17.4022 25.8047 17.8984V18.752H28.5C28.9962 18.752 29.3984 19.1541 29.3984 19.6504V20.5488H30.2969C30.3013 20.5488 30.3055 20.5494 30.3099 20.5495C30.4838 20.543 30.6615 20.5871 30.8201 20.6868L36.5208 24.2721C37.6867 25.0054 38.3828 26.2655 38.3828 27.643V31.0156C38.3828 31.5119 37.9806 31.9141 37.4844 31.9141C36.9881 31.9141 36.5859 31.5119 36.5859 31.0156V27.643C36.5859 26.887 36.2039 26.1955 35.5641 25.7931L31.1953 23.0455V38.2031H32.9473V36.7656C32.9473 36.2694 33.3495 35.8672 33.8457 35.8672C34.3419 35.8672 34.7441 36.2694 34.7441 36.7656V38.2031H36.5859V35.4629C36.5859 34.9666 36.9881 34.5645 37.4844 34.5645C37.9806 34.5645 38.3828 34.9666 38.3828 35.4629V38.2031H39.1016C39.5978 38.2031 40 38.6053 40 39.1016ZM23.0645 27.7812C22.5682 27.7812 22.166 28.1834 22.166 28.6797V29.5781C22.166 30.0744 22.5682 30.4766 23.0645 30.4766C23.5607 30.4766 23.9629 30.0744 23.9629 29.5781V28.6797C23.9629 28.1834 23.5607 27.7812 23.0645 27.7812ZM26.6582 27.7812C26.162 27.7812 25.7598 28.1834 25.7598 28.6797V29.5781C25.7598 30.0744 26.162 30.4766 26.6582 30.4766C27.1544 30.4766 27.5566 30.0744 27.5566 29.5781V28.6797C27.5566 28.1834 27.1544 27.7812 26.6582 27.7812ZM23.0645 31.8242C22.5682 31.8242 22.166 32.2264 22.166 32.7227V33.6211C22.166 34.1173 22.5682 34.5195 23.0645 34.5195C23.5607 34.5195 23.9629 34.1173 23.9629 33.6211V32.7227C23.9629 32.2264 23.5607 31.8242 23.0645 31.8242ZM26.6582 31.8242C26.162 31.8242 25.7598 32.2264 25.7598 32.7227V33.6211C25.7598 34.1173 26.162 34.5195 26.6582 34.5195C27.1544 34.5195 27.5566 34.1173 27.5566 33.6211V32.7227C27.5566 32.2264 27.1544 31.8242 26.6582 31.8242ZM26.6582 35.8672C26.162 35.8672 25.7598 36.2694 25.7598 36.7656V37.6641C25.7598 38.1603 26.162 38.5625 26.6582 38.5625C27.1544 38.5625 27.5566 38.1603 27.5566 37.6641V36.7656C27.5566 36.2694 27.1544 35.8672 26.6582 35.8672ZM34.7441 28.6797C34.7441 28.1834 34.3419 27.7812 33.8457 27.7812C33.3495 27.7812 32.9473 28.1834 32.9473 28.6797V29.5781C32.9473 30.0744 33.3495 30.4766 33.8457 30.4766C34.3419 30.4766 34.7441 30.0744 34.7441 29.5781V28.6797ZM33.8457 31.8242C33.3495 31.8242 32.9473 32.2264 32.9473 32.7227V33.6211C32.9473 34.1173 33.3495 34.5195 33.8457 34.5195C34.3419 34.5195 34.7441 34.1173 34.7441 33.6211V32.7227C34.7441 32.2264 34.3419 31.8242 33.8457 31.8242ZM23.0645 35.8672C22.5682 35.8672 22.166 36.2694 22.166 36.7656V37.6641C22.166 38.1603 22.5682 38.5625 23.0645 38.5625C23.5607 38.5625 23.9629 38.1603 23.9629 37.6641V36.7656C23.9629 36.2694 23.5607 35.8672 23.0645 35.8672ZM23.0645 23.7383C22.5682 23.7383 22.166 24.1405 22.166 24.6367V25.5352C22.166 26.0314 22.5682 26.4336 23.0645 26.4336C23.5607 26.4336 23.9629 26.0314 23.9629 25.5352V24.6367C23.9629 24.1405 23.5607 23.7383 23.0645 23.7383ZM26.6582 23.7383C26.162 23.7383 25.7598 24.1405 25.7598 24.6367V25.5352C25.7598 26.0314 26.162 26.4336 26.6582 26.4336C27.1544 26.4336 27.5566 26.0314 27.5566 25.5352V24.6367C27.5566 24.1405 27.1544 23.7383 26.6582 23.7383Z"
                        fill="white"
                      />
                    </svg>
                    <div class="d-flex flex-column ga-3">
                      <span class="font-weight-bold">اسم الشركة</span>
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
                        {{ companyInfo.name }}
                      </h4>
                    </div>
                  </div>
                </v-col>
                <v-col cols="2" class="d-flex justify-center align-center">
                  <div class="d-flex flex-column ga-3">
                    <span class="font-weight-bold">رقم العقد</span>
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
                      {{ companyInfo.contract }}
                    </h4>
                  </div>
                </v-col>
                <v-col cols="2" class="d-flex justify-center align-center">
                  <div class="d-flex flex-column ga-3">
                    <span class="font-weight-bold">جنسية الحجاج</span>
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
                      {{ companyInfo.nationality }}
                    </h4>
                  </div>
                </v-col>
                <v-col cols="2" class="d-flex justify-center align-center">
                  <div class="d-flex flex-column ga-3">
                    <span class="font-weight-bold">عدد الحجاج</span>
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
                      {{ companyInfo.pilgrims }}
                    </h4>
                  </div>
                </v-col>
                <v-col cols="3" class="d-flex justify-center align-center">
                  <div class="d-flex flex-column ga-3">
                    <span class="font-weight-bold">الموقع</span>
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
                      <v-btn
                        @click="displayLocationDialog(companyInfo.permit_no)"
                        color="#888888"
                        rounded="pill"
                      >
                        <div class="d-flex align-center ga-2 px-3">
                          <svg
                            width="0.9rem"
                            height="0.9rem"
                            viewBox="0 0 13 13"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <g clip-path="url(#clip0_5684_774)">
                              <path
                                d="M10.4662 1.64761C9.40376 0.585075 7.9911 0 6.48859 0C4.98598 0 3.57333 0.585175 2.51089 1.64761C1.44846 2.71005 0.863281 4.1227 0.863281 5.62521C0.863281 7.12782 1.44846 8.54047 2.51089 9.60291L5.49945 12.5916C5.76288 12.8549 6.11408 13 6.48849 13C6.86281 13 7.21401 12.8549 7.47744 12.5916L10.4662 9.60291C11.5287 8.54047 12.1138 7.12782 12.1138 5.62521C12.1138 4.1227 11.5286 2.71005 10.4662 1.64761ZM9.92764 9.06425L6.93878 12.053C6.81937 12.1724 6.65939 12.2383 6.48849 12.2383C6.3176 12.2383 6.15762 12.1724 6.03811 12.053L3.04955 9.06425C2.13093 8.14573 1.625 6.9243 1.625 5.62521C1.625 4.32613 2.13093 3.1048 3.04955 2.18617C3.96818 1.26765 5.18941 0.761719 6.48859 0.761719C7.78768 0.761719 9.00901 1.26765 9.92764 2.18617C11.8239 4.08253 11.8239 7.16809 9.92764 9.06425Z"
                                fill="white"
                              />
                              <path
                                d="M6.48927 3.61255C5.37942 3.61255 4.47656 4.5154 4.47656 5.62525C4.47656 6.735 5.37942 7.63786 6.48927 7.63786C7.59901 7.63786 8.50187 6.735 8.50187 5.62525C8.50187 4.5154 7.59901 3.61255 6.48927 3.61255ZM6.48927 6.87614C5.79945 6.87614 5.23828 6.31496 5.23828 5.62515C5.23828 4.93544 5.79945 4.37427 6.48927 4.37427C7.17898 4.37427 7.74015 4.93544 7.74015 5.62515C7.74015 6.31496 7.17898 6.87614 6.48927 6.87614Z"
                                fill="white"
                              />
                            </g>
                            <defs>
                              <clipPath id="clip0_5684_774">
                                <rect width="13" height="13" fill="white" />
                              </clipPath>
                            </defs>
                          </svg>

                          <span>استعرض الموقع</span>
                        </div>
                      </v-btn>
                    </div>
                  </div>
                </v-col>
              </v-row>
            </div>
            <div style="height: calc(100% - 8rem)" class="d-flex flex-column">
              <div style="height: 3.5625rem">
                <v-tabs v-model="companyTab" color="primary" class="map-tabs">
                  <v-tab :value="1">
                    <strong
                      style="font-size: 1rem"
                      class="d-flex align-center ga-2 pb-3 text-white"
                    >
                      <span>المراقبين المسندين</span>
                      <span v-if="counts && counts.observers != undefined"
                        >({{ counts.observers }})</span
                      >
                    </strong>
                  </v-tab>
                  <v-tab :value="2">
                    <strong
                      style="font-size: 1rem"
                      class="d-flex align-center ga-2 pb-3 text-white"
                    >
                      <span>المشرفين المسندين</span>
                      <span v-if="counts && counts.operators != undefined"
                        >({{ counts.operators }})</span
                      >
                    </strong>
                  </v-tab>
                </v-tabs>
                <hr />
              </div>

              <div class="h-100 map-tabs-window">
                <v-tabs-window v-model="companyTab">
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
                          :items="observersTableData"
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
                              <v-avatar v-if="item.image">
                                <img
                                  style="border-radius: 50%; object-fit: cover"
                                  width="100%"
                                  height="100%"
                                  :src="item.image"
                                />
                              </v-avatar>
                              <span>{{ item.name }}</span>
                            </div>
                          </template>
                          <template v-slot:item.shift="{ item }">
                            <span v-if="item.shift">
                              {{ item.shift }}
                            </span>
                            <span v-else>--</span>
                          </template>

                          <template v-slot:item.latest_attendance_at="{ item }">
                            <span v-if="item.latest_attendance_at">
                              {{ item.latest_attendance_at }}
                            </span>
                            <span v-else>--</span>
                          </template>
                        </v-data-table-virtual>
                      </div>
                    </div>
                    <div v-if="n === 2" class="w-100 h-100 d-flex flex-column">
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
                              <v-avatar v-if="item.image">
                                <img
                                  style="border-radius: 50%; object-fit: cover"
                                  width="100%"
                                  height="100%"
                                  :src="item.image"
                                />
                              </v-avatar>
                              <span>{{ item.name }}</span>
                            </div>
                          </template>
                          <template v-slot:item.shift="{ item }">
                            <span v-if="item.shift">
                              {{ item.shift }}
                            </span>
                            <span v-else>--</span>
                          </template>

                          <template v-slot:item.latest_attendance_at="{ item }">
                            <span v-if="item.latest_attendance_at">
                              {{ item.latest_attendance_at }}
                            </span>
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

    <div v-if="isEntityDetailsDialog">
      <MapEntityDetailsDialog
        v-model="isEntityDetailsDialog"
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
