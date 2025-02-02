<script setup lang="ts">
import { reactive, watch, onMounted } from 'vue';
import { parseValueToActialNumber, animateNumber } from '@/helpers/helperFunctions';

interface ChartProps {
  height?: string | number;
  label?: string;
  value?: number;
  color?: string;
  background?: string;
  labelColor?: string;
  isLoading?: boolean;
}

const props = withDefaults(defineProps<ChartProps>(), {
  height: 260,
  label: '',
  value: 0,
  color: '#B49164',
  background: '#fff',
  labelColor: '#fff',
  isLoading: false
});

const chartOptions = {
  chart: {
    height: 350,
    type: 'bar',
    sparkline: {
      enabled: true
    }
  },
  plotOptions: {
    bar: {
      borderRadius: 10,
      backgroundColor: 'red',
      dataLabels: {
        position: 'top' // top, center, bottom
      }
    }
  },
  dataLabels: {
    enabled: false,
    formatter: function (val) {
      return val + '%';
    },
    offsetY: -20,
    style: {
      fontSize: '12px',
      colors: ['#304758']
    }
  },

  xaxis: {
    categories: ['Jan', 'Feb'],
    position: 'top',
    axisBorder: {
      show: false
    },
    axisTicks: {
      show: false
    },
    crosshairs: {
      fill: {
        type: 'gradient',
        gradient: {
          colorFrom: '#D8E3F0',
          colorTo: '#BED1E6',
          stops: [0, 100],
          opacityFrom: 0.4,
          opacityTo: 0.5
        }
      }
    },
    tooltip: {
      enabled: false
    }
  },
  yaxis: {
    axisBorder: {
      show: false
    },
    axisTicks: {
      show: false
    },
    labels: {
      show: false,
      formatter: function (val) {
        return val + '%';
      }
    }
  },
  tooltip: {
    enabled: false
  }
  // title: {
  //   text: 'Monthly Inflation in Argentina, 2002',
  //   floating: true,
  //   offsetY: 330,
  //   align: 'center',
  //   style: {
  //     color: '#444'
  //   }
  // }
};

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
  <apexchart
    v-else
    type="bar"
    :height="75"
    :width="75"
    :options="chartOptions"
    :series="[
      {
        name: 'Inflation',
        data: [30, 70]
      }
    ]"
  ></apexchart>
</template>
