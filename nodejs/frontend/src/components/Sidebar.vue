<script setup>
import { logout } from '@/util/auth.js';

const isAdmin = localStorage.getItem('is_admin') === 'true';

const handleLogout = () => {
  logout();
};
</script>

<template>
  <div class="sidebar-container d-flex flex-column p-3 bg-light border-end h-100">
    <h4 class="mb-4 text-dark fw-bold px-2">OnTrack</h4>

    <ul class="nav nav-pills flex-column mb-auto">
      <li class="nav-item mb-2">
        <router-link to="/home" class="nav-link d-flex align-items-center gap-2 text-dark" active-class="!bg-bright !text-white">
          <i class="bi bi-house-door-fill fs-5"></i>
          <span>Home</span>
        </router-link>
      </li>
      <li class="nav-item mb-2">
        <router-link to="/profile" class="nav-link d-flex align-items-center gap-2 text-dark" active-class="!bg-bright !text-white">
          <i class="bi bi-person-badge fs-5"></i>
          <span>Profile</span>
        </router-link>
      </li>
      <li class="nav-item mb-2">
        <router-link to="/my-trip" class="nav-link d-flex align-items-center gap-2 text-dark" active-class="!bg-bright !text-white">
          <i class="bi bi-luggage-fill fs-5"></i>
          <span>My Trip</span>
        </router-link>
      </li>
      <li v-if="isAdmin" class="nav-item text-dark fw-bold px-2 mt-4">
        <h5>Admin</h5>
      </li>
      <li v-if="isAdmin" class="nav-item mb-2">
        <router-link to="/admin/user-management" class="nav-link d-flex align-items-center gap-2 text-dark" active-class="!bg-bright !text-white">
          <i class="bi bi-person-fill-gear fs-5"></i>
          <span>User Management</span>
        </router-link>
      </li>
      <li v-if="isAdmin" class="nav-item mb-2">
        <router-link to="/admin/train-management" class="nav-link d-flex align-items-center gap-2 text-dark" active-class="!bg-bright !text-white">
          <i class="bi bi-train-front-fill fs-5"></i>
          <span>Train Management</span>
        </router-link>
      </li>
    </ul>

    <hr>

    <button @click="handleLogout" class="btn btn-outline-danger btn-sm d-flex align-items-center gap-2 justify-content-center">
      <i class="bi bi-box-arrow-right"></i>
      Logout
    </button>
  </div>
</template>

<style scoped>
.sidebar-container {
  min-height: 100vh;
}

.nav-link {
  transition: all 0.2s;
  padding: 0.8rem 1rem;
}

.nav-link:hover {
  background-color: rgba(0, 0, 0, 0.05);
}
</style>