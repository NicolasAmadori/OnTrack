<template>
    <BaseBanner title="Reservations" imageType="tickets"/>
    <div class="max-w-4xl mx-auto p-4">
        <div v-if="reservations.length === 0" class="text-center text-lessdark mt-10">
        You have no reservations yet.
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
                    @delete="reservationToDelete = reservation"
                    @show-details="showReservationDetails = reservation"
                    />
            </div>
        </div>
    </div>
    <ConfirmationPopup v-if="reservationToDelete" 
        :title="'Delete Reservation'" 
        :question="'Are you sure you want to delete this reservation? This action cannot be undone.'" 
        @confirm="delReservation(reservationToDelete._id)" 
        @cancel="reservationToDelete = null"
    />
    <ReservationDetailsPopup 
        v-if="showReservationDetails" 
        :passengers="showReservationDetails.passengers"
        @close="showReservationDetails = null"
    />
</template>

<script setup>
import { onMounted, onUnmounted, ref } from 'vue';
import BaseBanner from "@/components/BaseBanner.vue";
import ReservationCard from "@/components/ReservationCard.vue";
import { getUserReservations, deleteReservation } from '@/api/reservations';
import ConfirmationPopup from '@/components/ConfirmationPopup.vue';
import ReservationDetailsPopup from '@/components/ReservationDetailsPopup.vue';
import { localAuthToken, localId } from "@/util/auth.js";
import { onEvent, offEvent } from "@/router/useSocket.js";

const reservations = ref([]);
const reservationToDelete = ref(null);
const showReservationDetails = ref(null);

const fetchReservations = async () => {
    try {
        reservations.value = await getUserReservations(localAuthToken.value, localId.value);
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

const handleTrainUpdate = (data) => {
    reservations.value.forEach(reservation => {
        reservation.nodes.forEach(node => {
            if (node.train._id === data.trainId && data.cancelled !== undefined) {
                node.train.cancelled = data.cancelled;
            }
        });
    });
};

onMounted(() => {
    fetchReservations();
    onEvent('train_update', handleTrainUpdate);
});

onUnmounted(() => {
    offEvent('train_update', handleTrainUpdate);
});
</script>