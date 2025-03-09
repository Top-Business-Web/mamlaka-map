<script setup>
import idIcon from "@/assets/imgs/icons/number.svg"
import phoneIcon from "@/assets/imgs/icons/phone.svg"
import roleIcon from "@/assets/imgs/icons/user.svg"
import locationIcon from "@/assets/imgs/icons/location.svg"
import searchIcon from "@/assets/imgs/icons/search.svg"
import pattern from "@/assets/imgs/pattern.svg"
import { computed, onMounted } from "vue"
import axios from "axios"
import http from "@/plugins/axios"

const props = defineProps({
    markerId: null
})
const emit = defineEmits(['userShowHandler'])

const searchInput = ref("")
const isLoading = ref(false)
const supervisorId = ref(props.markerId)
const supervisorDetails = ref(null)
const headers = [
    { title: 'الاسم', key: 'name' },
    { title: 'رقم الهوية', key: 'national_id' },
    { title: 'رقم الجوال', key: 'phone' },
    { title: 'الدور', key: 'role' },
    { title: 'المنطقة', key: 'region' },
    { title: 'حالة الحضور', key: 'attendance_status' },
    { title: 'وقت الحضور', key: 'attendance_time' },
]
const team = ref([]);

async function getSupervisorDetails() {
    try {
        isLoading.value = true
        const res = await http.get(`v1/map/getLeaderDetails/${supervisorId.value}`)
        supervisorDetails.value = res.data.data
        team.value = supervisorDetails.value.leader_team
    } catch (error) {
        console.log(error);
    } finally {
        isLoading.value = false
    }
}

function employeeShowHandler(employee) {
    if (employee.role == "مشرف") {
        supervisorId.value = employee.id
        getSupervisorDetails(employee.id)
    } else {
        emit("userShowHandler", employee.id)
    }
}

onMounted(getSupervisorDetails)

</script>

<template>
    <v-dialog v-if="supervisorDetails || isLoading" max-width="75rem" height="calc(100vh - 48px)">
        <template v-slot:default="{ isActive }">
            <v-card class="modal_card">
                <v-card-title class="d-flex align-center justify-space-between text-h6 py-3">
                    <h2 class="text-h6 m-0 font-weight-bold">معلومات المشرف</h2>
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
                                    <img v-else :src="supervisorDetails.image" alt="">
                                </div>
                                <v-skeleton-loader v-if="isLoading" width="200px" height="1.2rem"></v-skeleton-loader>
                                <div v-else class="name">
                                    {{ supervisorDetails.name }}
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
                                        <p v-else class="mt-2">{{ supervisorDetails.national_id }}</p>
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
                                        <p v-else class="mt-2">{{ supervisorDetails.phone }}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="stats_box">
                            <div class="stats_wrapper">
                                <div class="stat">
                                    <v-skeleton-loader v-if="isLoading" width="100px" height="1.2rem"
                                        style="margin:14px 0"></v-skeleton-loader>
                                    <p v-else>{{ supervisorDetails.complete_daily_reports_count }}</p>
                                    <label>عدد التقارير اليومية المعتمدة</label>
                                </div>
                                <div class="stat">
                                    <v-skeleton-loader v-if="isLoading" width="100px" height="1.2rem"
                                        style="margin:14px 0"></v-skeleton-loader>
                                    <p v-else>{{ supervisorDetails.refused_daily_reports_count }}</p>
                                    <label>عدد التقارير اليومية المرفوضة</label>
                                </div>
                                <div class="stat">
                                    <v-skeleton-loader v-if="isLoading" width="100px" height="1.2rem"
                                        style="margin:14px 0"></v-skeleton-loader>
                                    <p v-else>{{ supervisorDetails.notice_count }}</p>
                                    <label>عدد المخالفات المسجلة</label>
                                </div>
                                <div class="stat">
                                    <v-skeleton-loader v-if="isLoading" width="100px" height="1.2rem"
                                        style="margin:14px 0"></v-skeleton-loader>
                                    <p v-else>{{ supervisorDetails.reports_count }}</p>
                                    <label>عدد التقارير الإدارية المرفوعة</label>
                                </div>
                            </div>
                            <div class="pattern" :style="`background-image: url(${pattern})`"></div>
                        </div>
                        <div class="team_box">
                            <div class="box_header">
                                <h2 class="text-h6 d-flex align-items-center ga-3 m-0 font-weight-bold">فريق العمل
                                    الميداني
                                    <v-skeleton-loader v-if="isLoading" width="30px" height="1.2rem"
                                        style="display: inline;"></v-skeleton-loader>
                                    <span class="text-h6" v-else>({{ supervisorDetails.leader_team.length }})</span>
                                </h2>
                                <div class="input_wrapper">
                                    <img :src="searchIcon" alt="">
                                    <input type="text" v-model="searchInput" placeholder="البحث">
                                </div>
                            </div>
                            <div class="data_table_wrapper">
                                <v-data-table-virtual :headers="headers" :items="team" :search="searchInput"
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
                                        <tr @click="employeeShowHandler(item)">
                                            <td>
                                                <div class="user_info">
                                                    <div class="avatar">
                                                        <img :src="item.image" alt="">
                                                    </div>
                                                    <p>{{ item.full_name }}</p>
                                                </div>
                                            </td>
                                            <td>
                                                <p>{{ item.national_id }}</p>
                                            </td>
                                            <td>
                                                <p>{{ item.phone }}</p>
                                            </td>
                                            <td>
                                                <p>{{ item.role }}</p>
                                            </td>
                                            <td>
                                                <p>{{ item.area }}</p>
                                            </td>
                                            <td>
                                                <p class="attend_status" v-if="item.is_attendance_today">حضر</p>
                                                <p class="abscent_status" v-else="item.is_attendance_today">غياب</p>
                                            </td>
                                            <td>
                                                <p>{{ item.attendance_time }}</p>
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


.icon_box .info label {
    color: #9EA3A5;
    font-weight: 500;
    margin-top: 2px;
}

.stats_box {
    padding: 15px;
    border-radius: 10px;
    color: #9EA3A5;
    border: 1px solid #303030;
    overflow: hidden;
}

.stats_box .stats_wrapper {
    display: flex;
    align-items: center;
    gap: 15px;
}

.stats_box .stats_wrapper .stat {
    flex: 1;
}

.stats_box .stats_wrapper .stat+.stat {
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

.team_box .box_header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 30px;
}

.team_box .box_header span {
    font-weight: bold;
    color: #857854;
}

.team_box .box_header .input_wrapper {
    position: relative;
}

.team_box .box_header .input_wrapper img {
    content: attr(data-icon);
    position: absolute;
    top: 50%;
    right: 10px;
    transform: translateY(-50%);
    width: 20px;
    height: 20px
}

.team_box .box_header .input_wrapper input {

    background-color: #303030;
    border-radius: 10px;
    padding: 10px;
    font-weight: 500;
    padding-inline-start: 40px;
    outline: none !important;
}

.team_box .data_table_wrapper {
    margin-top: 15px;
}

.team_box .data_table_wrapper tr {
    background: #383838;
}

.team_box .data_table_wrapper tr:not(tr:has(th)) {
    cursor: pointer;
    transition: 0.15s;
}

.team_box .data_table_wrapper tr:not(tr:has(th)):hover {
    background: rgba(255, 255, 255, 0.05);
}

.team_box .data_table_wrapper td,
.team_box .data_table_wrapper th {
    padding: 20px;
    background: transparent !important;
}

.team_box .data_table_wrapper th {
    color: #9EA3A5;
    white-space: nowrap;
}


.team_box .data_table_wrapper td *,
.team_box .data_table_wrapper th * {
    font-weight: 500;
}

.team_box .data_table_wrapper .user_info {
    display: flex;
    align-items: center;
    gap: 15px;
}


.team_box .data_table_wrapper .user_info .avatar {
    flex: 0 0 50px;
    background-color: #303030;
    border-radius: 5px;
    width: 50px;
    aspect-ratio: 1;
    overflow: hidden;
}

.team_box .data_table_wrapper .user_info img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.team_box .data_table_wrapper .user_info .name {
    display: flex;
    flex-direction: column;
}

.team_box .data_table_wrapper .user_info .name small {
    color: #9EA3A5;
}

.team_box .data_table_wrapper [class*="_status"] {
    width: fit-content;
    color: #17663A;
    background: #EEFBF4;
    padding: 5px 15px;
    border-radius: 10px;
    font-weight: bold;
    font-size: 12px;
}

.team_box .data_table_wrapper .abscent_status {
    color: #C05E5E;
    background: #FFF0F0;
}
</style>
