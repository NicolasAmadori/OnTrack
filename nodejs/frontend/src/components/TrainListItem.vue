<template>
  <div class="group relative mb-3 flex h-11.75 items-stretch overflow-hidden rounded-xl bg-transparent transition-all duration-200 mx-4 xl:mx-40">
    
    <div class="flex flex-1 items-center min-w-0 bg-light px-3 gap-3">
        <span class="truncate font-mono text-sm text-black font-bold">
            {{ code }}
        </span>
        <img :src="getTrainLogo(logo_id)" alt="Logo" class="h-6 w-auto object-contain" />
    </div>

    <div class="flex items-center bg-lesslight px-2 md:px-3 gap-2 md:gap-3">
      <button
          class="flex items-center justify-center p-1 transition-transform active:scale-90 cursor-pointer"
          @click.stop="$emit('delete')"
          title="Delete Train"
      >
        <i class="bi bi-trash3-fill text-2xl text-dark transition-colors hover:text-bright"></i>
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
  }
});

defineEmits(['delete']);
</script>
