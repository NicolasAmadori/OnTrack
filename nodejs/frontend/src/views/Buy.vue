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
        @update:selectedSeats="(val) => handleLocalSeatUpdate(index, val)"
    />
  </div>

  <BaseButton @click="handleReserve" variant="primary" :loading="isSubmitting">
    Reserve
  </BaseButton>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getSolution, getSolutionOccupiedSeats } from "@/api/solutions.js";
import MinimalBanner from "@/components/MinimalBanner.vue";
import BaseButton from '@/components/BaseButton.vue';
import PassengerGroup from '@/components/PassengerGroup.vue';
import ReservationCard from '@/components/ReservationCard.vue';
import { getUser } from "@/api/users.js";
import { createReservation } from "@/api/reservations.js";
import { createErrors } from "@/api/util.js";
import { emitEvent, offEvent, onEvent } from "@/router/useSocket.js";
import { localAuthToken, localId } from "@/util/auth.js";

const route = useRoute();
const router = useRouter();
const isSubmitting = ref(false);
const solution = ref(null);
const passengersData = ref([]);
const occupiedSeats = ref({});

const routeSubtitle = computed(() => {
  if (!solution.value) return "";
  return solution.value.nodes.map(n => n.train.code).join(" / ");
});

const trainSeats = computed(() => {
  if (!solution.value) return [];
  const trains = solution.value.nodes.map(n => ({
    code: n.train.code,
    occupied: []
  }));

  trains.forEach(train => {
    const occupiedInThisTrain = [];

    if (occupiedSeats.value[train.code]) {
      occupiedInThisTrain.push(...occupiedSeats.value[train.code]);
    }

    passengersData.value.forEach(p => {
      const selectedSeat = p.seats.get(train.code);
      if (selectedSeat) {
        occupiedInThisTrain.push(selectedSeat);
      }
    });

    train.occupied = occupiedInThisTrain;
  });

  return trains;
});

const isFormValid = computed(() => {
  if (passengersData.value.length === 0) return false;
  return passengersData.value.every(p =>
      p.firstName &&
      p.firstName.trim() !== '' &&
      p.lastName &&
      p.lastName.trim() !== '' &&
      Array.from(p.seats.values()).every(s => s !== null)
  );
});

const solutionNodes = computed(() => {
  if(!solution.value) return {};
  return solution.value.nodes.reduce((map, node) => {
    map[node.train.code] = node;
    return map;
  }, {});
});

onMounted(async () => {
  const count = Number(history.state.passengers);
  const user = await getUser(localAuthToken.value, localId.value);

  solution.value = await getSolution(localAuthToken.value, route.params.solutionId);
  occupiedSeats.value = await getSolutionOccupiedSeats(localAuthToken.value, solution.value.solution_id);

  if (count && count > 0) {
    const defaultSeats = () => new Map(solution.value.nodes.map(n => [n.train.code, null]));

    passengersData.value = [
      {
        firstName: user.first_name,
        lastName: user.last_name,
        seats: defaultSeats()
      },
      ...Array.from({ length: count - 1 }, () => ({
        firstName: '',
        lastName: '',
        seats: defaultSeats()
      }))
    ];
  } else {
    router.back();
  }

  if (solution.value) {
    solution.value.nodes.forEach(n => {
      emitEvent("join_room", n.train.code);
    });
    onEvent('seat_update', handledRedisSeatUpdate);
  }
});

onUnmounted(() => {
  if (solution.value) {
    solution.value.nodes.forEach(n => {
      emitEvent("leave_room", n.train.code);
    });
    offEvent('seat_update', handledRedisSeatUpdate);
  }
});

const handleLocalSeatUpdate = (index, newSeats) => {
  passengersData.value[index].seats = newSeats;

  const trains = solution.value.nodes.map(n => ({
    code: n.train.code,
    occupied: []
  }));

  trains.forEach(train => {
    const occupiedInThisTrain = [];

    passengersData.value.forEach(p => {
      const selectedSeat = p.seats.get(train.code);
      if (selectedSeat) {
        occupiedInThisTrain.push(selectedSeat);
      }
    });

    train.occupied = occupiedInThisTrain;
  });
  emitEvent("seat_update", trains);
};

const handledRedisSeatUpdate = (data) => {
  console.log(data);
};

const handleReserve = async () => {
  isSubmitting.value = true;
  try {
    if(!isFormValid.value) {
      throw new Error('Fill all the fields and select a seat for every train');
    }

    const reservationBody = {
      solution_id: solution.value.solution_id,
      user: localId.value,
      passengers: passengersData.value.map(p => ({
        first_name: p.firstName,
        last_name: p.lastName,
        seats: p.seats ? Array.from(p.seats).map(([trainId, seatCode]) => ({
          seat: seatCode,
          node: solutionNodes.value[trainId]._id
        })) : []
      }))
    };

    await createReservation(localAuthToken.value, localId.value, reservationBody);
    router.push('/reservations');
  } catch (error) {
    createErrors([error.message]);
  } finally {
    isSubmitting.value = false;
  }
};
</script>