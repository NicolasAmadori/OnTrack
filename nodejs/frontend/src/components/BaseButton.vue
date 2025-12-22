<template>
  <button
    :type="type"
    :class="['btn', `btn-${variant}`]"
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
  transition: all 0.2s ease-in-out !important;
  font-weight: 600 !important;
}
.btn:hover {
  box-shadow: none !important;
}
.btn-primary {
  background-color: var(--bright) !important;
  color: var(--white) !important;
  border: none !important;
}
.btn-primary:hover {
  background-color: var(--brighter) !important;
}
.btn-primary:focus {
  background-color: var(--lessbright) !important;
}
</style>