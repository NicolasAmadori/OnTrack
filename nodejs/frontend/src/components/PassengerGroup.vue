<template>
  <div class="row fs-4 dark mx-4 xl:mx-40">{{ title }}</div>

  <BaseInput
      id="first_name"
      v-model="firstName"
      type="text"
      placeholder="First name"
  />
  <BaseInput
      id="last_name"
      v-model="lastName"
      type="text"
      placeholder="Last name"
  />
  <SeatSelect
      :trains="trains"
      placeholder="Select your seat"
      @select="handleSelection"
  />
</template>

<script setup>
import BaseInput from '@/components/BaseInput.vue';
import SeatSelect from "@/components/SeatSelect.vue";

defineProps({
  title: {
    type: String,
    default: 'Passenger Info'
  },
  trains: {
    type: Array,
    default: []
  }
});

const firstName = defineModel('firstName');
const lastName = defineModel('lastName');
const selectedSeats = defineModel('selectedSeats');

const handleSelection = (selectionData) => {
  selectedSeats.value = selectionData;
};

</script>