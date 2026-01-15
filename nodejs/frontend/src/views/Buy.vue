<template>
  <MinimalBanner
      title="Buy"
      :subtitle="routeSubtitle"
      goBackIcon
  />

  <div class="row fs-4 dark mx-4 xl:mx-40">Train Info</div>
  <div class="space-y-6">
    <ReservationCard
        v-if="solution"
        :departure_time="solution.departure_time"
        :arrival_time="solution.arrival_time"
        :origin="solution.origin"
        :destination="solution.destination"
        :duration="solution.duration"
        :price_amount="solution.price_amount"
        :price_currency="solution.price_currency"
        :nodes="solution.nodes"
        :num_passengers="passengersData.length"
        class="mx-2 xl:mx-40"
    />
  </div>
  <div class="my-4">
    <PassengerGroup
        v-for="(passenger, index) in passengersData"
        :key="index"
        :title="`Passenger ${index + 1}`"
        :trains="trainSeats"
        v-model:first-name="passenger.firstName"
        v-model:last-name="passenger.lastName"
        v-model:selectedSeats="passenger.seats"
    />
  </div>

  <BaseButton @click="handleReserve" variant="primary" :loading="isSubmitting">
    Reserve
  </BaseButton>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getSolution } from "@/api/solutions.js";
import MinimalBanner from "@/components/MinimalBanner.vue";
import BaseButton from '@/components/BaseButton.vue';
import PassengerGroup from '@/components/PassengerGroup.vue';
import ReservationCard from '@/components/ReservationCard.vue';

const route = useRoute();
const router = useRouter();
const routeSubtitle = ref("");
const isSubmitting = ref(false);
const solution = ref(null);
const passengersData = ref([]);
const trainSeats = ref(null);

onMounted(async () => {
  const count = Number(history.state.passengers);

  if (count && count > 0) {
    passengersData.value = Array.from({ length: count }, () => ({
      firstName: '',
      lastName: '',
      seats: null
    }));
  } else {
    router.back();
  }

  solution.value = await getSolution(localStorage.getItem("authToken"), route.params.solutionId);
  routeSubtitle.value = solution.value.nodes.map(n => n.train.code).join(" / ");
  trainSeats.value = solution.value.nodes
      .map(n => ({
        "code": n.train.code,
        "occupied": []
      }));
});

const handleReserve = () => {
  isSubmitting.value = true;

  console.log("Submitting Passenger Data:", passengersData.value);
  isSubmitting.value = false;
};
</script>