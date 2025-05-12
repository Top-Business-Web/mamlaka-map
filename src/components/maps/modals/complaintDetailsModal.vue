<script setup>
import avataImg from "@/assets/imgs/image1.png";
import imgIcon from "@/assets/imgs/icons/img-icon.svg";
import { onMounted } from "vue"
import http from "@/plugins/axios"

const props = defineProps({
    complaintId: null
})

const emit = defineEmits(['reportShowHandler'])
const complaintsPeriority = ref("")
const complaintsPeriorityColor = ref("")
const searchInput = ref("")
const isLoading = ref(false)
const complaintId = ref(props.complaintId)
const complaintDetails = ref(null)


async function getComplaintDetails() {
    try {
        isLoading.value = true
        const res = await http.get(`v1/map/getNoticeDetails/${complaintId.value}`)
        complaintDetails.value = res.data.data;
        console.log(complaintDetails.value);

    } catch (error) {
        console.log(error);
    } finally {
        isLoading.value = false
    }
}

onMounted(getComplaintDetails)

</script>

<template>
    <v-dialog v-if="complaintDetails || isLoading" max-width="75rem" height="calc(100vh - 48px)">
        <template v-slot:default="{ isActive }">
            <v-card class="modal_card">
                <v-card-title class="card_title">
                    <v-skeleton-loader v-if="isLoading" width="200px" height="1.2rem"></v-skeleton-loader>
                    <h5 v-else>{{ complaintDetails.title }}</h5>
                    <v-btn color="#303030" @click="isActive.value = false">
                        <div class="d-flex align-items-center ga-1">
                            <v-icon color="white" icon="mdi-close"></v-icon> إغلاق
                        </div>
                    </v-btn>
                </v-card-title>
                <hr class="mt-0">
                <v-card-text>
                    <div class="box">
                        <h6>شرح البلاغ</h6>
                        <hr>
                        <v-skeleton-loader v-if="isLoading" width="200px" height="1.2rem"></v-skeleton-loader>
                        <span v-else class="box_content">{{ complaintDetails.description }}</span>
                    </div>
                    <div class="box">
                        <h6>تفاصيل البلاغ</h6>
                        <hr>
                        <div class="details_wrapper">
                            <div class="info_box">
                                <label>موقع البلاغ</label>
                                <v-skeleton-loader v-if="isLoading" width="200px" height="1.2rem"></v-skeleton-loader>
                                <span v-else>شارع النصر، المنطقة الصناعية – مكة</span>
                            </div>
                            <div class="info_box">
                                <label>مرسل البلاغ</label>

                                <div class="reporter_info">
                                    <div class="avatar">
                                        <v-skeleton-loader v-if="isLoading" width="200px"
                                            height="100%"></v-skeleton-loader>
                                        <img v-else :src="avataImg" alt="">
                                    </div>
                                    <v-skeleton-loader v-if="isLoading" width="200px"
                                        height="1.2rem"></v-skeleton-loader>
                                    <span v-else>{{ complaintDetails.user }}</span>
                                </div>
                            </div>
                            <div class="info_box">
                                <label>درجة الأهمية</label>
                                <v-skeleton-loader v-if="isLoading" width="200px" height="1.2rem"></v-skeleton-loader>
                                <div v-else>
                                    <span v-if="complaintDetails.priority == 'منخفضة'" style="color: #35685F;">{{
                                        complaintDetails.priority }}</span>
                                    <span v-if="complaintDetails.priority == 'متوسطة'" style="color: #C4AB79;">{{
                                        complaintDetails.priority }}</span>
                                    <span v-if="complaintDetails.priority == 'عالية'" style="color: #C05E5E;">{{
                                        complaintDetails.priority }}</span>
                                </div>
                            </div>
                            <div class="info_box">
                                <label>تاريخ ووقت الإبلاغ</label>
                                <v-skeleton-loader v-if="isLoading" width="200px" height="1.2rem"></v-skeleton-loader>
                                <span v-else>{{ complaintDetails.date }}</span>
                            </div>
                            <div class="info_box">
                                <label>حالة البلاغ</label>
                                <v-skeleton-loader v-if="isLoading" width="200px" height="1.2rem"></v-skeleton-loader>
                                <span v-else>{{ complaintDetails.status_name }}</span>
                            </div>
                            <div class="info_box">
                                <label>تاريخ الإرسال</label>
                                <v-skeleton-loader v-if="isLoading" width="200px" height="1.2rem"></v-skeleton-loader>
                                <span v-else>{{ complaintDetails.created_at }}</span>
                            </div>
                        </div>
                    </div>
                    <div class="box">
                        <h6>الشواهد والأدلة الميدانية</h6>
                        <hr>
                        <v-skeleton-loader v-if="isLoading" width="100%" height="1.2rem"></v-skeleton-loader>
                        <div v-else>
                            <div v-if="complaintDetails.files.length > 0" class="files_wrapper">
                                <a v-for="(file, index) in complaintDetails.files" :key="index" :href="file.file"
                                    class="file" target="_blank">
                                    <img :src="imgIcon" alt="">
                                    <div class="file_info">
                                        <span>{{ file.file_name }}</span>
                                        <small> {{ file.file_size }}</small>
                                    </div>
                                </a>
                            </div>
                            <span v-else>لا يوجد</span>
                        </div>
                    </div>
                </v-card-text>
            </v-card>
        </template>
    </v-dialog>
</template>

<style scoped>
*:not(h1, h2, h3, h4, h5, h6) {
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

.modal_card {
    background-color: #383838;
    padding: 0;
}

.box {
    background-color: #303030;
    padding: 20px;
    border-radius: 10px;
}

.box+.box {
    margin-top: 15px;
}

.box_content {
    color: #9EA3A5;
    margin: 0;
}

.details_wrapper {
    display: flex;
    align-items: flex-start;
    flex-wrap: wrap;
    gap: 30px;
}

.info_box {
    flex: 1 1 300px;
    display: flex;
    flex-direction: column;
}

.info_box label {
    color: #929A9F;
    margin-bottom: 10px;
}

.reporter_info {
    display: flex;
    align-items: center;
    gap: 15px;
}

.reporter_info .avatar {
    width: 40px;
    height: 40px;
    border-radius: 5px;
    background-color: #383838;
    overflow: hidden;
}

.reporter_info .avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.files_wrapper {
    display: flex;
    align-items: stretch;
    flex-wrap: wrap;
    gap: 15px;
    padding-block: 15px;
}

.files_wrapper .file {
    flex: 0 1 calc(50% - 7.5px);
    display: flex;
    align-items: center;
    gap: 15px;
    background-color: #383838;
    padding: 15px;
    border-radius: 10px;
    text-decoration: none;
    color: #fff;
}

.files_wrapper .file img {
    width: 50px;
}

.files_wrapper .file .file_info {
    display: block;
    width: calc(100% - 80px);
}

.files_wrapper .file .file_info p {
    overflow: hidden;
    text-overflow: ellipsis;
}

.files_wrapper .file .file_info small {
    color: #949594;
}
</style>