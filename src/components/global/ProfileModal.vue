  
  <script setup lang="ts">
  import { ref, watch } from 'vue';
</script>
<template>
    <v-card>
        <div class="d-flex justify-content-between">
            <div>
                <img src="@/assets/imgs/Brandmark.png" class="img-company" alt="no-image">
            </div>
            <v-btn @click="$emit('close')" color="red" class="btn-closee">
                <img src="@/assets/imgs/close.svg">
                إغلاق 
            </v-btn>
        </div>
      <v-card-text>
        <div class="card-border d-flex" style="background-color: #303030;">
        <img src="@/assets/imgs/image1.png" style="height: 100px;" alt="no-image">
        <div class="me-2 w-100">
            <h6 class="text-white mb-2" style="font-size: 16px;">عبد الله الشمري</h6>
            <p style="font-size: 14px; color: #929A9F;">مدير الخريطة التفاعلية</p>
            <hr class="hr-card">
            <button type="button" class="btn-profile">تغيير صورة الملف الشخصي</button>
        </div>
      </div>

      <div class="card-border mt-3" style="background-color: #303030;">
        <div>
            <div>
                <h6 class="text-white">تفاصيل الحساب</h6>
            </div>
            <hr class="hr-card">
            <div class="row">
                <div class="col-lg-3 col-md-6 col-12 mb-3">
                    <p class="text-secondary fs-14 fw-400 mb-2">رقم الحساب</p>
                    <p class="text-white">#2378903242</p>
                </div>
                <div class="col-lg-3 col-md-6 col-12 mb-3">
                    <p class="text-secondary fs-14 fw-400 mb-2">رقم الهاتف </p>
                    <p class="text-white">378903242 </p>
                </div>
                <div class="col-lg-3 col-md-6 col-12 mb-3">
                    <p class="text-secondary fs-14 fw-400 mb-2">رقم الجوال</p>
                    <p class="text-white">+966378903242 </p>
                </div>
                <div class="col-lg-3 col-md-6 col-12 mb-3">
                    <p class="text-secondary fs-14 fw-400 mb-2">رقم الهوية</p>
                    <p class="text-white"> 378903242</p>
                </div>
                <div class="col-lg-3 col-md-6 col-12 mb-3">
                    <p class="text-secondary fs-14 fw-400 mb-2"> المنطقة</p>
                    <p class="text-white">الرباض</p>
                </div>
                <div class="col-lg-3 col-md-6 col-12 mb-3">
                    <p class="text-secondary fs-14 fw-400 mb-2"> المدينة</p>
                    <p class="text-white">-</p>
                </div>
                <div class="col-lg-3 col-md-6 col-12 mb-3">
                    <p class="text-secondary fs-14 fw-400 mb-2"> الحي</p>
                    <p class="text-white">-</p>
                </div>
            </div>
        </div>
      </div>
      </v-card-text>
    </v-card>
  </template>

  
  <style scoped>
      .img-company {
        width: 200px;
      margin: 25px;
      }
      .btn-closee{
        margin: 25px;
        background-color: white !important;
        color: #857854 !important;

      }
  </style>