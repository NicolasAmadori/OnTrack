<template>
  <div class="mx-4 xl:mx-40" v-bind="containerAttrs">
    <div class="flex bg-lighter rounded-xl overflow-hidden h-15 border border-black/5">
      <input
          :id="id"
          :value="modelValue"
          type="text"
          @input="$emit('update:modelValue', $event.target.value)"
          @keyup.enter="$emit('search')"
          class="flex-1 bg-transparent text-black px-5 text-[1.1rem] outline-none min-w-0 font-mono font-light placeholder:font-mono placeholder:font-light placeholder:text-lessdark placeholder:transition-opacity placeholder:duration-200 focus:placeholder:opacity-0"
          placeholder="Search..."
          aria-label="Search"
          v-bind="inputAttrs"
      />
      <button
          class="flex items-center justify-center shrink-0 bg-lesslight hover:bg-lessbright px-4 cursor-pointer transition-all duration-200 ease-in-out active:scale-95"
          type="button"
          @click="$emit('search')"
          aria-label="Esegui ricerca"
      >
        <i class="bi bi-search text-lessdark text-xl"></i>
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed, useAttrs } from 'vue'

defineProps({
  modelValue: [String, Number],
  id: String
})

defineEmits(['update:modelValue', 'search'])

const attrs = useAttrs()
const containerAttrs = computed(() => ({ class: attrs.class }))
const inputAttrs = computed(() => {
  const { class: _, ...rest } = attrs
  return rest
})
</script>

<script>
export default { inheritAttrs: false }
</script>