import './assets/main.scss';

import { createApp } from 'vue';
import { createPinia } from 'pinia';
import APIService from '@/services/api';

import App from '@/App.vue';
import router from '@/router';
import vuetify from '@/plugins/vuetify';
// import i18n from './plugins/i18n'
import Vue3Toasity, { type ToastContainerOptions } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';
import VueApexCharts from 'vue3-apexcharts';
import { VueDraggableNext } from 'vue-draggable-next';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.provide('API', APIService);
app.use(Vue3Toasity, {
  dangerouslyHTMLString: true,
  autoClose: 6000,
  rtl: true
} as ToastContainerOptions);
app.use(vuetify);
app.use(VueApexCharts);
app.component('draggable', VueDraggableNext);

// app.use(i18n)
app.mount('#app');
