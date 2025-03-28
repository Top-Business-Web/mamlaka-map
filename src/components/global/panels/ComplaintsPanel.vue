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
const fetchedReports = ref({});
const selectedReport = ref("");
const fetchedDetails = ref({});
const detailsSearchQuery = reactive({
    axis_id: "",
    area_id: "",
    period: searchQuery.value.period
});
const isLoading = ref(false)

async function getReports() {
    try {
        const params = Object.fromEntries(
            Object.entries(searchQuery.value).filter(([_, v]) => v)
        );
        const res = await http.get(`v1/map/getFilterObjects`, { params });
        fetchedReports.value = res.data.data.notice
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
        const res = await http.get(`v1/map/getDetailsForParent4`, { params });
        fetchedDetails.value = res.data.data
        console.log(fetchedDetails.value);

        generateCharts();
        isLoading.value = false
    } catch (error) {
        console.log("fetch failed", error);
    }
}
watch(selectedReport, getDetails, { deep: true });

function generateCharts() {
    const complaintsStatusData = {
        datasets: [
            {
                label: 'بلاغات مفتوحة',
                data: [fetchedDetails.value.openNoticesCount / fetchedDetails.value.notice * 100],
                borderWidth: 0,
                radius: "80%",
                cutout: 0,
                circumference: 360 * (fetchedDetails.value.openNoticesCount / fetchedDetails.value.notice * 100) / 100,
                backgroundColor: '#35685F',
            },
            {
                label: 'بلاغات مقفولة',
                data: [fetchedDetails.value.closedNoticesCount / fetchedDetails.value.notice * 100],
                borderWidth: 0,
                radius: "80%",
                backgroundColor: '#C05E5E',
                circumference: 360 * (fetchedDetails.value.closedNoticesCount / fetchedDetails.value.notice * 100) / 100,
                rotation: -360 * (fetchedDetails.value.closedNoticesCount / fetchedDetails.value.notice * 100) / 100,
            }
        ],
    }
    const complaintsPeriorityData = {
        datasets: [
            {
                label: 'عالية الأهمية',
                data: [fetchedDetails.value.highNoticesCount / fetchedDetails.value.notice * 100],
                borderWidth: 0,
                radius: "80%",
                cutout: 0,
                circumference: 360 * (fetchedDetails.value.highNoticesCount / fetchedDetails.value.notice * 100) / 100,
                backgroundColor: '#C05E5E',
            },
            {
                label: 'متوسطة الأهمية',
                data: [fetchedDetails.value.midNoticesCount / fetchedDetails.value.notice * 100],
                borderWidth: 0,
                radius: "80%",
                circumference: 360 * (fetchedDetails.value.midNoticesCount / fetchedDetails.value.notice * 100) / 100,
                rotation: -360 * ((fetchedDetails.value.midNoticesCount / fetchedDetails.value.notice * 100) + (fetchedDetails.value.lowNoticesCount / fetchedDetails.value.notice * 100)) / 100,
                backgroundColor: '#857854',
            },
            {
                label: 'منخفضة الأهمية',
                data: [fetchedDetails.value.lowNoticesCount / fetchedDetails.value.notice * 100],
                borderWidth: 0,
                cutout: "64%",
                radius: "80%",
                circumference: 360 * (fetchedDetails.value.lowNoticesCount / fetchedDetails.value.notice * 100) / 100,
                rotation: -360 * (fetchedDetails.value.lowNoticesCount / fetchedDetails.value.notice * 100) / 100,
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


    if (complaintsStatusChart.toDataURL() !== document.getElementById('blank').toDataURL()) {
        Chart.getChart(complaintsStatusChart).destroy();
    }
    new Chart(complaintsStatusChart, generateConfig(complaintsStatusData));

    if (complaintsPeriorityChart.toDataURL() !== document.getElementById('blank').toDataURL()) {
        Chart.getChart(complaintsPeriorityChart).destroy();
    }
    new Chart(complaintsPeriorityChart, generateConfig(complaintsPeriorityData));
}

onMounted(getReports)

</script>
<template>
    <div style="padding: 15px; height: 100%;">
        <v-row>
            <v-col cols="12">
                <select class="form-select w-100 mt-2" aria-label="Default select example"
                    style="background-color: #303030;" v-model="selectedReport">
                    <option value="" disabled selected>اختر الموقع</option>
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
                <v-col cols="12">
                    <v-card class="w-100" :class="[mapStore.isMapStatisticsFullscreen ? 'pa-10' : 'pa-0']"
                        style="background-color: transparent">
                        <div class="w-100 h-100 d-flex flex-column">
                            <v-skeleton-loader v-if="isLoading" type="button" height="1.5rem" width="10rem"
                                max-width="100%" max-height="100%" style="margin: 11px 0;"></v-skeleton-loader>
                            <h3 v-else class="font-weight-bold" style="color: #857854;">
                                {{ fetchedDetails.notice }}
                                <!-- {{
                                    convertNumberWithSeperator(
                                        parseValueToActialNumber(14456, 0),
                                        "٬"
                                    )
                                }} -->
                            </h3>
                            <div class="d-flex" style="justify-content: space-between">
                                <span style="font-size: 0.9rem">اجمالي عدد البلاغات</span>
                                <!-- <div class="status-normal d-flex justify-content-center">
                                    <img style="width: 16px" class="h-16" :src="arrowRight" alt="no-icon" />
                                    <p>0.0%</p>
                                </div> -->
                            </div>
                        </div>
                    </v-card>
                </v-col>
            </v-row>
            <v-row>
                <canvas id="blank" style="display: none;" aria-label="Hello ARIA World" role="img"></canvas>
                <v-col :cols="`${mapStore.isMapStatisticsFullscreen ? 6 : 12}`">
                    <v-card class="w-100 h-100" style="background-color: #303030; padding: 15px;">
                        <div class="w-100">
                            <p style="font-size: 0.9rem">عدد البلاغات (مقفولة، مفتوحة)</p>
                        </div>
                        <hr>
                        <div class="chart_wrapper position-relative"
                            :class="`${mapStore.isMapStatisticsFullscreen ? 'w-50' : ''}`">
                            <h3 class="position-absolute">
                                {{ fetchedDetails.notice }}
                                <!-- {{
                                    convertNumberWithSeperator(
                                        parseValueToActialNumber(14456, 0),
                                        "٬"
                                    )
                                }} -->
                            </h3>
                            <div class="chart_legend_closed" style="--c: #C05E5E">
                                <p>بلاغات مقفولة</p>
                            </div>
                            <canvas id="complaintsStatusChart" aria-label="Hello ARIA World" role="img"></canvas>
                            <div class="chart_legend_opened" style="--c: #35685F">
                                <p>بلاغات مفتوحة</p>
                            </div>
                        </div>
                    </v-card>
                </v-col>
                <v-col :cols="`${mapStore.isMapStatisticsFullscreen ? 6 : 12}`">
                    <v-card class="w-100 h-100" style="background-color: #303030; padding: 15px;">
                        <div class="w-100">
                            <p style="font-size: 0.9rem">نسبة البلاغات (عالية، متوسطة، منخفضة الأهمية)</p>
                        </div>
                        <hr>
                        <div class="chart_wrapper position-relative"
                            :class="`${mapStore.isMapStatisticsFullscreen ? 'w-50' : ''}`">
                            <h3 class="position-absolute">
                                {{ fetchedDetails.notice }}
                                <!-- {{
                                    convertNumberWithSeperator(
                                        parseValueToActialNumber(14456, 0),
                                        "٬"
                                    )
                                }} -->
                            </h3>
                            <canvas id="complaintsPeriorityChart" aria-label="Hello ARIA World" role="img"></canvas>
                        </div>
                        <div class="legend_wrapper">
                            <div class="chart_legend_high" style="--c: #C05E5E">
                                <p>عالية الأهمية: <b>{{ fetchedDetails.highNoticesCount }}</b></p>
                            </div>
                            <div class="chart_legend_medium" style="--c: #857854">
                                <p>متوسطة الأهمية: <b>{{ fetchedDetails.midNoticesCount }}</b></p>
                            </div>
                            <div class="chart_legend_low" style="--c: #35685F">
                                <p>منخفضة الأهمية: <b>{{ fetchedDetails.lowNoticesCount }}</b></p>
                            </div>
                        </div>
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
            <p style="color: #ffffff90">برجاء اختيار الموقع.</p>
        </div>
    </div>
</template>

<style scoped>
.chart_wrapper {
    display: grid;
    place-items: center;
    margin: auto;
    min-height: 400px;
}

.chart_legend_closed {
    position: absolute;
    text-align: center;
    top: 30px;
    left: 10px;
    padding-bottom: 10px;
    border-bottom: 2px solid var(--c);
}

.chart_legend_closed::before {
    content: "";
    position: absolute;
    bottom: -1px;
    right: 1px;
    height: 1px;
    width: 100px;
    background-color: var(--c);
    transform: translateX(100%) rotate(45deg);
    transform-origin: 0;
}

.chart_legend_opened {
    position: absolute;
    text-align: center;
    bottom: 30px;
    right: 0;
    padding-top: 10px;
    border-top: 2px solid var(--c);
}

.chart_legend_opened::before {
    content: "";
    position: absolute;
    top: -2px;
    left: 1px;
    height: 1px;
    width: 50px;
    background-color: var(--c);
    transform: translateX(-100%) rotate(30deg);
    transform-origin: 100%;
}

.legend_wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 15px;
    margin-top: -30px;
    margin-bottom: 15px;
}

.legend_wrapper [class*="chart_legend"] {
    padding-right: 10px;
    border-right: 5px solid var(--c);
    padding-inline: 10px;
}

.legend_wrapper [class*="chart_legend"] p {
    color: #ffffff90;
}

.legend_wrapper [class*="chart_legend"] b {
    color: #ffffff;
}
</style>