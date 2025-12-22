<script setup>
</script>

<template>
  <div class="row">
    <h1>OnTrack</h1>
  </div>
  <LoginSignUpLink activePage="login" />
  <div class="row">
    <form @submit.prevent="submitForm">
      <BaseInput
        id="email"
        v-model="email"
        type="email"
        placeholder="Email"
        required
      />
      <BaseInput
        id="password"
        v-model="password"
        type="password"
        placeholder="Password"
        required
      />
      <button type="submit" class="btn btn-primary w-100">Login</button>
    </form>
  </div>
</template>