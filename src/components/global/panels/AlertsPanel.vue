<script setup>
import { convertNumberWithSeperator, parseValueToActialNumber } from '@/helpers/helperFunctions';
import { useMapStore } from '@/stores/MapStore';
import Chart, { elements } from "chart.js/auto";
import { onMounted } from 'vue';
import http from '@/plugins/axios';
import AlertsModal from '@/components/maps/modals/alertsModal.vue'

import arrowUpRight from "@/assets/imgs/arrow-up-right.png";
import arrowDownRight from "@/assets/imgs/arrow-down-right.png";
import arrowRight from "@/assets/imgs/arrow-right.png";
import emptyBox from "@/assets/imgs/empty-box.svg";

const mapStore = useMapStore();
const searchQuery = ref(mapStore.mapStatisticsFilters);
const fetchedReports = ref({});
const selectedAlert = ref("");
const fetchedDetails = ref({});
const detailsSearchQuery = reactive({
    period: searchQuery.value.period,
    status: selectedAlert.value
});
const isLoading = ref(false)

async function getDetails() {
    isLoading.value = true
    try {
        const params = Object.fromEntries(
            Object.entries(detailsSearchQuery).filter(([_, v]) => v)
        );
        const res = await http.get(`v1/map/getDetailsForParent6`, { params });
        fetchedDetails.value = res.data.data
        generateCharts();
        isLoading.value = false
    } catch (error) {
        console.log("fetch failed", error);
    }
}
watch(selectedAlert, getDetails, { deep: true });

function generateCharts() {
    const alertsStatusData = {
        datasets: [
            {
                label: 'التنبيهات المقروءة',
                data: [fetchedDetails.value.seenAlertsCount / fetchedDetails.value.alertsCount * 100],
                borderWidth: 0,
                radius: "80%",
                cutout: 0,
                circumference: 360 * (fetchedDetails.value.seenAlertsCount / fetchedDetails.value.alertsCount * 100) / 100,
                backgroundColor: '#35685F',
            },
            {
                label: 'التنبيهات الغير مقروءة',
                data: [fetchedDetails.value.unseenAlertsCount / fetchedDetails.value.alertsCount * 100],
                borderWidth: 0,
                radius: "80%",
                backgroundColor: '#C05E5E',
                circumference: 360 * (fetchedDetails.value.unseenAlertsCount / fetchedDetails.value.alertsCount * 100) / 100,
                rotation: -360 * (fetchedDetails.value.unseenAlertsCount / fetchedDetails.value.alertsCount * 100) / 100,
            }
        ],
    }
    const alertsPeriorityData = {
        datasets: [
            {
                label: 'عالية الأهمية',
                data: [fetchedDetails.value.highAlertsCount / fetchedDetails.value.alertsCount * 100],
                borderWidth: 0,
                radius: "80%",
                cutout: 0,
                circumference: 360 * (fetchedDetails.value.highAlertsCount / fetchedDetails.value.alertsCount * 100) / 100,
                backgroundColor: '#C05E5E',
            },
            {
                label: 'متوسطة الأهمية',
                data: [fetchedDetails.value.midAlertsCount / fetchedDetails.value.alertsCount * 100],
                borderWidth: 0,
                radius: "80%",
                circumference: 360 * (fetchedDetails.value.midAlertsCount / fetchedDetails.value.alertsCount * 100) / 100,
                rotation: -360 * ((fetchedDetails.value.midAlertsCount / fetchedDetails.value.alertsCount * 100) + (fetchedDetails.value.lowAlertsCount / fetchedDetails.value.alertsCount * 100)) / 100,
                backgroundColor: '#857854',
            },
            {
                label: 'منخفضة الأهمية',
                data: [fetchedDetails.value.lowAlertsCount / fetchedDetails.value.alertsCount * 100],
                borderWidth: 0,
                cutout: "64%",
                radius: "80%",
                circumference: 360 * (fetchedDetails.value.lowAlertsCount / fetchedDetails.value.alertsCount * 100) / 100,
                rotation: -360 * (fetchedDetails.value.lowAlertsCount / fetchedDetails.value.alertsCount * 100) / 100,
                backgroundColor: '#35685F',
                weight: 0.8
            }
        ],
    }
    function generateConfig(data) {
        const config = {
            type: 'doughnut',
            data: data,
            options: {
                plugins: {
                    legend: {
                        display: true,
                        position: "bottom",
                        labels: {
                            padding: 30,
                            usePointStyle: true,
                            color: '#c1c1c1'
                        }
                    }
                }
            }
        }
        return config
    }


    if (alertsStatusChart.toDataURL() !== document.getElementById('blank').toDataURL()) {
        Chart.getChart(alertsStatusChart).destroy();
    }
    new Chart(alertsStatusChart, generateConfig(alertsStatusData));

    if (alertsPeriorityChart.toDataURL() !== document.getElementById('blank').toDataURL()) {
        Chart.getChart(alertsPeriorityChart).destroy();
    }
    new Chart(alertsPeriorityChart, generateConfig(alertsPeriorityData));
}

const isModalShow = ref(false);
const isAlertDetails = ref(false)
const alertsPeriority = ref("");

function toggleAlertsModal(periority) {
    alertsPeriority.value = periority
    isModalShow.value = true;
}

</script>
<template>
    <div style="padding: 15px; height: 100%;">
        <v-row class="my-0">
            <v-col :class="`py-0 ${mapStore.isMapStatisticsFullscreen ? 'mt-0' : 'mt-2'}`" cols="12">
                <div class="select_wrapper">
                    <img src="@/assets/imgs/icons/arrow-down.svg" width="10px" alt="">
                    <select class="dark_bg" v-model="selectedAlert">
                        <option value="" disabled selected>حالة التنبيه</option>
                        <option value="0">غير مقروءة</option>
                        <option value="1">مقروءة</option>
                    </select>
                </div>
            </v-col>
        </v-row>
        <div v-if="selectedAlert">
            <v-row class="stats_wrapper my-3"
                :class="{ 'stats_wrapper_fullscreen': mapStore.isMapStatisticsFullscreen }">
                <v-col cols="6" class="py-0">
                    <div class="stat">
                        <div>
                            <v-skeleton-loader v-if="isLoading" type="button" height="1.5rem" width="10rem"
                                max-width="100%" max-height="100%" style="margin: 11px 0;"></v-skeleton-loader>
                            <h3 v-else class="stat_value">
                                {{ fetchedDetails.alertsCount }}
                                <!-- {{
                                        convertNumberWithSeperator(
                                            parseValueToActialNumber(21, 0),
                                            "٬"
                                        )
                                    }} -->
                            </h3>
                            <label>اجمالي عدد التنبيهات</label>
                        </div>
                        <button :class="mapStore.isMapStatisticsFullscreen ? 'light' : ''"
                            @click="toggleAlertsModal('low')"><v-icon icon="mdi-chevron-left"></v-icon> </button>
                    </div>
                </v-col>
                <v-col cols="6" class="py-0">
                    <div class="stat">
                        <div>
                            <v-skeleton-loader v-if="isLoading" type="button" height="1.5rem" width="10rem"
                                max-width="100%" max-height="100%" style="margin: 11px 0;"></v-skeleton-loader>
                            <h3 v-else class="stat_value" style="color: #C05E5E;">
                                {{ fetchedDetails.highAlertsCount }}
                                <!-- {{
                                        convertNumberWithSeperator(
                                            parseValueToActialNumber(, 0),
                                            "٬"
                                        )
                                    }} -->
                            </h3>
                            <label>التنبيهات ذات الأهمية العالية</label>
                        </div>
                        <button :class="mapStore.isMapStatisticsFullscreen ? 'light' : ''"
                            @click="toggleAlertsModal('high')"><v-icon icon="mdi-chevron-left"></v-icon> </button>
                    </div>
                </v-col>
                <v-col cols="6" class="py-0">
                    <div class="stat">
                        <div>
                            <v-skeleton-loader v-if="isLoading" type="button" height="1.5rem" width="10rem"
                                max-width="100%" max-height="100%" style="margin: 11px 0;"></v-skeleton-loader>
                            <h3 v-else class="stat_value">
                                {{ fetchedDetails.midAlertsCount }}
                                <!-- {{
                                        convertNumberWithSeperator(
                                            parseValueToActialNumber(1512, 0),
                                            "٬"
                                        )
                                    }} -->
                            </h3>
                            <label>التنبيهات ذات الأهمية المتوسطة</label>
                        </div>
                        <button :class="mapStore.isMapStatisticsFullscreen ? 'light' : ''"
                            @click="toggleAlertsModal('mid')"><v-icon icon="mdi-chevron-left"></v-icon> </button>
                    </div>
                </v-col>
                <v-col cols="6" class="py-0">
                    <div class="stat">
                        <div>
                            <v-skeleton-loader v-if="isLoading" type="button" height="1.5rem" width="10rem"
                                max-width="100%" max-height="100%" style="margin: 11px 0;"></v-skeleton-loader>
                            <h3 v-else class="stat_value" style="color: #35685F;">
                                {{ fetchedDetails.lowAlertsCount }}
                                <!-- {{
                                        convertNumberWithSeperator(
                                            parseValueToActialNumber(1512, 0),
                                            "٬"
                                        )
                                    }} -->
                            </h3>
                            <label>التنبيهات ذات الأهمية المنخفضة</label>
                        </div>
                        <button :class="mapStore.isMapStatisticsFullscreen ? 'light' : ''"
                            @click="toggleAlertsModal('low')"><v-icon icon="mdi-chevron-left"></v-icon> </button>
                    </div>
                </v-col>
            </v-row>
            <hr v-if="!mapStore.isMapStatisticsFullscreen" class="my-4">
            <v-row class="my-0">
                <canvas id="blank" style="display: none;" aria-label="Hello ARIA World" role="img"></canvas>
                <v-col :cols="`${mapStore.isMapStatisticsFullscreen ? 6 : 12}`">
                    <v-card class="w-100 h-100" style="background-color: #303030; padding: 15px;">
                        <div class="w-100">
                            <p style="font-size: 0.9rem">نسبة التنبيهات (عالية، متوسطة، منخفضة الأهمية)</p>
                        </div>
                        <hr>
                        <div class="chart_wrapper position-relative"
                            :class="`${mapStore.isMapStatisticsFullscreen ? 'w-50' : ''}`">
                            <h3 class="position-absolute">
                                {{ fetchedDetails.alertsCount }}
                                <!-- {{
                                    convertNumberWithSeperator(
                                        parseValueToActialNumber(14456, 0),
                                        "٬"
                                    )
                                }} -->
                            </h3>
                            <canvas id="alertsPeriorityChart" aria-label="Hello ARIA World" role="img"></canvas>
                        </div>

                        <div class="pie_legend_wrapper">
                            <div class="legend">
                                <span>عالية الأهمية: <b style="--c: #C05E5E">{{ fetchedDetails.highAlertsCount
                                        }}</b></span>
                            </div>
                            <div class="legend">
                                <span>متوسطة الأهمية: <b style="--c: #857854">{{ fetchedDetails.midAlertsCount
                                        }}</b></span>
                            </div>
                            <div class="legend">
                                <span>منخفضة الأهمية: <b style="--c: #35685F">{{ fetchedDetails.lowAlertsCount
                                        }}</b></span>
                            </div>
                        </div>
                    </v-card>
                </v-col>
                <!-- <v-col :cols="`${mapStore.isMapStatisticsFullscreen ? 6 : 12}`">
                    <v-card class="w-100 h-100" style="background-color: #303030; padding: 15px;">
                        <div class="w-100">
                            <p style="font-size: 0.9rem">عدد التنبيهات (غير مقروءة، مقروءة)</p>
                        </div>
                        <hr>
                        <div class="chart_wrapper position-relative"
                            :class="`${mapStore.isMapStatisticsFullscreen ? 'w-50' : ''}`">
                            <h3 class="position-absolute">
                                {{ fetchedDetails.alertsCount }}
                            </h3>
                            <canvas id="alertsStatusChart" aria-label="Hello ARIA World" role="img"></canvas>
                        </div>

                        <div class="pie_legend_wrapper">
                            <div class="legend">
                                <span>تنبيهات مقروءة: <b style="--c: #35685F">{{ fetchedDetails.seenAlertsCount
                                        }}</b></span>
                            </div>
                            <div class="legend">
                                <span>تنبيهات غير مقروءة: <b style="--c: #C05E5E">{{ fetchedDetails.seenAlertsCount
                                        }}</b></span>
                            </div>
                        </div>
                    </v-card>
                </v-col> -->
            </v-row>
            <v-row class="my-0">
                <v-col v-if="isLoading" :cols="`${mapStore.isMapStatisticsFullscreen ? 3 : 12}`"
                    v-for="question in fetchedDetails.axisQuestions">
                    <div class="card-border mt-2" style="background-color: #303030">
                        <p style="color: white; margin-bottom: 10px">
                            <v-skeleton-loader type="button" height="1rem" width="8rem" max-width="100%"
                                max-height="100%"></v-skeleton-loader>
                        </p>
                        <div class="card-border" style="background-color: #383838">
                            <div class="row">
                                <div class="col-lg-6 col-12" style="border-left: 1px solid #e6ebee">
                                    <div class="d-flex justify-content-between mb-2 text-white">
                                        <v-skeleton-loader type="button" height="1rem" width="8rem" max-width="100%"
                                            max-height="100%"></v-skeleton-loader>
                                    </div>
                                    <v-skeleton-loader type="button" height="1rem" width="100%" max-width="100%"
                                        max-height="100%"></v-skeleton-loader>
                                </div>
                                <div class="col-lg-6 col-12">
                                    <div class="d-flex justify-content-between mb-2 text-white">
                                        <v-skeleton-loader type="button" height="1rem" width="8rem" max-width="100%"
                                            max-height="100%"></v-skeleton-loader>
                                    </div>
                                    <v-skeleton-loader type="button" height="1rem" width="100%" max-width="100%"
                                        max-height="100%"></v-skeleton-loader>
                                </div>
                            </div>
                        </div>
                    </div>
                </v-col>
                <v-col v-else :cols="`${mapStore.isMapStatisticsFullscreen ? 3 : 12}`"
                    v-for="question in fetchedDetails.axisQuestions">
                    <div class="card-border mt-2" style="background-color: #303030">
                        <p style="color: white; margin-bottom: 10px">
                            {{ question.question }}
                        </p>
                        <div class="card-border" style="background-color: #383838">
                            <div class="row">
                                <div class="col-lg-6 col-12" style="border-left: 1px solid #e6ebee">
                                    <div class="d-flex justify-content-between mb-2 text-white">
                                        <p>نعم</p>
                                        <p>{{ question.yesAnswers }}%</p>
                                    </div>
                                    <div class="progress primary">
                                        <div class="progress-bar" role="progressbar"
                                            :style="`width: ${question.yesAnswers}`"
                                            :aria-valuenow="question.yesAnswers" aria-valuemin="0" aria-valuemax="100">
                                        </div>
                                    </div>
                                </div>
                                <div class="col-lg-6 col-12">
                                    <div class="d-flex justify-content-between mb-2 text-white">
                                        <p>لا</p>
                                        <p>{{ question.noAnswers }}%</p>
                                    </div>
                                    <div class="progress primary">
                                        <div class="progress-bar" role="progressbar"
                                            :style="`width: ${question.noAnswers}`" :aria-valuenow="question.noAnswers"
                                            aria-valuemin="0" aria-valuemax="100"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </v-col>
            </v-row>
            <div v-if="isModalShow">
                <AlertsModal v-model="isModalShow" :status="selectedAlert" :periority="alertsPeriority"
                    @showDetails="isAlertDetails = true" />
            </div>
        </div>
        <div v-else style="
            position: relative;
            top: 45%;
            transform: translateY(-50%);
            display: flex;
            flex-direction: column;
            align-items: center;
            text-align: center;
            gap: 15px;
            margin-top: auto;
        ">
            <img :src=emptyBox width="150" alt="Empty box">
            <h1>لا توجد معلومات</h1>
            <p style="color: #ffffff90">برجاء اختيار حالة التنبيهات.</p>
        </div>
    </div>


</template>

<style scoped>
.panel_content {
    height: 100%;
}

[class*="stats_wrapper"] {
    display: flex;
    row-gap: 30px;

}

.stats_wrapper_fullscreen {
    flex-direction: row;
    background-color: #303030;
    padding: 30px;
    margin: 0;
}

.stat {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
}

.stat button {
    background-color: #303030;
    border-radius: 5px;
    width: 35px;
    aspect-ratio: 1;
    font-size: 12px;
}

.stat button.light {
    background-color: #383838;
}

.stat_value {
    font-size: 30px;
    font-weight: bold;
    color: #C4AB79;
    margin: 0 0 5px;
}

.stats_wrapper_fullscreen .stat label {
    color: #9EA3A5;
}

.pie_legend_wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 30px;
    margin-block-start: -30px;
}

.pie_legend_wrapper .legend {
    display: flex;
    align-items: center;
    gap: 10px;
    color: rgba(255, 255, 255, 0.7);
}

.pie_legend_wrapper .legend b {
    color: var(--c);
    font-size: 22px;
}

.question {
    background-color: #303030;
    border-radius: 8px;
    padding: 20px;
}

.question_asnwers {
    display: flex;
    background-color: #383838;
    border-radius: 8px;
}

[class*="_answer"] {
    flex: 1;
    padding: 10px;
}

[class*="_answer"] {
    margin: 0;
}

.yes_answer {
    border-left: 1px solid #F7F7F8;
}

.progress {
    background-color: #F7F7F8;
    height: 8px;
}

.chart_wrapper {
    display: grid;
    place-items: center;
    margin: auto;
    min-height: 400px;
}
</style>