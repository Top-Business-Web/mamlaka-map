<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from "vue";
import { useElementSize } from "@vueuse/core";
import {
  parseValueToActialNumber,
  animateNumber,
  convertNumberWithSeperator
} from "@/helpers/helperFunctions";
import MainAxesPanel from "./panels/MainAxesPanel.vue";
import ComplaintsPanel from "./panels/ComplaintsPanel.vue";
import DailyReportsPanel from "./panels/DailyReportsPanel.vue";
import FieldTeamsPanel from "./panels/FieldTeamsPanel.vue";
import LocationsPanel from "./panels/LocationsPanel.vue";
import PreperationPanel from "./panels/PreperationPanel.vue";
import SupervisorsPanel from "./panels/SupervisorsPanel.vue";
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
import maximizeIcon from "@/assets/imgs/maximize.png";
import minimizeIcon from "@/assets/imgs/minimize.png";
</script>

<template>
  <div :style="`width: ${mapStore.isMapStatisticsFullscreen ? 'calc(100% - 60px)' : '33rem'}`" class="map-custom-panel">
    <v-expansion-panels variant="popout" v-model="opendPanel" bg-color="transparent">
      <v-expansion-panel value="panel" bg-color="#383838" @group:selected="togglePanel">
        <v-expansion-panel-title :readonly="mapStore.isMapStatisticsFullscreen"
          :hide-actions="mapStore.isMapStatisticsFullscreen" :class="{ 'pe-0': mapStore.isMapStatisticsFullscreen }">
          <template v-slot:default="{ expanded }">
            <div ref="panelTitle" class="w-100 d-flex align-center justify-space-between">
              <h2 style="min-width: 10rem" class="text-h6 font-weight-bold" @click="(e) => e.stopPropagation()">
                <img :src="brandMark" style="height: 50px" />
              </h2>
              <transition name="list" mode="out-in">
                <div v-if="expanded" class="d-flex align-center ga-2 pe-4">
                  <v-btn @click="refreshData" icon variant="text">
                    <img :src="refreshIcon" style="height: 25px" />
                  </v-btn>
                  <v-btn v-if="mapStore.isMapStatisticsFullscreen" @click="minimaizePanel" variant="text">
                    <div class="w-100 d-flex align-center ga-2">
                      <span>تقليص الشاشة</span>
                      <img :src="minimizeIcon" style="height: 25px" />
                    </div>
                  </v-btn>
                  <v-btn v-else @click="maximaizePanel" icon variant="text">
                    <img :src="maximizeIcon" style="height: 25px" />
                  </v-btn>
                </div>
              </transition>
            </div>
          </template>
        </v-expansion-panel-title>
        <v-expansion-panel-text v-if="mapStore.isLoadingMapStatistics">
          <div class="h-100 d-flex flex-column pt-8">
            <div class="w-100 pb-8 px-4">
              <v-row class="mx-0" :class="[mapStore.isMapStatisticsFullscreen ? 'py-6' : '']">
                <v-col v-for="item in 4" :key="item" :cols="`${mapStore.isMapStatisticsFullscreen ? 3 : 6}`"
                  class="d-flex flex-column align-center mb-4">
                  <div class="mb-4">
                    <v-skeleton-loader type="button" height="1.5rem" width="10rem" max-width="100%"
                      max-height="100%"></v-skeleton-loader>
                  </div>
                  <div>
                    <v-skeleton-loader type="button" height="1rem" width="8rem" max-width="100%"
                      max-height="100%"></v-skeleton-loader>
                  </div>
                </v-col>
              </v-row>
            </div>
            <hr />
            <div class="panel-charts-wrapper panel-charts-wrapper__scrollbar overflow-y-auto">
              <div class="px-3">
                <v-row class="mx-0 pt-12">
                  <v-col v-for="item in 6" :key="item" :cols="`${mapStore.isMapStatisticsFullscreen ? 4 : 6}`"
                    class="d-flex flex-column align-center mb-4">
                    <div class="mb-4">
                      <v-skeleton-loader type="button" height="1rem" width="8rem" max-width="100%"
                        max-height="100%"></v-skeleton-loader>
                    </div>
                    <div>
                      <v-skeleton-loader type="button" height="4rem" width="10rem" max-width="100%"
                        max-height="100%"></v-skeleton-loader>
                    </div>
                  </v-col>
                </v-row>
              </div>
            </div>
          </div>
        </v-expansion-panel-text>
        <v-expansion-panel-text v-else :class="[mapStore.isMapStatisticsError ? 'justify-center align-center' : '']"
          :style="`height: calc(100% - ${restPanelHeight})`">
          <MainAxesPanel v-if="mapStore.mapStatisticsFilters.type == 'main-axes-management'" />
          <ComplaintsPanel v-if="mapStore.mapStatisticsFilters.type == 'complaints-management'" />
          <DailyReportsPanel v-if="mapStore.mapStatisticsFilters.type == 'daily-reports-management'" />
          <FieldTeamsPanel v-if="mapStore.mapStatisticsFilters.type == 'field-teams-management'" />
          <LocationsPanel v-if="mapStore.mapStatisticsFilters.type == 'locations-management'" />
          <PreperationPanel v-if="mapStore.mapStatisticsFilters.type == 'preparation-management'" />
          <SupervisorsPanel v-if="mapStore.mapStatisticsFilters.type == 'supervisors-reports-management'" />
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>

    <MapTicketTypesDialog v-if="isTicketsDialog" v-model="isTicketsDialog" :ticket-type="ticketDialogType" />

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
    &>.v-col:not(:last-child) {
      width: calc(100% / 5);
    }

    &>.v-col:last-child {
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

  .v-expansion-panel-text {
    overflow-y: scroll;
    height: calc(100% - (var(--panel-top) + 64px));
  }

  [class*='status-'] {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 3px;
    font-size: 14px;
    font-weight: 400;
    border-radius: 32px;
    padding: 8px 10px;
    min-width: 90px;
  }

  [class*="status-"] * {
    line-height: 1;
  }

  .status-true {
    background-color: #ebf0ef;
    color: #35685f;
  }

  .status-false {
    background-color: #fff0f0;
    color: #ffa2a2;
  }

  .status-normal {
    background-color: #fff9eb;
    color: #857854;
  }

}

.progress {
  height: 8px;
}

.primary .progress-bar {
  background-color: #b6ad98 !important;
}

.second .progress-bar {
  background-color: #c05e5e !important;
}

.card-border {
  padding: 16px;
  border-radius: 8px;
}

.shape {
  background-color: #303030;
  background-image: url("@/assets/imgs/shape.png");
  background-position: bottom;
  background-repeat: no-repeat;
  background-size: cover;
  height: 65px;
  border-radius: 0 0 10px 10px;
}

p {
  margin-bottom: 0;
}
</style>
