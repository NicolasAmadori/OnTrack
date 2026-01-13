<template>
  <BaseBanner title="Profile" imageType="passenger" :subtitle="email" /> 
  <div class="row">
    <form @submit.prevent="submitForm">
      <div class="row fs-4 dark mx-4 xl:mx-40">Personal Info</div>
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
      <div class="row fs-4 dark mx-4 xl:mx-40">Change Password</div>
      <BaseInput
        id="old_password"
        v-model="form.old_password"
        type="password"
        placeholder="Old Password"
        :minlength="PASSWORD_MIN_LENGTH"
      />
      <BaseInput
        id="password"
        v-model="form.password"
        type="password"
        placeholder="New Password"
        :minlength="PASSWORD_MIN_LENGTH"
      />
      <BaseInput
        id="confirm_password"
        v-model="form.confirm_password"
        type="password"
        placeholder="Confirm New Password"
        :minlength="PASSWORD_MIN_LENGTH"
      />
      <BaseButton type="submit" variant="primary" :loading="isSubmitting" :disabled="!hasChanges">Update Profile</BaseButton>
    </form>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted, computed } from 'vue';
import BaseInput from '@/components/BaseInput.vue'; 
import BaseButton from '@/components/BaseButton.vue';
import { getUser, updateUser } from '../api/users';
import { PASSWORD_MIN_LENGTH } from '@/util/constants.js';
import BaseBanner from "@/components/BaseBanner.vue";
import { createErrors } from '@/api/util.js';

const form = reactive({
  first_name: '',
  last_name: '',
  old_password: '',
  password: '',
  confirm_password: ''
});
const originalUser = reactive({
  first_name: '',
  last_name: ''
});
const hasChanges = computed(() => 
  originalUser.first_name !== form.first_name || 
  originalUser.last_name !== form.last_name || 
  form.old_password !== '' ||
  form.password !== '' || 
  form.confirm_password !== ''
);
const isSubmitting = ref(false);
let email = ''

const fetchUser = async () => {
  const user = await getUser(localStorage.getItem('authToken'), localStorage.getItem('id'));
  email = user.email;
  form.first_name = user.first_name;
  form.last_name = user.last_name;
  originalUser.first_name = user.first_name;
  originalUser.last_name = user.last_name;
};

onMounted(fetchUser);

const submitForm = async () => {
  isSubmitting.value = true;

  try {
    if ((form.password || form.confirm_password || form.old_password)
        && !(form.password && form.confirm_password && form.old_password)) {
          createErrors(['To change your password, please fill in all password fields.']);
      return;
    }
    
    if (form.password !== form.confirm_password) {
      createErrors(['New password and confirmation do not match.']);
      return;
    }

    await updateUser(localStorage.getItem('authToken'), localStorage.getItem('id'), {
      first_name: form.first_name,
      last_name: form.last_name,
      oldpassword: form.old_password || undefined,
      password: form.password || undefined
    });

    await fetchUser();

  } catch (error) {
    createErrors([error.message]);
  } finally {
    form.old_password = '';
    form.password = '';
    form.confirm_password = '';
    form.first_name = originalUser.first_name;
    form.last_name = originalUser.last_name;
    hasChanges.value = false;
    isSubmitting.value = false;
  }
}
</script>