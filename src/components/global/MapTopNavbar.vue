<script setup lang="ts">
import { ref, computed, watch, onMounted } from "vue";
import { useMapStore, type MapStatisticsFilterKeys } from "@/stores/MapStore";
import dayjs from "dayjs";
import avataImg from "@/assets/imgs/image1.png";
import searchIcon from "@/assets/imgs/icons/search.svg";
import ProfileModal from '@/components/global/ProfileModal.vue';
import LoginModal from "@/components/maps/modals/loginModal.vue";
import http from "@/plugins/axios";

const autharized = ref(sessionStorage.getItem('token') != null)
const mapStore = useMapStore();
const isMenuOpen = ref<boolean>(false);
const searchText = ref<string>("");
const selectedParent = ref<string>("0");
const selectedPeriod = ref<string>("");
const selectedUserType = ref<string>("all");
const selectedType = ref<string>("");
const myValue = ref('')
const myOptions = ref(['op1', 'op2', 'op3'])

const emit = defineEmits(["searchingUsers", "changeTypeHandler"])
const handleStatsFilter = (key: MapStatisticsFilterKeys, value: string) => {
  mapStore.updateMapStatisticsFilter(key, value);
  mapStore.getMapStatistics();
};
const handleUsersFilter = () => {
  mapStore.usersRole = selectedUserType.value;
  mapStore.updateMapLocations(selectedUserType.value);
};

const roles = ref([])
async function getRoles() {
  try {
    const res = await http.get("v1/map/getRoles", {
      headers: {
        Authorization: sessionStorage.getItem('token')
      }
    })
    roles.value = res.data.data
  } catch (error) {
    console.log(error);
  }
}

watch(selectedParent, () => { handleStatsFilter("parent", selectedParent.value) });
watch(selectedPeriod, () => { handleStatsFilter("period", selectedPeriod.value) });
watch(searchText, () => { emit("searchingUsers", searchText.value) });
watch(selectedUserType, () => { handleUsersFilter() });


const profileDialog = ref(false);

const openProfileModal = () => {
  profileDialog.value = true;
};

const closeProfileModal = () => {
  profileDialog.value = false;
};

const isLogin = ref(false);
function openLoginModal() {
  isLogin.value = true
}

async function handleLogout() {
  try {
    await http.post('v1/map/logout', {
      fcm_token: sessionStorage.getItem("fcm_token")
    }).then(() => {
      sessionStorage.removeItem('fcm_token');
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('mapUser');
      location.reload();
    });
  } catch (error) {
    console.log('Error while logging out!', error);
  }
}

onMounted(() => {
  getRoles();
})

</script>

<template>
  <div class="top_filter">
    <div class="filter_wrapper">
      <div class="input_wrapper">
        <img src="@/assets/imgs/icons/search.svg" width="20px" alt="">
        <input type="text" placeholder="البحث..." aria-label="Search" v-model="searchText">
      </div>
      <div class="select_wrapper">
        <img src="@/assets/imgs/icons/arrow-down.svg" width="10px" alt="">
        <select v-model="selectedParent">
          <option value="0" selected>إدارة المحاور الرئيسية</option>
          <option value="1">إدارة المواقع الجغرافية</option>
          <option value="2">إدارة التقارير اليومية</option>
          <option value="3">إدارة الفرق الميدانية</option>
          <option value="4">إدارة البلاغات</option>
          <option value="6">إدارة التنبيهات</option>
          <option value="5">إدارة تقارير المشرفين</option>
        </select>
      </div>
      <div class="select_wrapper">
        <img src="@/assets/imgs/icons/arrow-down.svg" width="10px" alt="">
        <select v-model="selectedPeriod">
          <option value="" selected>الفترة الزمنية</option>
          <option value="0">منذ يوم</option>
          <option value="1">منذ أسبوع</option>
          <option value="2">منذ شهر</option>
          <option value="3">منذ سنة</option>
        </select>
      </div>
      <div class="select_wrapper">
        <img src="@/assets/imgs/icons/arrow-down.svg" width="10px" alt="">
        <select @click="$emit('changeTypeHandler', $event.target.value)">
          <option value="" selected>كل المواقع</option>
          <option value="0">موقف</option>
          <option value="1">باص</option>
          <option value="2">سكة حديدية</option>
          <option value="3">طريق</option>
          <option value="4">محطة</option>
        </select>
      </div>
      <div class="select_wrapper">
        <img src="@/assets/imgs/icons/arrow-down.svg" width="10px" alt="">
        <select v-model="selectedUserType">
          <option value="all"> كل الموظفين</option>
          <option v-for="role in roles" :key="role.id" :value="role.name">{{ role.name }}</option>
        </select>
      </div>
    </div>

    <div v-if="!autharized" @click="openLoginModal">
      <v-icon icon="mdi-login" class="mx-0 ms-2"></v-icon> تسجيل الدخول
    </div>
    <v-menu v-else>
      <template v-slot:activator="{ props }">
        <img width="40px" :src="avataImg" v-bind="props" />
      </template>
      <v-list width="200" class="user_dropdown">
        <v-list-item @click="openProfileModal" style="border-bottom: 1px solid;">
          <v-list-item-title><v-icon icon="mdi-account-outline" class="mx-0 ms-2"></v-icon>
            الحساب</v-list-item-title>
        </v-list-item>
        <v-list-item @click="handleLogout">
          <v-list-item-title><v-icon icon="mdi-logout" class="mx-0 ms-2"></v-icon> تسجيل الخروج</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </div>
  <v-dialog v-model="profileDialog" min-width="90%" min-height="90%">
    <ProfileModal @close="closeProfileModal" />
  </v-dialog>
  <div v-if="isLogin">
    <LoginModal v-model="isLogin" />
  </div>
</template>

<!-- <style lang="scss">
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
</style> -->

<style scoped>
.top_filter {
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: transparent;
  padding: 20px;
  width: 71%;
  z-index: 1050;
}

.filter_wrapper {
  display: flex;
  align-items: stretch;
  gap: 8px;
}

.v-list.user_dropdown {
  background-color: #383838;
  padding: 0;
  border-radius: 8px;
}

.v-list.user_dropdown .v-list-item {
  padding: 17px 15px;
}
</style>