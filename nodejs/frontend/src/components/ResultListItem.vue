<template>
  <div class="group relative mb-3 flex h-19.25 items-stretch overflow-hidden rounded-xl bg-transparent shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg mx-4 xl:mx-40">

    <div class="absolute top-1.5 left-5 z-10 text-[11px] md:text-[13px] font-medium text-gray-500 pointer-events-none">
      {{ origin }} <span class="mx-0.5 text-gray-400">➝</span> {{ destination }}
    </div>
    <router-link
        :to="`/results/${id}`"
        class="flex flex-1 items-center justify-between min-w-0 bg-light px-5"
    >
      <div class="flex flex-col lg:flex-row items-start lg:items-center gap-y-0 lg:gap-y-0 lg:gap-x-6 justify-center mt-2">

        <span class="truncate font-mono text-[22px] text-black font-bold lg:mt-0 mt-5">
          {{ time }}
        </span>

        <div class="flex items-center lg:mt-0 -mt-1">
          <template v-for="(logoKey, index) in logos" :key="logoKey">

            <img
                :src="LOGO_MAP[logoKey]"
                :alt="logoKey"
                class="h-3 lg:h-4 w-auto object-contain"
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

    <div class="flex items-center px-2 md:px-3 w-25 md:w-50 justify-center" :style="divStyle">
      <h1 class="font-bold text-[20px] md:text-[25px]" :style="priceStyle">{{ price }}</h1>
    </div>
  </div>
</template>

<script setup>
import {computed} from "vue";

import fallbackLogo from '@/assets/images/logos/fallback.png';
import frecciarossaLogo from '@/assets/images/logos/FR.png';
import intercityLogo from '@/assets/images/logos/IC.png';
import italoLogo from '@/assets/images/logos/italo.png';
import regionaleLogo from '@/assets/images/logos/REnoTI.png';
import regionaleVeloceTTPER from '@/assets/images/logos/RVnoTI.png';
import regionaleVeloceLogo from '@/assets/images/logos/RV.png';
import intercityNotteLogo from '@/assets/images/logos/NI.png';
import frecciarossa1000Logo from '@/assets/images/logos/FR1000.png';

const LOGO_MAP = {
  fallback: fallbackLogo,
  FR: frecciarossaLogo,
  IC: intercityLogo,
  unknown: italoLogo,
  REnoTI: regionaleLogo,
  RVnoTI: regionaleVeloceTTPER,
  RV: regionaleVeloceLogo,
  NI: intercityNotteLogo,
  FR1000: frecciarossa1000Logo
};

const props = defineProps({
  id: { type: [String, Number], required: true },
  time: { type: String, required: true },
  price: { type: String, required: true },
  origin: { type: String, required: true },
  destination: { type: String, required: true },
  highlighted: { type: Boolean, default: false },
  logos: {
    type: Array,
    default: () => ['ferrovie'],
    validator: (value) => {
      if (value.length < 1 || value.length > 3) return false;
      const allowedKeys = [
        'fallback',
        'FR',
        'IC',
        'unknown',
        'REnoTI',
        'RVnoTI',
        'RV',
        'NI',
        'FR1000'
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