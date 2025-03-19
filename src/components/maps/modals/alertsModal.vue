<script setup>
import avataImg from "@/assets/imgs/image1.png";
import { onMounted } from "vue"
import http from "@/plugins/axios"
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';

const props = defineProps({
    periority: null,
    status: null
})

const emit = defineEmits(['showDetails'])

const alertsPeriority = ref("")
const alertsPeriorityColor = ref("")
function getPeriority() {
    if (props.periority && props.periority == "high") {
        searchQuery.value.priority = "high"
        alertsPeriority.value = "العالية";
        alertsPeriorityColor.value = "#C05E5E";
        return
    }
    if (props.periority && props.periority == "mid") {
        searchQuery.value.priority = "mid"
        alertsPeriority.value = "المتوسطة";
        alertsPeriorityColor.value = "#B49164";
        return
    }
    if (props.periority && props.periority == "low") {
        searchQuery.value.priority = "low"
        alertsPeriority.value = "المنخفضة";
        alertsPeriorityColor.value = "#35685F";
        return
    }
    searchQuery.value.priority = null
    alertsPeriority.value = "";
    alertsPeriorityColor.value = "#B49164";
    return
};
const isLoading = ref(false)
const alerts = ref([]);
const searchQuery = ref({
    priority: props.periority,
    seen: props.status,
})

async function getAlerts(status = null) {
    getPeriority();
    searchQuery.value.status = status
    try {
        isLoading.value = true
        const params = Object.fromEntries(
            Object.entries(searchQuery.value).filter(([_, v]) => v)
        );
        const res = await http.get("v1/map/getAlerts", { params })
        alerts.value = res.data.data;
    } catch (error) {
        console.log(error);
    } finally {
        isLoading.value = false
    }
}

onMounted(getAlerts)

</script>

<template>
    <v-dialog max-width="75rem" height="calc(100vh - 48px)">
        <template v-slot:default="{ isActive }">
            <v-card class="modal_card">
                <v-card-title class="card_title">
                    <div class="text">
                        <div class="alerts_count" :style="{ 'background-color': alertsPeriorityColor }">
                            <p>{{ alerts.length }}</p>
                        </div>
                        <h2 v-if="props.periority" class="text-h6 m-0 font-weight-bold">التنبيهات ذات الأهمية {{
                            alertsPeriority }}</h2>
                        <h2 v-else class="text-h6 m-0 font-weight-bold">جميع التنبيهات</h2>
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
                                :rowsPerPageOptions="[5, 10, 20, 50]" :value="alerts" :loading="isLoading">
                                <template #empty>
                                    <p class="text-center">
                                        لا يوجد بيانات
                                    </p>
                                </template>
                                <Column field="title" header="اسم التنبيه">
                                    <template #body="slotProps">
                                        <div class="d-flex align-items-center ga-2">
                                            <v-icon icon="mdi-information-outline" class="icon"></v-icon>
                                            <p class="m-0">{{ slotProps.data.title }}</p>
                                        </div>
                                    </template>
                                </Column>
                                <Column field="user" header="مرسل التنبيه">
                                    <template #body="slotProps">
                                        <div class="reporter_info">
                                            <div class="avatar">
                                                <img :src="avataImg" alt="">
                                            </div>
                                            <p class="m-0">{{ slotProps.data.sender }}</p>
                                        </div>
                                    </template>
                                </Column>
                                <Column v-if="!searchQuery.priority" field="priority" header="أهمية البلاغ">
                                    <template #body="slotProps">
                                        <span v-if="slotProps.data.priority == 'low'" class="alert_status"
                                            style="background-color: #35685F20;color: #35685F;">{{
                                                slotProps.data.priority_name
                                            }}
                                        </span>
                                        <span v-if="slotProps.data.priority == 'mid'" class="alert_status"
                                            style="background-color: #C4AB7920;color: #C4AB79;">{{
                                                slotProps.data.priority_name
                                            }}
                                        </span>
                                        <span v-if="slotProps.data.priority == 'high'" class="alert_status"
                                            style="background-color: #C05E5E20;color: #C05E5E;">{{
                                                slotProps.data.priority_name
                                            }}
                                        </span>

                                    </template>
                                </Column>
                                <Column field="created_at" header="تاريخ الإرسال"></Column>
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
