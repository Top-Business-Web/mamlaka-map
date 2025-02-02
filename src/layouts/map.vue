<script setup lang="ts">
import { ref, computed, onMounted, inject, unref } from "vue";

const isActiveSidebar = ref<boolean>(false);
</script>

<template>
  <v-locale-provider rtl>
    <v-app>
      <v-container fluid class="h-100 pa-0">
        <v-layout class="h-100">
          <!-- <MapTopNavbar /> -->

          <v-main class="h-100">
            <router-view v-slot="{ Component }">
              <transition name="scale" mode="out-in">
                <component :is="Component"></component>
              </transition>
            </router-view>
          </v-main>

          <MapFooter />
        </v-layout>
      </v-container>
    </v-app>
  </v-locale-provider>
</template>

<style lang="scss" scoped>
body .v-main {
  --v-layout-top: 0 !important;
}
</style>
