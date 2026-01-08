<template>
  <BaseBanner title="OnTrack" imageType="station">
    <div class="relative w-full p-2 bg-transparent z-1000">
      <BaseInput v-model="fromLocation" placeholder="From" class="mb-2" />
      <BaseInput v-model="toLocation" placeholder="To" />
      
      <button 
        class="absolute top-1/2 right-2 xl:right-40 -translate-y-1/2 w-[50px] h-[50px] rounded-full bg-dark border-none transition-transform duration-200 z-20 flex items-center justify-center group hover:scale-110 hover:bg-lessdark active:bg-bright" 
        @click="swapLocations"
      >
        <i class="bi bi-arrow-down-up text-2xl text-bright transition-transform duration-200 group-active:text-dark group-active:rotate-180"></i>
      </button>
    </div>
  </BaseBanner>
  <BaseSelect 
    iconName="bi-calendar-event-fill" 
    :text="formattedDate" 
    class="mt-5 mx-2" 
    @click="handleDateSelect"
  />
  <DateTimePopup 
    v-if="showDatePopup"
    v-model="selectedDate"
    @close="showDatePopup = false"
  />
  <BaseSelect
    iconName="bi-people-fill"
    :text="numPassengers + ' Passenger' + (numPassengers > 1 ? 's' : '')"
    :options="[1, 2, 3, 4, 5, 6, 7, 8, 9]"
    v-model="numPassengers"
    @select="numPassengers = $event"
    class="mt-3 mx-2"
  />
  <BaseButton 
    variant="primary" 
    class="mt-4 mx-2" 
    @click=""
  >
    Search Trains
  </BaseButton>
</template>

<script setup>
import { ref, computed } from 'vue';
import BaseBanner from '@/components/BaseBanner.vue';
import BaseInput from '@/components/BaseInput.vue';
import BaseSelect from '@/components/BaseSelect.vue';
import DateTimePopup from '@/components/DateTimePopup.vue';
import BaseButton from '../components/BaseButton.vue';

const fromLocation = ref('');
const toLocation = ref('');

const selectedDate = ref(new Date());
const showDatePopup = ref(false);

const numPassengers = ref(1);

const formattedDate = computed(() => {
  return selectedDate.value.toLocaleString('en-UK', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
});

const swapLocations = () => {
  const temp = fromLocation.value;
  fromLocation.value = toLocation.value;
  toLocation.value = temp;
};
const handleDateSelect = () => {
    showDatePopup.value = true;
};
</script>