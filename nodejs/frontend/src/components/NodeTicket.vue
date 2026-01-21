<template>
  <div class="bg-light text-dark rounded-lg shadow-md font-mono max-w-lg w-full mx-auto relative p-6">

    <div class="">
      <h2 class="text-2xl font-bold uppercase tracking-wide">{{ first_name }} {{ last_name }}</h2>
      <div class="text-xs uppercase opacity-60 tracking-widest mt-1">Passenger Ticket</div>
    </div>

    <div class="border-b-1 border-dark opacity-40 my-3 relative"></div>


    <div class="space-y-2">
      <div v-for="(s, index) in seats" :key="index" class="flex flex-col">

        <div class="flex justify-between items-center text-lg font-bold">
          <span>{{ s.node.origin }}</span>
          <span class="text-lg opacity-50 px-2">→</span>
          <span>{{ s.node.destination }}</span>
        </div>

        <div class="flex justify-between text-sm mt-1 mb-2">
          <span class="font-semibold">{{ formatDateTimeCompact(s.node.departure_time) }}</span>
          <span class="font-semibold">{{ formatDateTimeCompact(s.node.arrival_time) }}</span>
        </div>

        <div class="flex justify-between items-center bg-white/40 p-2 rounded">
          <div class="flex flex-col">
            <span class="text-[10px] uppercase opacity-70">Train</span>
            <span class="font-bold text-3xl">{{ s.node.train.code }}</span>
          </div>
          <div class="flex flex-col items-end">
            <span class="text-[10px] uppercase opacity-70">Seat</span>
            <span class="font-bold text-3xl">{{ s.seat }}</span>
          </div>
        </div>
      </div>
    </div>
    
  </div>
</template>

<script setup>
import { formatDateTimeCompact } from '@/util/dateTime.js';

const props = defineProps({
  first_name: {
    type: String,
    required: true
  },
  last_name: {
    type: String,
    required: true
  },
  seats: {
    type: Array,
    required: true
  }
});
</script>
