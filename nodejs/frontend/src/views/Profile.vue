<template>
  <BaseBanner title="Profile" imageType="passenger" subtitle="mariorossi@email.com" /> 
  <div class="row mx-2">
    <form @submit.prevent="submitForm">
      <div class="row fs-4 dark">Personal Info</div>
      <BaseInput
        id="first_name"
        v-model="form.first_name"
        type="string"
        placeholder="First Name"
        required
      />
      <BaseInput
        id="last_name"
        v-model="form.last_name"
        type="string"
        placeholder="Last Name"
        required
      />
      <div class="row fs-4 dark">Change Password</div>
      <BaseInput
        id="old_password"
        v-model="form.old_password"
        type="password"
        placeholder="Old Password"
      />
      <BaseInput
        id="password"
        v-model="form.password"
        type="password"
        placeholder="New Password"
      />
      <BaseInput
        id="confirm_password"
        v-model="form.confirm_password"
        type="password"
        placeholder="Confirm New Password"
      />
      <BaseButton type="submit" variant="primary" :loading="isSubmitting" class="w-100 mt-3">Update Profile</BaseButton>
    </form>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import BaseInput from '@/components/BaseInput.vue'; 
import BaseButton from '@/components/BaseButton.vue';

const form = reactive({
  first_name: 'Mario',
  last_name: 'Rossi',
  old_password: '',
  password: '',
  confirm_password: ''
});

const isSubmitting = ref(false);

const submitForm = async () => {
  isSubmitting.value = true;

  try {
    if ((form.password || form.confirm_password || form.old_password)
        && !(form.password && form.confirm_password && form.old_password)) {
      alert('To change your password, please fill in all password fields.');
      return;
    }
    
    if (form.password !== form.confirm_password) {
      alert('New password and confirmation do not match.');
      return;
    }

    await new Promise(resolve => setTimeout(resolve, 2000));
    console.log('Form submitted with:', form);

    alert('TODO: call backend API and redirect on success');

  } catch (error) {
    console.error(error);
  } finally {
    form.old_password = '';
    form.password = '';
    form.confirm_password = '';
    isSubmitting.value = false;
  }
}
</script>