<script setup>
import avataImg from "@/assets/imgs/image1.png";
import { onMounted } from "vue"
import http from "@/plugins/axios"
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';

const props = defineProps({
    areaId: null
})

const isLoading = ref(false)
const fetchedData = ref([]);

async function getRushHours() {
    try {
        isLoading.value = true
        // const res = await http.get(`v1/map/getBusesTimes/${area_id}`)
        const res = await http.get(`v1/map/getBusesTimes/78`)
        fetchedData.value = res.data.data;
    } catch (error) {
        console.log(error);
    } finally {
        isLoading.value = false
    }
}

onMounted(getRushHours)

</script>

<template>
    <v-dialog max-width="75rem" height="calc(100vh - 48px)">
        <template v-slot:default="{ isActive }">
            <v-card class="modal_card">
                <v-card-title class="card_title">
                    <div class="text">
                        <h2 class="text-h6 m-0 font-weight-bold">أوقات انتهاء الذروة</h2>
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
                            <DataTable :alwaysShowPaginator="false" paginator :rows="20"
                                :rowsPerPageOptions="[5, 10, 20, 50]" :value="fetchedData" :loading="isLoading">
                                <template #empty>
                                    <p class="text-center">
                                        لا يوجد بيانات
                                    </p>
                                </template>
                                <Column field="area" header="اسم الموقع">
                                    <template #body="slotProps">
                                        <div class="d-flex align-items-center ga-2">
                                            <v-icon icon="mdi-information-outline" class="icon"></v-icon>
                                            <p class="m-0">{{ slotProps.data.area }}</p>
                                        </div>
                                    </template>
                                </Column>
                                <Column field="user" header="المشرف">
                                    <template #body="slotProps">
                                        <div class="reporter_info">
                                            <div class="avatar">
                                                <img :src="slotProps.data.image" alt="">
                                            </div>
                                            <p class="m-0">{{ slotProps.data.user }}</p>
                                        </div>
                                    </template>
                                </Column>
                                <Column field="bus_count" header="عدد الحافلات"></Column>
                                <Column field="end_time" header="وقت انتهاء الذروة"></Column>
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

.card_title .alerts_count {
    padding: 3px 15px;
    border-radius: 5px;
    font-weight: bold
}

.card_title .alerts_count p {
    margin: 0;
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

.data_table_wrapper #buttons_wrapper {
    display: flex;
    align-items: center;
    margin-bottom: 15px;
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

.data_table_wrapper .alert_status {
    width: fit-content;
    padding: 7px 15px;
    border-radius: 5px;
    font-weight: 500;
}
</style>
