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
    markerId: null,
    userId: null,
})

const searchInput = ref("")
const isLoading = ref(false)
const reportId = ref(props.markerId)
const userId = ref(props.userId)
const reportDetails = ref(null)

async function getReportDetails() {
    try {
        isLoading.value = true
        // const res = await http.get(`v1/map/getDailyReportDetails/${reportId.value}?user_id=${userId.value}`)
        const res = await http.get(`v1/map/getDailyReportDetails/${45}?user_id=${55}`)
        reportDetails.value = res.data.data
    } catch (error) {
        console.log(error);
    } finally {
        isLoading.value = false
    }
}
onMounted(getReportDetails)

</script>

<template>
    <v-dialog v-if="reportDetails || isLoading" max-width="75rem" height="calc(100vh - 48px)">
        <template v-slot:default="{ isActive }">
            <v-card class="modal_card">
                <v-card-title class="d-flex align-center justify-space-between text-h6 py-3">
                    <div class="d-flex align-items-center ga-2">
                        <v-skeleton-loader v-if="isLoading" width="200px" height="1.2rem"></v-skeleton-loader>
                        <h2 v-else class="text-h6 m-0 font-weight-bold">
                            تقرير يومي {{ reportDetails.date }}
                        </h2>
                    </div>
                    <v-btn color="#303030" @click="isActive.value = false">
                        <div class="d-flex align-items-center ga-1">
                            <v-icon color="white" icon="mdi-close"></v-icon> إغلاق
                        </div>
                    </v-btn>
                </v-card-title>
                <hr class="mt-0">
                <v-card-text>
                    <div class="card_body">
                        <v-skeleton-loader v-if="isLoading" width="200px" height="1.2rem"></v-skeleton-loader>
                        <div v-else class="breadcrumb">
                            <b style="cursor: pointer;" @click="isActive.value = false">{{ reportDetails.user_name
                            }}</b><span>></span><span>عرض التقرير اليومي</span>
                        </div>
                        <div class="box">
                            <div class="box_header">
                                <h2 class="text-h6 d-flex align-items-center ga-3 m-0 font-weight-bold">وصف التقرير
                                    اليومي</h2>
                            </div>
                            <hr>
                            <div class="details_wrapper">
                                <v-skeleton-loader v-if="isLoading" width="100%" height="1.2rem"></v-skeleton-loader>
                                <p v-else> {{ reportDetails.description }}</p>
                            </div>
                        </div>
                        <div class="box">
                            <div class="box_header">
                                <h2 class="text-h6 d-flex align-items-center ga-3 m-0 font-weight-bold">الأسئلة</h2>
                            </div>
                            <hr>
                            <div class="details_wrapper">
                                <div v-if="isLoading" class="w-100">
                                    <v-skeleton-loader v-for="i in 6" width="100%" height="3rem"
                                        style="margin: 15px 0;"></v-skeleton-loader>
                                </div>
                                <v-expansion-panels variant="accordion" v-else>
                                    <v-expansion-panel v-for="report in reportDetails.questions"
                                        :title="report.question" bg-color="#303030" selected-class="expandedQuestion">
                                        <v-expansion-panel-text bg-color="#383838">
                                            <div class="answers_wrapper">
                                                <h1 v-if="report.answer_type == 0">مقالي</h1>
                                                <h1 v-else v-for="answer in report.answers">{{ answer.answer }}</h1>
                                            </div>
                                        </v-expansion-panel-text>
                                    </v-expansion-panel>
                                </v-expansion-panels>
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

.expandedQuestion {
    background-color: red;
}

.modal_card {
    background-color: #383838;
    padding: 0;
}

.card_body {
    display: flex;
    flex-direction: column;
    gap: 15px;
}

.card_body .breadcrumb {
    display: flex;
    gap: 15px;
}

.card_body .breadcrumb span {
    color: #9EA3A5;
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

.box .details_wrapper .answers_wrapper {
    display: flex;
    align-items: center;
    gap: 15px;
}

.box .details_wrapper .answers_wrapper>* {
    flex: 1;
    background-color: #383838;
    padding: 15px;
    border-radius: 5px;
}
</style>
