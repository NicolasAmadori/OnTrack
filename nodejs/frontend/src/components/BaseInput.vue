<template>
  <div class="mb-2 flex w-full">
    <div class="relative w-full mx-2 xl:mx-40">
      <input
          :id="id"
          :value="modelValue"
          :type="computedType"
          @input="$emit('update:modelValue', $event.target.value)"
          class="h-15 w-full bg-lighter text-black text-lg py-4 px-3 border-none outline-none focus:bg- placeholder:text-lessdark placeholder:transition-opacity placeholder:duration-200 focus:placeholder:opacity-0 rounded-xl pr-12"
          v-bind="$attrs"
      />
      <button
          v-if="type === 'password'"
          type="button"
          @click="togglePassword"
          aria-label="Toggle password visibility"
          class="absolute inset-y-0 right-0 flex items-center pr-3 text-lessdark hover:text-black cursor-pointer bg-transparent border-none outline-none"
      >
        <i :class="isPasswordVisible ? 'bi bi-eye-slash-fill' : 'bi bi-eye-fill'" class="text-xl"></i>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  modelValue: { type: [String, Number], default: '' },
  id: { type: String },
  type: { type: String, default: 'text' }
})

const isPasswordVisible = ref(false)

const togglePassword = () => {
  isPasswordVisible.value = !isPasswordVisible.value
}

const computedType = computed(() => {
  if (props.type === 'password' && isPasswordVisible.value) {
    return 'text'
  }
  return props.type
})
</script>