<template>
  <MinimalBanner
      title="Buy"
      :subtitle="routeSubtitle"
      goBackIcon
  />

  <div class="row fs-4 dark mx-4 xl:mx-40">Train Info</div>

  <div class="my-4">
    <PassengerGroup
        v-for="(passenger, index) in passengersData"
        :key="index"
        :title="`Passenger ${index + 1}`"
        v-model:first-name="passenger.firstName"
        v-model:last-name="passenger.lastName"
    />
  </div>

  <BaseButton @click="handleReserve" variant="primary" :loading="isSubmitting">
    Reserve
  </BaseButton>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import MinimalBanner from "@/components/MinimalBanner.vue";
import BaseButton from '@/components/BaseButton.vue';
import PassengerGroup from '@/components/PassengerGroup.vue';

const router = useRouter();
const routeSubtitle = ref("");
const isSubmitting = ref(false);

const passengersData = ref([]);

onMounted(() => {
  const count = Number(history.state.passengers);

  if (count && count > 0) {
    passengersData.value = Array.from({ length: count }, () => ({
      firstName: '',
      lastName: ''
    }));
  } else {
    router.back();
  }
});

const handleReserve = () => {
  isSubmitting.value = true;

  console.log("Submitting Passenger Data:", passengersData.value);
  isSubmitting.value = false;
};
</script>