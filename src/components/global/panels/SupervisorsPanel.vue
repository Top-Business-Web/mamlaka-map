<script setup>
import { convertNumberWithSeperator, parseValueToActialNumber } from '@/helpers/helperFunctions';
import { useMapStore } from '@/stores/MapStore';
import Chart, { elements } from "chart.js/auto";
import { onMounted } from 'vue';

import arrowUpRight from "@/assets/imgs/arrow-up-right.png";
import arrowDownRight from "@/assets/imgs/arrow-down-right.png";
import arrowRight from "@/assets/imgs/arrow-right.png";

const mapStore = useMapStore();

const compliancePercentageChartData = {
    labels: ['السبت', 'الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة'],
    datasets: [{
        label: 'ملتزم',
        data: [69, 20, 68, 18, 63, 16, 50],
        pointBackgroundColor: "#35685F",
        pointBorderColor: "#fff",
        borderColor: "#35685F",
        fill: true,
        backgroundColor: "#35685F20"
    }, {
        label: 'غير ملتزم',
        data: [58, 36, 48, 39, 69, 38, 30],
        pointBackgroundColor: "#C05E5E",
        pointBorderColor: "#fff",
        borderColor: "#C05E5E",
        fill: true,
        backgroundColor: "#C05E5E20"
    }]
}
const reportsStatusChartData = {
    datasets: [
        {
            label: 'نسبة الالتزام بالإجابة بلا لسؤال معين',
            data: [70],
            borderWidth: 0,
            radius: "80%",
            cutout: "0%",
            circumference: 360 * 70 / 100,
            backgroundColor: '#35685F',
        },
        {
            label: 'نسبة الالتزام بالإجابة بنعم لسؤال معين',
            data: [30],
            borderWidth: 0,
            radius: "80%",
            backgroundColor: '#C05E5E',
            circumference: 360 * 30 / 100,
            rotation: -360 * 30 / 100,
        }
    ],
}
const reportsQualityChartData = {
    labels: ['السبت', 'الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة'],
    datasets: [{
        label: 'نسبة الالتزام بالحضور',
        data: [58, 63, 78, 79, 69, 38, 30],
        pointBackgroundColor: "#35685F",
        pointBorderColor: "#fff",
        borderColor: "#35685F",
        fill: true,
        backgroundColor: "#35685F20"
    }]
}

const reportsStatusChartConfig = {
    type: 'doughnut',
    data: reportsStatusChartData,
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


function generateConfig(data, isLegend = true) {
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
                    display: isLegend,
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
    new Chart(compliancePercentageChart, generateConfig(compliancePercentageChartData, true));
    new Chart(reportsStatusChart, reportsStatusChartConfig);
    new Chart(reportsQualityChart, generateConfig(reportsQualityChartData, false));
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
            <v-col cols="12">
                <v-card class="w-100" :class="[mapStore.isMapStatisticsFullscreen ? 'pa-10' : 'pa-0']"
                    style="background-color: transparent">
                    <div class="w-100 h-100 d-flex flex-column">
                        <h3 class="font-weight-bold" style="color: #857854">
                            {{
                                convertNumberWithSeperator(
                                    parseValueToActialNumber(124, 0),
                                    "٬"
                                )
                            }}
                        </h3>
                        <div class="d-flex" style="justify-content: space-between">
                            <p style="font-size: 0.9rem">إجمالي عدد تقارير المشرفين</p>
                            <div class="status-false">
                                <img style="width: 16px" class="h-16" :src="arrowDownRight" alt="no-icon" />
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
                        <p style="font-size: 0.9rem">نسبة التزام المشرفين برفع التقارير</p>
                    </div>
                    <hr>
                    <canvas id="compliancePercentageChart" aria-label="Hello ARIA World" role="img"></canvas>
                </v-card>
            </v-col>
            <v-col :cols="`${mapStore.isMapStatisticsFullscreen ? 6 : 12}`">
                <v-card class="w-100 h-100" style="background-color: #303030; padding: 15px;">
                    <div class="w-100">
                        <p style="font-size: 0.9rem">إجمالي عدد التقارير</p>
                    </div>
                    <hr>
                    <div class="chart_wrapper position-relative"
                        :class="`${mapStore.isMapStatisticsFullscreen ? 'w-50 h-75' : ''}`">
                        <h3 class="position-absolute">
                            {{
                                convertNumberWithSeperator(
                                    parseValueToActialNumber(124, 0),
                                    "٬"
                                )
                            }}
                        </h3>
                        <div class="chart_legend_closed" style="--c: #C05E5E">
                            <p>بلاغات مقفولة</p>
                        </div>
                        <canvas id="reportsStatusChart" aria-label="Hello ARIA World" role="img"></canvas>
                        <div class="chart_legend_opened" style="--c: #35685F">
                            <p>بلاغات مفتوحة</p>
                        </div>
                    </div>
                </v-card>
            </v-col>
            <v-col :cols="`${mapStore.isMapStatisticsFullscreen ? 6 : 12}`">
                <v-card class="w-100" style="background-color: #303030; padding: 15px;">
                    <div class="w-100">
                        <p style="font-size: 0.9rem">نسبة جودة التقارير</p>
                    </div>
                    <hr>
                    <canvas id="reportsQualityChart" aria-label="Hello ARIA World" role="img"></canvas>
                </v-card>
            </v-col>
        </v-row>
    </div>
</template>

<style scoped>
.chart_wrapper {
    display: grid;
    place-items: center;
    margin: auto;
    text-align: center;
}

[class*="chart_legend_"] {
    position: absolute;
    width: 150px;
}

.chart_legend_closed {
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
    transform: translateX(100%) rotate(30deg);
    transform-origin: 0;
}

.chart_legend_opened {
    bottom: 30px;
    right: 0;
    padding-top: 10px;
    border-top: 2px solid var(--c);
}

.chart_legend_opened::before {
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