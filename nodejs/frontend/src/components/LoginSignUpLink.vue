<template>
  <div class="mx-4 xl:mx-40 gap-50 md:gap-130 mb-2 flex items-center justify-center text-lg">
    <div>
      <div v-if="activePage === 'login'" class="text-bright font-bold">
        Login
      </div>
      <a v-else href="/login" class="text-black underline hover:text-lessbright transition-colors duration-200">
        Login
      </a>
    </div>

    <div>
      <div v-if="activePage === 'signup'" class="text-bright font-bold">
        Sign Up
      </div>
      <a v-else href="/signup" class="text-black underline hover:text-lessbright transition-colors duration-200">
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