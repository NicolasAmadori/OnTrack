<template>
  <div class="row">
    <div class="col">
      <div v-if="activePage === 'login'" class="bright fw-bold">
        Login
      </div>
      <a v-else href="/login">
        Login
      </a>
    </div>

    <div class="col">
      <div v-if="activePage === 'signup'" class="bright fw-bold">
        Sign Up
      </div>
      <a v-else href="/signup">
        Sign Up
      </a>
    </div>
  </div>
</template>

<script setup>
defineProps({
  activePage: {
    type: String,
    required: true,
    validator: (value) => ['login', 'signup'].includes(value)
  }
})
</script>