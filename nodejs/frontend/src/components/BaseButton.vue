<template>
  <button
    :type="type"
    :class="['btn mt-4 py-4 drop-shadow-lg', `btn-${variant}`]"
    :disabled="disabled || loading"
  >
    <span 
      v-if="loading" 
      class="spinner-border spinner-border-sm me-2" 
      role="status" 
      aria-hidden="true"
    ></span>

    <slot />
    
  </button>
</template>

<script setup>
defineProps({
  type: {
    type: String,
    default: 'button'
  },
  variant: {
    type: String,
    default: 'primary'
  },
  loading: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  },
})
</script>

<style scoped>
.btn {
  font-weight: 600 !important;
  font-size: x-large;
}
.btn:hover {
  box-shadow: none !important;
}
.btn-primary {
  background-color: var(--bright) !important;
  color: var(--dark) !important;
  border: none !important;
}
.btn-primary:hover {
  background-color: var(--brighter) !important;
}
.btn-primary:focus {
  background-color: var(--lessbright) !important;
  filter: drop-shadow(0 0 #0000)
}
</style>