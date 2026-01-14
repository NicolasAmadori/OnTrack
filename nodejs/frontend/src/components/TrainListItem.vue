<template>
  <div class="group relative mb-1 flex h-11.75 items-stretch overflow-hidden rounded-xl bg-transparent transition-all duration-200 mx-4 xl:mx-40"
       :class="cancelled ? 'opacity-50' : ''">
    
    <div class="flex flex-1 items-center min-w-0 bg-light px-3 gap-3">
        <span class="truncate font-mono text-lg text-black font-bold" :class="cancelled ? 'line-through' : ''">
            {{ code }}
        </span>
        <img :src="getTrainLogo(logo_id)" alt="Logo" class="h-6 w-auto object-contain" />
    </div>

    <div class="flex items-center bg-lesslight px-2 md:px-3 gap-2 md:gap-3">
      <button
          class="flex items-center justify-center p-1 transition-transform active:scale-90 cursor-pointer"
          @click.stop="$emit('delete')"
          :title="cancelled ? 'Restore Train' : 'Cancel Train'"
      >
        <i class="text-2xl transition-colors hover:text-bright" :class="cancelled ? 'bi bi-x-circle-fill text-red hover:text-dark' : 'bi bi-x-circle text-dark'"></i>
      </button>

    </div>
  </div>
</template>

<script setup>
import { getTrainLogo } from '@/util/trainLogos';

defineProps({
  code: {
    type: String,
    required: true,
  },
  logo_id: {
    type: String,
    required: true
  },
  cancelled: {
    type: Boolean,
    default: false
  }
});

defineEmits(['delete']);
</script>
