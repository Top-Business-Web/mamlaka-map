<script setup>
import { convertNumberWithSeperator, parseValueToActialNumber } from '@/helpers/helperFunctions';
import { useMapStore } from '@/stores/MapStore';
import Chart from "chart.js/auto";
import { onMounted } from 'vue';

import arrowUpRight from "@/assets/imgs/arrow-up-right.png";
import arrowDownRight from "@/assets/imgs/arrow-down-right.png";
import arrowRight from "@/assets/imgs/arrow-right.png";

const mapStore = useMapStore();

const attendanecChartData = {
    labels: ['السبت', 'الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة'],
    datasets: [{
        label: 'الالتزام بالحضور',
        data: [69, 20, 37, 18, 63, 16, 50],
        pointBackgroundColor: "#35685F",
        pointBorderColor: "#fff",
        borderColor: "#35685F",
        fill: true,
        backgroundColor: "#35685F20"
    }, {
        label: 'نسبة الغياب',
        data: [58, 36, 48, 39, 69, 38, 30],
        pointBackgroundColor: "#C05E5E",
        pointBorderColor: "#fff",
        borderColor: "#C05E5E",
        fill: true,
        backgroundColor: "#C05E5E20"
    }]
}
const dailyReportsChartData = {
    labels: ['السبت', 'الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة'],
    datasets: [{
        label: 'نسبة التقارير اليومية المنجزة',
        data: [58, 63, 78, 79, 69, 38, 30],
        pointBackgroundColor: "#35685F",
        pointBorderColor: "#fff",
        borderColor: "#35685F",
        fill: true,
        backgroundColor: "#35685F20"
    }, {
        label: 'نسبة التقارير اليومية الغير منجزة',
        data: [39, 80, 17, 18, 63, 16, 80],
        pointBackgroundColor: "#C05E5E",
        pointBorderColor: "#fff",
        borderColor: "#C05E5E",
        fill: true,
        backgroundColor: "#C05E5E20"
    }]
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

onMounted(() => {
    new Chart(attendanecChart, generateConfig(attendanecChartData));
    new Chart(dailyReportsChart, generateConfig(dailyReportsChartData));
})

</script>
<template>
    <div style="padding: 15px;">
        <v-row>
            <v-col cols="12">
                <select class="form-select w-100" aria-label="Default select example"
                    style="background-color: #303030;">
                    <option value="">شارع الأمير سلطان</option>
                    <option value="">شارع الأمير عبدالله</option>
                    <option value="">شارع الأمير عبد العزيز</option>
                </select>
            </v-col>
        </v-row>
        <v-row class="top-panel-grid mx-0" :class="{ 'top-panel-grid--fullscreen': mapStore.isMapStatisticsFullscreen }"
            :style="[
                mapStore.isMapStatisticsFullscreen
                    ? 'background-color: #303030; margin-top: 20px;'
                    : ''
            ]">
            <v-col :cols="`${mapStore.isMapStatisticsFullscreen ? 4 : 12}`">
                <v-card class="w-100" :class="[mapStore.isMapStatisticsFullscreen ? 'pa-10' : 'pa-0']"
                    style="background-color: transparent" :style="[
                        mapStore.isMapStatisticsFullscreen
                            ? 'border-left: 1px solid #494A4A; border-radius: 0;'
                            : ''
                    ]">
                    <div class="w-100 h-100 d-flex flex-column">
                        <h3 class="font-weight-bold" style="color: #857854;">
                            {{
                                convertNumberWithSeperator(
                                    parseValueToActialNumber(76, 0),
                                    "٬"
                                )
                            }}
                        </h3>
                        <div class="d-flex" style="justify-content: space-between">
                            <p style="font-size: 0.9rem">عدد العاملين في الموقع</p>
                            <div class="status-normal d-flex justify-content-center">
                                <img style="width: 16px" class="h-16" :src="arrowRight" alt="no-icon" />
                                <p>0.0%</p>
                            </div>
                        </div>
                    </div>
                </v-card>
            </v-col>
            <v-col :cols="`${mapStore.isMapStatisticsFullscreen ? 4 : 12}`">
                <v-card class="w-100" :class="[mapStore.isMapStatisticsFullscreen ? 'pa-10' : 'pa-0']"
                    style="background-color: transparent" :style="[
                        mapStore.isMapStatisticsFullscreen
                            ? 'border-left: 1px solid #494A4A; border-radius: 0;'
                            : ''
                    ]">
                    <div class="w-100 h-100 d-flex flex-column">
                        <h3 class="font-weight-bold" style="color: #857854">
                            {{
                                convertNumberWithSeperator(
                                    parseValueToActialNumber(176, 0),
                                    "٬"
                                )
                            }}
                        </h3>
                        <div class="d-flex" style="justify-content: space-between">
                            <p style="font-size: 0.9rem">اجمالي عدد التقارير اليومية</p>
                            <div class="status-false">
                                <img style="width: 16px" class="h-16" :src="arrowDownRight" alt="no-icon" />
                                <p>4.1%</p>
                            </div>
                        </div>
                    </div>
                </v-card>
            </v-col>
            <v-col :cols="`${mapStore.isMapStatisticsFullscreen ? 4 : 12}`">
                <v-card class="w-100" :class="[mapStore.isMapStatisticsFullscreen ? 'pa-10' : 'pa-0']"
                    style="background-color: transparent">
                    <div class="w-100 h-100 d-flex flex-column">
                        <h3 class="font-weight-bold" style="color: #857854;">
                            {{
                                convertNumberWithSeperator(
                                    parseValueToActialNumber(982, 0),
                                    "٬"
                                )
                            }}
                        </h3>
                        <div class="d-flex" style="justify-content: space-between">
                            <span style="font-size: 0.9rem">اجمالي عدد التقارير المرفوعة</span>
                            <div class="status-true">
                                <img style="width: 16px" class="h-16" :src="arrowUpRight" alt="no-icon" />
                                <p>4.1%</p>
                            </div>
                        </div>
                    </div>
                </v-card>
            </v-col>
        </v-row>
        <hr>
        <v-row>
            <v-col :cols="`${mapStore.isMapStatisticsFullscreen ? 6 : 12}`">
                <v-card class="w-100" style="background-color: #303030; padding: 15px;">
                    <div class="w-100">
                        <p style="font-size: 0.9rem">الالتزام بالحضور في الموقع</p>
                    </div>
                    <hr>
                    <canvas id="attendanecChart" aria-label="Hello ARIA World" role="img"></canvas>
                </v-card>
            </v-col>
            <v-col :cols="`${mapStore.isMapStatisticsFullscreen ? 6 : 12}`">
                <v-card class="w-100" style="background-color: #303030; padding: 15px;">
                    <div class="w-100">
                        <p style="font-size: 0.9rem">التقارير اليومية</p>
                    </div>
                    <hr>
                    <canvas id="dailyReportsChart" aria-label="Hello ARIA World" role="img"></canvas>
                </v-card>
            </v-col>
        </v-row>
        <v-row>
            <v-col :cols="`${mapStore.isMapStatisticsFullscreen ? 6 : 12}`">
                <div class="card-border mt-2" style="background-color: #303030">
                    <p style="color: white; margin-bottom: 10px">
                        هل تشعر بالأمان أثناء أداء تقارير يوميةك الميدانية؟
                    </p>
                    <div class="card-border" style="background-color: #383838">
                        <div class="row">
                            <div class="col-lg-6 col-12" style="border-left: 1px solid #e6ebee">
                                <div class="d-flex justify-content-between mb-2 text-white">
                                    <p>نعم</p>
                                    <p>40%</p>
                                </div>
                                <div class="progress primary">
                                    <div class="progress-bar" role="progressbar" style="width: 50%" aria-valuenow="50"
                                        aria-valuemin="0" aria-valuemax="100"></div>
                                </div>
                            </div>
                            <div class="col-lg-6 col-12">
                                <div class="d-flex justify-content-between mb-2 text-white">
                                    <p>لا</p>
                                    <p>40%</p>
                                </div>
                                <div class="progress second">
                                    <div class="progress-bar" role="progressbar" style="width: 50%" aria-valuenow="50"
                                        aria-valuemin="0" aria-valuemax="100"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </v-col>
            <v-col :cols="`${mapStore.isMapStatisticsFullscreen ? 6 : 12}`">
                <div class="card-border mt-2" style="background-color: #303030">
                    <p style="color: white; margin-bottom: 10px">
                        هل تشعر بالأمان أثناء أداء تقارير يوميةك الميدانية؟
                    </p>
                    <div class="card-border" style="background-color: #383838">
                        <div class="row">
                            <div class="col-lg-6 col-12" style="border-left: 1px solid #e6ebee">
                                <div class="d-flex justify-content-between mb-2 text-white">
                                    <p>نعم</p>
                                    <p>40%</p>
                                </div>
                                <div class="progress primary">
                                    <div class="progress-bar" role="progressbar" style="width: 50%" aria-valuenow="50"
                                        aria-valuemin="0" aria-valuemax="100"></div>
                                </div>
                            </div>
                            <div class="col-lg-6 col-12">
                                <div class="d-flex justify-content-between mb-2 text-white">
                                    <p>لا</p>
                                    <p>40%</p>
                                </div>
                                <div class="progress second">
                                    <div class="progress-bar" role="progressbar" style="width: 50%" aria-valuenow="50"
                                        aria-valuemin="0" aria-valuemax="100"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </v-col>
            <v-col :cols="`${mapStore.isMapStatisticsFullscreen ? 6 : 12}`">
                <div class="card-border mt-2" style="background-color: #303030">
                    <p style="color: white; margin-bottom: 10px">
                        هل تشعر بالأمان أثناء أداء تقارير يوميةك الميدانية؟
                    </p>
                    <div class="card-border" style="background-color: #383838">
                        <div class="row">
                            <div class="col-lg-6 col-12" style="border-left: 1px solid #e6ebee">
                                <div class="d-flex justify-content-between mb-2 text-white">
                                    <p>نعم</p>
                                    <p>40%</p>
                                </div>
                                <div class="progress primary">
                                    <div class="progress-bar" role="progressbar" style="width: 50%" aria-valuenow="50"
                                        aria-valuemin="0" aria-valuemax="100"></div>
                                </div>
                            </div>
                            <div class="col-lg-6 col-12">
                                <div class="d-flex justify-content-between mb-2 text-white">
                                    <p>لا</p>
                                    <p>40%</p>
                                </div>
                                <div class="progress second">
                                    <div class="progress-bar" role="progressbar" style="width: 50%" aria-valuenow="50"
                                        aria-valuemin="0" aria-valuemax="100"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </v-col>
            <v-col :cols="`${mapStore.isMapStatisticsFullscreen ? 6 : 12}`">
                <div class="card-border mt-2" style="background-color: #303030">
                    <p style="color: white; margin-bottom: 10px">
                        هل تشعر بالأمان أثناء أداء تقارير يوميةك الميدانية؟
                    </p>
                    <div class="card-border" style="background-color: #383838">
                        <div class="row">
                            <div class="col-lg-6 col-12" style="border-left: 1px solid #e6ebee">
                                <div class="d-flex justify-content-between mb-2 text-white">
                                    <p>نعم</p>
                                    <p>40%</p>
                                </div>
                                <div class="progress primary">
                                    <div class="progress-bar" role="progressbar" style="width: 50%" aria-valuenow="50"
                                        aria-valuemin="0" aria-valuemax="100"></div>
                                </div>
                            </div>
                            <div class="col-lg-6 col-12">
                                <div class="d-flex justify-content-between mb-2 text-white">
                                    <p>لا</p>
                                    <p>40%</p>
                                </div>
                                <div class="progress second">
                                    <div class="progress-bar" role="progressbar" style="width: 50%" aria-valuenow="50"
                                        aria-valuemin="0" aria-valuemax="100"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </v-col>
        </v-row>
    </div>
</template>