<script setup>
import {provide, ref, watch} from 'vue';
import { useRoute } from 'vue-router';
import Sidebar from '@/components/Sidebar.vue';
import BaseToast from '@/components/BaseToast.vue';
import { successMessage, errorMessages } from '@/api/util.js';

const route = useRoute();
const isSidebarOpen = ref(false);

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
};

provide('sidebarControl', {
  isSidebarOpen,
  toggleSidebar
});

watch(
    () => route.fullPath,
    () => {
      isSidebarOpen.value = false;
    }
);
</script>

<template>
  <div class="flex w-full min-h-screen relative">

    <div
        v-if="isSidebarOpen"
        @click="isSidebarOpen = false"
        class="fixed inset-0 bg-black/50 z-1040 md:hidden"
    ></div>

    <aside
        v-if="route.meta.showSidebar"
        class="w-70 bg-[#212529] z-1050 transition-transform duration-300 ease-in-out
               fixed inset-y-0 left-0 -translate-x-full
               md:sticky md:top-0 md:h-screen md:translate-x-0"
        :class="{ 'translate-x-0': isSidebarOpen }"
    >
      <Sidebar />
    </aside>

    <main class="grow bg-white">
      <router-view />
    </main>

    <BaseToast
        :model-value="successMessage !== null"
        v-if="successMessage"
        type="success"
        :message="successMessage"
    />
    <BaseToast
      v-for="(error, index) in errorMessages"
      :key="error.id"
      :model-value="true"
      @update:model-value="errorMessages.splice(index, 1)"
      type="error"
      :message="error.text"
      :style="{ bottom: `calc(1rem + ${index * 4.5}rem)` }"
    />
  </div>
</template>