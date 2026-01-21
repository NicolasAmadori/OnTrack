<script setup>
</script>

<template>
  <BaseBanner title="OnTrack" imageType="station">
    <div class="relative w-full p-2 bg-transparent z-1000">
      <StationInput
          ref="fromInputComponent"
          v-model="fromLocation"
          placeholder="From"
          class="mb-2"
      />
      <StationInput
          ref="toInputComponent"
          v-model="toLocation"
          placeholder="To"
      />

      <button
        class="absolute top-20.75 -right-1.75 xl:right-36.25 -translate-y-1/2 w-12.5 h-12.5 rounded-full bg-dark border-none transition-transform duration-200 z-20 flex items-center justify-center group hover:scale-110 hover:bg-lessdark active:bg-bright"
        @click="swapLocations"
      >
        <i class="bi bi-arrow-down-up text-2xl text-bright transition-transform duration-200 group-active:text-dark group-active:rotate-180"></i>
      </button>
    </div>
  </BaseBanner>
  <BaseSelect
    iconName="bi-calendar-event-fill"
    :text="formattedDate"
    class="mt-5 mx-2"
    @click="handleDateSelect"
  />
  <DateTimePopup
    v-if="showDatePopup"
    v-model="selectedDate"
    @close="showDatePopup = false"
  />
  <BaseSelect
    iconName="bi-people-fill"
    :text="numPassengers + ' Passenger' + (numPassengers > 1 ? 's' : '')"
    :options="[1, 2, 3, 4, 5, 6, 7, 8, 9]"
    v-model="numPassengers"
    @select="numPassengers = $event"
    class="mt-3 mx-2"
  />
  <BaseButton
    variant="primary"
    class="mt-4"
    @click="handleSearch"
    :disabled="!areStationsSelected"
  >
    Search Trains
  </BaseButton>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from "vue-router";
import { DateTime } from 'luxon'
import BaseBanner from '@/components/BaseBanner.vue';
import BaseInput from '@/components/BaseInput.vue';
import BaseSelect from '@/components/BaseSelect.vue';
import DateTimePopup from '@/components/DateTimePopup.vue';
import BaseButton from '../components/BaseButton.vue';
import StationInput from "@/components/StationInput.vue";
import { createErrors } from "@/api/util.js";

const router = useRouter();

const fromLocation = ref('');
const toLocation = ref('');

const fromInputComponent = ref(null);
const toInputComponent = ref(null);

const selectedDate = ref(new Date());
const showDatePopup = ref(false);

const numPassengers = ref(1);

const formattedDate = computed(() => {
  return selectedDate.value.toLocaleString('en-UK', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
});

const areStationsSelected = computed( () => {
  const hasLocations = !!fromLocation.value && !!toLocation.value;
  const locationsAreDifferent = fromLocation.value !== toLocation.value;
  return hasLocations && locationsAreDifferent;
});

const swapLocations = () => {
  const tempId = fromLocation.value;
  fromLocation.value = toLocation.value;
  toLocation.value = tempId;

  if (fromInputComponent.value && toInputComponent.value) {
    const fromText = fromInputComponent.value.query;
    const toText = toInputComponent.value.query;

    fromInputComponent.value.setDisplayValue(toText);
    toInputComponent.value.setDisplayValue(fromText);
  }
};
const handleDateSelect = () => {
    showDatePopup.value = true;
};

const handleSearch = async () => {
  if (!areStationsSelected.value) {
    createErrors(["Please select both stations (they must be different)"]);
    return;
  }
  await router.push({
    name: 'Results',
    query: {
      from: fromLocation.value,
      fromName: fromInputComponent.value?.query,
      to: toLocation.value,
      toName: toInputComponent.value?.query,
      passengers: numPassengers.value,
      date: DateTime.fromJSDate(selectedDate.value).toISO()
    }
  });
}
</script>