<script setup>
import idIcon from "@/assets/imgs/icons/number.svg"
import phoneIcon from "@/assets/imgs/icons/phone.svg"
import roleIcon from "@/assets/imgs/icons/user.svg"
import displayIcon from "@/assets/imgs/icons/display.svg"
import locationIcon from "@/assets/imgs/icons/location.svg"
import searchIcon from "@/assets/imgs/icons/search.svg"
import pattern from "@/assets/imgs/pattern.svg"
import avataImg from "@/assets/imgs/image1.png";
import { computed, onMounted, shallowRef } from "vue"
import axios from "axios"
import http from "@/plugins/axios"

import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import ColumnGroup from 'primevue/columngroup';   // optional
import Row from 'primevue/row';
import Paginator from "primevue/paginator"

import Tabs from 'primevue/tabs';
import TabList from 'primevue/tablist';
import Tab from 'primevue/tab';
import TabPanels from 'primevue/tabpanels';
import TabPanel from 'primevue/tabpanel';

const props = defineProps({
    periority: null,
    status: null
})

const emit = defineEmits(['showDetails'])

const alertsPeriority = ref("")
const alertsPeriorityColor = ref("")
function getPeriority() {
    if (props.periority == "high") {
        searchQuery.value.priority = "high"
        alertsPeriority.value = "العالية";
        alertsPeriorityColor.value = "#C05E5E";
        return
    }
    if (props.periority == "mid") {
        searchQuery.value.priority = "mid"
        alertsPeriority.value = "المتوسطة";
        alertsPeriorityColor.value = "#B49164";
        return
    }
    if (props.periority == "low") {
        searchQuery.value.priority = "low"
        alertsPeriority.value = "المنخفضة";
        alertsPeriorityColor.value = "#35685F";
        return
    }
};
const isLoading = ref(false)
const alerts = ref([]);
const searchQuery = ref({
    priority: props.periority,
    seen: props.status,
})

async function getAlerts(status = null) {
    getPeriority();
    searchQuery.value.status = status
    try {
        isLoading.value = true
        const params = Object.fromEntries(
            Object.entries(searchQuery.value).filter(([_, v]) => v)
        );
        const res = await http.get("v1/map/getAlerts", { params })
        alerts.value = res.data.data;
    } catch (error) {
        console.log(error);
    } finally {
        isLoading.value = false
    }
}

onMounted(getAlerts)

</script>

<template>
    <v-dialog max-width="75rem" height="calc(100vh - 48px)">
        <template v-slot:default="{ isActive }">
            <v-card class="modal_card">
                <v-card-title class="card_title">
                    <div class="text">
                        <div class="alerts_count" :style="{ 'background-color': alertsPeriorityColor }">
                            <p>{{ alerts.length }}</p>
                        </div>
                        <h2 class="text-h6 m-0 font-weight-bold">التنبيهات ذات الأهمية {{ alertsPeriority }}</h2>
                    </div>
                    <v-btn color="#303030" @click="isActive.value = false">
                        <div class="d-flex align-items-center ga-1">
                            <v-icon color="white" icon="mdi-close"></v-icon> إغلاق
                        </div>
                    </v-btn>
                </v-card-title>
                <v-card-text>
                    <div class="card_body">
                        <div class="data_table_wrapper">
                            <DataTable paginator :rows="5" :rowsPerPageOptions="[5, 10, 20, 50]" :value="alerts"
                                :loading="isLoading">
                                <Column field="title" header="اسم التنبيه">
                                    <template #body="slotProps">
                                        <div class="d-flex align-items-center ga-2">
                                            <v-icon icon="mdi-information-outline" class="icon"></v-icon>
                                            <p>{{ slotProps.data.title }}</p>
                                        </div>
                                    </template>
                                </Column>
                                <Column field="user" header="مرسل التنبيه">
                                    <template #body="slotProps">
                                        <div class="reporter_info">
                                            <div class="avatar">
                                                <img :src="avataImg" alt="">
                                            </div>
                                            <p>{{ slotProps.data.sender }}</p>
                                        </div>
                                    </template>
                                </Column>
                                <Column field="created_at" header="تاريخ الإرسال"></Column>
                            </DataTable>
                        </div>
                    </div>
                </v-card-text>
            </v-card>
        </template>
    </v-dialog>


</template>

<style scoped>
* {
    font-size: 14px;
    --p-highlight-background: red !important;
}

.card_title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 30px;
    padding: 25px;
}

.card_title .text {
    display: flex;
    align-items: center;
    gap: 10px
}

.card_title .alerts_count {
    padding: 3px 15px;
    border-radius: 5px;
    font-weight: bold
}

.card_body {
    display: flex;
    flex-direction: column;
    gap: 15px;
}

.modal_card {
    background-color: #383838;
    padding: 0;
}

.box {
    background-color: #303030;
    padding: 20px;
    border-radius: 10px;
}

.data_table_wrapper #buttons_wrapper {
    display: flex;
    align-items: center;
    margin-bottom: 15px;
    border-bottom: 1px solid #555;
}

.data_table_wrapper #buttons_wrapper>button {
    padding: 15px 30px;
    transition: 0.3s;
    box-shadow: inset 0 0 0 0#B49164;
}

.data_table_wrapper #buttons_wrapper>button:hover {
    box-shadow: inset 0 -2px 0 0#B49164;
}

.data_table_wrapper #buttons_wrapper>button.active {
    box-shadow: inset 0 -4px 0 0#B49164;
}

.data_table_wrapper .icon {
    color: #B49164;
    font-size: 20px
}

.data_table_wrapper .reporter_info {
    display: flex;
    align-items: center;
    gap: 15px;
}

.data_table_wrapper .reporter_info .avatar {
    width: 40px;
    height: 40px;
    border-radius: 5px;
    background-color: #383838;
    overflow: hidden;
}

.data_table_wrapper .reporter_info .avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.data_table_wrapper .alert_status {
    width: fit-content;
    padding: 7px 15px;
    border-radius: 5px;
    font-weight: 500;
}
</style>

<style>
.p-datatable .p-datatable-table {
    border-collapse: separate;
    border-spacing: 0 10px !important;
}

.p-datatable tr {
    background: none;
}

.p-datatable .p-datatable-header-cell {
    background-color: transparent;
    border: none;
}

.p-datatable .p-datatable-tbody tr td {
    background-color: #303030;
    border: none;
}

.p-datatable .p-datatable-tbody tr td:first-child {
    border-radius: 0 10px 10px 0;
}

.p-datatable .p-datatable-tbody tr td:last-child {
    border-radius: 10px 0 0 10px;
}

.p-datatable .p-datatable-paginator-bottom {
    border: none;
}

.p-datatable .p-paginator {
    background-color: transparent;
    width: 100%;
    padding: 0;
}

.p-paginator-content {
    width: 100%;
    justify-content: space-between;
}

.p-datatable .p-paginator-page {
    min-width: unset;
    width: 35px;
    height: auto;
    aspect-ratio: 1;
}

.p-datatable .p-paginator-page.p-paginator-page-selected {
    background-color: #C4AB79;
    border-radius: 10px;
}

.p-datatable .p-paginator-rpp-dropdown {
    background-color: #303030;
    border: none;
    order: -1;
    margin-inline-end: auto;
}

.p-datatable .p-select-dropdown svg {
    width: 12px;
}

.p-select-overlay {
    z-index: 9999 !important;
    width: fit-content;
    background-color: #303030 !important;
    border: none !important;
}

.p-select-option.p-select-option-selected {
    background-color: #C4AB79 !important;
}

.p-tabpanels,
.p-tablist-tab-list {
    background: none !important;
}

.p-tablist-tab-list .p-tab {
    color: #fff;
    border-bottom: none;
    /* border-bottom: 3px solid #C4AB79; */
}

.p-tablist-tab-list .p-tablist-active-bar {
    height: 4px;
    background-color: #C4AB79;
    left: 100%;
}
</style>
