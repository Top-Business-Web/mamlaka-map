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
                        display: true,
                        rtl: true,
                        position: 'bottom',
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
    <div style="padding: 15px;height: 100%;">
        <v-row>
            <v-col cols="12">
                <select class="form-select w-100" aria-label="Default select example" style="background-color: #303030;"
                    v-model="selectedAxis">
                    <option value="" disabled selected>اختر المحور</option>
                    <option v-for="(axis, index) in fetchedAxes" :value="axis">
                        {{ axis.name }}
                    </option>
                </select>
                <select class="form-select w-100 mt-2" aria-label="Default select example"
                    style="background-color: #303030;" v-model="selectedArea">
                    <option value="" disabled selected>اختر الموقع</option>
                    style="background-color: #303030;" v-model="selectedArea">
                    <option v-for="(area, index) in fetchedAreas" :value="area">
                        {{ area.name }}
                    </option>
                </select>
            </v-col>
        </v-row>
        <div v-if="selectedAxis && selectedArea">
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
                                {{ fetchedDetails.numberOfUsersInAxisCount }}
                                <!-- {{
                                    convertNumberWithSeperator(
                                        parseValueToActialNumber(21, 0),
                                        "٬"
                                    )
                                }} -->
                            </h3>
                            <div class="d-flex" style="justify-content: space-between">
                                <p style="font-size: 0.9rem">عدد العاملين في المحور</p>

                                <!-- <div class="status-true">
                                    <img style="width: 16px" class="h-16" :src="arrowUpRight" alt="no-icon" />
                                    <p>4.1%</p>
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
                                {{ fetchedDetails.numberOfDailyReportsInAxis }}
                                <!-- {{
                                    convertNumberWithSeperator(
                                        parseValueToActialNumber(, 0),
                                        "٬"
                                    )
                                }} -->
                            </h3>
                            <div class="d-flex" style="justify-content: space-between">
                                <p style="font-size: 0.9rem">إجمالي عدد التقارير</p>
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
                                {{ fetchedDetails.noticeCount }}
                                <!-- {{
                                    convertNumberWithSeperator(
                                        parseValueToActialNumber(1512, 0),
                                        "٬"
                                    )
                                }} -->
                            </h3>
                            <div class="d-flex" style="justify-content: space-between">
                                <span style="font-size: 0.9rem"> إجمالي عدد البلاغات</span>
                                <!-- <div class="status-normal d-flex justify-content-center">
                                    <img style="width: 16px" class="h-16" :src="arrowRight" alt="no-icon" />
                                    <p>0.0%</p>
                                </div> -->
                            </div>
                        </div>
                    </v-card>
                </v-col>
            </v-row>
            <hr>
            <v-row>
                <canvas id="blank" class="d-none" aria-label="Hello ARIA World" role="img"></canvas>
                <v-col :cols="`${mapStore.isMapStatisticsFullscreen ? 6 : 12}`">
                    <v-card class="w-100" style="background-color: #303030; padding: 15px;">
                        <div class="w-100">
                            <p style="font-size: 0.9rem">الالتزام بالحضور في المحور</p>
                        </div>
                        <hr>
                        <canvas id="attendaneChart" aria-label="Hello ARIA World" role="img"></canvas>
                    </v-card>
                </v-col>
                <v-col :cols="`${mapStore.isMapStatisticsFullscreen ? 6 : 12}`">
                    <v-card class="w-100" style="background-color: #303030; padding: 15px;">
                        <div class="w-100">
                            <p style="font-size: 0.9rem">الالتزام بالحضور في المحور</p>
                        </div>
                        <hr>
                        <canvas id="dailyReportsChart" aria-label="Hello ARIA World" role="img"></canvas>
                    </v-card>
                </v-col>
            </v-row>
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