<script setup lang="ts">
import { ref, computed, watch, onMounted } from "vue";
import { useMapStore, type MapStatisticsFilterKeys } from "@/stores/MapStore";
import dayjs from "dayjs";
import avataImg from "@/assets/imgs/image1.png";
import ProfileModal from '@/components/global/ProfileModal.vue';
const mapStore = useMapStore();
const isMenuOpen = ref<boolean>(false);
const searchText = ref<string>("");
const selectedParent = ref<string>("0");
const selectedPeriod = ref<string>("");
const selectedType = ref<string>("");

const handleFilter = (key: MapStatisticsFilterKeys, value: string) => {
  mapStore.updateMapStatisticsFilter(key, value);
  mapStore.getMapStatistics();
};

watch(searchText, () => { handleFilter("search", searchText.value) });
watch(selectedParent, () => { handleFilter("parent", selectedParent.value) });
watch(selectedPeriod, () => { handleFilter("period", selectedPeriod.value) });

// const getFilterLabel = (Key: MapStatisticsFilterKeys) => {
//   const filterLabels = {
//     company: "الشركة",
//     shift: "الوردية",
//     start_date: "اليوم"
//   };

//   return filterLabels[Key];
// };

const profileDialog = ref(false);

const openProfileModal = () => {
  profileDialog.value = true;  // فتح modal
};

const closeProfileModal = () => {
  profileDialog.value = false;  // إغلاق modal
};
</script>

<template>
  <v-app-bar flat tile elevation="0" class="bg-transparent px-4 pt-4 pb-0 px-xl-10" style="z-index: 9999">
    <template v-slot:prepend>
      <div class="d-flex align-center ga-16">
        <div class="d-flex align-center ga-4">
          <a href="#" class="pa-1">
            <!-- <img width="48rem" :src="selaIconLogo" /> -->
          </a>
          <!-- <span class="font-weight-bold">مشروع إدارة ومراقبة البيانات الميدانية</span> -->
        </div>

        <v-locale-provider rtl locale="ar">
          <transition name="scale" mode="out-in">
            <div v-if="mapStore.mapStatisticsFiltersResponse.length && !mapStore.isMapStatisticsError"
              class="d-flex align-center ga-4">
              <v-menu v-model="isMenuOpen">
                <template v-slot:activator="{ props }">
                  <v-btn variant="outlined" v-bind="props" height="auto" rounded="md" style="min-width: 10rem"
                    class="day-filter-btn px-0">
                    <div class="w-100 d-flex justify-start align-center ga-2 py-2 px-2">
                      <svg width="1.6rem" height="1.6rem" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <path fill="currentColor"
                          d="M15,19.88C15.04,20.18 14.94,20.5 14.71,20.71C14.32,21.1 13.69,21.1 13.3,20.71L9.29,16.7C9.06,16.47 8.96,16.16 9,15.87V10.75L4.21,4.62C3.87,4.19 3.95,3.56 4.38,3.22C4.57,3.08 4.78,3 5,3V3H19V3C19.22,3 19.43,3.08 19.62,3.22C20.05,3.56 20.13,4.19 19.79,4.62L15,10.75V19.88M7.04,5L11,10.06V15.58L13,17.58V10.05L16.96,5H7.04Z" />
                      </svg>
                      <span class="font-weight-bold">
                        {{ formattedDate }}
                      </span>
                    </div>
                  </v-btn>
                </template>
                <!-- hide-actions -->
                <v-date-picker v-model="selectedDate" header="اختر التاريخ" rounded="xl" color="#383838" />
              </v-menu>

              <div class="d-flex align-center ga-4">
                <div v-for="(filter, index) in mapStore.mapStatisticsFiltersResponse" :key="index"
                  class="position-relative d-inline-block">
                  <!-- clearable -->
                  <!-- 
                  :placeholder="getFilterLabel(filter.key)" -->
                  <v-autocomplete class="map-select-input" :items="filter.values" item-title="name" item-value="value"
                    variant="outlined" rounded="md" no-data-text="لا توجد بيانات"
                    prepend-inner-icon="mdi-filter-outline"
                    @update:modelValue="handleFilter(filter.key, $event)"></v-autocomplete>
                  <!-- <v-menu width="500px">
                    <template v-slot:activator="{ props }">
                      <v-btn
                        variant="outlined"
                        v-bind="props"
                        height="auto"
                        rounded="md"
                        style="min-width: 5rem"
                      >
                        <div class="d-flex align-center ga-4 py-2 px-2">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="1rem"
                            height="1rem"
                            viewBox="0 0 15 16"
                            fill="none"
                          >
                            <path
                              d="M0 0V4.62116L5.22466 10.1941V16L9.49936 14.4801V10.1941L14.724 4.62116V0H0ZM13.2991 3.99159L8.07445 9.56456V13.3847L6.64954 13.8913V9.56456L1.42491 3.99159V1.51991H13.2991V3.99159Z"
                              fill="currentColor"
                            />
                          </svg>
                          <span class="font-weight-bold">
                            {{ getFilterLabel(filter.key) }}
                          </span>
                        </div>
                      </v-btn>
                    </template>

                    <v-list width="300">
                      <v-list-item
                        @click="handleFilter(filter.key, filterValue.value)"
                        href="#"
                        v-for="(filterValue, index) in filter.values"
                        :key="index"
                      >
                        <v-list-item-title>
                          {{ filterValue.name }}
                        </v-list-item-title>
                      </v-list-item>
                    </v-list>
                  </v-menu> -->
                </div>
              </div>
            </div>
          </transition>
        </v-locale-provider>
      </div>
    </template>

    <!-- <template v-slot:append> -->
    <div style="width: 70%; display: flex; justify-content: space-between;">
      <div class="d-flex">
        <input class="form-control ms-2"
          style="max-width: 300px; border-radius: 8px; background-color: #303030; color: white; border: none;"
          type="search" placeholder="البحث عن تقرير يومي..." aria-label="Search" v-model="searchText">
        <select class="form-select" aria-label="Default select example" v-model="selectedParent">
          <option value="0" selected>إدارة المحاور الرئيسية</option>
          <option value="1">إدارة المواقع الجغرافية</option>
          <option value="2">إدارة التقارير اليومية</option>
          <option value="3">إدارة الفرق الميدانية</option>
          <option value="4">إدارة البلاغات</option>
          <option value="5">إدارة تقارير المشرفين</option>
        </select>
        <select class="form-select" aria-label="Default select example" v-model="selectedPeriod">
          <option value="" selected>الفترة الزمنية</option>
          <option value="0">منذ يوم</option>
          <option value="1">منذ أسبوع</option>
          <option value="2">منذ شهر</option>
          <option value="3">منذ سنة</option>
        </select>
        <select class="form-select" aria-label="Default select example"
          @click="$emit('changeTypeHandler', $event.target.value)">
          <option value="" selected> الكل</option>
          <option value="0">موقف</option>
          <option value="1">باص</option>
          <option value="2">سكة حديدية</option>
          <option value="3">طريق</option>
          <option value="4">محطة</option>
        </select>
      </div>

      <v-menu>
        <template v-slot:activator="{ props }">
          <v-btn icon variant="outlined" class="border-0" v-bind="props">
            <img width="32px" :src="avataImg" />
          </v-btn>
        </template>

        <v-list width="200">
          <v-list-item @click="openProfileModal">
            <v-list-item-title>الملف الشخصي</v-list-item-title>
          </v-list-item>
          <v-list-item href="#">
            <v-list-item-title>تسجيل الخروج</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>

      <!-- نافذة منبثقة Modal لعرض الملف الشخصي -->
      <v-dialog v-model="profileDialog" min-width="90%" min-height="90%">
        <ProfileModal @close="closeProfileModal" />
      </v-dialog>
    </div>
    <!-- </template> -->
  </v-app-bar>
</template>

<style lang="scss">
.v-menu>.v-overlay__content>.v-list {
  border-radius: 15px;
  background-color: #383838; // #383838
}

.select2,
.select2-container--default .select2-selection--single {
  background-color: #383838 !important;
  margin-left: 10px;
}

.select2-container--default .select2-selection--single .select2-selection__rendered {
  color: white !important;
}

.hr-card {
  color: #494A4A;
  height: 1px;
  opacity: 1;
}

.btn-profile {
  color: #F7F7F8;
  border: none;
  border-radius: 8px;
  padding: 8px;
  background-color: #383838;
}

input::placeholder {
  color: white !important;
}

.form-select {
  background-color: #383838;
  border: none;
  color: white;
  margin-left: 10px;
  --bs-form-select-bg-img: url('@/assets/imgs/vector.svg');
  background-position: left .75rem center;
  padding: 0.375rem .75rem .375rem 2.25rem;
  width: max-content;
}
</style>
