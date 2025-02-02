<script setup>
import { use, registerTheme } from 'echarts/core';
import { BarChart } from 'echarts/charts';
import { GridComponent, DatasetComponent } from 'echarts/components';
import { shallowRef, onBeforeUnmount } from 'vue';
// import theme from '../theme.json';

use([BarChart, DatasetComponent, GridComponent]);
// registerTheme('ovilia-green', theme);

const seconds = shallowRef(0);
const loading = shallowRef(false);
const loadingOptions = {
  text: 'Loading…',
  color: '#4ea397',
  maskColor: 'rgba(255, 255, 255, 0.4)'
};

const random = () => Math.random();

const option = {
  textStyle: {
    fontFamily: 'Inter, "Helvetica Neue", Arial, sans-serif',
    fontWeight: 300
  },
  dataset: {
    dimensions: ['Product', '2015', '2016', '2017'],
    source: [
      {
        Product: 'Matcha Latte',
        2015: random(),
        2016: random(),
        2017: random()
      },
      {
        Product: 'Milk Tea',
        2015: random(),
        2016: random(),
        2017: random()
      },
      {
        Product: 'Cheese Cocoa',
        2015: random(),
        2016: random(),
        2017: random()
      },
      {
        Product: 'Walnut Brownie',
        2015: random(),
        2016: random(),
        2017: random()
      }
    ]
  },
  xAxis: { type: 'category' },
  yAxis: {},
  // Declare several bar series, each will be mapped
  // to a column of dataset.source by default.
  series: [{ type: 'bar' }, { type: 'bar' }, { type: 'bar' }]
};

let timer = null;

onBeforeUnmount(() => {
  clearInterval(timer);
});

function tick() {
  seconds.value--;

  if (seconds.value === 0) {
    clearInterval(timer);
    loading.value = false;
    option.value = {
      textStyle: {
        fontFamily: 'Inter, "Helvetica Neue", Arial, sans-serif',
        fontWeight: 300
      },
      dataset: {
        dimensions: ['Product', '2015', '2016', '2017'],
        source: [
          {
            Product: 'Matcha Latte',
            2015: random(),
            2016: random(),
            2017: random()
          },
          {
            Product: 'Milk Tea',
            2015: random(),
            2016: random(),
            2017: random()
          },
          {
            Product: 'Cheese Cocoa',
            2015: random(),
            2016: random(),
            2017: random()
          },
          {
            Product: 'Walnut Brownie',
            2015: random(),
            2016: random(),
            2017: random()
          }
        ]
      },
      xAxis: { type: 'category' },
      yAxis: {},
      // Declare several bar series, each will be mapped
      // to a column of dataset.source by default.
      series: [{ type: 'bar' }, { type: 'bar' }, { type: 'bar' }]
    };
  }
}

function refresh() {
  // simulating async data from server
  seconds.value = 3;
  loading.value = true;

  timer = setInterval(tick, 1000);
}
</script>

<template>
  <!-- theme="ovilia-green" -->
  <v-chart :option="option" autoresize :loading="loading" :loadingOptions="loadingOptions" />
</template>
