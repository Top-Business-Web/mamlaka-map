<script setup lang="ts">
import { computed, ref, watch } from "vue";
import http from "@/plugins/axios";
import { convertNumberWithSeperator } from "@/helpers/helperFunctions";

import { useMapStore } from "@/stores/MapStore";

const mapStore = useMapStore();

interface ComponentProps {
  modelValue: boolean;
  ticketType: "high" | "low";
  task: any;
}

interface LocationItem {
  name: string;
  sa_id: number;
}

interface ReportTicketFilters {
  level: "low" | "high";
  tab: "open" | "resolved";
}

interface Pagination {
  per_page: number;
  page: number;
  total: number;
}

const props = withDefaults(defineProps<ComponentProps>(), {
  modelValue: false,
  ticketType: "high",
  task: {}
});

const emit = defineEmits(["update:modelValue"]);

const toggleDialogVisibility = (status: boolean) => {
  emit("update:modelValue", status);
};

const isLoadingTableData = ref<boolean>(false);
const search = ref<string>("");
const headers = [
  { key: "name", title: "اسم الشركة" },
  { key: "reportType", title: " نوع البلاغ" },
  { key: "plateNo", title: "رقم لوحة الحافلة" },
  { key: "neighborhoodName", title: "اسم الحي" },
  { key: "observer", title: "اسم المراقب" },
  { key: "isResolved", title: "اغلاق البلاغ" }
];

const lowTypeHeaders = [
  { key: "name", title: "اسم الشركة" },
  { key: "reportType", title: " نوع البلاغ" },
  { key: "neighborhoodName", title: "اسم الحي" },
  { key: "observer", title: "اسم المراقب" },
  { key: "isResolved", title: "اغلاق البلاغ" }
];

const tableHeaders = computed(() => (props.ticketType === "high" ? headers : lowTypeHeaders));

const tableData = ref<LocationItem[] | []>([]);
const ticketTab = ref<number>(1);
const counts = ref();
const isCompanyDetailsDialog = ref<boolean>(false);
const isObserverDetailsDialog = ref<boolean>(false);
const selectedCompany = ref(null);
const selectedObserver = ref(null);
const resolvingTicketId = ref<number>(0);
const pagination = ref<Pagination>({
  per_page: 30,
  page: 1,
  total: 0
});

watch(
  () => props.modelValue,
  (isActive) => {
    if (isActive) {
      getTicketsData({ level: props.ticketType, tab: ticketTab.value === 1 ? "open" : "resolved" });
    } else {
      ticketTab.value = 1;
      pagination.value = {
        per_page: 30,
        page: 1,
        total: 0
      };
      resolvingTicketId.value = 0;
      counts.value = {};
      tableData.value = [];
    }
  }
);

watch(ticketTab, (tabIdx) => {
  pagination.value = {
    per_page: 30,
    page: 1,
    total: 0
  };
  getTicketsData({ level: props.ticketType, tab: tabIdx === 1 ? "open" : "resolved" });
});

const getTicketsData = async (filters: ReportTicketFilters) => {
  isLoadingTableData.value = true;
  tableData.value = [];

  try {
    const { data } = await http.get("mobility/map/auditing-reports-results", {
      params: {
        ...filters,
        type: mapStore.mapStatisticsFilters.type,
        page: pagination.value.page,
        per_page: pagination.value.per_page
      }
    });

    counts.value = data?.counts;
    tableData.value = data?.data?.data || [];
    const paginationData = data?.data?.meta || {};
    pagination.value.total = paginationData?.total;
  } catch (err) {
    console.error(err);
  } finally {
    isLoadingTableData.value = false;
  }
};

const resolveTicket = async (ticketId: number, status: 1 | 0) => {
  resolvingTicketId.value = ticketId;

  try {
    const { data } = await http.post("mobility/map/resolve-report", {
      report_id: ticketId,
      is_resolved: status
    });

    getTicketsData({ level: props.ticketType, tab: ticketTab.value === 1 ? "open" : "resolved" });
  } catch (err) {
    console.error(err);
  } finally {
    resolvingTicketId.value = 0;
  }
};

const displayDialog = (type: "company" | "observer", item: any) => {
  if (type === "company") {
    const itemData = {
      ...item,
      id: item.Entity.id
    };
    selectedCompany.value = itemData;
    isCompanyDetailsDialog.value = true;
    return;
  }

  if (type === "observer") {
    const itemData = {
      ...item,
      id: item.createdBy.id
    };

    selectedObserver.value = itemData;
    isObserverDetailsDialog.value = true;
    return;
  }
};

const loadItems = ({ page, itemsPerPage }: { page: number; itemsPerPage: number }) => {
  pagination.value.page = page;
  pagination.value.per_page = itemsPerPage;

  getTicketsData({ level: props.ticketType, tab: ticketTab.value === 1 ? "open" : "resolved" });
};
</script>

<template>
  <div>
    <v-dialog
      :modelValue="modelValue"
      @update:modelValue="toggleDialogVisibility"
      max-width="85rem"
      height="calc(100vh - 48px)"
      v-if="modelValue"
    >
      <v-card class="h-100 custom-card-variant">
        <v-card-title class="d-flex align-center justify-space-between text-h6 py-3">
          <h2 class="px-2 text-h6 font-weight-bold">نتائج التدقيق</h2>
          <v-btn color="#666666" icon variant="text" @click="toggleDialogVisibility(false)">
            <v-icon icon="mdi-close"></v-icon>
          </v-btn>
        </v-card-title>
        <hr />
        <v-card-text class="d-flex flex-column pa-0 overflow-hidden">
          <div class="w-100 h-100 d-flex flex-column px-6 pt-8">
            <div class="w-100 h-100 pb-10">
              <div class="w-100 d-flex align-center ga-4 py-2">
                <DonutChart
                  v-if="!task.is_count"
                  :colors="['#B49164', '#fff']"
                  :width="110"
                  :data="[task.yes, task.no]"
                />

                <div class="d-flex align-center ga-16">
                  <div class="mb-4">
                    <h2 class="mb-3" style="opacity: 0.9; font-size: 1.2rem">اسم البند</h2>
                    <h2 class="px-2 text-center" style="font-size: 1.3rem">
                      {{ task.name }}
                    </h2>
                  </div>
                  <h2 v-if="task.is_count" class="text-h4 pt-6 font-weight-bold">
                    {{ task.count }}
                  </h2>
                  <div v-else class="d-flex align-center ga-16">
                    <div class="d-flex flex-column align-center ga-2">
                      <h4 class="font-weight-bold">نسبة الإجابة بنعم</h4>
                      <div class="d-flex align-center ga-5">
                        <v-badge class="v-badge--custom" dot color="primary"></v-badge>
                        <h4 class="mt-1 font-weight-bold" style="font-size: 1.2rem; opacity: 0.9">
                          {{ convertNumberWithSeperator(task.yes) }}
                        </h4>
                      </div>
                    </div>
                    <div class="d-flex flex-column align-center ga-2">
                      <h4 class="font-weight-bold">نسبة الإجابة لا</h4>
                      <div class="d-flex align-center ga-5">
                        <v-badge class="v-badge--custom" dot color="white"></v-badge>
                        <h4 class="mt-1 font-weight-bold" style="font-size: 1.2rem; opacity: 0.9">
                          {{ convertNumberWithSeperator(task.no) }}
                        </h4>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div style="height: 100%" class="d-flex flex-column">
              <div style="height: 3.5625rem">
                <v-tabs v-model="ticketTab" color="primary" class="map-tabs">
                  <v-tab :value="1">
                    <strong
                      style="font-size: 1rem"
                      class="d-flex align-center ga-2 pb-3 text-white"
                    >
                      <span>جميع النتائج </span>
                      <span v-if="counts && counts.open_reports != undefined"
                        >({{ counts.open_reports }})</span
                      >
                    </strong>
                  </v-tab>
                  <v-tab :value="2">
                    <strong
                      style="font-size: 1rem"
                      class="d-flex align-center ga-2 pb-3 text-white"
                    >
                      <span>نتائج الإجابة بنعم</span>
                      <span v-if="counts && counts.resolved_report != undefined"
                        >({{ counts.resolved_report }})</span
                      >
                    </strong>
                  </v-tab>
                  <v-tab :value="3">
                    <strong
                      style="font-size: 1rem"
                      class="d-flex align-center ga-2 pb-3 text-white"
                    >
                      <span>نتائج الإجابة لا</span>
                      <span v-if="counts && counts.resolved_report != undefined"
                        >({{ counts.resolved_report }})</span
                      >
                    </strong>
                  </v-tab>
                </v-tabs>
                <hr />
              </div>

              <div class="h-100 map-tabs-window">
                <v-tabs-window v-model="ticketTab">
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
                        <v-data-table-server
                          :items-length="pagination.total"
                          @update:options="loadItems"
                          v-model:items-per-page="pagination.per_page"
                          fixed-header
                          show-current-page
                          items-per-page-text="عدد السجلات بالصفحة"
                          :items-per-page-options="[
                            { value: 10, title: '10' },
                            { value: 25, title: '25' },
                            { value: 30, title: '30' },
                            { value: 50, title: '50' },
                            { value: 100, title: '100' },
                            { value: -1, title: 'الكل' }
                          ]"
                          class="map-table map-table--with-footer h-100 bg-transparent"
                          height="calc(100vh - (4.5rem + 13.5rem + 5.5rem + 3.5625rem + 50px + 1rem))"
                          :headers="tableHeaders"
                          :items="tableData"
                          :search="search"
                          :loading="isLoadingTableData"
                          no-data-text="لا توجد بيانات"
                        >
                          <!-- hide-default-footer -->
                          <template v-slot:loading>
                            <v-skeleton-loader
                              class="loader--no-bg"
                              type="table-row@10"
                            ></v-skeleton-loader>
                          </template>
                          <template v-slot:item.name="{ item }">
                            <div
                              @click="displayDialog('company', item)"
                              class="d-flex align-center ga-4 cursor-pointer"
                            >
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
                              <span v-if="item.Entity && item.Entity.name">{{
                                item.Entity.name
                              }}</span>
                            </div>
                          </template>
                          <template v-slot:item.plateNo="{ item }">
                            <div class="d-flex align-center ga-2">
                              <span>
                                <svg
                                  width="19"
                                  height="19"
                                  viewBox="0 0 19 19"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M16.0898 5.4624H15.793V4.86865C15.793 3.23168 14.4612 1.8999 12.8242 1.8999H5.69922C4.06225 1.8999 2.73047 3.23168 2.73047 4.86865V5.4624H2.43359C1.61481 5.4624 0.949219 6.12859 0.949219 6.94678V8.43115C0.949219 8.7589 1.21463 9.0249 1.54297 9.0249C1.87131 9.0249 2.13672 8.7589 2.13672 8.43115V6.94678C2.13672 6.7829 2.27031 6.6499 2.43359 6.6499H2.73047V12.5874C2.73047 13.5534 3.20131 14.4049 3.91797 14.947V16.1499C3.91797 16.8048 4.45056 17.3374 5.10547 17.3374H6.29297C6.94788 17.3374 7.48047 16.8048 7.48047 16.1499V15.5562H11.043V16.1499C11.043 16.8048 11.5756 17.3374 12.2305 17.3374H13.418C14.0729 17.3374 14.6055 16.8048 14.6055 16.1499V14.947C15.3221 14.4043 15.793 13.5528 15.793 12.5874V6.6499H16.0898C16.2531 6.6499 16.3867 6.7829 16.3867 6.94678V8.43115C16.3867 8.7589 16.6521 9.0249 16.9805 9.0249C17.3088 9.0249 17.5742 8.7589 17.5742 8.43115V6.94678C17.5742 6.12859 16.9086 5.4624 16.0898 5.4624ZM3.91797 5.4624H14.6055V9.83537C14.0681 10.0788 13.4803 10.2124 12.8901 10.2124H5.63331C5.04372 10.2124 4.45531 10.0788 3.91797 9.83537V5.4624ZM5.69922 3.0874H12.8242C13.5973 3.0874 14.2504 3.58556 14.4962 4.2749H4.02722C4.27303 3.58556 4.92616 3.0874 5.69922 3.0874ZM6.29297 16.1499H5.10547V15.4962C5.29725 15.5354 5.49616 15.5562 5.69922 15.5562H6.29297V16.1499ZM13.418 16.1499H12.2305V15.5562H12.8242C13.0273 15.5562 13.2262 15.5354 13.418 15.4962V16.1499ZM12.8242 14.3687H5.69922C4.71716 14.3687 3.91797 13.5695 3.91797 12.5874V11.1113C4.47016 11.2978 5.05144 11.3999 5.63331 11.3999H12.8907C13.4726 11.3999 14.0539 11.2978 14.6061 11.1113V12.5874C14.6061 13.5695 13.8063 14.3687 12.8242 14.3687Z"
                                    fill="white"
                                  />
                                  <path
                                    d="M5.9375 13.0625C6.26542 13.0625 6.53125 12.7967 6.53125 12.4688C6.53125 12.1408 6.26542 11.875 5.9375 11.875C5.60958 11.875 5.34375 12.1408 5.34375 12.4688C5.34375 12.7967 5.60958 13.0625 5.9375 13.0625Z"
                                    fill="white"
                                  />
                                  <path
                                    d="M13.0625 13.0625C13.3904 13.0625 13.6562 12.7967 13.6562 12.4688C13.6562 12.1408 13.3904 11.875 13.0625 11.875C12.7346 11.875 12.4688 12.1408 12.4688 12.4688C12.4688 12.7967 12.7346 13.0625 13.0625 13.0625Z"
                                    fill="white"
                                  />
                                </svg>
                              </span>
                              <span>{{ item.plateNo }}</span>
                            </div>
                          </template>
                          <template v-slot:item.observer="{ item }">
                            <div
                              @click="displayDialog('observer', item)"
                              class="d-flex align-center ga-4 cursor-pointer"
                            >
                              <v-avatar size="2rem" v-if="item.createdBy && item.createdBy.image">
                                <img
                                  style="border-radius: 50%; object-fit: cover"
                                  width="100%"
                                  height="100%"
                                  :src="item.createdBy.image"
                                />
                              </v-avatar>
                              <span v-if="item.createdBy && item.createdBy.name">{{
                                item.createdBy.name
                              }}</span>
                            </div>
                          </template>
                          <template v-slot:item.isResolved="{ item }">
                            <div class="d-flex align-center justify-center">
                              <v-btn
                                v-if="item.isResolved"
                                :loading="item.id == resolvingTicketId"
                                :disabled="item.id == resolvingTicketId"
                                @click="resolveTicket(item.id, 0)"
                                size="small"
                                icon
                                color="primary"
                              >
                                <svg
                                  width="1rem"
                                  height="1rem"
                                  viewBox="0 0 12 9"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M11.7212 0.290533C11.3499 -0.0969666 10.747 -0.0967223 10.3752 0.290533L4.31744 6.60474L1.62503 3.79848C1.25325 3.41098 0.650609 3.41098 0.278832 3.79848C-0.0929441 4.18598 -0.0929441 4.81411 0.278832 5.20161L3.6442 8.70931C3.82998 8.90294 4.07357 9 4.31718 9C4.5608 9 4.80463 8.90319 4.9904 8.70931L11.7212 1.69364C12.0929 1.30641 12.0929 0.678009 11.7212 0.290533Z"
                                    fill="white"
                                  />
                                </svg>
                              </v-btn>
                              <v-btn
                                v-else
                                :loading="item.id == resolvingTicketId"
                                :disabled="item.id == resolvingTicketId"
                                @click="resolveTicket(item.id, 1)"
                                size="small"
                                variant="outlined"
                                icon
                              >
                                <svg
                                  width="1rem"
                                  height="1rem"
                                  viewBox="0 0 12 9"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M11.7212 0.290533C11.3499 -0.0969666 10.747 -0.0967223 10.3752 0.290533L4.31744 6.60474L1.62503 3.79848C1.25325 3.41098 0.650609 3.41098 0.278832 3.79848C-0.0929441 4.18598 -0.0929441 4.81411 0.278832 5.20161L3.6442 8.70931C3.82998 8.90294 4.07357 9 4.31718 9C4.5608 9 4.80463 8.90319 4.9904 8.70931L11.7212 1.69364C12.0929 1.30641 12.0929 0.678009 11.7212 0.290533Z"
                                    fill="white"
                                  />
                                </svg>
                              </v-btn>
                            </div>
                          </template>
                        </v-data-table-server>
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
                        <v-data-table-server
                          :items-length="pagination.total"
                          @update:options="loadItems"
                          v-model:items-per-page="pagination.per_page"
                          fixed-header
                          show-current-page
                          items-per-page-text="عدد السجلات بالصفحة"
                          :items-per-page-options="[
                            { value: 10, title: '10' },
                            { value: 25, title: '25' },
                            { value: 30, title: '30' },
                            { value: 50, title: '50' },
                            { value: 100, title: '100' },
                            { value: -1, title: 'الكل' }
                          ]"
                          class="map-table map-table--with-footer h-100 bg-transparent"
                          height="calc(100vh - (4.5rem + 13.5rem + 5.5rem + 3.5625rem + 50px + 1rem))"
                          :headers="tableHeaders"
                          :items="tableData"
                          :search="search"
                          :loading="isLoadingTableData"
                          no-data-text="لا توجد بيانات"
                        >
                          <!-- hide-default-footer -->
                          <template v-slot:loading>
                            <v-skeleton-loader
                              class="loader--no-bg"
                              type="table-row@10"
                            ></v-skeleton-loader>
                          </template>
                          <template v-slot:item.name="{ item }">
                            <div
                              @click="displayDialog('company', item)"
                              class="d-flex align-center ga-4 cursor-pointer"
                            >
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
                              <span v-if="item.Entity && item.Entity.name">{{
                                item.Entity.name
                              }}</span>
                            </div>
                          </template>
                          <template v-slot:item.plateNo="{ item }">
                            <div class="d-flex align-center ga-2">
                              <span>
                                <svg
                                  width="19"
                                  height="19"
                                  viewBox="0 0 19 19"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M16.0898 5.4624H15.793V4.86865C15.793 3.23168 14.4612 1.8999 12.8242 1.8999H5.69922C4.06225 1.8999 2.73047 3.23168 2.73047 4.86865V5.4624H2.43359C1.61481 5.4624 0.949219 6.12859 0.949219 6.94678V8.43115C0.949219 8.7589 1.21463 9.0249 1.54297 9.0249C1.87131 9.0249 2.13672 8.7589 2.13672 8.43115V6.94678C2.13672 6.7829 2.27031 6.6499 2.43359 6.6499H2.73047V12.5874C2.73047 13.5534 3.20131 14.4049 3.91797 14.947V16.1499C3.91797 16.8048 4.45056 17.3374 5.10547 17.3374H6.29297C6.94788 17.3374 7.48047 16.8048 7.48047 16.1499V15.5562H11.043V16.1499C11.043 16.8048 11.5756 17.3374 12.2305 17.3374H13.418C14.0729 17.3374 14.6055 16.8048 14.6055 16.1499V14.947C15.3221 14.4043 15.793 13.5528 15.793 12.5874V6.6499H16.0898C16.2531 6.6499 16.3867 6.7829 16.3867 6.94678V8.43115C16.3867 8.7589 16.6521 9.0249 16.9805 9.0249C17.3088 9.0249 17.5742 8.7589 17.5742 8.43115V6.94678C17.5742 6.12859 16.9086 5.4624 16.0898 5.4624ZM3.91797 5.4624H14.6055V9.83537C14.0681 10.0788 13.4803 10.2124 12.8901 10.2124H5.63331C5.04372 10.2124 4.45531 10.0788 3.91797 9.83537V5.4624ZM5.69922 3.0874H12.8242C13.5973 3.0874 14.2504 3.58556 14.4962 4.2749H4.02722C4.27303 3.58556 4.92616 3.0874 5.69922 3.0874ZM6.29297 16.1499H5.10547V15.4962C5.29725 15.5354 5.49616 15.5562 5.69922 15.5562H6.29297V16.1499ZM13.418 16.1499H12.2305V15.5562H12.8242C13.0273 15.5562 13.2262 15.5354 13.418 15.4962V16.1499ZM12.8242 14.3687H5.69922C4.71716 14.3687 3.91797 13.5695 3.91797 12.5874V11.1113C4.47016 11.2978 5.05144 11.3999 5.63331 11.3999H12.8907C13.4726 11.3999 14.0539 11.2978 14.6061 11.1113V12.5874C14.6061 13.5695 13.8063 14.3687 12.8242 14.3687Z"
                                    fill="white"
                                  />
                                  <path
                                    d="M5.9375 13.0625C6.26542 13.0625 6.53125 12.7967 6.53125 12.4688C6.53125 12.1408 6.26542 11.875 5.9375 11.875C5.60958 11.875 5.34375 12.1408 5.34375 12.4688C5.34375 12.7967 5.60958 13.0625 5.9375 13.0625Z"
                                    fill="white"
                                  />
                                  <path
                                    d="M13.0625 13.0625C13.3904 13.0625 13.6562 12.7967 13.6562 12.4688C13.6562 12.1408 13.3904 11.875 13.0625 11.875C12.7346 11.875 12.4688 12.1408 12.4688 12.4688C12.4688 12.7967 12.7346 13.0625 13.0625 13.0625Z"
                                    fill="white"
                                  />
                                </svg>
                              </span>
                              <span>{{ item.plateNo }}</span>
                            </div>
                          </template>
                          <template v-slot:item.observer="{ item }">
                            <div
                              @click="displayDialog('observer', item)"
                              class="d-flex align-center ga-4 cursor-pointer"
                            >
                              <v-avatar size="2rem" v-if="item.createdBy && item.createdBy.image">
                                <img
                                  style="border-radius: 50%; object-fit: cover"
                                  width="100%"
                                  height="100%"
                                  :src="item.createdBy.image"
                                />
                              </v-avatar>
                              <span v-if="item.createdBy && item.createdBy.name">{{
                                item.createdBy.name
                              }}</span>
                            </div>
                          </template>
                          <template v-slot:item.isResolved="{ item }">
                            <div class="d-flex align-center justify-center">
                              <v-btn
                                v-if="item.isResolved"
                                :loading="item.id == resolvingTicketId"
                                :disabled="item.id == resolvingTicketId"
                                @click="resolveTicket(item.id, 0)"
                                size="small"
                                icon
                                color="primary"
                              >
                                <svg
                                  width="1rem"
                                  height="1rem"
                                  viewBox="0 0 12 9"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M11.7212 0.290533C11.3499 -0.0969666 10.747 -0.0967223 10.3752 0.290533L4.31744 6.60474L1.62503 3.79848C1.25325 3.41098 0.650609 3.41098 0.278832 3.79848C-0.0929441 4.18598 -0.0929441 4.81411 0.278832 5.20161L3.6442 8.70931C3.82998 8.90294 4.07357 9 4.31718 9C4.5608 9 4.80463 8.90319 4.9904 8.70931L11.7212 1.69364C12.0929 1.30641 12.0929 0.678009 11.7212 0.290533Z"
                                    fill="white"
                                  />
                                </svg>
                              </v-btn>
                              <v-btn
                                v-else
                                :loading="item.id == resolvingTicketId"
                                :disabled="item.id == resolvingTicketId"
                                @click="resolveTicket(item.id, 1)"
                                size="small"
                                variant="outlined"
                                icon
                              >
                                <svg
                                  width="1rem"
                                  height="1rem"
                                  viewBox="0 0 12 9"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M11.7212 0.290533C11.3499 -0.0969666 10.747 -0.0967223 10.3752 0.290533L4.31744 6.60474L1.62503 3.79848C1.25325 3.41098 0.650609 3.41098 0.278832 3.79848C-0.0929441 4.18598 -0.0929441 4.81411 0.278832 5.20161L3.6442 8.70931C3.82998 8.90294 4.07357 9 4.31718 9C4.5608 9 4.80463 8.90319 4.9904 8.70931L11.7212 1.69364C12.0929 1.30641 12.0929 0.678009 11.7212 0.290533Z"
                                    fill="white"
                                  />
                                </svg>
                              </v-btn>
                            </div>
                          </template>
                        </v-data-table-server>
                      </div>
                    </div>
                    <div v-if="n === 3" class="w-100 h-100 d-flex flex-column">
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
                        <v-data-table-server
                          :items-length="pagination.total"
                          @update:options="loadItems"
                          v-model:items-per-page="pagination.per_page"
                          fixed-header
                          show-current-page
                          items-per-page-text="عدد السجلات بالصفحة"
                          :items-per-page-options="[
                            { value: 10, title: '10' },
                            { value: 25, title: '25' },
                            { value: 30, title: '30' },
                            { value: 50, title: '50' },
                            { value: 100, title: '100' },
                            { value: -1, title: 'الكل' }
                          ]"
                          class="map-table map-table--with-footer h-100 bg-transparent"
                          height="calc(100vh - (4.5rem + 13.5rem + 5.5rem + 3.5625rem + 50px + 1rem))"
                          :headers="tableHeaders"
                          :items="tableData"
                          :search="search"
                          :loading="isLoadingTableData"
                          no-data-text="لا توجد بيانات"
                        >
                          <!-- hide-default-footer -->
                          <template v-slot:loading>
                            <v-skeleton-loader
                              class="loader--no-bg"
                              type="table-row@10"
                            ></v-skeleton-loader>
                          </template>
                          <template v-slot:item.name="{ item }">
                            <div
                              @click="displayDialog('company', item)"
                              class="d-flex align-center ga-4 cursor-pointer"
                            >
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
                              <span v-if="item.Entity && item.Entity.name">{{
                                item.Entity.name
                              }}</span>
                            </div>
                          </template>
                          <template v-slot:item.plateNo="{ item }">
                            <div class="d-flex align-center ga-2">
                              <span>
                                <svg
                                  width="19"
                                  height="19"
                                  viewBox="0 0 19 19"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M16.0898 5.4624H15.793V4.86865C15.793 3.23168 14.4612 1.8999 12.8242 1.8999H5.69922C4.06225 1.8999 2.73047 3.23168 2.73047 4.86865V5.4624H2.43359C1.61481 5.4624 0.949219 6.12859 0.949219 6.94678V8.43115C0.949219 8.7589 1.21463 9.0249 1.54297 9.0249C1.87131 9.0249 2.13672 8.7589 2.13672 8.43115V6.94678C2.13672 6.7829 2.27031 6.6499 2.43359 6.6499H2.73047V12.5874C2.73047 13.5534 3.20131 14.4049 3.91797 14.947V16.1499C3.91797 16.8048 4.45056 17.3374 5.10547 17.3374H6.29297C6.94788 17.3374 7.48047 16.8048 7.48047 16.1499V15.5562H11.043V16.1499C11.043 16.8048 11.5756 17.3374 12.2305 17.3374H13.418C14.0729 17.3374 14.6055 16.8048 14.6055 16.1499V14.947C15.3221 14.4043 15.793 13.5528 15.793 12.5874V6.6499H16.0898C16.2531 6.6499 16.3867 6.7829 16.3867 6.94678V8.43115C16.3867 8.7589 16.6521 9.0249 16.9805 9.0249C17.3088 9.0249 17.5742 8.7589 17.5742 8.43115V6.94678C17.5742 6.12859 16.9086 5.4624 16.0898 5.4624ZM3.91797 5.4624H14.6055V9.83537C14.0681 10.0788 13.4803 10.2124 12.8901 10.2124H5.63331C5.04372 10.2124 4.45531 10.0788 3.91797 9.83537V5.4624ZM5.69922 3.0874H12.8242C13.5973 3.0874 14.2504 3.58556 14.4962 4.2749H4.02722C4.27303 3.58556 4.92616 3.0874 5.69922 3.0874ZM6.29297 16.1499H5.10547V15.4962C5.29725 15.5354 5.49616 15.5562 5.69922 15.5562H6.29297V16.1499ZM13.418 16.1499H12.2305V15.5562H12.8242C13.0273 15.5562 13.2262 15.5354 13.418 15.4962V16.1499ZM12.8242 14.3687H5.69922C4.71716 14.3687 3.91797 13.5695 3.91797 12.5874V11.1113C4.47016 11.2978 5.05144 11.3999 5.63331 11.3999H12.8907C13.4726 11.3999 14.0539 11.2978 14.6061 11.1113V12.5874C14.6061 13.5695 13.8063 14.3687 12.8242 14.3687Z"
                                    fill="white"
                                  />
                                  <path
                                    d="M5.9375 13.0625C6.26542 13.0625 6.53125 12.7967 6.53125 12.4688C6.53125 12.1408 6.26542 11.875 5.9375 11.875C5.60958 11.875 5.34375 12.1408 5.34375 12.4688C5.34375 12.7967 5.60958 13.0625 5.9375 13.0625Z"
                                    fill="white"
                                  />
                                  <path
                                    d="M13.0625 13.0625C13.3904 13.0625 13.6562 12.7967 13.6562 12.4688C13.6562 12.1408 13.3904 11.875 13.0625 11.875C12.7346 11.875 12.4688 12.1408 12.4688 12.4688C12.4688 12.7967 12.7346 13.0625 13.0625 13.0625Z"
                                    fill="white"
                                  />
                                </svg>
                              </span>
                              <span>{{ item.plateNo }}</span>
                            </div>
                          </template>
                          <template v-slot:item.observer="{ item }">
                            <div
                              @click="displayDialog('observer', item)"
                              class="d-flex align-center ga-4 cursor-pointer"
                            >
                              <v-avatar size="2rem" v-if="item.createdBy && item.createdBy.image">
                                <img
                                  style="border-radius: 50%; object-fit: cover"
                                  width="100%"
                                  height="100%"
                                  :src="item.createdBy.image"
                                />
                              </v-avatar>
                              <span v-if="item.createdBy && item.createdBy.name">{{
                                item.createdBy.name
                              }}</span>
                            </div>
                          </template>
                          <template v-slot:item.isResolved="{ item }">
                            <div class="d-flex align-center justify-center">
                              <v-btn
                                v-if="item.isResolved"
                                :loading="item.id == resolvingTicketId"
                                :disabled="item.id == resolvingTicketId"
                                @click="resolveTicket(item.id, 0)"
                                size="small"
                                icon
                                color="primary"
                              >
                                <svg
                                  width="1rem"
                                  height="1rem"
                                  viewBox="0 0 12 9"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M11.7212 0.290533C11.3499 -0.0969666 10.747 -0.0967223 10.3752 0.290533L4.31744 6.60474L1.62503 3.79848C1.25325 3.41098 0.650609 3.41098 0.278832 3.79848C-0.0929441 4.18598 -0.0929441 4.81411 0.278832 5.20161L3.6442 8.70931C3.82998 8.90294 4.07357 9 4.31718 9C4.5608 9 4.80463 8.90319 4.9904 8.70931L11.7212 1.69364C12.0929 1.30641 12.0929 0.678009 11.7212 0.290533Z"
                                    fill="white"
                                  />
                                </svg>
                              </v-btn>
                              <v-btn
                                v-else
                                :loading="item.id == resolvingTicketId"
                                :disabled="item.id == resolvingTicketId"
                                @click="resolveTicket(item.id, 1)"
                                size="small"
                                variant="outlined"
                                icon
                              >
                                <svg
                                  width="1rem"
                                  height="1rem"
                                  viewBox="0 0 12 9"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M11.7212 0.290533C11.3499 -0.0969666 10.747 -0.0967223 10.3752 0.290533L4.31744 6.60474L1.62503 3.79848C1.25325 3.41098 0.650609 3.41098 0.278832 3.79848C-0.0929441 4.18598 -0.0929441 4.81411 0.278832 5.20161L3.6442 8.70931C3.82998 8.90294 4.07357 9 4.31718 9C4.5608 9 4.80463 8.90319 4.9904 8.70931L11.7212 1.69364C12.0929 1.30641 12.0929 0.678009 11.7212 0.290533Z"
                                    fill="white"
                                  />
                                </svg>
                              </v-btn>
                            </div>
                          </template>
                        </v-data-table-server>
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
    <div v-if="isCompanyDetailsDialog">
      <MapCompanyDetailsDialog v-model="isCompanyDetailsDialog" :details="selectedCompany" />
    </div>
    <div v-if="isObserverDetailsDialog">
      <MapObserverDetailsDialog
        v-model="isObserverDetailsDialog"
        :location-details="selectedObserver"
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

.v-badge--custom.v-badge--dot .v-badge__badge {
  height: 0.9rem;
  width: 0.9rem;
  border-radius: 50%;
}
</style>
