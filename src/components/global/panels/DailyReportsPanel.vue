<script setup>
import { convertNumberWithSeperator, parseValueToActialNumber } from '@/helpers/helperFunctions';
import { useMapStore } from '@/stores/MapStore';
import Chart, { elements } from "chart.js/auto";
import { onMounted } from 'vue';
import axios from 'axios';

import arrowUpRight from "@/assets/imgs/arrow-up-right.png";
import arrowDownRight from "@/assets/imgs/arrow-down-right.png";
import arrowRight from "@/assets/imgs/arrow-right.png";
import emptyBox from "@/assets/imgs/empty-box.svg";


const mapStore = useMapStore();
const searchQuery = ref(mapStore.mapStatisticsFilters);
const fetchedReports = ref({})
const selectedReport = ref("");
const fetchedDetails = ref({})
const detailsSearchQuery = reactive({
    axis_id: "",
    area_id: "",
    period: searchQuery.value.period ?? "3"
});
const isLoading = ref(false);

// const completionRateChartData = {
//     labels: ['السبت', 'الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة'],
//     datasets: [{
//         label: 'معدل الإنجاز الكلي',
//         data: [69, 20, 37, 18, 63, 16, 50],
//         pointBackgroundColor: "#35685F",
//         pointBorderColor: "#fff",
//         borderColor: "#35685F",
//         fill: true,
//         backgroundColor: "#35685F20"
//     }, {
//         label: 'معدل الخطأ للتقرير يومي',
//         data: [58, 36, 48, 39, 69, 38, 30],
//         pointBackgroundColor: "#C05E5E",
//         pointBorderColor: "#fff",
//         borderColor: "#C05E5E",
//         fill: true,
//         backgroundColor: "#C05E5E20"
//     }]
// }
// const compliancePercentageChartData = {
//     datasets: [
//         {
//             label: 'نسبة الالتزام بالإجابة بلا لسؤال معين',
//             data: [70],
//             borderWidth: 0,
//             radius: "80%",
//             cutout: "0%",
//             circumference: 360 * 70 / 100,
//             backgroundColor: '#35685F',
//         },
//         {
//             label: 'نسبة الالتزام بالإجابة بنعم لسؤال معين',
//             data: [30],
//             borderWidth: 0,
//             radius: "80%",
//             backgroundColor: '#C05E5E',
//             circumference: 360 * 30 / 100,
//             rotation: -360 * 30 / 100,
//         }
//     ],
// }
// const doughnutChartConfig = {
//     type: 'doughnut',
//     data: compliancePercentageChartData,
//     options: {
//         plugins: {
//             legend: {
//                 display: true,
//                 position: "bottom",
//                 labels: {
//                     padding: 30,
//                     usePointStyle: true,
//                     color: '#c1c1c1'
//                 }
//             }
//         }
//     }
// }
// function generateConfig(data) {
//     const config = {
//         type: 'line',
//         data: data,
//         options: {
//             aspectRatio: 2 / 1,
//             layout: {
//                 padding: 0
//             },
//             elements: {
//                 point: {
//                     radius: 6,
//                     hoverRadius: 7,
//                     borderWidth: 2,
//                     hoverBorderWidth: 2,
//                 }
//             },
//             tension: 0.4,
//             scales: {
//                 y: {
//                     position: "right",
//                     min: 0,
//                     max: 100,
//                     ticks: {
//                         color: '#c1c1c1',
//                         stepSize: 20,
//                     },
//                     grid: {
//                         color: "#646464",
//                     },
//                     border: {
//                         dash: [3, 3],
//                     },
//                 },
//                 x: {
//                     reverse: true,
//                     ticks: {
//                         color: '#c1c1c1',
//                         align: "start",
//                     },
//                     offset: true,
//                     grid: {
//                         color: "#646464",
//                     },
//                     border: {
//                         dash: [3, 3],
//                     },
//                 },
//             },
//             plugins: {
//                 legend: {
//                     display: true,
//                     rtl: true,
//                     position: 'bottom',
//                     labels: {
//                         padding: 30,
//                         usePointStyle: true,
//                         color: '#c1c1c1'
//                     }
//                 }
//             }
//         }
//     }
//     return config
// }
// onMounted(() => {
//     new Chart(completionRateChart, generateConfig(completionRateChartData));
//     new Chart(compliancePercentageChart, doughnutChartConfig);
// })

async function getReports() {
    try {
        const params = Object.fromEntries(
            Object.entries(searchQuery.value).filter(([_, v]) => v)
        );
        const res = await axios.get(`api/v1/map/getFilterObjects`, { params });
        fetchedReports.value = res.data.data.daily_reports
    } catch (error) {
        console.log("fetch failed", error);
    }
}
watch(searchQuery, getReports, { deep: true });

async function getDetails() {
    isLoading.value = true
    console.log(selectedReport.value);

    detailsSearchQuery.axis_id = await selectedReport.value.axis_id
    detailsSearchQuery.area_id = await selectedReport.value.area_id
    try {
        const params = Object.fromEntries(
            Object.entries(detailsSearchQuery).filter(([_, v]) => v)
        );
        const res = await axios.get(`api/v1/map/getDetailsForParent2`, { params });
        fetchedDetails.value = res.data.data
        isLoading.value = false

    } catch (error) {
        console.log("fetch failed", error);
    }
}
watch(selectedReport, getDetails, { deep: true });

onMounted(getReports)

</script>
<template>
    <div style="padding: 15px; height: 100%;">
        <v-row>
            <v-col cols="12">
                <select class="form-select w-100" aria-label="Default select example" style="background-color: #303030;"
                    v-model="selectedReport">
                    <option v-for="(report, index) in fetchedReports" :value="report" :selected="index == 0">
                        {{ report.title }}
                    </option>
                </select>
            </v-col>
        </v-row>
        <div v-if="selectedReport">
            <v-row class="top-panel-grid mx-0"
                :class="{ 'top-panel-grid--fullscreen': mapStore.isMapStatisticsFullscreen }" :style="[
                    mapStore.isMapStatisticsFullscreen
                        ? 'background-color: #303030; margin-top: 20px;'
                        : ''
                ]">
                <v-col :cols="`${mapStore.isMapStatisticsFullscreen ? 3 : 12}`">
                    <v-card class="w-100" :class="[mapStore.isMapStatisticsFullscreen ? 'pa-10' : 'pa-0']"
                        style="background-color: transparent" :style="[
                            mapStore.isMapStatisticsFullscreen
                                ? 'border-left: 1px solid #494A4A; border-radius: 0;'
                                : ''
                        ]">
                        <div class="w-100 h-100 d-flex flex-column">
                            <v-skeleton-loader v-if="isLoading" type="button" height="1.5rem" width="10rem"
                                max-width="100%" max-height="100%" style="margin: 11px 0;"></v-skeleton-loader>
                            <h3 v-else class="font-weight-bold" style="color: #857854;">
                                {{ fetchedDetails.numberOfDailyReportsInArea }}
                                <!-- {{
                                convertNumberWithSeperator(
                                    parseValueToActialNumber(1953, 0),
                                    "٬"
                                )
                            }} -->
                            </h3>
                            <div class="d-flex" style="justify-content: space-between">
                                <p style="font-size: 0.9rem">عدد التقارير اليومية المرفوعة</p>
                                <!-- <div class="status-true align-items-center">
                                    <img style="width: 16px" class="h-16" :src="arrowUpRight" alt="no-icon" />
                                    <p>31.1%</p>
                                </div> -->
                            </div>
                        </div>
                    </v-card>
                </v-col>
                <v-col :cols="`${mapStore.isMapStatisticsFullscreen ? 3 : 12}`">
                    <v-card class="w-100" :class="[mapStore.isMapStatisticsFullscreen ? 'pa-10' : 'pa-0']"
                        style="background-color: transparent" :style="[
                            mapStore.isMapStatisticsFullscreen
                                ? 'border-left: 1px solid #494A4A; border-radius: 0;'
                                : ''
                        ]">
                        <div class="w-100 h-100 d-flex flex-column">
                            <v-skeleton-loader v-if="isLoading" type="button" height="1.5rem" width="10rem"
                                max-width="100%" max-height="100%" style="margin: 11px 0;"></v-skeleton-loader>
                            <h3 v-else class="font-weight-bold" style="color: #857854">
                                {{ fetchedDetails.numberOfAcceptedDailyReportsInArea }}
                                <!-- {{
                                convertNumberWithSeperator(
                                    parseValueToActialNumber(1521, 0),
                                    "٬"
                                )
                            }} -->
                            </h3>
                            <div class="d-flex" style="justify-content: space-between">
                                <p style="font-size: 0.9rem">عدد التقارير اليومية المقبولة</p>
                                <!-- <div class="status-false">
                                    <img style="width: 16px" class="h-16" :src="arrowDownRight" alt="no-icon" />
                                    <p>4.1%</p>
                                </div> -->
                            </div>
                        </div>
                    </v-card>
                </v-col>
                <v-col :cols="`${mapStore.isMapStatisticsFullscreen ? 3 : 12}`">
                    <v-card class="w-100" :class="[mapStore.isMapStatisticsFullscreen ? 'pa-10' : 'pa-0']"
                        style="background-color: transparent">
                        <div class="w-100 h-100 d-flex flex-column">
                            <v-skeleton-loader v-if="isLoading" type="button" height="1.5rem" width="10rem"
                                max-width="100%" max-height="100%" style="margin: 11px 0;"></v-skeleton-loader>
                            <h3 v-else class="font-weight-bold" style="color: #857854;">
                                {{ fetchedDetails.numberOfRejectedDailyReportsInArea }}
                                <!-- {{
                                convertNumberWithSeperator(
                                    parseValueToActialNumber(465, 0),
                                    "٬"
                                )
                            }} -->
                            </h3>
                            <div class="d-flex" style="justify-content: space-between">
                                <span style="font-size: 0.9rem">اجمالي عدد التقارير المرفوضة</span>
                                <!-- <div class="status-true">
                                    <img style="width: 16px" class="h-16" :src="arrowUpRight" alt="no-icon" />
                                    <p>23.4%</p>
                                </div> -->
                            </div>
                        </div>
                    </v-card>
                </v-col>
            </v-row>
            <hr>
            <!-- <v-row>
            <v-col :cols="`${mapStore.isMapStatisticsFullscreen ? 6 : 12}`">
                <v-card class="w-100" style="background-color: #303030; padding: 15px;">
                    <div class="w-100">
                        <p style="font-size: 0.9rem">معدل إنجاز التقارير اليومية</p>
                    </div>
                    <hr>
                    <canvas id="completionRateChart" aria-label="Hello ARIA World" role="img"></canvas>
                </v-card>
            </v-col>
            <v-col :cols="`${mapStore.isMapStatisticsFullscreen ? 6 : 12}`">
                <v-card class="w-100 h-100" style="background-color: #303030; padding: 15px;">
                    <div class="w-100">
                        <p style="font-size: 0.9rem">نسبة الالتزام بالإجابة نعم او لا</p>
                    </div>
                    <hr>
                    <div class="chart_wrapper position-relative"
                        :class="`${mapStore.isMapStatisticsFullscreen ? 'w-50 h-75' : ''}`">
                        <div class="chart_legend_no" style="--c: #C05E5E">
                            <p>نسبة الالتزام بالإجابة بلا لسؤال معين</p>
                        </div>
                        <canvas id="compliancePercentageChart" aria-label="Hello ARIA World" role="img"></canvas>
                        <div class="chart_legend_yes" style="--c: #35685F">
                            <p>نسبة الالتزام بالإجابة بنعم لسؤال معين</p>
                        </div>
                    </div>
                </v-card>
            </v-col>
        </v-row> -->
            <v-row>
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
            <p style="color: #ffffff90">برجاء اختيار المحور والمنطقة.</p>
        </div>
    </div>
</template>

<style scoped>
.chart_wrapper {
    display: grid;
    place-items: center;
    margin: auto;
}

[class*="chart_legend_"] {
    position: absolute;
    width: 160px;
}

.chart_legend_no {
    top: 50px;
    left: 0;
    padding-bottom: 10px;
    border-bottom: 2px solid var(--c);
}

.chart_legend_no::before {
    content: "";
    position: absolute;
    bottom: -1px;
    right: 1px;
    height: 1px;
    width: 50px;
    background-color: var(--c);
    transform: translateX(100%) rotate(30deg);
    transform-origin: 0;
}

.chart_legend_yes {
    bottom: 0;
    right: 0;
    padding-top: 10px;
    border-top: 2px solid var(--c);
}

.chart_legend_yes::before {
    content: "";
    position: absolute;
    top: -1px;
    left: 1px;
    height: 1px;
    width: 50px;
    background-color: var(--c);
    transform: translateX(-100%) rotate(30deg);
    transform-origin: 100%;
}
</style>