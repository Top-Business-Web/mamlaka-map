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
    complaintTypeId: null
})

const emit = defineEmits(['showDetails'])

const complaintsPeriority = ref("")
const complaintsPeriorityColor = ref("")
function getPeriority() {
    if (props.periority && props.periority == "high") {
        searchQuery.value.priority = "high"
        complaintsPeriority.value = "العالية";
        complaintsPeriorityColor.value = "#C05E5E";
        return
    }
    if (props.periority && props.periority == "mid") {
        searchQuery.value.priority = "mid"
        complaintsPeriority.value = "المتوسطة";
        complaintsPeriorityColor.value = "#B49164";
        return
    }
    if (props.periority && props.periority == "low") {
        searchQuery.value.priority = "low"
        complaintsPeriority.value = "المنخفضة";
        complaintsPeriorityColor.value = "#35685F";
        return
    }
    searchQuery.value.priority = null
    complaintsPeriority.value = null;
    complaintsPeriorityColor.value = "#B49164";
    return
};
const isLoading = ref(false)
const complaints = ref([]);
const searchQuery = ref({
    notice_type_id: props.complaintTypeId,
    priority: null,
    status: null,
})

async function getComplaints(target = allComplaints, status = null) {
    toggleActive(target)
    getPeriority();
    searchQuery.value.status = status
    try {
        isLoading.value = true
        const params = Object.fromEntries(
            Object.entries(searchQuery.value).filter(([_, v]) => v)
        );
        const res = await http.get("v1/map/getNotice", { params })
        complaints.value = res.data.data;
    } catch (error) {
        console.log(error);
    } finally {
        isLoading.value = false
    }
}

function toggleActive(button) {
    Object.values(buttons_wrapper.children).map(button => button.classList.remove("active"))
    button.classList.add("active")
}

const selectedComplaint = ref()

onMounted(getComplaints)

</script>

<template>
    <v-dialog max-width="75rem" height="calc(100vh - 48px)">
        <template v-slot:default="{ isActive }">
            <v-card class="modal_card">
                <v-card-title class="card_title">
                    <div class="text">
                        <div class="complaints_count" :style="{ 'background-color': complaintsPeriorityColor }">{{
                            complaints.length }}</div>
                        <h2 v-if="props.periority" class="text-h6 m-0 font-weight-bold">البلاغات ذات الأهمية {{
                            complaintsPeriority }}</h2>
                        <h2 v-else class="text-h6 m-0 font-weight-bold">جميع البلاغات</h2>
                    </div>
                    <v-btn color="#303030" @click="isActive.value = false">
                        <div class="d-flex align-items-center ga-1">
                            <v-icon color="white" icon="mdi-close"></v-icon> إغلاق
                        </div>
                    </v-btn>
                </v-card-title>
                <v-card-text class="pt-0">
                    <div class="card_body">
                        <div class="data_table_wrapper">
                            <div id="buttons_wrapper">
                                <button id="allComplaints" @click="getComplaints($event.target)">جميع البلاغات</button>
                                <button @click="getComplaints($event.target, '0')">البلاغات المفتوحة</button>
                                <button @click="getComplaints($event.target, '1')">البلاغات المقفولة</button>
                            </div>
                            <DataTable :alwaysShowPaginator="false" paginator :rows="20"
                                :rowsPerPageOptions="[5, 10, 20, 50]" :value="complaints" selectionMode="single"
                                :loading="isLoading" @rowSelect="emit('showDetails', selectedComplaint.id)"
                                v-model:selection="selectedComplaint">
                                <template #empty>
                                    <p class="text-center">
                                        لا يوجد بيانات
                                    </p>
                                </template>
                                <Column field="title" header="اسم البلاغ">
                                    <template #body="slotProps">
                                        <div class="d-flex align-items-center ga-2">
                                            <v-icon icon="mdi-information-outline" class="icon"></v-icon>
                                            <span>{{ slotProps.data.title }}</span>
                                        </div>
                                    </template>
                                </Column>
                                <Column field="user" header="مرسل البلاغ">
                                    <template #body="slotProps">
                                        <div class="reporter_info">
                                            <div class="avatar">
                                                <img :src="avataImg" alt="">
                                            </div>
                                            <span>{{ slotProps.data.user }}</span>
                                        </div>
                                    </template>
                                </Column>
                                <Column v-if="!periority" field="status" header="أهمية البلاغ">
                                    <template #body="slotProps">
                                        <span v-if="slotProps.data.priority == 'low'" class="complaint_status"
                                            style="background-color: #35685F20;color: #35685F;">{{
                                                slotProps.data.priority_name
                                            }}
                                        </span>
                                        <span v-if="slotProps.data.priority == 'mid'" class="complaint_status"
                                            style="background-color: #C4AB7920;color: #C4AB79;">{{
                                                slotProps.data.priority_name
                                            }}
                                        </span>
                                        <span v-if="slotProps.data.priority == 'high'" class="complaint_status"
                                            style="background-color: #C05E5E20;color: #C05E5E;">{{
                                                slotProps.data.priority_name
                                            }}
                                        </span>
                                    </template>
                                </Column>
                                <Column field="status" header="حالة البلاغ">
                                    <template #body="slotProps">
                                        <span class="complaint_status"
                                            :style="{ 'background-color': slotProps.data.status_name == 'مفتوحه' ? '#EBF0EF' : '#FFF0F0', 'color': slotProps.data.status_name == 'مفتوحه' ? '#35685F' : '#C05E5E' }">
                                            {{ slotProps.data.status_name }}</span>
                                    </template>
                                </Column>
                                <Column field="date" header="تاريخ الإرسال"></Column>
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

span {
    color: #fff;
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

.card_title .complaints_count {
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

.data_table_wrapper * {
    color: #fff;
}


.data_table_wrapper #buttons_wrapper {
    display: flex;
    align-items: center;
    /* margin-bottom: 15px; */
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

.data_table_wrapper .complaint_status {
    width: fit-content;
    padding: 7px 15px;
    border-radius: 5px;
    font-weight: 500;
}
</style>