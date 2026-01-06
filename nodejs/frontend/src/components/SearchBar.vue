<template>
  <div class="custom-input-container" v-bind="containerAttrs">
    <div class="input-group-container">
      <input
          :id="id"
          :value="modelValue"
          type="text"
          @input="$emit('update:modelValue', $event.target.value)"
          @keyup.enter="$emit('search')"
          class="custom-input font-mono font-light placeholder:font-mono placeholder:font-light"
          placeholder="Cerca..."
          v-bind="inputAttrs"
      />
      <button
          class="btn-search bg-lesslight hover:bg-lessbright px-4"
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

<style scoped>
.input-group-container {
  display: flex;
  background-color: var(--lighter);
  border-radius: 0.375rem;
  overflow: hidden;
  height: 60px;
  border: 1px solid rgba(0,0,0,0.05);
}

.custom-input {
  flex: 1;
  background-color: transparent;
  color: var(--black);
  border: none;
  padding: 0 1.25rem;
  font-size: 1.1rem;
  outline: none;
  min-width: 0;
}

.custom-input::placeholder {
  color: var(--lessdark);
  transition: opacity 0.2s;
}

.custom-input:focus::placeholder {
  opacity: 0;
}

.btn-search {
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease-in-out;
  flex-shrink: 0;
}

.btn-search:active {
  transform: scale(0.95);
}
</style>