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




function generateCharts() {
    const dataCalc = Object.values(fetchedDetails.value.reports_status_percentages).map(data => {
        const sum = data.pending + data.approved + data.rejected;
        if (sum == 0) return 0;
        return (data.approved / sum) * 100;
    })

    const compliancePercentageChartData = {
        labels: Object.keys(fetchedDetails.value.general_reports_percentages),
        datasets: [{
            label: 'تقارير الإدارة',
            data: Object.values(fetchedDetails.value.general_reports_percentages),
            pointBackgroundColor: "#35685F",
            pointBorderColor: "#fff",
            borderColor: "#35685F",
            fill: true,
            backgroundColor: "#35685F20"
        }, {
            label: 'تقارير المخالفه',
            data: Object.values(fetchedDetails.value.violation_reports_percentages),
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
                label: 'التقارير المعتمدة',
                data: [fetchedDetails.value.completedDailyReportAssignCount / fetchedDetails.value.dailyReportAssignCount * 100],
                borderWidth: 0,
                radius: "80%",
                cutout: "0%",
                circumference: 360 * (fetchedDetails.value.completedDailyReportAssignCount / fetchedDetails.value.dailyReportAssignCount * 100) / 100,
                backgroundColor: '#35685F',
            },
            {
                label: 'التقارير المرفوضة',
                data: [(fetchedDetails.value.dailyReportAssignCount - fetchedDetails.value.completedDailyReportAssignCount) / fetchedDetails.value.dailyReportAssignCount * 100],
                borderWidth: 0,
                radius: "80%",
                backgroundColor: '#C05E5E',
                circumference: 360 * ((fetchedDetails.value.dailyReportAssignCount - fetchedDetails.value.completedDailyReportAssignCount) / fetchedDetails.value.dailyReportAssignCount * 100) / 100,
                rotation: -360 * ((fetchedDetails.value.dailyReportAssignCount - fetchedDetails.value.completedDailyReportAssignCount) / fetchedDetails.value.dailyReportAssignCount * 100) / 100,
            }
        ],
    }

    const reportsQualityChartData = {
        labels: Object.keys(fetchedDetails.value.reports_status_percentages),
        datasets: [{
            label: 'نسبة الالتزام بالحضور',
            data: dataCalc,
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

    if (compliancePercentageChart.toDataURL() !== document.getElementById('blank').toDataURL()) {
        Chart.getChart(compliancePercentageChart).destroy();
    }
    new Chart(compliancePercentageChart, generateConfig(compliancePercentageChartData));

    if (reportsStatusChart.toDataURL() !== document.getElementById('blank').toDataURL()) {
        Chart.getChart(reportsStatusChart).destroy();
    }
    new Chart(reportsStatusChart, reportsStatusChartConfig);

    if (reportsQualityChart.toDataURL() !== document.getElementById('blank').toDataURL()) {
        Chart.getChart(reportsQualityChart).destroy();
    }
    new Chart(reportsQualityChart, generateConfig(reportsQualityChartData));
}

async function getReports() {
    try {
        const params = Object.fromEntries(
            Object.entries(searchQuery.value).filter(([_, v]) => v)
        );
        const res = await http.get(`v1/map/getFilterObjects`, { params });
        fetchedReports.value = res.data.data.assigned
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
        const res = await http.get(`v1/map/getDetailsForParent5`, { params });
        fetchedDetails.value = res.data.data
        isLoading.value = false
        generateCharts();
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
                            {{ fetchedDetails.dailyReportAssignCount }}
                            <!-- {{
                                    convertNumberWithSeperator(
                                        parseValueToActialNumber(21, 0),
                                        "٬"
                                    )
                                }} -->
                        </h3>
                        <label>إجمالي عدد تقارير المشرفين</label>
                    </div>
                </v-col>
            </v-row>
            <hr v-if="!mapStore.isMapStatisticsFullscreen" class="my-4">
            <v-row class="my-0">
                <canvas id="blank" class="d-none" aria-label="Hello ARIA World" role="img"></canvas>
                <v-col :cols="`${mapStore.isMapStatisticsFullscreen ? 6 : 12}`">
                    <v-card class="w-100" style="background-color: #303030; padding: 15px;">
                        <div class="w-100">
                            <p style="font-size: 0.9rem">نسبة التزام المشرفين برفع التقارير</p>
                        </div>
                        <hr>
                        <canvas id="compliancePercentageChart" aria-label="Hello ARIA World" role="img"></canvas>
                        <div class="line_legend_wrapper">
                            <div class="legend">
                                <span>تقارير الإدارة</span>
                                <img src="@/assets/imgs/icons/legend-green.svg" width="20" alt="">
                            </div>
                            <div class="legend">
                                <span>تقارير المخالفه</span>
                                <img src="@/assets/imgs/icons/legend-red.svg" width="20" alt="">
                            </div>
                        </div>
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
                                {{ fetchedDetails.dailyReportAssignCount }}
                            </h3>
                            <canvas id="reportsStatusChart" aria-label="Hello ARIA World" role="img"></canvas>
                            <div class="pie_legend_wrapper">
                                <div class="legend">
                                    <span>التقارير المعتمدة: <b style="--c: #35685F">{{
                                        fetchedDetails.completedDailyReportAssignCount
                                            }}</b></span>
                                </div>
                                <div class="legend">
                                    <span>التقارير المرفوضة: <b style="--c: #C05E5E">{{
                                        fetchedDetails.cancelledDailyReportAssignCount
                                            }}</b></span>
                                </div>
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
    text-align: center;
}

.panel_content {
    height: 100%;
    padding-block-start: 15px;
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

.chart_wrapper {
    display: grid;
    place-items: center;
    margin: auto;
    min-height: 400px;
}
</style>