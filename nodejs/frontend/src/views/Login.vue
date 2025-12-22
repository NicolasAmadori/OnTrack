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
        v-model="form.email"
        type="email"
        placeholder="Email"
        required
      />
      <BaseInput
        id="password"
        v-model="form.password"
        type="password"
        placeholder="Password"
        required
      />
      <BaseButton type="submit" variant="primary" :loading="isSubmitting" class="w-100 mt-3">Login</BaseButton>
    </form>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import LoginSignUpLink from '@/components/LoginSignUpLink.vue';
import BaseInput from '@/components/BaseInput.vue'; 
import BaseButton from '@/components/BaseButton.vue';

const form = reactive({
  email: '',
  password: ''
});

const isSubmitting = ref(false);

const submitForm = async () => {
  isSubmitting.value = true;

  try {
    await new Promise(resolve => setTimeout(resolve, 2000));
    console.log('Form submitted with:', form);

    alert('TODO: call backend API and redirect on success');

  } catch (error) {
    console.error(error);
  } finally {
    form.email = '';
    form.password = '';
    isSubmitting.value = false;
  }
}
</script>