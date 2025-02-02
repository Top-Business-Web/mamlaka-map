<script setup lang="ts">
import { ref, watch } from 'vue';

// Define filter options as key-value pairs
const filterOptions = {
  time: [
    { key: 'all', value: 'جميع الاوقات' },
    { key: 'hajj', value: 'الحج' },
    { key: 'umrah', value: 'العمرة' },
  ],
  nationality: [
    { key: 'all', value: 'كل الجنسيات' },
    { key: 'saudi', value: 'سعودي' },
    { key: 'non-saudi', value: 'غير سعودي' },
  ],
  gender: [
    { key: 'all', value: 'ذكور واناث' },
    { key: 'male', value: 'ذكور' },
    { key: 'female', value: 'اناث' },
  ],
  city: [
    { key: 'all', value: 'كل المدن' },
    { key: 'riyadh', value: 'الرياض' },
    { key: 'makkah', value: 'مكة المكرمة' },
    { key: 'jeddah', value: 'جدة' },
  ],
  age: [
    { key: 'all', value: 'كل الاعمار' },
    { key: '18-25', value: '18-25' },
    { key: '26-35', value: '26-35' },
    { key: '36-45', value: '36-45' },
    { key: '46+', value: '46+' },
  ],
};

// Track selected filter values
const selectedTime = ref(filterOptions.time[0].key);
const selectedNationality = ref(filterOptions.nationality[0].key);
const selectedGender = ref(filterOptions.gender[0].key);
const selectedCity = ref(filterOptions.city[0].key);
const selectedAge = ref(filterOptions.age[0].key);

// Watch for changes in filter values
watch([selectedTime, selectedNationality, selectedGender, selectedCity, selectedAge], () => {
  applyFilters();
});

// Function to apply filters
const applyFilters = () => {
  console.log('Applied Filters:', {
    time: selectedTime.value,
    nationality: selectedNationality.value,
    gender: selectedGender.value,
    city: selectedCity.value,
    age: selectedAge.value,
  });
  // Here you would filter your data based on the selected values
};

// Helper function to get the display value for a selected key
const getDisplayValue = (options: { key: string; value: string }[], selectedKey: string) => {
  const selectedOption = options.find((option) => option.key === selectedKey);
  return selectedOption ? selectedOption.value : '';
};
</script>

<template>
  <v-sheet rounded="pill" class="d-flex align-center ga-3 py-3 px-8">
    <!-- Filter Icon -->
    <span>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="15"
        height="16"
        viewBox="0 0 15 16"
        fill="none"
      >
        <!-- Your SVG path here -->
      </svg>
    </span>
    <!-- Time Filter -->
    <div>
      <v-menu>
        <template v-slot:activator="{ props }">
          <v-btn v-bind="props" height="auto" rounded="pill" color="gray">
            <div class="d-flex py-2">
              <span class="me-2">{{ getDisplayValue(filterOptions.time, selectedTime) }}</span>
              <span>
                <svg
                  width="14"
                  height="8"
                  viewBox="0 0 14 8"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <!-- Your SVG path here -->
                </svg>
              </span>
            </div>
          </v-btn>
        </template>
        <v-list width="200">
          <v-list-item
            v-for="option in filterOptions.time"
            :key="option.key"
            @click="selectedTime = option.key"
          >
            <v-list-item-title>{{ option.value }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </div>
    <!-- Nationality Filter -->
    <div>
      <v-menu>
        <template v-slot:activator="{ props }">
          <v-btn v-bind="props" height="auto" rounded="pill" color="gray">
            <div class="d-flex py-2">
              <span class="me-2">{{ getDisplayValue(filterOptions.nationality, selectedNationality) }}</span>
              <span>
                <svg
                  width="14"
                  height="8"
                  viewBox="0 0 14 8"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <!-- Your SVG path here -->
                </svg>
              </span>
            </div>
          </v-btn>
        </template>
        <v-list width="200">
          <v-list-item
            v-for="option in filterOptions.nationality"
            :key="option.key"
            @click="selectedNationality = option.key"
          >
            <v-list-item-title>{{ option.value }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </div>
    <!-- Gender Filter -->
    <div>
      <v-menu>
        <template v-slot:activator="{ props }">
          <v-btn v-bind="props" height="auto" rounded="pill" color="gray">
            <div class="d-flex py-2">
              <span class="me-2">{{ getDisplayValue(filterOptions.gender, selectedGender) }}</span>
              <span>
                <svg
                  width="14"
                  height="8"
                  viewBox="0 0 14 8"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <!-- Your SVG path here -->
                </svg>
              </span>
            </div>
          </v-btn>
        </template>
        <v-list width="200">
          <v-list-item
            v-for="option in filterOptions.gender"
            :key="option.key"
            @click="selectedGender = option.key"
          >
            <v-list-item-title>{{ option.value }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </div>
    <!-- City Filter -->
    <div>
      <v-menu>
        <template v-slot:activator="{ props }">
          <v-btn v-bind="props" height="auto" rounded="pill" color="gray">
            <div class="d-flex py-2">
              <span class="me-2">{{ getDisplayValue(filterOptions.city, selectedCity) }}</span>
              <span>
                <svg
                  width="14"
                  height="8"
                  viewBox="0 0 14 8"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <!-- Your SVG path here -->
                </svg>
              </span>
            </div>
          </v-btn>
        </template>
        <v-list width="200">
          <v-list-item
            v-for="option in filterOptions.city"
            :key="option.key"
            @click="selectedCity = option.key"
          >
            <v-list-item-title>{{ option.value }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </div>
    <!-- Age Filter -->
    <div>
      <v-menu>
        <template v-slot:activator="{ props }">
          <v-btn v-bind="props" height="auto" rounded="pill" color="gray">
            <div class="d-flex py-2">
              <span class="me-2">{{ getDisplayValue(filterOptions.age, selectedAge) }}</span>
              <span>
                <svg
                  width="14"
                  height="8"
                  viewBox="0 0 14 8"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <!-- Your SVG path here -->
                </svg>
              </span>
            </div>
          </v-btn>
        </template>
        <v-list width="200">
          <v-list-item
            v-for="option in filterOptions.age"
            :key="option.key"
            @click="selectedAge = option.key"
          >
            <v-list-item-title>{{ option.value }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </div>
  </v-sheet>
</template>