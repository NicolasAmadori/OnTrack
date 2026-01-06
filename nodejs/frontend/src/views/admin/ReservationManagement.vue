<template>
  <button
      @click="goBack"
      class="position-fixed top-0 start-0 m-2 bg-transparent border-0 p-2"
      style="z-index: 1050;"
      title="Go back"
  >
    <i class="bi bi-arrow-left-circle-fill text-dark text-4xl shadow-sm" style="font-size: 2.5rem;"></i>
  </button>
  <BaseBanner title="Reservation Management" imageType="tickets" :subtitle="displaySubtitle" admin/>

  <div class="container-fluid mt-4">
    <div class="row mt-4 justify-content-center">
      <div class="col-12 col-md-8">

        <div v-if="isLoading" class="text-center py-5">
          <span class="spinner-border text-primary" role="status"></span>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import {ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';

import { getUser } from '@/api/users.js';

// Store e State
const router = useRouter();
const route = useRoute();
const user_id = computed(() => route.params.user_id);
const user = ref(null);
const reservations = ref([]);
const isLoading = ref(false);
const error = ref(null);

const goBack = () => {
  router.back();
};

const displaySubtitle = computed(() => {
  return user.value?.email || "";
});

/**
 * Load reservations
 */
const loadReservations = async () => {
  isLoading.value = true;
  try {
    user.value = await getUser(localStorage.getItem("authToken"), user_id.value);
  } catch (e) {
    console.error("Error:", e);
    error.value = "Unable to retrieve user.";
  } finally {
    isLoading.value = false;
  }
};

onMounted(loadReservations);
</script>