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
      :trains="availableTrains"
      placeholder="Select your seat"
      @select="handleSelection"
  />
</template>

<script setup>
import { ref } from 'vue';
import BaseInput from '@/components/BaseInput.vue';
import SeatSelect from "@/components/SeatSelect.vue";

defineProps({
  title: {
    type: String,
    default: 'Passenger Info'
  }
});

const firstName = defineModel('firstName');
const lastName = defineModel('lastName');

const userSelection = ref(null);

const availableTrains = ref([
  {
    id: "FR9600",
    occupied: [ "A1" ]
  },
  {
    id: "RV7932",
    occupied: [ "B2", "C5" ]
  }
]);

const handleSelection = (selectionData) => {
  userSelection.value = selectionData;
};

</script>