<script setup>
import http from "@/plugins/axios"
import { toast } from "vue3-toastify";

const email = ref("");
const password = ref("")

function validateData(res) {
    if (email.value.trim() == '') {
        emailError.innerHTML = "برجاء إدخال البريد الإلكتروني"
    } else {
        emailError.innerHTML = null
    }
    if (password.value.trim() == '') {
        passwordError.innerHTML = "برجاء إدخال كلمة المرور"
    } else {
        passwordError.innerHTML = null
    }
    if (email.value && password.value && !res.data) {
        dataError.innerHTML = res.msg;
    }
}

async function handleSubmit() {
    try {
        await http.post("v1/map/login", {
            national_or_email: email.value,
            password: password.value,
        }).then((res) => {
            validateData(res.data);
            sessionStorage.setItem('mapUser', JSON.stringify(res.data.data));
            sessionStorage.setItem('token', res.data.data.jwt_token);
            location.replace('/');
        })
    } catch (error) {
        console.log("Login Error", error)
    }
}

</script>

<template>
    <div class="login_wrapper">
        <v-card class="card">
            <v-card-text class="card_body">
                <img src="../../assets/imgs/logo.png" width="300" class="mx-auto mb-4" alt="">
                <v-form @submit.prevent="handleSubmit">
                    <v-text-field label="البريد الإلكتروني / رقم الهوية*" v-model="email" required></v-text-field>
                    <div class="error_message" id="emailError"></div>
                    <v-text-field label="كلمة المرور*" type="password" v-model="password" required></v-text-field>
                    <div class="error_message" id="passwordError"></div>
                    <div class="error_message" id="dataError"></div>
                    <v-btn class="mt-4" color="primary" type="submit" text="تسجيل الدخول" variant="tonal"></v-btn>
                </v-form>
            </v-card-text>
        </v-card>
    </div>
</template>

<style scoped>
* {
    font-size: 14px;
    --p-highlight-background: red !important;
}

.login_wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    background: url('../../assets/imgs/blured-bg.jpg');
}

span {
    color: #fff;
}


.card {
    background-color: #383838;
    color: #fff !important;
    min-width: 500px;
    padding: 0;
    border-radius: 30px;
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
    display: flex;
    flex-direction: column;
    padding: 50px;
    gap: 15px;
}

.error_message {
    color: #C05E5E;
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