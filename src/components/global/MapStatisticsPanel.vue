<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from "vue";
import { useElementSize } from "@vueuse/core";
import {
  parseValueToActialNumber,
  animateNumber,
  convertNumberWithSeperator
} from "@/helpers/helperFunctions";
import { useMapStore } from "@/stores/MapStore";

import arrowUpRight from "@/assets/imgs/arrow-up-right.png";
import arrowDownRight from "@/assets/imgs/arrow-down-right.png";
import arrowRight from "@/assets/imgs/arrow-right.png";

interface StageFilter {
  name: string;
  value: string;
  center: { lat: number; lng: number };
}

const mapStore = useMapStore();
const opendPanel = ref<"panel" | null>("panel");
const isActivePanel = ref(true);
const panelTitle = ref();
const topPanel = ref();
const panelTitleDimensions = useElementSize(panelTitle);
const topPanelDimensions = useElementSize(topPanel);

const restPanelHeight = computed(() => {
  return panelTitleDimensions.height.value + topPanelDimensions.height.value + 80 + 80 + 68;
});

const auditedBusesCount = ref<number>(0);
const auditedBusesCountTweened = reactive({
  number: 0
});
watch(auditedBusesCount, (value: number) => {
  animateNumber(auditedBusesCountTweened, value);
});

const ticketsHighCount = ref<number>(0);
const ticketsHighCountTweened = reactive({
  number: 0
});
watch(ticketsHighCount, (value: number) => {
  animateNumber(ticketsHighCountTweened, value);
});

const ticketsMediumCount = ref<number>(0);
const ticketsMediumCountTweened = reactive({
  number: 0
});
watch(ticketsMediumCount, (value: number) => {
  animateNumber(ticketsMediumCountTweened, value);
});

const totalObserversCount = ref<number>(0);
const totalObserversCountTweened = reactive({
  number: 0
});
watch(totalObserversCount, (value: number) => {
  animateNumber(totalObserversCountTweened, value);
});

const workersCount = ref(0);
const workersCountTweened = reactive({
  number: 0
});
watch(workersCount, (value) => {
  animateNumber(workersCountTweened, value);
});

const entitiesVisitedCount = ref(0);
const entitiesVisitedCountTweened = reactive({
  number: 0
});
watch(entitiesVisitedCount, (value) => {
  animateNumber(entitiesVisitedCountTweened, value);
});

const workersApperance = ref(0);
const workersApperanceTweened = reactive({
  number: 0
});
watch(workersApperance, (value) => {
  animateNumber(workersApperanceTweened, value);
});

const workersAbsent = ref(0);
const workersAbsentTweened = reactive({
  number: 0
});
watch(workersAbsent, (value) => {
  animateNumber(workersAbsentTweened, value);
});

// animate when the panel toogled
watch(
  () => mapStore.isLoadingMapStatistics,
  (isLoading: boolean) => {
    if (isLoading) {
      mapStore.resetMapStatisticsAttendance();
      //   auditedBusesCountTweened.number = 0;
      //   workersCountTweened.number = 0;
      //   entitiesVisitedCountTweened.number = 0;
      //   workersApperanceTweened.number = 0;
      //   workersAbsentTweened.number = 0;
    } else {
      auditedBusesCount.value = mapStore.mapStageReports.count_audited_buses;
      ticketsMediumCount.value = mapStore.mapStageReports.count_midlevel;
      ticketsHighCount.value = mapStore.mapStageReports.count_highlevel;
      workersCount.value = mapStore.mapStatisticsAttendance.total_attendance;
      entitiesVisitedCount.value = mapStore.mapStatisticsAttendance.count_companies;
      workersApperance.value = mapStore.mapStatisticsAttendance.attendance_percent;
      workersAbsent.value = mapStore.mapStatisticsAttendance.absence_percent;
      totalObserversCount.value = mapStore.mapStatisticsAttendance.total_observers_count;
    }
  }
);

watch(
  () => mapStore.mapStatisticsAttendance,
  (attendance) => {
    workersCount.value = attendance.total_attendance;
    entitiesVisitedCount.value = attendance.count_companies;
    workersApperance.value = attendance.attendance_percent;
    workersAbsent.value = attendance.absence_percent;
    totalObserversCount.value = attendance.total_observers_count;
  }
);

watch(
  () => mapStore.mapStageReports,
  (reports) => {
    auditedBusesCount.value = reports.count_audited_buses;
    ticketsMediumCount.value = reports.count_midlevel;
    ticketsHighCount.value = reports.count_highlevel;
  }
);

watch(isActivePanel, (isActive) => {
  if (!isActive && mapStore.isMapStatisticsFullscreen) {
    mapStore.toggleMapStatisticsFullscreen(false);
  }
});

const togglePanel = ({ value }: { value: boolean }) => {
  isActivePanel.value = value;
};

const refreshData = (e: Event) => {
  e.stopPropagation();
  // mapStore.resetStatisticsFilters();
  mapStore.getMapStatistics();
};

const maximaizePanel = (e: Event) => {
  e.stopPropagation();
  mapStore.toggleMapStatisticsFullscreen(true);
};

const minimaizePanel = (e: Event) => {
  e.stopPropagation();
  mapStore.toggleMapStatisticsFullscreen(false);
};

type TicketDialogType = "high" | "low";

const currentStage = computed(() => mapStore.locationMapTypes.find((type) => type.isCurrent));
const isActiveStageMenu = ref<boolean>(false);
const activeStageName = ref<string>("جاهزية التفويج إلى مشعر منى");
const activeStageValue = ref<string>("mina_tafweej_readiness");
const isTicketsDialog = ref<boolean>(false);
const ticketDialogType = ref<TicketDialogType>("high");
const isFirstLoad = ref<boolean>(false);

watch(currentStage, (stage) => {
  activeStageName.value = stage?.name || "";
  activeStageValue.value = stage?.value || "";

  if (!isFirstLoad.value) {
    mapStore.mapInstance?.panTo(stage.center);
    isFirstLoad.value = true;
  }
});

const displayDialog = (type: TicketDialogType) => {
  ticketDialogType.value = type;
  isTicketsDialog.value = true;
};

const handleStageFilter = (filter: StageFilter) => {
  activeStageName.value = filter.name;
  activeStageValue.value = filter.value;
  mapStore.updateMapStatisticsFilter("type", filter.value);
  mapStore.mapInstance?.panTo(filter.center);

  mapStore.getMapStatistics();
};

const taskDialogDetails = ref<any>(null);
const isTaskDialog = ref<boolean>(false);

const showTaskDialog = (task: any) => {
  taskDialogDetails.value = task;
  isTaskDialog.value = true;
};

onMounted(() => {
  mapStore.getMapStatistics();
});

import brandMark from "@/assets/imgs/Brandmark.png";
import refreshIcon from "@/assets/imgs/refresh.png";
import maximizeIcon from '@/assets/imgs/maximize.png';
import minimizeIcon from '@/assets/imgs/minimize.png';
</script>

<template>
  <div
    :style="`width: ${mapStore.isMapStatisticsFullscreen ? 'calc(100% - 60px)' : '33rem'}`"
    class="map-custom-panel"
  >
    <v-expansion-panels variant="popout" v-model="opendPanel" bg-color="transparent">
      <v-expansion-panel value="panel" bg-color="#383838" @group:selected="togglePanel">
        <v-expansion-panel-title
          :readonly="mapStore.isMapStatisticsFullscreen"
          :hide-actions="mapStore.isMapStatisticsFullscreen"
          :class="{ 'pe-0': mapStore.isMapStatisticsFullscreen }"
        >
          <template v-slot:default="{ expanded }">
            <div ref="panelTitle" class="w-100 d-flex align-center justify-space-between">
              <h2
                style="min-width: 10rem"
                class="text-h6 font-weight-bold"
                @click="(e) => e.stopPropagation()"
              >
                <img :src="brandMark" style="height: 50px;" />
                <v-menu v-model="isActiveStageMenu" width="500px">
                  <template v-slot:activator="{ props }">
                    <v-btn
                      variant="text"
                      v-bind="props"
                      height="auto"
                      rounded="md"
                      class="px-2"
                      style="font-size: 1rem"
                    >
                    </v-btn>
                  </template>

                  <v-list width="300">
                    <v-list-item
                      @click="handleStageFilter(filterValue)"
                      href="#"
                      v-for="(filterValue, index) in mapStore.locationMapTypes"
                      :key="index"
                      :active="filterValue.isCurrent"
                    >
                      <v-list-item-title>
                        {{ filterValue.name }}
                      </v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-menu>
                <!-- @update:modelValue="handleFilter(filter.key, $event)" -->
              </h2>
              
              <transition name="list" mode="out-in">
                <div v-if="expanded" class="d-flex align-center ga-2 pe-4">
                  <v-btn @click="refreshData" icon variant="text">
                    <img :src="refreshIcon" style="height: 25px" />
                  </v-btn>
                  <v-btn
                    v-if="mapStore.isMapStatisticsFullscreen"
                    @click="minimaizePanel"
                    variant="text"
                  >
                    <div class="w-100 d-flex align-center ga-2">
                      <span>تقليص الشاشة</span>
                      <img :src="minimizeIcon" style="height: 25px" />
                    </div>
                  </v-btn>
                  <v-btn v-else @click="maximaizePanel" icon variant="text">
                    <img :src="maximizeIcon" style="height: 25px;" />
                  </v-btn>
                </div>
              </transition>
            </div>
          </template>
        </v-expansion-panel-title>
        <hr>
        <v-expansion-panel-text v-if="mapStore.isLoadingMapStatistics" class="h-100">
          <div class="h-100 d-flex flex-column pt-8">
            <div class="w-100 pb-8 px-4">
              <v-row class="mx-0" :class="[mapStore.isMapStatisticsFullscreen ? 'py-6' : '']">
                <v-col
                  v-for="item in 4"
                  :key="item"
                  :cols="`${mapStore.isMapStatisticsFullscreen ? 3 : 6}`"
                  class="d-flex flex-column align-center mb-4"
                >
                  <div class="mb-4">
                    <v-skeleton-loader
                      type="button"
                      height="1.5rem"
                      width="10rem"
                      max-width="100%"
                      max-height="100%"
                    ></v-skeleton-loader>
                  </div>
                  <div>
                    <v-skeleton-loader
                      type="button"
                      height="1rem"
                      width="8rem"
                      max-width="100%"
                      max-height="100%"
                    ></v-skeleton-loader>
                  </div>
                </v-col>
              </v-row>
            </div>
            <hr />
            <div class="panel-charts-wrapper panel-charts-wrapper__scrollbar overflow-y-auto">
              <div class="px-3">
                <v-row class="mx-0 pt-12">
                  <v-col
                    v-for="item in 6"
                    :key="item"
                    :cols="`${mapStore.isMapStatisticsFullscreen ? 4 : 6}`"
                    class="d-flex flex-column align-center mb-4"
                  >
                    <div class="mb-4">
                      <v-skeleton-loader
                        type="button"
                        height="1rem"
                        width="8rem"
                        max-width="100%"
                        max-height="100%"
                      ></v-skeleton-loader>
                    </div>
                    <div>
                      <v-skeleton-loader
                        type="button"
                        height="4rem"
                        width="10rem"
                        max-width="100%"
                        max-height="100%"
                      ></v-skeleton-loader>
                    </div>
                  </v-col>
                </v-row>
              </div>
            </div>
          </div>
        </v-expansion-panel-text>
        <v-expansion-panel-text
          disabled
          v-else
          class="h-100"
          :class="[mapStore.isMapStatisticsError ? 'justify-center align-center' : '']"
        >
          <!-- <div
            v-if="mapStore.isMapStatisticsError"
            class="d-flex flex-column justify-center align-center ga-2 mt-n16 text-red-accent-1"
          >
            <div>
              <svg
                width="3rem"
                height="3rem"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <path
                  d="M11,15H13V17H11V15M11,7H13V13H11V7M12,2C6.47,2 2,6.5 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20Z"
                  fill="currentColor"
                />
              </svg>
            </div>
            <p>عذرا، حدث خطأ غير متوقع اثناء جلب الاحصائيات</p>
          </div> -->
          <div class="h-100 d-flex flex-column">
            <div
              ref="topPanel"
              class="w-100 pb-8"
              :class="[mapStore.isMapStatisticsFullscreen ? 'px-2' : 'px-4']"
            >
              <v-row
                class="top-panel-grid mx-0"
                :class="{ 'top-panel-grid--fullscreen': mapStore.isMapStatisticsFullscreen }"
                :style="[mapStore.isMapStatisticsFullscreen ? 'background-color: #303030; margin-top: 20px;' : '']"
              >
                <v-col :cols="`${mapStore.isMapStatisticsFullscreen ? 3 : 12}`">
                  <v-card
                    class="w-100"
                    :class="[mapStore.isMapStatisticsFullscreen ? 'pa-10' : 'pa-0']"
                    style=" background-color: transparent;"
                    :style="[mapStore.isMapStatisticsFullscreen ? 'border-left: 1px solid #494A4A; border-radius: 0;' : '']"
                  >
                    <div class="w-100 h-100 d-flex flex-column ga-2">
                      <h2 class="text-h4 font-weight-bold">
                        {{
                          convertNumberWithSeperator(
                            parseValueToActialNumber(auditedBusesCountTweened.number, 0),
                            "٬"
                          )
                        }}
                      </h2>
                      <div class="d-flex" style="justify-content: space-between">
                        <p style="font-size: 0.9rem">عدد العاملين في الميدان</p>

                        <div class="status-true">
                          <img style="width: 16px" class="h-16" :src="arrowUpRight" alt="no-icon" />
                          <p>4.1%</p>
                        </div>
                      </div>
                    </div>
                  </v-card>
                </v-col>

                <v-col :cols="`${mapStore.isMapStatisticsFullscreen ? 3 : 12}`">
                  <v-card
                    class="w-100"
                    :class="[mapStore.isMapStatisticsFullscreen ? 'pa-10' : 'pa-0']"
                    style=" background-color: transparent;"
                  >
                    <div class="w-100 h-100 d-flex flex-column ga-2">
                      <h2 class="text-h4 font-weight-bold" style="color: white">
                        {{
                          convertNumberWithSeperator(
                            parseValueToActialNumber(ticketsHighCountTweened.number, 0),
                            "٬"
                          )
                        }}
                      </h2>
                      <div class="d-flex" style="justify-content: space-between">
                        <p style="font-size: 0.9rem">عدد الزيارت الميدانيه</p>
                        <div class="status-false">
                          <img
                            style="width: 16px"
                            class="h-16"
                            :src="arrowDownRight"
                            alt="no-icon"
                          />
                          <p>4.1%</p>
                        </div>
                      </div>
                    </div>
                  </v-card>
                </v-col>
                <v-col :cols="`${mapStore.isMapStatisticsFullscreen ? 3 : 12}`">
                  <v-card
                    class="w-100"
                    :class="[mapStore.isMapStatisticsFullscreen ? 'pa-10' : 'pa-0']"
                    style=" background-color: transparent;"
                  >
                    <div class="w-100 h-100 d-flex flex-column ga-2">
                      <h2 class="text-h4 font-weight-bold">
                        {{
                          convertNumberWithSeperator(
                            parseValueToActialNumber(totalObserversCountTweened.number, 0),
                            "٬"
                          )
                        }}
                      </h2>
                      <div class="d-flex" style="justify-content: space-between">
                        <span style="font-size: 0.9rem"> عدد المخيمات التي تمت زيارتها</span>
                        <div class="status-normal d-flex justify-content-center">
                          <img style="width: 16px" class="h-16" :src="arrowRight" alt="no-icon" />
                          <p>0.0%</p>
                        </div>
                      </div>
                    </div>
                  </v-card>
                </v-col>
                <v-col :cols="`${mapStore.isMapStatisticsFullscreen ? 3 : 12}`">
                  <v-card
                    class="w-100"
                    :class="[mapStore.isMapStatisticsFullscreen ? 'pa-10' : 'pa-0']"
                    style=" background-color: transparent;"
                  >
                    <div class="w-100 h-100 d-flex flex-column ga-2">
                      <h2 class="text-h4 font-weight-bold" style="color: white">
                        {{
                          convertNumberWithSeperator(
                            parseValueToActialNumber(ticketsMediumCountTweened.number, 0),
                            "٬"
                          )
                        }}
                      </h2>
                      <div class="d-flex" style="justify-content: space-between">
                        <span style="font-size: 0.9rem">عدد المساكن التي تمت زيارتها</span>
                        <div class="status-normal d-flex justify-content-center">
                          <img style="width: 16px" class="h-16" :src="arrowRight" alt="no-icon" />
                          <p>0.0%</p>
                        </div>
                      </div>
                    </div>
                  </v-card>
                </v-col>
                <!-- <v-col :cols="`${mapStore.isMapStatisticsFullscreen ? 'auto' : 6}`">
                  <v-row class="ma-0" :class="{ 'h-100': mapStore.isMapStatisticsFullscreen }">
                    <v-col
                      :cols="`${mapStore.isMapStatisticsFullscreen ? 6 : 12}`"
                      class="h-100 py-0"
                      :class="[mapStore.isMapStatisticsFullscreen ? 'h-100 ps-0' : 'mb-3 px-0']"
                    >
                      <v-card
                        class="w-100"
                        :class="[mapStore.isMapStatisticsFullscreen ? 'h-100 pa-10' : 'pa-0']"
                      >
                        <div
                          class="d-flex align-center justify-space-between ga-2"
                          :class="{ 'mt-3': mapStore.isMapStatisticsFullscreen }"
                        >
                          <span class="whitespace-nowrap" style="font-size: 0.9rem">
                            نسبة التزام العاملين
                          </span>
                          <h2 class="text-h6">
                            <span class="font-weight-bold">
                              {{ parseValueToActialNumber(workersApperanceTweened.number, 0) }}
                            </span>
                            <span class="font-weight-bold">%</span>
                          </h2>
                        </div>
                        <v-progress-linear
                          :model-value="parseValueToActialNumber(workersApperanceTweened.number, 0)"
                          height="10"
                          bg-color="#fff"
                          color="primary"
                          bg-opacity="1"
                          rounded
                        ></v-progress-linear>
                      </v-card>
                    </v-col>
                    <v-col
                      :cols="`${mapStore.isMapStatisticsFullscreen ? 6 : 12}`"
                      class="py-0"
                      :class="[mapStore.isMapStatisticsFullscreen ? 'h-100 pe-0' : 'px-0']"
                    >
                      <v-card
                        class="w-100"
                        :class="[mapStore.isMapStatisticsFullscreen ? 'h-100 pa-10' : 'pa-0']"
                      >
                        <div
                          class="d-flex align-center justify-space-between ga-2"
                          :class="{ 'mt-3': mapStore.isMapStatisticsFullscreen }"
                        >
                          <span class="whitespace-nowrap" style="font-size: 0.9rem">
                            نسبة الغياب
                          </span>
                          <h2 class="text-h6">
                            <span class="font-weight-bold">
                              {{ parseValueToActialNumber(workersAbsentTweened.number, 0) }}
                            </span>
                            <span class="font-weight-bold">%</span>
                          </h2>
                        </div>
                        <v-progress-linear
                          :model-value="parseValueToActialNumber(workersAbsentTweened.number, 0)"
                          height="10"
                          bg-color="#fff"
                          color="primary"
                          bg-opacity="1"
                          rounded
                        ></v-progress-linear>
                      </v-card>
                    </v-col>
                  </v-row>
                </v-col> -->
              </v-row>
            </div>
            <hr />
            <!-- :style="`height: calc(100vh - ${restPanelHeight}px)`" -->
            <div
              :style="`height: calc(100vh - ${restPanelHeight}px)`"
              class="panel-charts-wrapper panel-charts-wrapper__scrollbar w-100 overflow-y-auto"
            >
              <!-- <PerfectScrollbar
                :options="{
                  swipeEasing: true
                }"
              > -->
              <!-- </PerfectScrollbar> -->
              <div :class="{ 'px-3': !mapStore.isMapStatisticsFullscreen }">
                <v-row
                  class="panel-bottom ma-0 pb-4"
                  :class="[mapStore.isMapStatisticsFullscreen ? 'panel-bottom--fullscreen' : '']"
                >
                  <v-col
                    v-for="(task, index) in mapStore.mapStatisticsTasks"
                    :key="index"
                    :cols="`${mapStore.isMapStatisticsFullscreen ? 4 : 6}`"
                    :class="{ 'pb-0': mapStore.isMapStatisticsFullscreen }"
                  >
                    <v-card
                      @click="showTaskDialog(task)"
                      class="w-100 h-100"
                      :class="[mapStore.isMapStatisticsFullscreen ? 'pa-10 pa-xl-16' : 'pa-0']"
                    >
                      <div
                        class="h-100 w-100 d-flex flex-column justify-space-between align-center py-2"
                      >
                        <h2
                          class="mb-4 px-2 text-center"
                          :style="`opacity: 0.9; font-size: ${
                            mapStore.isMapStatisticsFullscreen ? '1rem' : '0.8rem'
                          };`"
                        >
                          {{ task.name }}
                        </h2>
                        <h2 v-if="task.is_count" class="text-h4 pt-6 font-weight-bold">
                          {{ task.count }}
                        </h2>
                        <div v-else class="d-flex align-center ga-4">
                          <DonutChart
                            v-show="mapStore.isMapStatisticsFullscreen"
                            :colors="['#B49164', '#fff']"
                            :width="125"
                            :data="[task.yes, task.no]"
                          />
                          <DonutChart
                            v-show="!mapStore.isMapStatisticsFullscreen"
                            :colors="['#B49164', '#fff']"
                            :width="85"
                            :data="[task.yes, task.no]"
                          />
                          <div class="d-flex align-center ga-8">
                            <div class="d-flex flex-column align-center ga-2">
                              <div class="d-flex align-center ga-2">
                                <v-badge dot color="primary"></v-badge>
                                <span
                                  class="mt-1 font-weight-bold"
                                  style="font-size: 0.8rem; opacity: 0.9"
                                >
                                  نعم
                                </span>
                              </div>
                              <h4 class="font-weight-bold">
                                {{ convertNumberWithSeperator(task.yes) }}
                              </h4>
                            </div>
                            <div class="d-flex flex-column align-center ga-2">
                              <div class="d-flex align-center ga-2">
                                <v-badge dot color="white"></v-badge>
                                <span
                                  class="mt-1 font-weight-bold"
                                  style="font-size: 0.8rem; opacity: 0.9"
                                >
                                  لا
                                </span>
                              </div>
                              <h4 class="font-weight-bold">
                                {{ convertNumberWithSeperator(task.no) }}
                              </h4>
                            </div>
                          </div>
                        </div>
                      </div>
                    </v-card>
                  </v-col>
                </v-row>
              </div>
            </div>
          </div>
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>

    <MapTicketTypesDialog
      v-if="isTicketsDialog"
      v-model="isTicketsDialog"
      :ticket-type="ticketDialogType"
    />

    <MapTaskDetailsDialog v-if="isTaskDialog" v-model="isTaskDialog" :task="taskDialogDetails" />
  </div>
</template>

<style lang="scss">
@import "vue3-perfect-scrollbar/style.css";
.v-btn-icon {
  transition: transform 300ms ease-in-out;
}

// [aria-expanded="true"] .v-btn-icon {
//   transform: rotate(180deg);
// }

.top-panel-grid {
  &--fullscreen {
    & > .v-col:not(:last-child) {
      width: calc(100% / 5);
    }

    & > .v-col:last-child {
      width: calc((100% / 5) * 2);
    }
  }

  &:not(.top-panel-grid--fullscreen) {
    .v-card {
      background-color: transparent !important;
    }
  }
}

.panel-bottom:not(.panel-bottom--fullscreen) {
  .v-card {
    background-color: transparent !important;
  }
}

.panel-charts-wrapper {
  &__scrollbar {
    &::-webkit-scrollbar {
      width: 8px;
    }

    &::-webkit-scrollbar-track {
      background: #000;
    }

    &::-webkit-scrollbar-thumb {
      border-radius: 10px;
      background: #343434;
    }
  }
}

.map-custom-panel {
  --panel-top: 25px;
  overflow: hidden;
  position: fixed;
  top: var(--panel-top);
  right: 30px;
  z-index: 9999;
  transition: width 300ms ease-in-out;
  // box-shadow: 5px 10px 15px rgba(0, 0, 0, 0.1);
  // width: 33rem;
  // height: calc(100vh - var(--panel-top));

  .panel-bottom {
    .v-col {
      padding-top: 1.5rem;
      padding-bottom: 1.5rem;
    }

    &:not(.panel-bottom--fullscreen) {
      .v-col {
        border-top: 1px solid #343434;

        &:nth-child(odd) {
          border-left: 1px solid #343434;
        }
      }
    }
  }

  .v-expansion-panel {
    border-radius: 10px;

    &.v-expansion-panel--active {
      height: calc(100vh - (var(--panel-top) + 64px));
    }
  }

  .v-expansion-panel-title {
    font-size: 1rem;
    font-weight: bold;
  }

  .v-expansion-panel-text__wrapper {
    padding: 8px 0px 16px;
  }

  .status-true {
    background-color: #ebf0ef;
    color: #35685f;
    font-size: 14px;
    font-weight: 400;
    border-radius: 32px;
    padding: 4px 10px;
    display: flex;
  }
  .status-true img {
    margin: 3px 0 0 3px;
  }

  .status-false {
    background-color: #fff0f0;
    color: #ffa2a2;
    font-size: 14px;
    font-weight: 400;
    border-radius: 32px;
    padding: 4px 10px;
    display: flex;
  }
  .status-false img {
    margin: 3px 0 0 3px;
  }

  .status-normal {
    background-color: #fff9eb;
    color: #857854;
    font-size: 14px;
    font-weight: 400;
    border-radius: 32px;
    padding: 4px 10px;
    display: flex;
  }
  .status-normal img {
    margin: 3px 0 0 3px;
  }
}
</style>
