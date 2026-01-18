<template>
  <BaseBanner title="Reservation Management" imageType="tickets" :subtitle="displaySubtitle" admin goBackIcon/>

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
import { useRoute } from 'vue-router';

import { getUser } from '@/api/users.js';
import BaseBanner from "@/components/BaseBanner.vue";

const route = useRoute();
const user_id = computed(() => route.params.user_id);
const user = ref(null);
const reservations = ref([]);
const isLoading = ref(false);
const error = ref(null);

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