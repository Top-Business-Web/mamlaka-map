<script setup lang="ts">
import { ref, computed, onMounted, inject, unref } from 'vue';

const isActiveSidebar = ref<boolean>(false);
</script>

<template>
    <v-locale-provider rtl locale="ar">
    <v-app>
      <v-container fluid class="py-0">
        <v-layout>
          <!-- <main-sidebar 
           :is-visible="isActiveSidebar"
           /> -->

          <TopNavbar />

          <v-main>
            <router-view v-slot="{ Component }">
              <transition name="scale" mode="out-in">
                <component :is="Component"></component>
              </transition>
            </router-view>
          </v-main>
        </v-layout>
      </v-container>
    </v-app>
  </v-locale-provider>
</template>

<style>
/* Add your transition styles here */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
