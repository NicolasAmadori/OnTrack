<template>
  <div class="group relative mb-3 flex h-19.25 items-stretch overflow-hidden rounded-xl bg-transparent shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg mx-4 xl:mx-40">

    <router-link
        :to="`/results/${id}`"
        class="flex flex-1 items-center justify-between min-w-0 bg-light px-5"
    >
      <div class="flex flex-col lg:flex-row items-start lg:items-center gap-y-1 lg:gap-y-0 lg:gap-x-6 justify-center">

        <span class="truncate font-mono text-[22px] text-black font-bold">
          {{ time }}
        </span>

        <div class="flex items-center">
          <template v-for="(logoKey, index) in logos" :key="logoKey">

            <img
                :src="getTrainLogo(logoKey)"
                :alt="logoKey"
                class="h-5 w-auto object-contain"
            />

            <span
                v-if="index < logos.length - 1"
                class="mx-2 text-black text-[15px] font-bold"
            >
              /
            </span>
          </template>
        </div>
      </div>
    </router-link>

    <div class="flex items-center px-2 md:px-3 w-[100px] md:w-[200px] justify-center" :style="divStyle">
      <h1 class="font-bold text-[20px] md:text-[25px]" :style="priceStyle">{{ price }}</h1>
    </div>
  </div>
</template>

<script setup>
import {computed} from "vue";
import { getTrainLogo } from "@/util/trainLogos";

const props = defineProps({
  id: { type: [String, Number], required: true },
  time: { type: String, required: true },
  price: { type: String, required: true },
  highlighted: { type: Boolean, default: false },
  logos: {
    type: Array,
    default: () => ['ferrovie'],
    validator: (value) => {
      if (value.length < 1 || value.length > 3) return false;
      const allowedKeys = [
        'ferrovie',
        'frecciarossa',
        'intercity',
        'italo',
        'regionale',
        'regionaleVeloce'
      ];
      return value.every(key => allowedKeys.includes(key));
    }
  }
})

const divStyle = computed(() => ({
  background: props.highlighted ? 'var(--dark)' : 'var(--lesslight)'
}));

const priceStyle = computed(() => ({
  color: props.highlighted ? 'var(--bright)' : 'var(--lessdark)'
}));
</script>