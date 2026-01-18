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

        :selectedSeats="passenger.seats"
        @update:selectedSeats="(val) => handleSeatUpdate(index, val)"
    />
  </div>

  <BaseButton @click="handleReserve" variant="primary" :loading="isSubmitting">
    Reserve
  </BaseButton>
</template>

<script setup>
import {ref, onMounted, reactive} from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getSolution } from "@/api/solutions.js";
import MinimalBanner from "@/components/MinimalBanner.vue";
import BaseButton from '@/components/BaseButton.vue';
import PassengerGroup from '@/components/PassengerGroup.vue';
import ReservationCard from '@/components/ReservationCard.vue';
import {getUser} from "@/api/users.js";
import { createReservation } from "@/api/reservations.js";

const route = useRoute();
const router = useRouter();
const routeSubtitle = ref("");
const isSubmitting = ref(false);
const solution = ref(null);
const passengersData = ref([]);
const trainSeats = ref(null);
const solutionNodes = ref(null);

onMounted(async () => {
  const count = Number(history.state.passengers);
  const user = await getUser(localStorage.getItem('authToken'), localStorage.getItem('id'));

  if (count && count > 0) {
    const firstPassenger = {
      firstName: user.first_name,
      lastName: user.last_name,
      seats: null
    };

    const otherPassengers = Array.from({ length: count - 1 }, () => ({
      firstName: '',
      lastName: '',
      seats: null
    }));

    passengersData.value = [firstPassenger, ...otherPassengers];
  } else {
    router.back();
  }

  solution.value = await getSolution(localStorage.getItem("authToken"), route.params.solutionId);
  console.log(solution.value);
  routeSubtitle.value = solution.value.nodes.map(n => n.train.code).join(" / ");
  trainSeats.value = solution.value.nodes
      .map(n => ({
        "code": n.train.code,
        "occupied": []
      }));
  solutionNodes.value = solution.value.nodes.reduce((map, node) => {
    const trainCode = node.train.code;
    map[trainCode] = node;
    return map;
  }, {});
});

const handleReserve = async () => {
  isSubmitting.value = true;
  try {
    const reservationBody = {
      solution_id: solution.value.solution_id,
      user: localStorage.getItem("id"),
      passengers: passengersData.value.map(p => ({
        first_name: p.firstName,
        last_name: p.lastName,
        seats: p.seats ? Array.from(p.seats).map(([trainId, seatCode]) => ({
          seat: seatCode,
          node: solutionNodes.value[trainId]._id
        })) : []
      }))
    };
    await createReservation(
        localStorage.getItem("authToken"),
        localStorage.getItem("id"),
        reservationBody
    );
  } catch (error) {

  } finally {
    isSubmitting.value = false;
    router.push('/reservations')
  }
};

const handleSeatUpdate = (index, newSeats) => {
  passengersData.value[index].seats = newSeats;

  const allOccupiedSeats = {};
  passengersData.value.filter(p => p.seats).forEach(passenger => {
    passenger.seats.forEach((seatId, trainId) => {
      if (!allOccupiedSeats[trainId]) {
        allOccupiedSeats[trainId] = [];
      }
      allOccupiedSeats[trainId].push(seatId);
    });
  });

  trainSeats.value = trainSeats.value.map(t => ({
    code: t.code,
    occupied: allOccupiedSeats[t.code]
  }));
};
</script>