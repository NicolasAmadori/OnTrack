<template>
  <BaseBanner title="OnTrack" imageType="station"/>
  <LoginSignUpLink activePage="login" />
  <div class="flex flex-col mx-2">
    <form @submit.prevent="submitForm" class="flex flex-col">
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
          :minlength="password_min_length"
          required
      />
      <BaseButton
          type="submit"
          variant="primary"
          :loading="isSubmitting"
          class="w-full mt-3"
      >
        Login
      </BaseButton>
    </form>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';

import LoginSignUpLink from '@/components/LoginSignUpLink.vue';
import BaseInput from '@/components/BaseInput.vue';
import BaseButton from '@/components/BaseButton.vue';
import BaseBanner from '@/components/BaseBanner.vue';
import { login } from '@/api/auth.js';
import router from '@/router';
import { PASSWORD_MIN_LENGTH } from '@/util/constants.js';
import { createErrors } from '@/api/util.js';

const password_min_length = PASSWORD_MIN_LENGTH;
const form = reactive({
  email: '',
  password: ''
});

const isSubmitting = ref(false);

const submitForm = async () => {
  isSubmitting.value = true;

  try {
    await login(form.email, form.password);
    router.push({ path: '/home' });
  } catch (error) {
    createErrors([error.message]);
  } finally {
    form.password = '';
    isSubmitting.value = false;
  }
}
</script>