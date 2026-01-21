<template>
    <div class="relative min-h-screen w-full bg-cover bg-center overflow-hidden" :style="{ backgroundImage: `url(${onboard})` }">
        <div class="absolute inset-0 bg-white opacity-85"></div>
        
        <div class="absolute top-0 left-0 bg-bright rounded-br-3xl sm:px-10 sm:py-10 px-6 py-5 z-10 shadow-lg">
            <h1 class="text-white text-2xl md:text-4xl font-medium m-0 leading-tight">OnBoard</h1>
            <h2 class="text-darker text-md md:text-xl ml-1">by OnTrack</h2>
        </div>
        
        <div v-if="train">
            <div class="relative z-10 flex flex-col items-center w-full">
                <h2 class="text-bright font-bold text-[4rem] md:text-[6rem] lg:text-[10rem] leading-none mb-30 sm:ml-20 md:ml-0 ml-50"
                    :class="train.cancelled ? 'line-through text-gray' : ''">{{ trainCode }}</h2>
                <div v-if="train.cancelled" class="bg-red text-white text-center font-bold py-1 text-2xl w-full">
                    TRAIN CANCELLED
                </div>
                <div v-else class="flex flex-col items-center">
                    <div class="flex items-center gap-4 mb-12" :class="getDelayClass(train.delay)">
                        <i class="bi bi-clock-fill text-5xl lg:text-8xl md:text-6xl"></i>
                        <input 
                            aria-label="Train delay in minutes"
                            type="number" 
                            v-model="train.delay" 
                            @change="updateDelay" 
                            min="0"
                            max="9999"
                            oninput="if(this.value.length > 4) this.value = this.value.slice(0, 4); this.value = this.value.replace(/[^0-9]/g, '')"
                            class="font-bold text-5xl lg:text-8xl md:text-6xl bg-transparent border-b-4 border-current w-65 text-center focus:outline-none"
                        />
                        <span class="font-bold text-5xl lg:text-8xl md:text-6xl">m</span>
                    </div>

                    <div class="flex flex-col items-center mx-5">
                        <img :src="trainSvg" class="h-16 md:h-32 lg:h-48 mx-auto" alt="Train Diagram" />
                        <div class="flex justify-between w-full px-12">
                        <i 
                            role="button"
                            tabindex="0"
                            aria-label="Toggle bathroom 1"
                            @keydown.enter="toggleBathroom(0)"
                            @keydown.space="toggleBathroom(0)"
                            class="bi bi-badge-wc-fill text-8xl lg:text-9xl transition-colors duration-300 cursor-pointer hover:scale-110" 
                            :class="train.bathrooms[0]?.isOccupied ? 'text-red' : 'text-green'"
                            @click="toggleBathroom(0)">
                        </i>
                        <i 
                            role="button"
                            tabindex="0"
                            aria-label="Toggle bathroom 2"
                            @keydown.enter="toggleBathroom(1)"
                            @keydown.space="toggleBathroom(1)"
                            class="bi bi-badge-wc-fill text-8xl lg:text-9xl transition-colors duration-300 cursor-pointer hover:scale-110" 
                            :class="train.bathrooms[1]?.isOccupied ? 'text-red' : 'text-green'"
                            @click="toggleBathroom(1)">
                        </i>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div v-else class="relative z-10 flex justify-center items-center h-screen text-2xl md:text-4xl text-black">
            No train data available.
        </div>
  </div>
</template>

<script setup>
import { get_train, update_train } from '@/api/trains.js';
import onboard from '@/assets/images/banners/onboard.png';
import trainSvg from '@/assets/images/train.svg';
import { getDelayClass } from '@/util/dateTime.js';
import { computed, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { localAuthToken } from "@/util/auth.js";

const route = useRoute();
const trainCode = computed(() => route.params.trainCode );
const train = ref(null);

const updateDelay = async () => {
  train.value.delay = Math.min(Math.max(train.value.delay, 0), 9999);
  await update_train(localAuthToken.value, train.value._id, { delay: train.value.delay });
};

const toggleBathroom = async (index) => {
    if (!train.value.bathrooms) {
        train.value.bathrooms = [];
    }
    if (!train.value.bathrooms[index]) {
        for (let i = train.value.bathrooms ? train.value.bathrooms.length : 0; i <= index; i++) {
            train.value.bathrooms = train.value.bathrooms || [];
            train.value.bathrooms.push({ isOccupied: false, queue: [] });
        }
    }
    train.value.bathrooms[index].isOccupied = !train.value.bathrooms[index].isOccupied;
    await update_train(localAuthToken.value, train.value._id, { bathrooms: train.value.bathrooms });
};

onMounted(async () => {
  train.value = await get_train(trainCode.value);
});
</script>
