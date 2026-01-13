<template>
  <BaseBanner title="OnTrack" imageType="station"/>
  <LoginSignUpLink activePage="signup" />
  <div class="mx-2 flex flex-col">
    <form @submit.prevent="submitForm" class="flex flex-col">
      <BaseInput id="email" v-model="form.email" type="email" placeholder="Email" required />
      <BaseInput id="first_name" v-model="form.first_name" type="text" placeholder="First Name" required />
      <BaseInput id="last_name" v-model="form.last_name" type="text" placeholder="Last Name" required />
      <BaseInput id="password" v-model="form.password" type="password" placeholder="Password" :minlength="password_min_length" required />
      <BaseInput id="confirm_password" v-model="form.confirm_password" type="password" placeholder="Confirm Password" :minlength="password_min_length" required />

      <BaseButton type="submit" variant="primary" :loading="isSubmitting" class="w-full mt-3">Sign Up</BaseButton>
    </form>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';

import LoginSignUpLink from '@/components/LoginSignUpLink.vue';
import BaseInput from '@/components/BaseInput.vue';
import BaseButton from '@/components/BaseButton.vue';
import BaseBanner from '@/components/BaseBanner.vue';
import { login, register } from '@/api/auth.js';
import router from '@/router';
import { PASSWORD_MIN_LENGTH } from '@/util/constants.js';
import { createErrors } from '@/api/util.js';
const password_min_length = PASSWORD_MIN_LENGTH;
const form = reactive({
  email: '',
  first_name: '',
  last_name: '',
  password: '',
  confirm_password: ''
});

const isSubmitting = ref(false);

const submitForm = async () => {
  isSubmitting.value = true;

  try {
    if ( form.password !== form.confirm_password ) {
      createErrors(['Passwords do not match']);
      return;
    }

    await register(form.email, form.first_name, form.last_name, form.password, form.confirm_password);
    await login(form.email, form.password);
    router.push({ path: '/home' });

  } catch (error) {
    createErrors([error.message]);
  } finally {
    form.password = '';
    form.confirm_password = '';
    isSubmitting.value = false;
  }
}
</script>