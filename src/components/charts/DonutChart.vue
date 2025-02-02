<script setup lang="ts">
import { ref, reactive, provide, watch, onMounted } from 'vue';
import { parseValueToActialNumber, animateNumber } from '@/helpers/helperFunctions';
// import { Chart, Responsive, Pie, Tooltip } from 'vue3-charts';
import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { PieChart } from 'echarts/charts';
import { TitleComponent, TooltipComponent, LegendComponent } from 'echarts/components';
import VChart, { THEME_KEY } from 'vue-echarts';

use([CanvasRenderer, PieChart, TitleComponent, TooltipComponent, LegendComponent]);

provide(THEME_KEY, 'dark');

interface ChartProps {
  height?: number;
  width?: number;
  colors?: string[];
  data: number[];
  isLoading?: boolean;
}

const props = withDefaults(defineProps<ChartProps>(), {
  height: 260,
  width: 260,
  colors: ['#B49164', '#31AE93', '#fff'],
  isLoading: false
});

const chartOptions = {
  chart: {
    type: 'donut',
    sparkline: {
      enabled: true
    }
  },
  plotOptions: {
    pie: {
      startAngle: 0,
      endAngle: 360,
      expandOnClick: true,
      offsetX: 0,
      offsetY: 0,
      customScale: 0.95,
      dataLabels: {
        offset: 0,
        minAngleToShowLabel: 10
      },
      donut: {
        size: '65%',
        background: 'transparent',
        labels: {
          show: false,
          name: {
            show: true,
            fontSize: '22px',
            fontFamily: 'Helvetica, Arial, sans-serif',
            fontWeight: 600,
            color: undefined,
            offsetY: -10,
            formatter: function (val) {
              return val;
            }
          },
          value: {
            show: false,
            fontSize: '16px',
            fontFamily: 'Helvetica, Arial, sans-serif',
            fontWeight: 400,
            color: undefined,
            offsetY: 16,
            formatter: function (val) {
              return val;
            }
          },
          total: {
            show: false,
            showAlways: false,
            label: 'Total',
            fontSize: '22px',
            fontFamily: 'Helvetica, Arial, sans-serif',
            fontWeight: 600,
            color: '#373d3f',
            formatter: function (w) {
              return w.globals.seriesTotals.reduce((a, b) => {
                return a + b;
              }, 0);
            }
          }
        }
      }
    }
  },
  stroke: {
    show: true,
    curve: 'straight',
    lineCap: 'butt',
    colors: undefined,
    width: 2.5,
    dashArray: 0
  },
  tooltip: {
    enabled: false
  },
  colors: props.colors,
  responsive: [
    {
      breakpoint: 480,
      options: {
        chart: {
          width: 200
        },
        legend: {
          position: 'bottom'
        }
      }
    }
  ],
  dataLabels: {
    enabled: false
  }
};

const chartOption = ref({
  tooltip: {
    show: false,
    trigger: 'item'
  },
  legend: {
    bottom: '5%',
    left: 'center'
  },
  series: [
    {
      name: 'Access From',
      type: 'pie',
      radius: ['40%', '70%'],
      avoidLabelOverlap: false,
      label: {
        show: false,
        position: 'center'
      },
      emphasis: {
        label: {
          show: false,
          fontSize: 40,
          fontWeight: 'bold'
        }
      },
      labelLine: {
        show: false
      },
      data: [
        { value: 1048, name: 'Search Engine' },
        { value: 735, name: 'Direct' },
        { value: 580, name: 'Email' },
        { value: 484, name: 'Union Ads' },
        { value: 300, name: 'Video Ads' }
      ]
    }
  ]
});

const tweened = reactive({
  number: 0
});

watch(props, (props) => {
  animateNumber(tweened, props.value);
});

onMounted(() => {
  animateNumber(tweened, props.value);
});
</script>

<template>
  <v-card
    v-if="isLoading"
    class="card-rounded w-100 h-100 d-flex justify-center align-center mx-2 pa-4 overflow-hidden is-loading"
  >
    <v-skeleton-loader
      type="button"
      height="4rem"
      width="10rem"
      max-width="100%"
      max-height="100%"
    ></v-skeleton-loader>
  </v-card>
  <apexchart v-else :width="width" :options="chartOptions" :series="data"></apexchart>
  <!-- <v-chart :option="chartOption" v-else /> -->
</template>

<style lang="scss">
.chart {
  height: 120px;
}
.chart.custom-donut-chart {
  .axis {
    display: none;
  }

  .layers {
    display: inline-block;
    transform: translateX(5px);
  }
}
</style>
