<template>
  <v-chart class="chart" :option="option" />
</template>

<script setup>
import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { PieChart, LineChart } from 'echarts/charts';
import { TitleComponent, TooltipComponent, LegendComponent } from 'echarts/components';
import VChart, { THEME_KEY } from 'vue-echarts';
import { ref, provide } from 'vue';

use([CanvasRenderer, LineChart, TitleComponent, TooltipComponent, LegendComponent]);

provide(THEME_KEY, 'dark');

const option = ref({
  // title: {
  //   text: "Traffic Sources",
  //   left: "center"
  // },
  // title: false,
  // tooltip: {
  //   trigger: 'item',
  //   formatter: '{a} <br/>{b} : {c} ({d}%)'
  // },
  // //   legend: {
  // //     orient: 'vertical',
  // //     left: 'left',
  // //     data: ['Direct', 'Email', 'Ad Networks', 'Video Ads', 'Search Engines']
  // //   },
  // legend: false,
  xAxis: {
    type: 'category',
    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  },
  yAxis: {
    type: 'value'
  },
  series: [
    {
      data: [820, 932, 901, 934, 1290, 1330, 1320],
      type: 'line',
      smooth: true
    }
  ]
});
</script>

<style scoped>
.chart {
  height: 400px;
}
</style>
