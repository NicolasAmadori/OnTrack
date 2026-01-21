<template>
  <div class="flex w-full">
    <button
        :type="type"
        :class="[
      'mt-4 py-4 shadow-lg font-semibold text-2xl transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed w-full rounded-xl',
      variant === 'primary' ? 'bg-bright text-dark hover:bg-brighter focus:bg-lessbright mx-2 xl:mx-40' : '',
      variant === 'secondary' ? 'bg-dark text-white hover:bg-lessdark focus:bg-bright' : ''
    ]"
        :disabled="disabled || loading"
    >
    <span
        v-if="loading"
        class="inline-block w-4 h-4 mr-2 border-2 border-current border-t-transparent rounded-full animate-spin"
        role="status"
    ></span>
      <slot />
    </button>
  </div>
</template>

<script setup>
defineProps({
  type: { type: String, default: 'button' },
  variant: { type: String, default: 'primary' },
  loading: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
})
</script>