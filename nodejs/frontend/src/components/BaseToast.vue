<template>
  <Transition name="toast">
    <div 
      v-if="modelValue" 
      class="base-toast d-flex align-items-center justify-content-between p-3 rounded shadow-lg"
      :class="typeClass"
      role="alert"
      @mouseenter="pauseTimer"
      @mouseleave="resumeTimer"
    >
      <div class="d-flex bi align-items-center gap-3">
        <i :class="['bi', iconClass, 'fs-4', { darkBg: isDarkBg }]"></i>
        <span class="toast-message fs-5 fw-medium" :class="{ darkBg: isDarkBg }">{{ message }}</span>
      </div>
      <button 
        type="button" 
        class="btn-close" 
        :class="{ 'btn-close-white': isDarkBg }"
        aria-label="Close" 
        @click="close"
      ></button>
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
    case 'success': return 'toast-success';
    case 'warning': return 'toast-warning';
    case 'error':   return 'toast-error';
    case 'info':    default: return 'toast-info';
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

const clearTimer = () => {
  if (timer) {
    clearTimeout(timer);
    timer = null;
  }
};

const startTimer = () => {
  clearTimer();
  if (props.duration > 0 && remainingTime > 0) {
    startTime = Date.now();
    timer = setTimeout(() => {
      close();
    }, remainingTime);
  }
};

const pauseTimer = () => {
  if (timer) {
    clearTimer();
    const elapsed = Date.now() - startTime;
    remainingTime -= elapsed;
  }
};

const resumeTimer = () => {
  if (props.modelValue) {
    startTimer();
  }
};

const close = () => {
  clearTimer();
  remainingTime = props.duration; 
  emit('update:modelValue', false);
  emit('close');
};


watch(() => props.modelValue, (isOpen) => {
  if (isOpen) {
    remainingTime = props.duration; // Reset duration on open
    startTimer();
  } else {
    clearTimer();
  }
}, { immediate: true });

onUnmounted(() => {
  clearTimer();
});
</script>

<style scoped>
.base-toast {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1050;
  min-width: 300px;
  max-width: 90%;
  font-family: "IBM Plex Mono", monospace;
  border: 1px solid rgba(0,0,0,0.1);
  user-select: none; 
}

.toast-message, .bi {
  background-color: transparent !important;
}

.darkBg {
  color: var(--white, #fff) !important;
}

.toast-success {
  background-color: #198754; 
  background-color: var(--green, #198754);
}

.toast-info {
  background-color: #0dcaf0;
}

.toast-warning {
  background-color: #ffc107;
  background-color: var(--yellow, #ffc107);
}

.toast-error {
  background-color: #dc3545;
  background-color: var(--red, #dc3545);
}

/* Transition styles */
.toast-enter-active,
.toast-leave-active {
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  /* Ensure we keep the X centering while animating Y */
  transform: translate(-50%, 50px); 
}
</style>