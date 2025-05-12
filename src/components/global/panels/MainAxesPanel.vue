<script setup>
import { convertNumberWithSeperator, parseValueToActialNumber } from '@/helpers/helperFunctions';
import { useMapStore } from '@/stores/MapStore';
import Chart from "chart.js/auto";
import { ref, onMounted, computed } from 'vue';
import http from '@/plugins/axios';

import arrowUpRight from "@/assets/imgs/arrow-up-right.png";
import arrowDownRight from "@/assets/imgs/arrow-down-right.png";
import arrowRight from "@/assets/imgs/arrow-right.png";
import emptyBox from "@/assets/imgs/empty-box.svg";


const mapStore = useMapStore();
const searchQuery = ref(mapStore.mapStatisticsFilters);
const fetchedAxes = ref({})
const fetchedAreas = ref({})
const selectedAxis = ref("");
const selectedArea = ref("");
const fetchedDetails = ref({})
const detailsSearchQuery = reactive({
    axis_id: "",
    area_id: "",
    period: searchQuery.value.period
});
const isLoading = ref(false);

async function getAxes() {
    try {
        const params = Object.fromEntries(
            Object.entries(searchQuery.value).filter(([_, v]) => v)
        );
        const res = await http.get(`v1/map/getFilterObjects`, { params });
        fetchedAxes.value = res.data.data.axes
    } catch (error) {
        console.log("fetch failed", error);
    }
}
watch(searchQuery, getAxes);

async function getAreas() {
    selectedArea.value = '';
    fetchedAreas.value = null;
    const axisId = selectedAxis.value.id;
    try {
        const res = await http.get(`v1/map/getAreas/${axisId}`);
        fetchedAreas.value = res.data.data
    } catch (error) {
        console.log("fetch failed", error);
    }
}
watch(selectedAxis, getAreas);

async function getLocationStats() {
    detailsSearchQuery.axis_id = selectedAxis.value.id;
    detailsSearchQuery.area_id = selectedArea.value.id;
    isLoading.value = true
    try {
        const params = Object.fromEntries(
            Object.entries(detailsSearchQuery).filter(([_, v]) => v)
        );
        const res = await http.get(`v1/map/getDetailsForParent0`, { params });
        fetchedDetails.value = res.data.data
        generateCharts();
        isLoading.value = false
    } catch (error) {
        console.log("fetch failed", error);
    }
}
watch(selectedArea, getLocationStats);

function generateCharts() {
    const attendaneChartData = {
        labels: Object.keys(fetchedDetails.value.attendance_percentages),
        datasets: [{
            label: 'الالتزام بالحضور',
            data: Object.values(fetchedDetails.value.attendance_percentages),
            pointBackgroundColor: "#35685F",
            pointBorderColor: "#fff",
            borderColor: "#35685F",
            fill: true,
            backgroundColor: "#35685F20"
        }, {
            label: 'نسبة الغياب',
            data: Object.values(fetchedDetails.value.absence_percentages),
            pointBackgroundColor: "#C05E5E",
            pointBorderColor: "#fff",
            borderColor: "#C05E5E",
            fill: true,
            backgroundColor: "#C05E5E20"
        }]
    };
    const dailyReportsChartData = {
        labels: Object.keys(fetchedDetails.value.attendance_percentages),
        datasets: [{
            label: 'نسبة التقارير اليومية المنجزة',
            data: Object.values(fetchedDetails.value.percentageOfDoneAxisToDailyReports),
            pointBackgroundColor: "#35685F",
            pointBorderColor: "#fff",
            borderColor: "#35685F",
            fill: true,
            backgroundColor: "#35685F20"
        }, {
            label: 'نسبة التقارير اليومية الغير منجزة',
            data: Object.values(fetchedDetails.value.percentageOfNotDoneAxisToDailyReports),
            pointBackgroundColor: "#C05E5E",
            pointBorderColor: "#fff",
            borderColor: "#C05E5E",
            fill: true,
            backgroundColor: "#C05E5E20"
        }]
    }
    function generateConfig(data = []) {
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
    if (attendaneChart.toDataURL() !== document.getElementById('blank').toDataURL()) {
        Chart.getChart(attendaneChart).destroy();
    }
    new Chart(attendaneChart, generateConfig(attendaneChartData))

    if (dailyReportsChart.toDataURL() !== document.getElementById('blank').toDataURL()) {
        Chart.getChart(dailyReportsChart).destroy();
    }
    new Chart(dailyReportsChart, generateConfig(dailyReportsChartData));
}

onMounted(getAxes)

</script>
<template>
    <div class="panel_content">
        <v-row class="my-0">
            <v-col class="py-0" :cols="mapStore.isMapStatisticsFullscreen ? 10 : 12">
                <div class="select_wrapper">
                    <img src="@/assets/imgs/icons/arrow-down.svg" width="10px" alt="">
                    <select class="dark_bg" v-model="selectedAxis">
                        <option value="" disabled selected>اسم المحور</option>
                        <option v-for="(axis, index) in fetchedAxes" :value="axis">
                            {{ axis.name }}
                        </option>
                    </select>
                </div>
            </v-col>
            <v-col :class="`py-0 ${mapStore.isMapStatisticsFullscreen ? 'mt-0' : 'mt-2'}`"
                :cols="mapStore.isMapStatisticsFullscreen ? 2 : 12">
                <div class="select_wrapper">
                    <img src="@/assets/imgs/icons/arrow-down.svg" width="10px" alt="">
                    <select class="dark_bg" v-model="selectedArea">
                        <option value="" disabled selected>اسم الموقع</option>
                        <option v-for="(area, index) in fetchedAreas" :value="area">
                            {{ area.name }}
                        </option>
                    </select>
                </div>
            </v-col>
        </v-row>
        <div v-if="selectedAxis && selectedArea">
            <v-row class="stats_wrapper my-3"
                :class="{ 'stats_wrapper_fullscreen': mapStore.isMapStatisticsFullscreen }">
                <v-col :cols="`${mapStore.isMapStatisticsFullscreen ? 4 : 12}`" class="py-0">
                    <div class="stat">
                        <v-skeleton-loader v-if="isLoading" type="button" height="1.5rem" width="10rem" max-width="100%"
                            max-height="100%" style="margin: 11px 0;"></v-skeleton-loader>
                        <h3 v-else class="stat_value">
                            {{ fetchedDetails.numberOfUsersInAxisCount }}
                            <!-- {{
                                    convertNumberWithSeperator(
                                        parseValueToActialNumber(21, 0),
                                        "٬"
                                    )
                                }} -->
                        </h3>
                        <label>عدد العاملين في المحور</label>
                    </div>
                </v-col>
                <v-col :cols="`${mapStore.isMapStatisticsFullscreen ? 4 : 12}`" class="py-0">
                    <div class="stat">
                        <v-skeleton-loader v-if="isLoading" type="button" height="1.5rem" width="10rem" max-width="100%"
                            max-height="100%" style="margin: 11px 0;"></v-skeleton-loader>
                        <h3 v-else class="stat_value">
                            {{ fetchedDetails.numberOfDailyReportsInAxis }}
                            <!-- {{
                                    convertNumberWithSeperator(
                                        parseValueToActialNumber(, 0),
                                        "٬"
                                    )
                                }} -->
                        </h3>
                        <label>إجمالي عدد التقارير</label>
                    </div>
                </v-col>
                <v-col :cols="`${mapStore.isMapStatisticsFullscreen ? 4 : 12}`" class="py-0">
                    <div class="stat">
                        <v-skeleton-loader v-if="isLoading" type="button" height="1.5rem" width="10rem" max-width="100%"
                            max-height="100%" style="margin: 11px 0;"></v-skeleton-loader>
                        <h3 v-else class="stat_value">
                            {{ fetchedDetails.noticeCount }}
                            <!-- {{
                                    convertNumberWithSeperator(
                                        parseValueToActialNumber(1512, 0),
                                        "٬"
                                    )
                                }} -->
                        </h3>
                        <label> إجمالي عدد البلاغات</label>
                    </div>
                </v-col>
            </v-row>
            <hr v-if="!mapStore.isMapStatisticsFullscreen" class="my-4">
            <v-row class="my-0">
                <canvas id="blank" class="d-none" aria-label="Hello ARIA World" role="img"></canvas>
                <v-col :cols="`${mapStore.isMapStatisticsFullscreen ? 6 : 12}`" class="py-0">
                    <v-card class="w-100" style="background-color: #303030; padding: 15px;">
                        <div class="w-100">
                            <p style="font-size: 0.9rem">الالتزام بالحضور في المحور</p>
                        </div>
                        <hr>
                        <canvas id="attendaneChart" aria-label="Hello ARIA World" role="img"></canvas>
                        <div class="line_legend_wrapper">
                            <div class="legend">
                                <span>نسبة الالتزام بالحضور</span>
                                <img src="@/assets/imgs/icons/legend-green.svg" width="20" alt="">
                            </div>
                            <div class="legend">
                                <span>نسبة الغياب</span>
                                <img src="@/assets/imgs/icons/legend-red.svg" width="20" alt="">
                            </div>
                        </div>
                    </v-card>
                </v-col>
                <v-col :cols="`${mapStore.isMapStatisticsFullscreen ? 6 : 12}`"
                    :class="`py-0 ${mapStore.isMapStatisticsFullscreen ? 'mt-0' : 'mt-3'}`">
                    <v-card class="w-100" style="background-color: #303030; padding: 15px;">
                        <div class="w-100">
                            <p style="font-size: 0.9rem">التقارير اليومية</p>
                        </div>
                        <hr>
                        <canvas id="dailyReportsChart" aria-label="Hello ARIA World" role="img"></canvas>
                        <div class="line_legend_wrapper">
                            <div class="legend">
                                <span>نسبة التقارير اليومية المنجزة</span>
                                <img src="@/assets/imgs/icons/legend-green.svg" width="20" alt="">
                            </div>
                            <div class="legend">
                                <span>نسبة التقارير اليومية المنجزة</span>
                                <img src="@/assets/imgs/icons/legend-red.svg" width="20" alt="">
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
            <p style="color: #ffffff90">برجاء اختيار المحور والمنطقة.</p>
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