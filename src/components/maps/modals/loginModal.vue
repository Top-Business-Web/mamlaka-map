<script setup>
import http from "@/plugins/axios"

const email = ref("");
const password = ref("")

async function handleSubmit() {
    try {
        const res = await http.post("v1/map/login", {
            national_or_email: email.value,
            password: password.value,
        })
        sessionStorage.setItem('user', res.data.data)
        sessionStorage.setItem('token', res.data.data.jwt_token)
        location.reload();
    } catch (error) {
        console.log("Login Error", error)
    }
}

</script>

<template>
    <v-dialog max-width="500px" height="calc(100vh - 48px)">
        <template v-slot:default="{ isActive }">
            <v-card class="modal_card">
                <v-card-title class="card_title">
                    <div class="text">
                        <h2 class="text-h6 m-0 font-weight-bold">تسجيل الدخول</h2>
                    </div>
                    <v-btn color="#303030" @click="isActive.value = false">
                        <div class="d-flex align-items-center ga-1">
                            <v-icon color="white" icon="mdi-close"></v-icon> إغلاق
                        </div>
                    </v-btn>
                </v-card-title>
                <v-card-text class="card_body">
                    <v-form @submit.prevent="handleSubmit">
                        <v-text-field label="البريد الإلكتروني*" v-model="email" required></v-text-field>
                        <v-text-field label="كلمة المرور*" type="password" v-model="password" required></v-text-field>
                        <v-btn color="primary" type="submit" text="تسجيل الدخول" variant="tonal"></v-btn>
                    </v-form>
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

span {
    color: #fff;
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

.card_title .complaints_count {
    padding: 3px 15px;
    border-radius: 5px;
    font-weight: bold
}

.card_body {
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

.data_table_wrapper * {
    color: #fff;
}


.data_table_wrapper #buttons_wrapper {
    display: flex;
    align-items: center;
    /* margin-bottom: 15px; */
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

.data_table_wrapper .complaint_status {
    width: fit-content;
    padding: 7px 15px;
    border-radius: 5px;
    font-weight: 500;
}
</style>