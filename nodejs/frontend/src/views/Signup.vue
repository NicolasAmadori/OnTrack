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
        required
      />
      <BaseInput
        id="confirmpassword"
        v-model="form.confirmpassword"
        type="password"
        placeholder="Confirm Password"
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
    await new Promise(resolve => setTimeout(resolve, 2000));
    console.log('Form submitted with:', form);

    alert('TODO: call backend API and redirect on success');
    form.email = '';
    form.name = '';
    form.surname = '';

  } catch (error) {
    console.error(error);
  } finally {
    form.password = '';
    form.confirmpassword = '';
    isSubmitting.value = false;
  }
}
</script>