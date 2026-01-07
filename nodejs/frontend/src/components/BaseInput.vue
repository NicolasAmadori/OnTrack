<template>
  <div class="mb-2 flex w-full">
    <input
        :id="id"
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
        class="h-15 w-full bg-lighter text-black text-lg py-4 px-3 border-none outline-none focus:bg- placeholder:text-lessdark placeholder:transition-opacity placeholder:duration-200 focus:placeholder:opacity-0 rounded-xl mx-2 xl:mx-40"
        v-bind="$attrs"
    />
  </div>
</template>

<script setup>
defineProps({
  modelValue: { type: [String, Number], default: '' },
  id: { type: String }
})
</script>