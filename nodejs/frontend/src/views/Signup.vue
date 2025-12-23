<template>
  <BaseBanner title="OnTrack" imageType="station"/>
  <LoginSignUpLink activePage="signup" />
  <div class="row mx-2">
    <form @submit.prevent="submitForm">
      <BaseInput
        id="email"
        v-model="form.email"
        type="email"
        placeholder="Email"
        required
      />
      <BaseInput
        id="name"
        v-model="form.name"
        type="text"
        placeholder="Name"
        required
      />
      <BaseInput
        id="surname"
        v-model="form.surname"
        type="text"
        placeholder="Surname"
        required
      />
      <BaseInput
        id="password"
        v-model="form.password"
        type="password"
        placeholder="Password"
        :minlength="password_min_length"
        required
      />
      <BaseInput
        id="confirmpassword"
        v-model="form.confirmpassword"
        type="password"
        placeholder="Confirm Password"
        :minlength="password_min_length"
        required
      />
      <BaseButton type="submit" variant="primary" :loading="isSubmitting" class="w-100 mt-3">Sign Up</BaseButton>
    </form>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';

import LoginSignUpLink from '@/components/LoginSignUpLink.vue';
import BaseInput from '@/components/BaseInput.vue'; 
import BaseButton from '@/components/BaseButton.vue';
import { login, register } from '@/api/auth.js';
import router from '@/router';
import { PASSWORD_MIN_LENGTH } from '@/util/constants.js';

const password_min_length = PASSWORD_MIN_LENGTH;
const form = reactive({
  email: '',
  name: '',
  surname: '',
  password: '',
  confirmpassword: ''
});

const isSubmitting = ref(false);

const submitForm = async () => {
  isSubmitting.value = true;

  try {
    if ( form.password !== form.confirmpassword ) {
      alert('Passwords do not match');
      return;
    }

    await register(form.email, form.name, form.surname, form.password, form.confirmpassword);
    await login(form.email, form.password);
    router.push({ path: '/home' });

  } catch (error) {
    console.error(error);
  } finally {
    form.email = '';
    form.name = '';
    form.surname = '';
    form.password = '';
    form.confirmpassword = '';
    isSubmitting.value = false;
  }
}
</script>