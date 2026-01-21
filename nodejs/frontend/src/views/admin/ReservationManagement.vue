<template>
  <BaseBanner title="Reservation Management" imageType="tickets" :subtitle="displaySubtitle" admin goBackIcon/>
    <div class="max-w-4xl mx-auto p-4">
      <div v-if="reservations.length === 0" class="text-center text-lessdark mt-10">
        User has no reservations yet.
      </div>
      <div v-else class="space-y-6">
        <div 
          v-for="reservation in reservations" 
          :key="reservation._id"
        >
          <ReservationCard
            :departure_time="reservation.departure_time"
            :arrival_time="reservation.arrival_time"
            :origin="reservation.origin"
            :destination="reservation.destination"
            :duration="reservation.duration"
            :price_amount="reservation.price_amount"
            :price_currency="reservation.price_currency"
            :nodes="reservation.nodes"
            :num_passengers="reservation.passengers.length"
            :reservation_id="reservation._id"
            @delete="reservationToDelete = reservation"/>
        </div>
      </div>
    </div>
    <ConfirmationPopup v-if="reservationToDelete" 
        :title="'Delete Reservation'" 
        :question="'Are you sure you want to delete this reservation? This action cannot be undone.'" 
        @confirm="delReservation(reservationToDelete._id)" 
        @cancel="reservationToDelete = null"
    />
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import BaseBanner from "@/components/BaseBanner.vue";
import ReservationCard from "@/components/ReservationCard.vue";
import { getUser } from '@/api/users.js';
import { getUserReservations, deleteReservation } from '@/api/reservations';
import ConfirmationPopup from '@/components/ConfirmationPopup.vue';
import { localAuthToken } from "@/util/auth.js";

const route = useRoute();
const user_id = computed(() => route.params.user_id);
const user = ref(null);
const reservations = ref([]);
const reservationToDelete = ref(null);

const displaySubtitle = computed(() => {
  return user.value?.email || "";
});

const fetchUser = async () => {
    try {
        user.value = await getUser(localAuthToken.value, user_id.value);
    } catch (error) {
        console.error('Error fetching user:', error);
    }
};

const fetchReservations = async () => {
    try {
        reservations.value = await getUserReservations(localAuthToken.value, user_id.value);
    } catch (error) {
        console.error('Error fetching reservations:', error);
    }
};

const delReservation = async (reservationId) => {
    reservationToDelete.value = null;
    try {
        await deleteReservation(localAuthToken.value, reservationId);
    } catch (error) {
        console.error('Error deleting reservation:', error);
    }
    reservations.value = reservations.value.filter(reservation => reservation._id !== reservationId);
};

onMounted(() => {
    fetchUser();
    fetchReservations();
});
</script>