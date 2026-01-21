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
import {createErrors, successMessage} from "@/api/util.js";
import { emitEvent, offEvent, onEvent } from "@/router/useSocket.js";
import { localAuthToken, localId } from "@/util/auth.js";

const REFRESH_INTERVAL = 1_000;

const route = useRoute();
const router = useRouter();
const isSubmitting = ref(false);
const solution = ref(null);
const passengersData = ref([]);
let refreshIntervalId = null;

const bookedSeats = ref({}); //Seats already booked sourced from the database
const dynamicallySelectedSeats = ref(null); //seats selected from every clients, not already booked

const routeSubtitle = computed(() => {
  if (!solution.value) return "";
  return solution.value.nodes.map(n => n.train.code).join(" / ");
});

const trainSeats = computed(() => {
  if (!solution.value) return [];
  const trains = solution.value.nodes.map(n => ({
    code: n.train.code,
    departureTime: n.departure_time,
    arrivalTime: n.arrival_time,
    occupied: []
  }));

  const dynamicallySelectedMap = new Map(dynamicallySelectedSeats.value.map(g => [g.trainCode, g.occupied]));

  trains.forEach(train => {
    const occupiedInThisTrain = [];

    if (bookedSeats.value[train.code]) {
      occupiedInThisTrain.push(...bookedSeats.value[train.code]);
    }

    occupiedInThisTrain.push(...dynamicallySelectedMap.get(train.code));

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
  solution.value = await getSolution(localAuthToken.value, route.params.solutionId);
  bookedSeats.value = await getSolutionOccupiedSeats(localAuthToken.value, solution.value.solution_id);

  dynamicallySelectedSeats.value = solution.value.nodes.map(n => ({
    trainCode: n.train.code,
    departureTime: n.departure_time,
    arrivalTime: n.arrival_time,
    occupied: []
  }));
  await initializePassengersData();

  if (solution.value) {
    solution.value.nodes.forEach(n => {
      emitEvent("join_room", "train_" + n.train.code);
    });
    onEvent('seat_selected', handledRedisSeatUpdate);
  }

  refreshIntervalId = window.setInterval(async () => {
    emitEvent('lock_seats', { bookingGroups: getLocallySelectedSeats() })
  }, REFRESH_INTERVAL);
});

onUnmounted(() => {
  if (solution.value) {
    solution.value.nodes.forEach(n => {
      emitEvent("leave_room", "train_" + n.train.code);
    });
    offEvent('seat_selected', handledRedisSeatUpdate);
  }
  if (refreshIntervalId) clearInterval(refreshIntervalId);
});

const initializePassengersData = async () => {
  const count = Number(history.state.passengers);
  if (count && count > 0) {
    const user = await getUser(localAuthToken.value, localId.value);
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
    await router.push("/home");
  }
}

const handleLocalSeatUpdate = async (index, newSeats) => {
  passengersData.value[index].seats = newSeats;
  emitEvent('lock_seats', { bookingGroups: getLocallySelectedSeats() })
};

const getLocallySelectedSeats = () => {
  const bookingGroups = solution.value.nodes.map(n => ({
    trainCode: n.train.code,
    departureTime: n.departure_time,
    arrivalTime: n.arrival_time,
    seats: []
  }));

  bookingGroups.forEach(group => {
    const occupiedInThisTrain = [];

    passengersData.value.forEach(p => {
      const selectedSeat = p.seats.get(group.trainCode);
      if (selectedSeat) {
        occupiedInThisTrain.push(selectedSeat);
      }
    });

    group.seats = occupiedInThisTrain;
  });

  return bookingGroups;
}

const handledRedisSeatUpdate = (data) => {
  dynamicallySelectedSeats.value.forEach(t => {
    if (data.trainCode === t.trainCode) {
      const nodeDepTime = new Date(t.departureTime).getTime();
      const nodeArrTime = new Date(t.arrivalTime).getTime();
      const trainDepTime = new Date(data.departureTime).getTime();
      const trainArrTime = new Date(data.arrivalTime).getTime();
      if (trainDepTime < nodeArrTime && trainArrTime > nodeDepTime) {
        if (data.status === "locked") {
          t.occupied.push(data.seat);
        } else {
          t.occupied = t.occupied.filter(s => s !== data.seat);
        }
      }
    }
  });
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
    await router.push('/reservations');
    successMessage.value = "Reservation completed successfully";
  } catch (error) {
    createErrors([error.message]);
  } finally {
    isSubmitting.value = false;
  }
};
</script>