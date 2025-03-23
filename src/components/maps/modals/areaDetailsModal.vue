<script setup>
import idIcon from "@/assets/imgs/icons/number.svg"
import phoneIcon from "@/assets/imgs/icons/phone.svg"
import roleIcon from "@/assets/imgs/icons/user.svg"
import locationIcon from "@/assets/imgs/icons/location.svg"
import markerIcon from "@/assets/imgs/icons/marker.svg"
import searchIcon from "@/assets/imgs/icons/search.svg"
import stationMarker from "@/assets/imgs/markers-icons/station.svg";
import carStationMarker from "@/assets/imgs/markers-icons/car-station.svg";
import busMarker from "@/assets/imgs/markers-icons/bus-station.svg";
import highwayMarker from "@/assets/imgs/markers-icons/highway.svg";
import trainMarker from "@/assets/imgs/markers-icons/train.svg";
import pattern from "@/assets/imgs/pattern.svg"
import { computed, onMounted } from "vue"
import axios from "axios"
import UserDetailsModal from "./userDetailsModal.vue"
import SupervisorDetailsModal from "./supervisorDetailsModal.vue"
import http from "@/plugins/axios"

const props = defineProps({
    markerId: null
})

const emit = defineEmits(['supervisorShowHandler', 'userShowHandler'])

const searchInput = ref("")
const isLoading = ref(false)
const areaId = ref(props.markerId)
const areaDetails = ref(null)
const headers = [
    { title: 'الاسم', key: 'name' },
    { title: 'رقم الهوية', key: 'national_id' },
    { title: 'رقم الجوال', key: 'phone' },
    { title: 'الدور', key: 'role' },
    { title: 'حالة الحضور', key: 'attendance_status' },
    { title: 'وقت الحضور', key: 'attendance_time' },
]
const team = ref([]);


async function getAreaDetails() {
    try {
        isLoading.value = true
        const res = await http.get(`v1/map/getAreaDetails/${areaId.value}`)
        areaDetails.value = res.data.data
        team.value = areaDetails.value.users
    } catch (error) {
        console.log(error);
    } finally {
        isLoading.value = false
    }
}

function employeeShowHandler(employee) {
    if (employee.role == "مشرف") {
        emit("supervisorShowHandler", employee.id)
    } else {
        emit("userShowHandler", employee.id)
    }
}

onMounted(getAreaDetails)

</script>

<template>
    <v-dialog v-if="areaDetails || isLoading" max-width="75rem" height="calc(100vh - 48px)">
        <template v-slot:default="{ isActive }">
            <v-card class="modal_card">
                <v-card-title class="d-flex align-center justify-space-between text-h6 py-3">
                    <h2 class="text-h6 m-0 font-weight-bold">معلومات الموقع</h2>
                    <v-btn color="#303030" @click="isActive.value = false">
                        <div class="d-flex align-items-center ga-1">
                            <v-icon color="white" icon="mdi-close"></v-icon> إغلاق
                        </div>
                    </v-btn>
                </v-card-title>
                <hr class="mt-0">
                <v-card-text>
                    <div class="card_body">
                        <div class="box">
                            <div class="box_header">
                                <v-skeleton-loader v-if="isLoading" width="1.2rem" height="1.2rem"></v-skeleton-loader>
                                <div v-else class="area_icon">
                                    <img v-if="areaDetails.type == '0'" :src="carStationMarker" alt="">
                                    <img v-if="areaDetails.type == '1'" :src="busMarker" alt="">
                                    <img v-if="areaDetails.type == '2'" :src="trainMarker" alt="">
                                    <img v-if="areaDetails.type == '3'" :src="highwayMarker" alt="">
                                    <img v-if="areaDetails.type == '4'" :src="stationMarker" alt="">
                                </div>
                                <v-skeleton-loader v-if="isLoading" width="200px" height="1.2rem"></v-skeleton-loader>
                                <div v-else class="name">
                                    {{ areaDetails.name }}
                                </div>
                            </div>
                            <hr>
                            <div class="details_wrapper">
                                <div class="icon_box">
                                    <div class="icon">
                                        <img :src="idIcon" alt="">
                                    </div>
                                    <div class="info">
                                        <label>رقم التصريح</label>
                                        <p v-if="isLoading" class="mt-2">
                                            <v-skeleton-loader width="200px" height="1.2rem"></v-skeleton-loader>
                                        </p>
                                        <p v-else class="mt-2">-</p>
                                    </div>
                                </div>
                                <div class="icon_box">
                                    <div class="icon">
                                        <img :src="locationIcon" alt="">
                                    </div>
                                    <div class="info">
                                        <label>الحي</label>
                                        <p v-if="isLoading" class="mt-2">
                                            <v-skeleton-loader width="200px" height="1.2rem"></v-skeleton-loader>
                                        </p>
                                        <p v-else class="mt-2">-</p>
                                    </div>
                                </div>
                                <div class="icon_box">
                                    <div class="icon">
                                        <img :src="markerIcon" alt="">
                                    </div>
                                    <div class="info">
                                        <label>العنوان</label>
                                        <p v-if="isLoading" class="mt-2">
                                            <v-skeleton-loader width="200px" height="1.2rem"></v-skeleton-loader>
                                        </p>
                                        <p v-else class="mt-2">-</p>
                                    </div>
                                </div>
                                <div class="icon_box">
                                    <div class="icon">
                                        <img :src="roleIcon" alt="">
                                    </div>
                                    <div class="info">
                                        <label>اسم المشرف</label>
                                        <p v-if="isLoading" class="mt-2">
                                            <v-skeleton-loader width="200px" height="1.2rem"></v-skeleton-loader>
                                        </p>
                                        <div v-else class="area_leader_info mt-2">
                                            <div class="avatar">
                                                <img :src="areaDetails.image" alt="">
                                            </div>
                                            <p style="cursor: pointer;"
                                                @click="emit('supervisorShowHandler', areaDetails.id)">
                                                {{ areaDetails.leader }}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="team_box">
                            <div class="box_header">
                                <h2 class="text-h6 d-flex align-items-center ga-3 m-0 font-weight-bold">الموظفين</h2>
                                <div class="input_wrapper search_wrapper">
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

.box_header .area_icon {
    width: 35px;
    height: 35px;
    border-radius: 5px;
    overflow: hidden;
}

.box_header .area_icon img {
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
    font-size: 18px;
}

.icon_box .info label {
    color: #9EA3A5;
    font-weight: 500;
    margin-top: 2px;
}


.icon_box .area_leader_info {
    display: flex;
    align-items: center;
    gap: 15px;
}

.icon_box .area_leader_info .avatar {
    flex: 0 0 50px;
    height: 50px;
    background-color: #383838;
    border-radius: 5px;
    overflow: hidden;
}

.avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.team_box .box_header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 15px;
}

.team_box .box_header span {
    font-weight: bold;
    color: #C4AB79;
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
