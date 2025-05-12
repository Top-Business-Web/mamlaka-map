<script setup lang="ts">
import { ref, watch } from 'vue';

const userDetails = JSON.parse(sessionStorage.getItem('mapUser'))

</script>


<template>
    <v-card class="card">
        <div class="d-flex justify-content-between">
            <div>
                <img src="@/assets/imgs/logo.png" class="img-company" alt="no-image">
            </div>
            <v-btn @click="$emit('close')" color="red" class="btn-closee">
                <img src="@/assets/imgs/close.svg">
                إغلاق
            </v-btn>
        </div>
        <hr class="mt-0">
        <v-card-text>
            <div class="general_info_box">
                <img :src="userDetails.image" style="height: 80px;
                width: 80px; object-fit: cover;" alt="no-image">
                <div class="w-100">
                    <h6 class="text-white mb-2">{{ userDetails.full_name }}</h6>
                    <p>مدير الخريطة التفاعلية</p>
                    <!-- <hr>
                    <button type="button" class="btn-profile">تغيير صورة الملف الشخصي</button> -->
                </div>
            </div>
            <div class="details_box mt-4">
                <div>
                    <div>
                        <h6 class="text-white">تفاصيل الحساب</h6>
                    </div>
                    <hr>
                    <div class="row mt-4">
                        <div class="col-lg-3 col-md-6 col-12 mb-3">
                            <label>رقم الحساب</label>
                            <p class="text-white">{{ userDetails.account_number }}</p>
                        </div>
                        <div class="col-lg-3 col-md-6 col-12 mb-3">
                            <label>البريد الإلكتروني</label>
                            <p class="text-white">{{ userDetails.email }}</p>
                        </div>
                        <div class="col-lg-3 col-md-6 col-12 mb-3">
                            <label>رقم الجوال</label>
                            <p class="text-white">{{ userDetails.phone }}</p>
                        </div>
                        <div class="col-lg-3 col-md-6 col-12 mb-3">
                            <label>رقم الهوية</label>
                            <p class="text-white">{{ userDetails.national_id }}</p>
                        </div>
                        <div class="col-lg-3 col-md-6 col-12 mb-3">
                            <label> المنطقة</label>
                            <p class="text-white">-</p>
                        </div>
                        <div class="col-lg-3 col-md-6 col-12 mb-3">
                            <label> المدينة</label>
                            <p class="text-white">-</p>
                        </div>
                        <div class="col-lg-3 col-md-6 col-12 mb-3">
                            <label> الحي</label>
                            <p class="text-white">-</p>
                        </div>
                    </div>
                </div>
            </div>
        </v-card-text>
    </v-card>
</template>

<style scoped>
hr {
    border-color: #E6EBEE;
}

.card {
    background-color: #383838;
}

.general_info_box {
    display: flex;
    align-items: center;
    gap: 20px;
    padding: 20px;
    background-color: #303030;
    border-radius: 8px;
}

.general_info_box p {
    color: #929A9F;
}

.general_info_box button {
    background-color: #383838;
    color: #fff;
    padding: 10px 15px;
    border-radius: 5px;
    font-size: 14px;
}

.details_box {
    gap: 20px;
    padding: 20px;
    background-color: #303030;
    border-radius: 8px;
}

.details_box label {
    font-size: 14px;
    color: #929A9F;
    margin-bottom: 10px;
}

.img-company {
    width: 200px;
    margin: 25px;
}

.btn-closee {
    margin: 25px;
    background-color: white !important;
    color: #C4AB79 !important;
}
</style>