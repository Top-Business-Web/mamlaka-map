<script setup lang="ts">
import { ref, computed, onMounted, inject, unref } from "vue";
import appLogo from "@/assets/imgs/royal_comm.png";

const isSubmitting = ref<boolean>(false);
</script>

<template>
  <v-app-bar flat tile elevation="0" class="bg-transparent py-4">
    <template v-slot:prepend>
      <div class="d-flex align-center gap-2">
        
        <v-img width="80" max-width="80" max-height="40" alt="Zimam" :src="appLogo"></v-img>

        <v-sheet rounded="pill" class="d-flex ga-3">
          <v-btn icon>
            <svg
              width="9"
              height="14"
              viewBox="0 0 9 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M7.75893 7.61911L2.27013 13.1813C1.92098 13.5353 1.35488 13.5353 1.0059 13.1813C0.656887 12.8276 0.656887 12.2539 1.0059 11.9003L5.86264 6.97861L1.00604 2.05711C0.657029 1.70328 0.657029 1.12968 1.00604 0.775994C1.35505 0.422162 1.92112 0.422162 2.27027 0.775994L7.75908 6.33826C7.93358 6.51519 8.02074 6.74683 8.02074 6.97858C8.02074 7.21045 7.93341 7.44227 7.75893 7.61911Z"
                fill="white"
              />
            </svg>
          </v-btn>
          <v-btn icon>
            <svg
              width="8"
              height="14"
              viewBox="0 0 8 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M0.622902 6.33828L6.1117 0.776111C6.46086 0.422107 7.02695 0.422107 7.37594 0.776111C7.72495 1.1298 7.72495 1.70345 7.37594 2.05711L2.51919 6.97879L7.37579 11.9003C7.72481 12.2541 7.72481 12.8277 7.37579 13.1814C7.02678 13.5352 6.46072 13.5352 6.11156 13.1814L0.62276 7.61914C0.448254 7.44221 0.361099 7.21057 0.361099 6.97881C0.361099 6.74694 0.448424 6.51513 0.622902 6.33828Z"
                fill="white"
              />
            </svg>
          </v-btn>
        </v-sheet>
        <div class="ms-2">
          <v-menu width="500px">
            <template v-slot:activator="{ props }">
              <v-btn v-bind="props" height="auto" rounded="pill">
                <div class="d-flex flex-column pb-2">
                  <div class="d-flex py-2">
                    <span class="me-2">الاحصاءات العامة</span>
                    <span
                      ><svg
                        width="14"
                        height="8"
                        viewBox="0 0 14 8"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M0.267426 0.270324C0.623994 -0.0901081 1.2021 -0.0901081 1.55867 0.270324L7.00001 5.77152L12.4413 0.270324C12.7979 -0.0901081 13.376 -0.0901081 13.7326 0.270324C14.0891 0.630818 14.0891 1.21531 13.7326 1.57581L7.64565 7.72968C7.28908 8.09011 6.71094 8.09011 6.35436 7.72968L0.267426 1.57581C-0.089142 1.21531 -0.089142 0.630818 0.267426 0.270324Z"
                          fill="white"
                        /></svg
                    ></span>
                  </div>
                  <span class="text-sm text-gray">مشروع إدارة ومراقبة البيانات الميدانية</span>
                </div>
              </v-btn>
            </template>

            <v-list width="200">
              <v-list-item href="#">
                <v-list-item-title>الاحصاءات العامة</v-list-item-title>
              </v-list-item>
              <v-list-item href="#">
                <v-list-item-title>الاحصاءات 2</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </div>
      </div>
    </template>
    <template v-slot:title>
      <div class="d-flex justify-center">
        <StatisticsFilter />
      </div>
    </template>

    <template v-slot:append>
      <div class="d-flex ms-6">
        <div>
          <v-btn icon>
            <svg
              width="17"
              height="18"
              viewBox="0 0 17 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M13.6061 9.79102L8.5 15.1975L3.39385 9.79102L4.33301 8.79662L7.83594 12.5056V0H9.16406V12.5056L12.667 8.79662L13.6061 9.79102ZM17 16.5938H0V18H17V16.5938Z"
                fill="#AAAEB6"
              />
            </svg>
          </v-btn>
        </div>
        <div class="ms-2">
          <v-btn icon>
            <svg
              width="20"
              height="18"
              viewBox="0 0 20 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M19.7095 4.88561C19.4058 4.67417 18.992 4.75407 18.785 5.06408L17.428 7.096C17.0755 5.41866 16.2589 3.8774 15.0438 2.63663C13.3789 0.936373 11.1654 0 8.81078 0C6.45626 0 4.24261 0.936373 2.57771 2.63663C-0.859237 6.14658 -0.859237 11.8577 2.57771 15.3675C4.29619 17.1225 6.55348 18 8.81078 18C11.0681 18 13.3254 17.1225 15.0438 15.3675C15.3037 15.1022 15.3037 14.672 15.0438 14.4066C14.784 14.1413 14.3627 14.1413 14.103 14.4066C11.1848 17.3867 6.43683 17.3867 3.51874 14.4066C0.60065 11.4265 0.60065 6.57753 3.51874 3.59746C4.93232 2.15395 6.81171 1.3589 8.81087 1.3589C10.81 1.3589 12.6895 2.15395 14.103 3.59755C15.194 4.71167 15.9051 6.11161 16.1735 7.63141L13.8118 5.98641C13.5082 5.77497 13.0943 5.85487 12.8872 6.16488C12.6802 6.47489 12.7584 6.8976 13.062 7.10904L16.585 9.56295C16.5852 9.56304 16.5853 9.56322 16.5855 9.5634C16.6412 9.60217 16.7007 9.63071 16.7618 9.65019C16.7636 9.65082 16.7654 9.65182 16.7673 9.65236C16.7777 9.65562 16.7882 9.65689 16.7987 9.65961C16.8519 9.6732 16.9058 9.68153 16.9598 9.68153C17.1723 9.68153 17.3812 9.57771 17.51 9.38493L19.8843 5.82987C20.0913 5.51976 20.0131 5.09706 19.7095 4.88561Z"
                fill="#AAAEB6"
              />
            </svg>
          </v-btn>
        </div>
        <div class="ms-2">
          <v-menu>
            <template v-slot:activator="{ props }">
              <v-btn icon class="bg-accent" v-bind="props">
                <svg
                  width="14"
                  height="18"
                  viewBox="0 0 14 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M13.1484 18C12.7601 18 12.4453 17.6852 12.4453 17.2969C12.4453 14.5442 10.2058 12.3047 7.45312 12.3047H6.39844C3.64574 12.3047 1.40625 14.5442 1.40625 17.2969C1.40625 17.6852 1.09146 18 0.703125 18C0.314789 18 0 17.6852 0 17.2969C0 13.7688 2.87033 10.8984 6.39844 10.8984H7.45312C10.9812 10.8984 13.8516 13.7688 13.8516 17.2969C13.8516 17.6852 13.5368 18 13.1484 18Z"
                    fill="white"
                  />
                  <path
                    d="M6.85547 9.49219C4.23847 9.49219 2.10938 7.36309 2.10938 4.74609C2.10938 2.1291 4.23847 0 6.85547 0C9.47247 0 11.6016 2.1291 11.6016 4.74609C11.6016 7.36309 9.47247 9.49219 6.85547 9.49219ZM6.85547 1.40625C5.01388 1.40625 3.51562 2.9045 3.51562 4.74609C3.51562 6.58768 5.01388 8.08594 6.85547 8.08594C8.69706 8.08594 10.1953 6.58768 10.1953 4.74609C10.1953 2.9045 8.69706 1.40625 6.85547 1.40625Z"
                    fill="white"
                  />
                </svg>
              </v-btn>
            </template>

            <v-list width="200">
              <v-list-item href="#">
                <v-list-item-title> الملف الشخصي </v-list-item-title>
              </v-list-item>
              <v-list-item href="#">
                <v-list-item-title> تسجيل الخروج </v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </div>
      </div>
    </template>
  </v-app-bar>
</template>

<style lang="scss" scoped>
.v-menu > .v-overlay__content > .v-list.time-between-list {
  border-radius: 15px;
  background-color: #383838;
}
</style>
