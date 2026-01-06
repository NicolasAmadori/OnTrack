<template>
  <BaseBanner title="OnTrack" imageType="station">
    <div class="position-relative w-100 p-3 bg-transparent">
      <BaseInput v-model="fromLocation" placeholder="From" />
      <BaseInput v-model="toLocation" placeholder="To" />
      
      <button class="btn rounded-circle swap-btn position-absolute top-50 end-0 translate-middle-y me-2 d-flex align-items-center justify-content-center" @click="swapLocations">
        <i class="bi bi-arrow-down-up"></i>
      </button>
    </div>
  </BaseBanner>
  <BaseSelect iconName="bi-calendar-event-fill" text="Select Date" class="mt-3 mx-2" @click="handleDateSelect"/>
</template>

<script setup>
import { ref } from 'vue';
import BaseBanner from '@/components/BaseBanner.vue';
import BaseInput from '@/components/BaseInput.vue';
import BaseSelect from '@/components/BaseSelect.vue';

const fromLocation = ref('');
const toLocation = ref('');

const swapLocations = () => {
  const temp = fromLocation.value;
  fromLocation.value = toLocation.value;
  toLocation.value = temp;
};
const handleDateSelect = () => {
};
</script>

<style scoped>
.force-bg-transparent {
  background-color: transparent !important;
}

.swap-btn {
  background-color: var(--dark);
  width: 50px;
  height: 50px;
  border: none;
  transition: transform 0.2s;
  z-index: 10;
}

.swap-btn:hover {
  transform: scale(1.1);
  background-color: var(--lessdark);
}

.swap-btn:active {
  background-color: var(--bright) !important;
}

.swap-btn:active i {
  color: var(--dark) !important;
  transform: rotate(180deg);
}

.swap-btn i {
  color: var(--bright);
  font-size: 1.5rem;
  background-color: transparent;
  transition: transform 0.2s;
}
</style>