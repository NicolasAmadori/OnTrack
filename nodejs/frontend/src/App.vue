<script setup>
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import Sidebar from '@/components/Sidebar.vue';

const route = useRoute();
const isSidebarOpen = ref(false);

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
};

watch(
    () => route.fullPath,
    () => {
      isSidebarOpen.value = false;
    }
);
</script>

<template>
  <button
      v-if="route.meta.showSidebar && (isSidebarOpen === false)"
      @click.stop="toggleSidebar"
      class="btn-hamburger d-md-none position-fixed m-2 bg-transparent border-0 p-2"
  >
    <i class="bi bi-list !text-bright text-4xl font-bold"></i>
  </button>

  <div class="d-flex w-100 min-vh-100 position-relative">
    <div
        v-if="isSidebarOpen"
        @click="isSidebarOpen = false"
        class="sidebar-overlay d-md-none"
    ></div>

    <aside
        v-if="route.meta.showSidebar"
        class="sidebar-wrapper"
        :class="{ 'mobile-open': isSidebarOpen }"
    >
      <Sidebar />
    </aside>

    <main class="flex-grow-1 bg-white">
      <router-view />
    </main>
  </div>
</template>

<style scoped>
.btn-hamburger {
  z-index: 2000;
  line-height: 1;
  cursor: pointer;
}

.sidebar-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1040;
}

.sidebar-wrapper {
  width: 280px;
  background-color: #212529;
  z-index: 1050;
  transition: transform 0.3s ease;
}

@media (max-width: 767.98px) {
  .sidebar-wrapper {
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    transform: translateX(-100%);
  }

  .sidebar-wrapper.mobile-open {
    transform: translateX(0);
  }
}
</style>