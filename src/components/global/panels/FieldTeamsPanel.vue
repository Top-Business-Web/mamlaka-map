<script setup>
import { convertNumberWithSeperator, parseValueToActialNumber } from '@/helpers/helperFunctions';
import { useMapStore } from '@/stores/MapStore';
import Chart, { plugins } from "chart.js/auto";
import { onMounted } from 'vue';
import http from '@/plugins/axios';

import arrowUpRight from "@/assets/imgs/arrow-up-right.png";
import arrowDownRight from "@/assets/imgs/arrow-down-right.png";
import arrowRight from "@/assets/imgs/arrow-right.png";
import emptyBox from "@/assets/imgs/empty-box.svg";

const mapStore = useMapStore();
const searchQuery = ref(mapStore.mapStatisticsFilters);
const fetchedReports = ref({});
const selectedReport = ref("");
const fetchedDetails = ref({});
const detailsSearchQuery = reactive({
    axis_id: "",
    area_id: "",
    period: searchQuery.value.period
});
const isLoading = ref(false)

// const teamAttendanecChartData = {
//     labels: ['السبت', 'الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة'],
//     datasets: [{
//         label: 'نسبة الالتزام بالحضور',
//         data: [69, 20, 37, 18, 63, 16, 50],
//         pointBackgroundColor: "#35685F",
//         pointBorderColor: "#fff",
//         borderColor: "#35685F",
//         fill: true,
//         backgroundColor: "#35685F20"
//     }, {
//         label: 'نسبة الغياب',
//         data: [58, 36, 48, 39, 69, 38, 30],
//         pointBackgroundColor: "#C05E5E",
//         pointBorderColor: "#fff",
//         borderColor: "#C05E5E",
//         fill: true,
//         backgroundColor: "#C05E5E20"
//     }]
// }
// const teamReportsChartData = {
//     labels: ['السبت', 'الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة'],
//     datasets: [{
//         label: 'نسبة الالتزام بالحضور',
//         data: [58, 63, 78, 79, 69, 38, 30],
//         pointBackgroundColor: "#35685F",
//         pointBorderColor: "#fff",
//         borderColor: "#35685F",
//         fill: true,
//         backgroundColor: "#35685F20"
//     }]
// }
// const teamComplaintsChartData = {
//     labels: ['السبت', 'الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة'],
//     datasets: [{
//         data: [39, 80, 17, 18, 63, 16, 80],
//         pointBackgroundColor: "#C4AB79",
//         pointBorderColor: "#fff",
//         borderColor: "#C4AB79",
//         fill: true,
//         backgroundColor: "#C4AB7920"
//     }]
// }
// function generateConfig(data, isLegend = true) {
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
//                     display: isLegend,
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
//     new Chart(teamAttendanecChart, generateConfig(teamAttendanecChartData));
//     new Chart(teamReportsChart, generateConfig(teamReportsChartData, false));
//     new Chart(teamComplaintsChart, generateConfig(teamComplaintsChartData, false));
// })

async function getReports() {
    try {
        const params = Object.fromEntries(
            Object.entries(searchQuery.value).filter(([_, v]) => v)
        );
        const res = await http.get(`v1/map/getFilterObjects`, { params });
        fetchedReports.value = res.data.data.daily_reports
    } catch (error) {
        console.log("fetch failed", error);
    }
}
watch(searchQuery, getReports, { deep: true });

async function getDetails() {
    isLoading.value = true
    detailsSearchQuery.axis_id = await selectedReport.value.axis_id
    detailsSearchQuery.area_id = await selectedReport.value.area_id
    try {
        const params = Object.fromEntries(
            Object.entries(detailsSearchQuery).filter(([_, v]) => v)
        );
        const res = await http.get(`v1/map/getDetailsForParent3`, { params });
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
    <div class="panel_content">
        <v-row class="my-0">
            <v-col class="py-0" cols="12">
                <div class="select_wrapper">
                    <img src="@/assets/imgs/icons/arrow-down.svg" width="10px" alt="">
                    <select class="dark_bg" v-model="selectedReport">
                        <option value="" disabled selected>اسم التقرير</option>
                        <option v-for="(report, index) in fetchedReports" :value="report" :selected="index == 0">
                            {{ report.title }}
                        </option>
                    </select>
                </div>
            </v-col>
        </v-row>
        <div v-if="selectedReport">

            <v-row class="stats_wrapper my-3"
                :class="{ 'stats_wrapper_fullscreen': mapStore.isMapStatisticsFullscreen }">
                <v-col cols="12" class="py-0">
                    <div class="stat">
                        <v-skeleton-loader v-if="isLoading" type="button" height="1.5rem" width="10rem" max-width="100%"
                            max-height="100%" style="margin: 11px 0;"></v-skeleton-loader>
                        <h3 v-else class="stat_value">
                            {{ fetchedDetails.axisTeamCount }}
                            <!-- {{
                                    convertNumberWithSeperator(
                                        parseValueToActialNumber(21, 0),
                                        "٬"
                                    )
                                }} -->
                        </h3>
                        <label>إجمالي عدد الفرق الميدانية</label>
                    </div>
                </v-col>
            </v-row>
            <!-- <v-row class="my-0">
                <v-col :cols="`${mapStore.isMapStatisticsFullscreen ? 6 : 12}`">
                    <v-card class="w-100" style="background-color: #303030; padding: 15px;">
                        <div class="w-100">
                            <p style="font-size: 0.9rem">نسبة التزام الفرق الميدانية</p>
                        </div>
                        <hr>
                        <canvas id="teamAttendanecChart" aria-label="Hello ARIA World" role="img"></canvas>
                    </v-card>
                </v-col>
                <v-col :cols="`${mapStore.isMapStatisticsFullscreen ? 6 : 12}`">
                    <v-card class="w-100" style="background-color: #303030; padding: 15px;">
                        <div class="w-100">
                            <p style="font-size: 0.9rem">نسبة التزام الفرق الميدانية برفع التقارير اليومية</p>
                        </div>
                        <hr>
                        <canvas id="teamReportsChart" aria-label="Hello ARIA World" role="img"></canvas>
                    </v-card>
                </v-col>
                <v-col :cols="`${mapStore.isMapStatisticsFullscreen ? 6 : 12}`">
                    <v-card class="w-100" style="background-color: #303030; padding: 15px;">
                        <div class="w-100">
                            <p style="font-size: 0.9rem">نسبة البلاغات المسجلة من الفريق الميداني</p>
                        </div>
                        <hr>
                        <canvas id="teamComplaintsChart" aria-label="Hello ARIA World" role="img"></canvas>
                    </v-card>
                </v-col>
            </v-row> -->
            <hr v-if="!mapStore.isMapStatisticsFullscreen" class="mt-4 mb-0">
            <v-row :class="`${mapStore.isMapStatisticsFullscreen ? '' : 'mt-2'}`">
                <v-col v-if="isLoading" :cols="`${mapStore.isMapStatisticsFullscreen ? 6 : 12}`"
                    v-for="question in fetchedDetails.axisQuestions" class="py-0">
                    <div class="question">
                        <p class="question_title">
                            <v-skeleton-loader type="button" height="1rem" width="8rem" max-width="100%"
                                max-height="100%"></v-skeleton-loader>
                        </p>
                        <div class="answers">
                            <div class="yes_answer">
                                <div class="d-flex justify-content-between mb-2 text-white">
                                    <span>نعم</span>
                                    <v-skeleton-loader type="button" height="1rem" width="8rem" max-width="100%"
                                        max-height="100%"></v-skeleton-loader>
                                </div>
                                <v-skeleton-loader type="button" height="1rem" width="100%" max-width="100%"
                                    max-height="100%"></v-skeleton-loader>
                            </div>
                            <div class="no_answer">
                                <div class="d-flex justify-content-between mb-2 text-white">
                                    <span>لا</span>
                                    <v-skeleton-loader type="button" height="1rem" width="8rem" max-width="100%"
                                        max-height="100%"></v-skeleton-loader>
                                </div>
                                <v-skeleton-loader type="button" height="1rem" width="100%" max-width="100%"
                                    max-height="100%"></v-skeleton-loader>
                            </div>
                        </div>
                    </div>
                </v-col>
                <v-col v-else :cols="`${mapStore.isMapStatisticsFullscreen ? 6 : 12}`"
                    v-for="question in fetchedDetails.axisQuestions">
                    <div class="question">
                        <p class="question_title">
                            {{ question.question }}
                        </p>
                        <div class="answers">
                            <div class="yes_answer">
                                <div class="d-flex justify-content-between mb-2 text-white">
                                    <span>نعم</span>
                                    <span>{{ question.yesAnswers }}%</span>
                                </div>
                                <div class="progress">
                                    <div class="progress-bar" role="progressbar"
                                        :style="`width: ${question.yesAnswers}%; background-color: #B6AD98;`"
                                        :aria-valuenow="question.yesAnswers" aria-valuemin="0" aria-valuemax="100">
                                    </div>
                                </div>
                            </div>
                            <div class="no_answer">
                                <div class="d-flex justify-content-between mb-2 text-white">
                                    <span>لا</span>
                                    <span>{{ question.noAnswers }}%</span>
                                </div>
                                <div class="progress">
                                    <div class="progress-bar" role="progressbar"
                                        :style="`width: ${question.noAnswers}%; background-color: #C05E5E;`"
                                        :aria-valuenow="question.noAnswers" aria-valuemin="0" aria-valuemax="100"></div>
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
            <p style="color: #ffffff90">برجاء اختيار الموقع.</p>
        </div>
    </div>
</template>

<style scoped>
.panel_content {
    height: 100%;
    padding-block-start: 15px;
}

[class*="stats_wrapper"] {
    display: flex;
    flex-direction: column;
    row-gap: 15px;
}


.stats_wrapper_fullscreen {
    flex-direction: row;
    background-color: #303030;
    padding: 30px;
    margin: 0;
}

.stats_wrapper_fullscreen .stat {
    border-inline-end: 1px solid #494A4A;
}

.stat_value {
    font-size: 30px;
    color: #C4AB79;
    margin: 5px 0;
}

.stats_wrapper_fullscreen .stat label {
    color: #9EA3A5;
}

.line_legend_wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 30px;
    margin-block-start: 20px;
}

.line_legend_wrapper .legend {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 14px;
    color: rgba(255, 255, 255, 0.7);
}

.question {
    background-color: #303030;
    border-radius: 8px;
    padding: 15px;
}

.answers {
    display: flex;
    background-color: #383838;
    border-radius: 8px;
    margin-block-start: 15px;
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
</style>