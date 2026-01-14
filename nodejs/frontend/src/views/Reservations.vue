<template>
    <BaseBanner title="Reservations" imageType="tickets"/>
    <div class="max-w-4xl mx-auto p-4">
        <div v-if="reservations.length === 0" class="text-center text-disabled mt-10">
        You have no reservations yet.
        </div>
        <div v-else class="space-y-6">
            <div 
                v-for="reservation in reservations" 
                :key="reservation._id"
            >
                <ReservationCard :reservation="reservation" @delete="reservationToDelete = reservation"/>
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
import { onMounted, ref } from 'vue';
import BaseBanner from "@/components/BaseBanner.vue";
import ReservationCard from "@/components/ReservationCard.vue";
import { getUserReservations, deleteReservation } from '../api/reservations';
import ConfirmationPopup from '../components/ConfirmationPopup.vue';

const reservations = ref([]);
const reservationToDelete = ref(null);

const fetchReservations = async () => {
    try {
        reservations.value = await getUserReservations(localStorage.getItem('authToken'), localStorage.getItem('id'));
    } catch (error) {
        console.error('Error fetching reservations:', error);
    }
};

const delReservation = async (reservationId) => {
    reservationToDelete.value = null;
    try {
        await deleteReservation(localStorage.getItem('authToken'), reservationId);
    } catch (error) {
        console.error('Error deleting reservation:', error);
    }
    reservations.value = reservations.value.filter(reservation => reservation._id !== reservationId);
};

onMounted(fetchReservations);
</script>