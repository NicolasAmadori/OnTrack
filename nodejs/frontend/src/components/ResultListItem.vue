<template>
  <div class="group relative mb-3 flex h-19.25 items-stretch overflow-hidden rounded-xl bg-transparent shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg mx-4 xl:mx-40">

    <router-link
        :to="`/results/${id}`"
        class="flex flex-1 items-center min-w-0 bg-light px-3"
    >
      <span class="truncate font-mono text-2xl text-black font-bold">
        {{ time }}
      </span>
    </router-link>

    <div class="flex items-center px-2 md:px-3 gap-2 md:gap-3" :style="divStyle">
      <h1 class="font-bold" :style="priceStyle">{{ price }}</h1>
    </div>
  </div>
</template>

<script setup>
import {computed} from "vue";

const props = defineProps({
  id: { type: [String, Number], required: true },
  time: { type: String, required: true },
  price: { type: String, required: true },
  highlighted: { type: Boolean, default: false }
})

const divStyle = computed(() => ({
  background: props.highlighted ? 'var(--dark)' : 'var(--lesslight)'
}));

const priceStyle = computed(() => ({
  color: props.highlighted ? 'var(--bright)' : 'var(--lessdark)'
}));
</script>