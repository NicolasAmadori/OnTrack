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
                class="p-4 border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200"
            >
                <ReservationCard :reservation="reservation" />
            </div>
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import BaseBanner from "@/components/BaseBanner.vue";
import ReservationCard from "@/components/ReservationCard.vue";
import { getUserReservations } from '../api/reservations';

const reservations = ref([]);

const fetchReservations = async () => {
    try {
        reservations.value = await getUserReservations(localStorage.getItem('authToken'), localStorage.getItem('id'));
    } catch (error) {
        console.error('Error fetching reservations:', error);
    }
};

onMounted(fetchReservations);
</script>