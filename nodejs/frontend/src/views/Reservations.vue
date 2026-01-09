<template>
  <BaseBanner title="Reservations" imageType="tickets"/>
</template>

<script setup>
import { onMounted } from 'vue';
import BaseBanner from "@/components/BaseBanner.vue";

const fetchReservations = async () => {
};

onMounted(fetchReservations);
</script>