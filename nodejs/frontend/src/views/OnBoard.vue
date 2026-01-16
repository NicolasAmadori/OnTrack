<template>
  <div class="relative min-h-screen w-full bg-cover bg-center overflow-hidden" :style="{ backgroundImage: `url(${onboard})` }">
    <div class="absolute inset-0 bg-white opacity-85"></div>

    <div class="">
        <div class="absolute top-0 left-0 bg-dark rounded-br-3xl sm:px-10 sm:py-10 px-6 py-5 z-10 shadow-lg">
        <h1 class="text-white text-2xl md:text-4xl font-medium m-0 leading-tight">OnBoard</h1>
        <h2 class="text-bright text-md md:text-xl ml-1">by OnTrack</h2>
        </div>
    </div>
    
    <div class="relative z-10 flex flex-col items-center w-full">
      <h1 class="text-dark font-bold text-[4rem] md:text-[6rem] lg:text-[10rem] leading-none mb-30 sm:ml-20 md:ml-0 ml-50">FR9802</h1>
      <div class="flex items-center gap-4 mb-12" :class="getDelayClass(delay)">
        <i class="bi bi-clock-fill text-5xl lg:text-8xl md:text-6xl"></i>
        <span class="font-bold text-5xl lg:text-8xl md:text-6xl">{{ formatDuration(delay * 60000) }}</span>
      </div>

      <div class="flex flex-col items-center mx-5">
        <img :src="trainSvg" class="h-16 md:h-32 lg:h-48 mx-auto" alt="Train Diagram" />
        
        <div class="flex justify-between w-full px-12">
          <i 
            class="bi bi-badge-wc-fill text-8xl lg:text-9xl transition-colors duration-300" 
            :class="bathrooms[0]?.isOccupied ? 'text-red' : 'text-green'">
          </i>
          <i 
            class="bi bi-badge-wc-fill text-8xl lg:text-9xl transition-colors duration-300" 
            :class="bathrooms[1]?.isOccupied ? 'text-red' : 'text-green'">
          </i>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import onboard from '@/assets/images/banners/onboard.png';
import trainSvg from '@/assets/images/train.svg';
import { getDelayClass, formatDuration } from '@/util/dateTime.js';

const delay = ref(10);
const bathrooms = ref([
  { isOccupied: false },
  { isOccupied: true }
]);
</script>
