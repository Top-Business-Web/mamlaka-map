<script setup>
const isAuth = sessionStorage.getItem('token') != null

if (!isAuth) { window.location.replace('/login') }
</script>
<template>
   <InteractiveMap v-if="isAuth" />
   <!-- <InteractiveMapMapbox /> -->
</template>
