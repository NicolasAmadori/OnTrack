<template>
  <Transition name="toast">
    <div
        v-if="modelValue"
        class="fixed bottom-5 left-1/2 -translate-x-1/2 z-1050 min-w-75 max-w-[90%] flex items-center justify-between p-4 rounded-lg shadow-lg border border-black/10 select-none font-mono"
        :class="typeClass"
        role="alert"
        @mouseenter="pauseTimer"
        @mouseleave="resumeTimer"
    >
      <div class="flex items-center gap-3">
        <i :class="['bi', iconClass, 'text-2xl', { 'text-white': isDarkBg }]"></i>
        <span class="text-lg font-medium" :class="{ 'text-white': isDarkBg }">
          {{ message }}
        </span>
      </div>

      <button
          type="button"
          class="ml-4 p-1 rounded-md transition-colors hover:bg-black/10 flex items-center justify-center"
          :class="isDarkBg ? 'text-white/80 hover:text-white' : 'text-black/50 hover:text-black'"
          aria-label="Close"
          @click="close"
      >
        <svg class="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  </Transition>
</template>

<script setup>
import { computed, watch, onUnmounted } from 'vue';

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  message: {
    type: String,
    required: true
  },
  type: {
    type: String,
    default: 'info',
    validator: (value) => ['success', 'info', 'warning', 'error'].includes(value)
  },
  duration: {
    type: Number,
    default: 3000
  }
});

const emit = defineEmits(['update:modelValue', 'close']);

const isDarkBg = computed(() => ['success', 'error'].includes(props.type));

const typeClass = computed(() => {
  switch (props.type) {
    case 'success': return 'bg-green';
    case 'warning': return 'bg-yellow';
    case 'error':   return 'bg-red';
    case 'info':    default: return 'bg-cyan';
  }
});

const iconClass = computed(() => {
  switch (props.type) {
    case 'success': return 'bi-check-circle-fill';
    case 'warning': return 'bi-exclamation-triangle-fill';
    case 'error':   return 'bi-x-circle-fill';
    case 'info':    default: return 'bi-info-circle-fill';
  }
});

let timer = null;
let remainingTime = props.duration;
let startTime = 0;

const clearTimer = () => { if (timer) clearTimeout(timer); timer = null; };
const startTimer = () => {
  clearTimer();
  if (props.duration > 0 && remainingTime > 0) {
    startTime = Date.now();
    timer = setTimeout(() => close(), remainingTime);
  }
};
const pauseTimer = () => {
  if (timer) {
    clearTimer();
    remainingTime -= (Date.now() - startTime);
  }
};
const resumeTimer = () => { if (props.modelValue) startTimer(); };
const close = () => {
  clearTimer();
  remainingTime = props.duration;
  emit('update:modelValue', false);
  emit('close');
};

watch(() => props.modelValue, (isOpen) => {
  if (isOpen) { remainingTime = props.duration; startTimer(); }
  else clearTimer();
}, { immediate: true });

watch(() => props.message, () => {
  if (props.modelValue) {
    remainingTime = props.duration;
    startTimer();
  }
});

onUnmounted(() => clearTimer());
</script>