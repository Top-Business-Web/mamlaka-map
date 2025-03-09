<script setup>
import idIcon from "@/assets/imgs/icons/number.svg"
import phoneIcon from "@/assets/imgs/icons/phone.svg"
import roleIcon from "@/assets/imgs/icons/user.svg"
import displayIcon from "@/assets/imgs/icons/display.svg"
import locationIcon from "@/assets/imgs/icons/location.svg"
import searchIcon from "@/assets/imgs/icons/search.svg"
import pattern from "@/assets/imgs/pattern.svg"
import { computed, onMounted } from "vue"
import axios from "axios"
import http from "@/plugins/axios"

const props = defineProps({
    markerId: null
})

const emit = defineEmits(['reportShowHandler'])

const searchInput = ref("")
const isLoading = ref(false)
const userId = ref(props.markerId)
const userDetails = ref(null)
const headers = [
    { title: 'عنوان التقرير', key: 'title' },
    { title: 'الموظف', key: 'user' },
    { title: 'المشرف', key: 'supervisor' },
    { title: 'تاريخ التقرير', key: 'date' },
    { title: 'حالة التقرير', key: 'status' },
    { title: '', key: 'action' },
]
const reports = ref([]);

async function getUserDetails() {
    try {
        isLoading.value = true
        const res = await http.get(`v1/map/getUserDetails/${userId.value}`)
        userDetails.value = res.data.data
        reports.value = userDetails.value.daily_reports
    } catch (error) {
        console.log(error);
    } finally {
        isLoading.value = false
    }
}

onMounted(getUserDetails)

</script>

<template>
    <v-dialog v-if="userDetails || isLoading" max-width="75rem" height="calc(100vh - 48px)">
        <template v-slot:default="{ isActive }">
            <v-card class="modal_card">
                <v-card-title class="d-flex align-center justify-space-between text-h6 py-3">
                    <h2 class="text-h6 m-0 font-weight-bold">معلومات الموظف</h2>
                    <v-btn color="#666666" icon variant="text" @click="isActive.value = false">
                        <v-icon icon="mdi-close"></v-icon>
                    </v-btn>
                </v-card-title>
                <hr class="mt-0">
                <v-card-text>
                    <div class="card_body">
                        <div class="box">
                            <div class="box_header">

                                <div class="avatar">
                                    <v-skeleton-loader v-if="isLoading" width="100%" height="100%"></v-skeleton-loader>
                                    <img v-else :src="userDetails.user.image" alt="">
                                </div>
                                <v-skeleton-loader v-if="isLoading" width="200px" height="1.2rem"></v-skeleton-loader>
                                <div v-else class="name">
                                    {{ userDetails.user.full_name }}
                                </div>
                            </div>
                            <hr>
                            <div class="details_wrapper">
                                <div class="icon_box">
                                    <div class="icon">
                                        <img :src="idIcon" alt="">
                                    </div>
                                    <div class="info">
                                        <label>رقم الهوية</label>
                                        <p v-if="isLoading" class="mt-2">
                                            <v-skeleton-loader width="200px" height="1.2rem"></v-skeleton-loader>
                                        </p>
                                        <p v-else class="mt-2">{{ userDetails.user.national_id }}</p>
                                    </div>
                                </div>
                                <div class="icon_box">
                                    <div class="icon">
                                        <img :src="phoneIcon" alt="">
                                    </div>
                                    <div class="info">
                                        <label>رقم الجوال</label>
                                        <p v-if="isLoading" class="mt-2">
                                            <v-skeleton-loader width="200px" height="1.2rem"></v-skeleton-loader>
                                        </p>
                                        <p v-else class="mt-2">{{ userDetails.user.phone }}</p>
                                    </div>
                                </div>
                                <div class="icon_box">
                                    <div class="icon">
                                        <img :src="roleIcon" alt="">
                                    </div>
                                    <div class="info">
                                        <label>الدور</label>
                                        <p v-if="isLoading" class="mt-2">
                                            <v-skeleton-loader width="200px" height="1.2rem"></v-skeleton-loader>
                                        </p>
                                        <p v-else class="mt-2">{{ userDetails.user.role }}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="stats_box">
                            <div class="stats_wrapper">
                                <div class="stat">
                                    <v-skeleton-loader v-if="isLoading" width="100px" height="1.2rem"
                                        style="margin:14px 0"></v-skeleton-loader>
                                    <p v-else>{{ userDetails.complete_daily_reports_count }}</p>
                                    <label>عدد التقارير اليومية المنجزة</label>
                                </div>
                                <div class="stat">
                                    <v-skeleton-loader v-if="isLoading" width="100px" height="1.2rem"
                                        style="margin:14px 0"></v-skeleton-loader>
                                    <p v-else>{{ userDetails.reports_count }}</p>
                                    <label>عدد المخالفات المسجلة</label>
                                </div>
                                <div class="stat">
                                    <v-skeleton-loader v-if="isLoading" width="100px" height="1.2rem"
                                        style="margin:14px 0"></v-skeleton-loader>
                                    <p v-else>{{ userDetails.notice_count }}</p>
                                    <label>عدد البلاغات المرسلة</label>
                                </div>
                                <div class="stat">
                                    <v-skeleton-loader v-if="isLoading" width="100px" height="1.2rem"
                                        style="margin:14px 0"></v-skeleton-loader>
                                    <p v-else>{{ userDetails.attendance_percentage }}%</p>
                                    <label>نسبة حضوره</label>
                                </div>
                                <div class="stat">
                                    <v-skeleton-loader v-if="isLoading" width="100px" height="1.2rem"
                                        style="margin:14px 0"></v-skeleton-loader>
                                    <p v-else>{{ userDetails.absence_percentage }}%</p>
                                    <label>نسبة غيابه</label>
                                </div>
                            </div>
                            <div class="pattern" :style="`background-image: url(${pattern})`"></div>
                        </div>
                        <div class="reports_box">
                            <div class="box_header">
                                <h2 class="text-h6 m-0 font-weight-bold">التقارير اليومية</h2>
                                <div class="input_wrapper">
                                    <img :src="searchIcon" alt="">
                                    <input type="text" v-model="searchInput" placeholder="البحث">
                                </div>
                            </div>
                            <div class="data_table_wrapper">
                                <v-data-table-virtual :headers="headers" :items="reports" :search="searchInput"
                                    :loading="isLoading" item-value="name" fixed-header style="background: transparent"
                                    no-data-text="لا توجد بيانات">
                                    <template v-slot:headers="{ columns, isSorted, getSortIcon, toggleSort }">
                                        <tr>
                                            <template v-for="column in columns" :key="column.key">
                                                <th>
                                                    <div class="d-flex">
                                                        <span class="cursor-pointer" @click="toggleSort(column)"
                                                            v-text="column.title"></span>

                                                        <v-icon v-if="isSorted(column)" :icon="getSortIcon(column)"
                                                            color="medium-emphasis"></v-icon>

                                                        <v-icon v-if="column.removable" color="medium-emphasis"
                                                            icon="$close" @click="remove(column.key)"></v-icon>
                                                    </div>
                                                </th>
                                            </template>
                                        </tr>
                                    </template>
                                    <template v-slot:item="{ item }">
                                        <tr @click="emit('reportShowHandler', item.id, userDetails.user.id)">
                                            <td>
                                                <div class="report_info">
                                                    <div class="avatar">
                                                        <img :src="displayIcon" alt="">
                                                    </div>
                                                    <p>{{ item.title }}</p>
                                                </div>
                                            </td>
                                            <td>
                                                <div class="user_info">
                                                    <div class="avatar">
                                                        <img :src="item.user_image" alt="">
                                                    </div>
                                                    <p>{{ item.user_name }}</p>
                                                </div>
                                            </td>
                                            <td>
                                                <div class="user_info">
                                                    <div class="avatar">
                                                        <img :src="item.leader_image" alt="">
                                                    </div>
                                                    <p>{{ item.leader_name }}</p>
                                                </div>
                                            </td>
                                            <td>
                                                <p>{{ item.date }}</p>
                                            </td>
                                            <td>
                                                <p>{{ item.status_name }}</p>
                                            </td>
                                            <td>
                                                <button class="show_report_btn">عرض</button>
                                            </td>
                                        </tr>
                                    </template>
                                </v-data-table-virtual>
                            </div>
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

.box_header {
    display: flex;
    align-items: center;
    gap: 15px;
}

.box_header .avatar {
    width: 60px;
    height: 60px;
    border-radius: 5px;
    background-color: #383838;
    overflow: hidden;
}

.box_header .avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.box_header .name {
    font-weight: bold;
    font-size: 18px;
}

.details_wrapper {
    display: flex;
    align-items: stretch;
    gap: 50px;
}

.icon_box {
    flex: 1 1 300px;
    display: flex;
    align-items: flex-start;
    gap: 10px;
}

.icon_box .icon {
    width: 20px;
    height: 20px;
}

.icon_box .info {
    font-size: 14px;
}

.icon_box .info label {
    color: #9EA3A5;
    font-weight: 500;
    margin-top: 2px;
}

.stats_box {
    padding: 30px;
    border-radius: 10px;
    font-size: 14px;
    color: #9EA3A5;
    border: 1px solid #303030;
    overflow: hidden;
}

.stats_box .stats_wrapper {
    display: flex;
    align-items: center;
    gap: 30px;
}

.stats_box .stats_wrapper .stat+.stat {
    flex: 1;
    border-right: 1px solid;
    padding-right: 30px;
}

.stats_box .stats_wrapper .stat p {
    color: #857854;
    font-size: 28px;
    font-weight: 500;
}

.stats_box .pattern {
    background-repeat: space;
    height: 80px;
    margin: 30px -30px -30px;
}

.reports_box .box_header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 30px;
}

.reports_box .box_header span {
    font-weight: bold;
    color: #857854;
}

.reports_box .box_header .input_wrapper {
    position: relative;
}

.reports_box .box_header .input_wrapper img {
    content: attr(data-icon);
    position: absolute;
    top: 50%;
    right: 10px;
    transform: translateY(-50%);
    width: 20px;
    height: 20px
}

.reports_box .box_header .input_wrapper input {
    background-color: #303030;
    border-radius: 10px;
    padding: 10px;
    font-weight: 500;
    padding-inline-start: 40px;
    outline: none !important;
}

.reports_box .data_table_wrapper {
    margin-top: 15px;
}

.reports_box .data_table_wrapper tr {
    background: #383838;
}

.reports_box .data_table_wrapper tr:not(tr:has(th)) {
    cursor: pointer;
    transition: 0.15s;
}

.reports_box .data_table_wrapper tr:not(tr:has(th)):hover {
    background: rgba(255, 255, 255, 0.05);
}

.reports_box .data_table_wrapper td,
.reports_box .data_table_wrapper th {
    padding: 20px;
    background: transparent !important;
}

.reports_box .data_table_wrapper th {
    color: #9EA3A5;
    white-space: nowrap;
}


.reports_box .data_table_wrapper td *,
.reports_box .data_table_wrapper th * {
    font-weight: 500;
}

.reports_box .data_table_wrapper .report_info,
.reports_box .data_table_wrapper .user_info {
    display: flex;
    align-items: center;
    gap: 15px;
}

.reports_box .data_table_wrapper .user_info p {
    white-space: nowrap;
}


.reports_box .data_table_wrapper .user_info .avatar {
    flex: 0 0 50px;
    background-color: #303030;
    border-radius: 5px;
    width: 50px;
    aspect-ratio: 1;
    overflow: hidden;
}

.reports_box .data_table_wrapper .report_info .avatar {
    flex: 0 0 75px;
    display: flex;
    align-items: center;
    justify-content: center;
    aspect-ratio: 2.5/3;
    margin: -20px -20px -20px 0;
    background-color: #4a4b4e;
    border-radius: 0 5px 5px 0;
    overflow: hidden;
}

.reports_box .data_table_wrapper .report_info .avatar img {
    width: 20px;
    margin: auto;
}

.reports_box .data_table_wrapper .user_info img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.reports_box .data_table_wrapper .user_info .name {
    display: flex;
    flex-direction: column;
}

.reports_box .data_table_wrapper .user_info .name small {
    color: #9EA3A5;
}

.reports_box .data_table_wrapper .show_report_btn {
    background: #303030;
    padding: 7px 25px;
    border-radius: 10px;
}
</style>
