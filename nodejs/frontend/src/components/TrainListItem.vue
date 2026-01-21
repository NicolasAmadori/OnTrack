<template>
  <BaseListItem
    class="mb-2"
    :class="cancelled ? 'opacity-50' : ''"
    left-class="gap-3"
  >
    <template #left>
      <div class="flex flex-1 items-center min-w-0 h-full gap-3">
        <span
          class="truncate font-mono text-lg text-black font-bold"
          :class="cancelled ? 'line-through' : ''"
        >
          {{ code }}
        </span>
        <img
          :src="getTrainLogo(logo_id)"
          alt="Logo"
          class="h-3 lg:h-4 w-auto object-contain"
        />
      </div>
    </template>

    <template #right>
      <button
        class="flex items-center justify-center p-1 transition-transform active:scale-90 cursor-pointer"
        @click.stop="$emit('delete')"
        :title="cancelled ? 'Restore Train' : 'Cancel Train'"
      >
        <i
          class="text-2xl transition-colors"
          :class="
            cancelled
              ? 'bi bi-arrow-clockwise text-dark hover:text-green'
              : 'bi bi-x-circle-fill text-dark hover:text-red'
          "
        ></i>
      </button>
    </template>
  </BaseListItem>
</template>

<script setup>
import { getTrainLogo } from '@/util/trainLogos';
import BaseListItem from '@/components/BaseListItem.vue';

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
