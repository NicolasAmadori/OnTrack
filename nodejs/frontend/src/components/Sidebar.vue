<script setup>
import { logout } from '@/util/auth.js';
import { useRoute } from 'vue-router';

const route = useRoute();
const isAdmin = localStorage.getItem('is_admin') === 'true';

const menuItems = [
  { name: 'Home', path: '/home', icon: 'bi-house-door-fill', metaKey: 'home' },
  { name: 'Profile', path: '/profile', icon: 'bi-person-badge', metaKey: 'profile' },
  { name: 'My Trip', path: '/my-trip', icon: 'bi-luggage-fill', metaKey: 'my-trip' },
];

const adminMenuItems = [
  { name: 'User Management', path: '/admin/user-management', icon: 'bi-person-fill-gear', metaKey: 'user-management' },
  { name: 'Train Management', path: '/admin/train-management', icon: 'bi-train-front-fill', metaKey: 'train-management' },
];

const isActive = (metaKey) => {
  return route.meta?.activeMenu === metaKey;
};

const handleLogout = () => {
  logout();
};
</script>

<template>
  <div class="flex flex-col p-4 bg-gray-100 border-r border-gray-200 h-full min-h-screen">

    <router-link to="/home" class="flex items-center gap-3 mb-6 px-2 no-underline">
      <img src="/logo.png" alt="Logo" class="h-14 w-auto object-contain" />
      <h4 class="text-black font-bold text-xl">OnTrack</h4>
    </router-link>

    <ul class="flex flex-col gap-1 grow list-none p-0">

      <li v-for="item in menuItems" :key="item.path" class="mb-1">
        <router-link
            :to="item.path"
            class="flex items-center gap-3 text-black p-3 rounded-lg transition-all duration-200 hover:bg-black/5"
            :class="{ 'bg-bright! text-white!': isActive(item.metaKey) }"
        >
          <i :class="['bi', item.icon, 'text-xl']"></i>
          <span class="font-medium">{{ item.name }}</span>
        </router-link>
      </li>

      <template v-if="isAdmin">
        <li class="text-black font-bold px-2 mt-6 mb-2">
          <h5 class="text-sm uppercase tracking-wider opacity-60">Admin</h5>
        </li>

        <li v-for="item in adminMenuItems" :key="item.path" class="mb-1">
          <router-link
              :to="item.path"
              class="flex items-center gap-3 text-black p-3 rounded-lg transition-all duration-200 hover:bg-black/5"
              :class="{ 'bg-bright! text-white!': isActive(item.metaKey) }"
          >
            <i :class="['bi', item.icon, 'text-xl']"></i>
            <span class="font-medium">{{ item.name }}</span>
          </router-link>
        </li>
      </template>

    </ul>

    <hr class="my-4 border-gray-300">

    <button
        @click="handleLogout"
        class="flex items-center gap-2 justify-center px-4 py-2 text-sm font-semibold text-red-600 border border-red-600 rounded-md transition-colors duration-200 hover:bg-red-600 hover:text-white cursor-pointer"
    >
      <i class="bi bi-box-arrow-right"></i>
      Logout
    </button>
  </div>
</template>