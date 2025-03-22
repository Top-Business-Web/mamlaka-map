<script setup>
import { convertNumberWithSeperator, parseValueToActialNumber } from '@/helpers/helperFunctions';
import { useMapStore } from '@/stores/MapStore';
import Chart, { elements } from "chart.js/auto";
import { onMounted } from 'vue';
import http from '@/plugins/axios';

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
    period: searchQuery.value.period
});
const isLoading = ref(false);

function generateCharts() {
    const completionRateChartData = {
        labels: Object.keys(fetchedDetails.value.daily_report_completion),
        datasets: [{
            label: 'معدل الإنجاز الكلي',
            data: Object.values(fetchedDetails.value.daily_report_completion),
            pointBackgroundColor: "#35685F",
            pointBorderColor: "#fff",
            borderColor: "#35685F",
            fill: true,
            backgroundColor: "#35685F20"
        }, {
            label: 'معدل الخطأ للتقرير يومي',
            data: Object.values(fetchedDetails.value.daily_report_non_completion),
            pointBackgroundColor: "#C05E5E",
            pointBorderColor: "#fff",
            borderColor: "#C05E5E",
            fill: true,
            backgroundColor: "#C05E5E20"
        }]
    }
    // const completionRateChartData = {
    //     labels: Object.keys(fetchedDetails.value.percentageOfDoneAxisToDailyReports),
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
    const compliancePercentageChartData = {
        datasets: [
            {
                label: 'نسبة الالتزام بالإجابة بلا لسؤال معين',
                data: [fetchedDetails.value.YesAnswerPercentage],
                borderWidth: 0,
                radius: "80%",
                cutout: "0%",
                circumference: 360 * fetchedDetails.value.YesAnswerPercentage / 100,
                backgroundColor: '#35685F',
            },
            {
                label: 'نسبة الالتزام بالإجابة بنعم لسؤال معين',
                data: [fetchedDetails.value.noAnswerPercentage],
                borderWidth: 0,
                radius: "80%",
                backgroundColor: '#C05E5E',
                circumference: 360 * fetchedDetails.value.noAnswerPercentage / 100,
                rotation: -360 * fetchedDetails.value.noAnswerPercentage / 100,
            }
        ],
    }
    const doughnutChartConfig = {
        type: 'doughnut',
        data: compliancePercentageChartData,
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
    function generateConfig(data) {
        const config = {
            type: 'line',
            data: data,
            options: {
                aspectRatio: 2 / 1,
                layout: {
                    padding: 0
                },
                elements: {
                    point: {
                        radius: 6,
                        hoverRadius: 7,
                        borderWidth: 2,
                        hoverBorderWidth: 2,
                    }
                },
                tension: 0.4,
                scales: {
                    y: {
                        position: "right",
                        min: 0,
                        max: 100,
                        ticks: {
                            color: '#c1c1c1',
                            stepSize: 20,
                        },
                        grid: {
                            color: "#646464",
                        },
                        border: {
                            dash: [3, 3],
                        },
                    },
                    x: {
                        reverse: true,
                        ticks: {
                            color: '#c1c1c1',
                            align: "start",
                        },
                        offset: true,
                        grid: {
                            color: "#646464",
                        },
                        border: {
                            dash: [3, 3],
                        },
                    },
                },
                plugins: {
                    legend: {
                        display: false,
                    }
                }
            }
        }
        return config
    }


    if (completionRateChart.toDataURL() !== document.getElementById('blank').toDataURL()) {
        Chart.getChart(completionRateChart).destroy();
    }
    new Chart(completionRateChart, generateConfig(completionRateChartData))

    if (compliancePercentageChart.toDataURL() !== document.getElementById('blank').toDataURL()) {
        Chart.getChart(compliancePercentageChart).destroy();
    }
    new Chart(compliancePercentageChart, doughnutChartConfig);
}

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
    detailsSearchQuery.axis_id = selectedReport.value.axis_id
    detailsSearchQuery.area_id = selectedReport.value.area_id
    try {
        const params = Object.fromEntries(
            Object.entries(detailsSearchQuery).filter(([_, v]) => v)
        );
        const res = await http.get(`v1/map/getDetailsForParent2`, { params });
        fetchedDetails.value = res.data.data
        generateCharts();
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
                <v-col :cols="`${mapStore.isMapStatisticsFullscreen ? 3 : 12}`" class="py-0">
                    <div class="stat">
                        <v-skeleton-loader v-if="isLoading" type="button" height="1.5rem" width="10rem" max-width="100%"
                            max-height="100%" style="margin: 11px 0;"></v-skeleton-loader>
                        <h3 v-else class="stat_value">
                            {{ fetchedDetails.numberOfDailyReportsInArea }}
                            <!-- {{
                                    convertNumberWithSeperator(
                                        parseValueToActialNumber(21, 0),
                                        "٬"
                                    )
                                }} -->
                        </h3>
                        <label>عدد التقارير اليومية المرفوعة</label>
                    </div>
                </v-col>
                <v-col :cols="`${mapStore.isMapStatisticsFullscreen ? 3 : 12}`" class="py-0">
                    <div class="stat">
                        <v-skeleton-loader v-if="isLoading" type="button" height="1.5rem" width="10rem" max-width="100%"
                            max-height="100%" style="margin: 11px 0;"></v-skeleton-loader>
                        <h3 v-else class="stat_value" style="color: #35685F;">
                            {{ fetchedDetails.numberOfAcceptedDailyReportsInArea }}
                            <!-- {{
                                    convertNumberWithSeperator(
                                        parseValueToActialNumber(, 0),
                                        "٬"
                                    )
                                }} -->
                        </h3>
                        <label>عدد التقارير اليومية المقبولة</label>
                    </div>
                </v-col>
                <v-col :cols="`${mapStore.isMapStatisticsFullscreen ? 3 : 12}`" class="py-0">
                    <div class="stat">
                        <v-skeleton-loader v-if="isLoading" type="button" height="1.5rem" width="10rem" max-width="100%"
                            max-height="100%" style="margin: 11px 0;"></v-skeleton-loader>
                        <h3 v-else class="stat_value" style="color: #C05E5E;">
                            {{ fetchedDetails.numberOfRejectedDailyReportsInArea }}
                            <!-- {{
                                    convertNumberWithSeperator(
                                        parseValueToActialNumber(, 0),
                                        "٬"
                                    )
                                }} -->
                        </h3>
                        <label>عدد التقارير اليومية المرفوضة</label>
                    </div>
                </v-col>
                <v-col :cols="`${mapStore.isMapStatisticsFullscreen ? 3 : 12}`" class="py-0">
                    <div class="stat">
                        <v-skeleton-loader v-if="isLoading" type="button" height="1.5rem" width="10rem" max-width="100%"
                            max-height="100%" style="margin: 11px 0;"></v-skeleton-loader>
                        <h3 v-else class="stat_value">
                            {{ fetchedDetails.usersRate }}%
                            <!-- {{
                                    convertNumberWithSeperator(
                                        parseValueToActialNumber(, 0),
                                        "٬"
                                    )
                                }} -->
                        </h3>
                        <label>معدل إنجاز الأفراد</label>
                    </div>
                </v-col>
            </v-row>
            <hr v-if="!mapStore.isMapStatisticsFullscreen" class="my-4">
            <v-row class="my-0">
                <canvas id="blank" class="d-none" aria-label="Hello ARIA World" role="img"></canvas>
                <v-col :cols="`${mapStore.isMapStatisticsFullscreen ? 6 : 12}`">
                    <v-card class="w-100" style="background-color: #303030; padding: 15px;">
                        <div class="w-100">
                            <p style="font-size: 0.9rem">معدل إنجاز التقارير اليومية</p>
                        </div>
                        <hr>
                        <canvas id="completionRateChart" aria-label="Hello ARIA World" role="img"></canvas>
                        <div class="line_legend_wrapper">
                            <div class="legend">
                                <span>معدل الإنجاز الكلي</span>
                                <img src="@/assets/imgs/icons/legend-green.svg" width="20" alt="">
                            </div>
                            <div class="legend">
                                <span>معدل الخطأ للتقرير اليومي</span>
                                <img src="@/assets/imgs/icons/legend-red.svg" width="20" alt="">
                            </div>
                        </div>
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
                            <canvas id="compliancePercentageChart" aria-label="Hello ARIA World" role="img"></canvas>
                            <div class="line_legend_wrapper">
                                <div class="legend">
                                    <span>نسبة الالتزام بالإجابة بنعم لسؤال معين</span>
                                    <img src="@/assets/imgs/icons/legend-green.svg" width="20" alt="">
                                </div>
                                <div class="legend">
                                    <span>نسبة الالتزام بالإجابة بلا لسؤال معين</span>
                                    <img src="@/assets/imgs/icons/legend-red.svg" width="20" alt="">
                                </div>
                            </div>
                        </div>
                    </v-card>
                </v-col>
            </v-row>
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
            <p style="color: #ffffff90">برجاء اختيار التقرير.</p>
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
    white-space: nowrap;
    gap: 10px;
    font-size: 14px;
    color: rgba(255, 255, 255, 0.7);
}

.pie_legend_wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
    gap: 5px 30px;
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