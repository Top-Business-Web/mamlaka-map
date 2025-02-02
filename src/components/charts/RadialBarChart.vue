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
    type: 'radialBar',
    offsetY: -10
  },
  plotOptions: {
    radialBar: {
      startAngle: -90,
      endAngle: 90,
      track: {
        background: props.background,
        strokeWidth: '100%',
        margin: 5
      },
      dataLabels: {
        name: {
          fontSize: '0.875rem',
          fontFamily: 'inherit',
          color: props.labelColor,
          offsetY: 30
        },
        value: {
          offsetY: -15,
          fontSize: '1.375rem',
          fontWeight: 900,
          fontFamily: 'inherit',
          color: props.labelColor,
          formatter: function (val: number) {
            return val;
          }
        }
      }
    }
  },
  grid: {
    padding: {
      top: -10
    }
  },
  colors: [props.color],
  labels: [props.label]
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
    type="radialBar"
    :options="chartOptions"
    :series="[parseValueToActialNumber(tweened.number, 0)]"
  ></apexchart>
</template>
