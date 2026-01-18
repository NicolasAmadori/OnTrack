<template>
    <BasePopup title="Reservation Details">
        <NodeTicket
            v-for="(passenger, index) in passengers"
            :key="index"
            :first_name="passenger.first_name"
            :last_name="passenger.last_name"
            :seats="passenger.seats"
            :class="index > 0 ? 'border-t-2 border-white border-dashed' : ''"
        />
    </BasePopup>
</template>

<script setup>
import BasePopup from './BasePopup.vue';
import NodeTicket from './NodeTicket.vue';

defineProps({
    passengers: { type: Array, required: true }
});

</script>