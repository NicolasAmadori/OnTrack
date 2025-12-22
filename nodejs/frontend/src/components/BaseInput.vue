<template>
  <div class="row">
    <input
      :id="id"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      class="form-control"
      v-bind="$attrs"
    />
  </div>
</template>

<script setup>
defineProps({
  modelValue: {
    type: [String, Number],
    default: ''
  },
  id: {
    type: String,
    required: false
  }
})
</script>

<style scoped>
.form-control::placeholder{
  color: var(--lessdark);
  opacity: 1;
  transition: opacity 0.2s;
}
.form-control:focus {
  background-color: var(--lighter);
  box-shadow: none;
}
.form-control:focus::placeholder {
  opacity: 0;
  transition: opacity 0.2s;
}
.form-control {
  background-color: var(--lighter);
  color: var(--black);
  border: none;
  box-shadow: none;
}
</style>