<script setup lang="ts">
import { reactive, watch, onMounted } from 'vue';
import { parseValueToActialNumber, animateNumber } from '@/helpers/helperFunctions';
import { Chart, Responsive, Pie, Tooltip } from 'vue3-charts';

interface ChartProps {
  height?: number;
  width?: number;
  data: number[];
  isLoading?: boolean;
}

const props = withDefaults(defineProps<ChartProps>(), {
  height: 50,
  width: 80,
  data: [],
  isLoading: false
});

const chartOptions = {
  chart: {
    height: 350,
    type: 'area',
    sparkline: {
      enabled: true
    }
  },
  stroke: {
    curve: 'smooth'
  },
  tooltip: {
    enabled: false,
    x: {
      format: 'dd/MM/yy HH:mm'
    }
  },
  colors: ['#B49164'],
  dataLabels: {
    enabled: false
  }
};
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
</template>

<style lang="scss">
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
