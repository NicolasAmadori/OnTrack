<template>
  <div
    class="group relative flex h-11.75 items-stretch overflow-hidden rounded-xl bg-transparent transition-all duration-200 mx-4 xl:mx-40"
    :class="clickable ? 'shadow-md hover:-translate-y-0.5 hover:shadow-lg cursor-pointer' : ''"
  >
    <div
      class="flex flex-1 items-center min-w-0 bg-light px-3"
      :class="leftClass"
    >
      <slot name="left"></slot>
    </div>

    <div class="flex items-center bg-lesslight px-2 md:px-3 gap-2 md:gap-3">
      <slot name="right"></slot>
    </div>
  </div>
</template>

<script setup>
defineProps({
  clickable: {
    type: Boolean,
    default: false
  },
  leftClass: {
    type: String,
    default: ''
  }
})
</script>
