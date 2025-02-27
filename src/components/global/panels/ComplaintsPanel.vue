<script setup>
import { convertNumberWithSeperator, parseValueToActialNumber } from '@/helpers/helperFunctions';
import { useMapStore } from '@/stores/MapStore';
import Chart, { elements } from "chart.js/auto";
import { onMounted } from 'vue';

import arrowUpRight from "@/assets/imgs/arrow-up-right.png";
import arrowDownRight from "@/assets/imgs/arrow-down-right.png";
import arrowRight from "@/assets/imgs/arrow-right.png";

const mapStore = useMapStore();

const complaintsStatusData = {
    datasets: [
        {
            label: 'نسبة الالتزام بالإجابة بلا لسؤال معين',
            data: [70],
            borderWidth: 0,
            radius: "80%",
            cutout: 0,
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
const complaintsPeriorityData = {
    datasets: [
        {
            label: 'نسبة الالتزام بالإجابة بلا لسؤال معين',
            data: [60],
            borderWidth: 0,
            radius: "80%",
            cutout: 0,
            circumference: 360 * 60 / 100,
            backgroundColor: '#C05E5E',
        },
        {
            label: 'نسبة الالتزام بالإجابة بنعم لسؤال معين',
            data: [30],
            borderWidth: 0,
            radius: "80%",
            circumference: 360 * 30 / 100,
            rotation: -360 * 40 / 100,
            backgroundColor: '#857854',
        },
        {
            label: 'نسبة الالتزام بالإجابة بنعم لسؤال معين',
            data: [10],
            borderWidth: 0,
            cutout: "64%",
            radius: "80%",
            circumference: 360 * 10 / 100,
            rotation: -360 * 10 / 100,
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

onMounted(() => {
    new Chart(complaintsStatus, generateConfig(complaintsStatusData));
    new Chart(complaintsPeriority, generateConfig(complaintsPeriorityData));
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
                        <h3 class="font-weight-bold" style="color: #857854;">
                            {{
                                convertNumberWithSeperator(
                                    parseValueToActialNumber(14456, 0),
                                    "٬"
                                )
                            }}
                        </h3>
                        <div class="d-flex" style="justify-content: space-between">
                            <span style="font-size: 0.9rem">اجمالي عدد البلاغات</span>
                            <div class="status-normal d-flex justify-content-center">
                                <img style="width: 16px" class="h-16" :src="arrowRight" alt="no-icon" />
                                <p>0.0%</p>
                            </div>
                        </div>
                    </div>
                </v-card>
            </v-col>
        </v-row>
        <hr>
        <v-row>
            <v-col :cols="`${mapStore.isMapStatisticsFullscreen ? 6 : 12}`">
                <v-card class="w-100 h-100" style="background-color: #303030; padding: 15px;">
                    <div class="w-100">
                        <p style="font-size: 0.9rem">عدد البلاغات (مقفولة، مفتوحة)</p>
                    </div>
                    <hr>
                    <div class="chart_wrapper position-relative"
                        :class="`${mapStore.isMapStatisticsFullscreen ? 'w-50' : ''}`">
                        <h3 class="position-absolute">
                            {{
                                convertNumberWithSeperator(
                                    parseValueToActialNumber(14456, 0),
                                    "٬"
                                )
                            }}
                        </h3>
                        <div class="chart_legend_closed" style="--c: #C05E5E">
                            <p>بلاغات مقفولة</p>
                        </div>
                        <canvas id="complaintsStatus" aria-label="Hello ARIA World" role="img"></canvas>
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
                            {{
                                convertNumberWithSeperator(
                                    parseValueToActialNumber(14456, 0),
                                    "٬"
                                )
                            }}
                        </h3>
                        <div class="chart_legend_low" style="--c: #35685F">
                            <p>منخفضة الأهمية</p>
                        </div>
                        <canvas id="complaintsPeriority" aria-label="Hello ARIA World" role="img"></canvas>
                        <div class="chart_legend_high" style="--c: #C05E5E">
                            <p>عالية الأهمية</p>
                        </div>
                        <div class="chart_legend_medium" style="--c: #857854">
                            <p>متوسطة الأهمية</p>
                        </div>
                    </div>
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
    min-height: 500px;
}

[class*="chart_legend_"] {
    position: absolute;
    width: 150px;
    text-align: center;
}

.chart_legend_closed,
.chart_legend_low {
    top: 30px;
    left: 10px;
    padding-bottom: 10px;
    border-bottom: 2px solid var(--c);
}

.chart_legend_closed::before,
.chart_legend_low::before {
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

.chart_legend_opened,
.chart_legend_high {
    bottom: 30px;
    right: 0;
    padding-top: 10px;
    border-top: 2px solid var(--c);
}

.chart_legend_opened::before,
.chart_legend_high::before {
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

.chart_legend_medium {
    bottom: 150px;
    left: -20px;
    padding-bottom: 10px;
    border-bottom: 2px solid var(--c);
}

.chart_legend_medium::before {
    content: "";
    position: absolute;
    bottom: -1px;
    right: 1px;
    height: 1px;
    width: 50px;
    background-color: var(--c);
    transform: translateX(100%) rotate(-30deg);
    transform-origin: 0;
}
</style>