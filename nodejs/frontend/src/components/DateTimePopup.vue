<template>
  <BasePopup title="Select Date & Time" @close="$emit('close')">
    <div class="flex flex-col gap-4 select-none">
      <div class="flex items-center justify-between mb-2">
        <button 
            @click="changeMonth(-1)" 
            class="p-2 text-dark hover:text-bright transition-colors rounded-full active:bg-lighter"
            type="button"
        >
          <i class="bi bi-chevron-left text-lg"></i>
        </button>
        <span class="text-lg font-bold text-black font-mono">{{ monthName }} {{ currentYear }}</span>
        <button 
            @click="changeMonth(1)" 
            class="p-2 text-dark hover:text-bright transition-colors rounded-full active:bg-lighter"
            type="button"
        >
          <i class="bi bi-chevron-right text-lg"></i>
        </button>
      </div>

      <div class="grid grid-cols-7 gap-1 text-center mb-1">
        <span v-for="day in weekDays" :key="day" class="text-xs font-bold text-gray-400 uppercase">{{ day }}</span>
      </div>

      <div class="grid grid-cols-7 grid-rows-6 gap-1 text-center">
        <div v-for="blank in firstDayOfMonth" :key="'blank-' + blank" class="p-2"></div>
        
        <button
          v-for="date in daysInMonth"
          :key="date"
          @click="updateSelection(date)"
          type="button"
          :disabled="isDisabled(date)"
          class="h-9 w-9 rounded-full text-sm flex items-center justify-center mx-auto transition-all duration-200 border-2 border-transparent"
          :class="{
            'bg-bright text-white shadow-md hover:bg-bright!': isSelectedDate(date),
            'text-bright font-bold border-bright': isToday(date) && !isSelectedDate(date),
            'text-dark hover:bg-light': !isSelectedDate(date) && !isToday(date) && !isDisabled(date),
            'text-disabled cursor-not-allowed hover:bg-transparent': isDisabled(date)
          }"
        >
          {{ date }}
        </button>
      </div>

      <div v-if="!dateOnly" class="flex items-center justify-center gap-4 py-4 border-t border-gray-100">
        <div class="flex flex-col items-center">
            <label class="text-xs text-gray-400 font-bold mb-1 tracking-wider">LEAVING AT</label>
            <div class="flex items-center p-3 bg-light rounded-xl shadow-inner gap-4">
                <div class="relative group">
                    <select 
                        v-model="selectedHour" 
                        @change="updateTime"
                        class="bg-transparent text-2xl font-bold text-black outline-none font-mono appearance-none pl-2 pr-6 cursor-pointer hover:text-bright text-center transition-colors z-10 relative"
                    >
                        <option class="text-black" v-for="h in hourOptions" :key="h" :value="h">{{ h }}</option>
                    </select>
                    <i class="bi bi-chevron-down absolute right-0 top-1/2 -translate-y-1/2 text-xs text-black opacity-50 font-bold group-hover:text-bright pointer-events-none transition-colors"></i>
                </div>
                
                <span class="text-dark font-bold text-2xl -mt-1">:</span>

                <div class="relative group">
                    <select 
                        v-model="selectedMinute" 
                        @change="updateTime"
                        class="bg-transparent text-2xl font-bold text-black outline-none font-mono appearance-none pl-2 pr-6 cursor-pointer text-center hover:text-bright transition-colors z-10 relative"
                    >
                        <option class="text-black" v-for="m in minuteOptions" :key="m" :value="m">{{ m }}</option>
                    </select>
                    <i class="bi bi-chevron-down absolute right-0 top-1/2 -translate-y-1/2 text-xs text-black opacity-50 font-bold pointer-events-none group-hover:text-bright transition-colors"></i>
                </div>
            </div>
        </div>
      </div>

       <div class="flex justify-center mt-2">
         <BaseButton 
           @click="confirmSelection"
           variant="secondary"
         >
           Confirm Date
         </BaseButton>
       </div>
    </div>
  </BasePopup>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import BasePopup from '@/components/BasePopup.vue';
import BaseButton from '@/components/BaseButton.vue';

const props = defineProps({
  modelValue: {
    type: Date,
    default: () => new Date()
  },
  dateOnly: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['close', 'update:modelValue']);

const weekDays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const hourOptions = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'));
const minuteOptions = ['00', '15', '30', '45'];

const snapToQuarter = (m) => {
    const quarters = [0, 15, 30, 45];
    const closest = quarters.reduce((prev, curr) => Math.abs(curr - m) < Math.abs(prev - m) ? curr : prev);
    return closest.toString().padStart(2, '0');
};

const currentDate = new Date();

const internalSelectedFullDate = ref(new Date(props.modelValue));

const currentMonth = ref(internalSelectedFullDate.value.getMonth());
const currentYear = ref(internalSelectedFullDate.value.getFullYear());

const selectedHour = ref(internalSelectedFullDate.value.getHours().toString().padStart(2, '0'));
const selectedMinute = ref(snapToQuarter(internalSelectedFullDate.value.getMinutes()));

watch(() => props.modelValue, (newVal) => {
    internalSelectedFullDate.value = new Date(newVal);
    currentMonth.value = internalSelectedFullDate.value.getMonth();
    currentYear.value = internalSelectedFullDate.value.getFullYear();
    selectedHour.value = internalSelectedFullDate.value.getHours().toString().padStart(2, '0');
    selectedMinute.value = snapToQuarter(internalSelectedFullDate.value.getMinutes());
});

const monthName = computed(() => monthNames[currentMonth.value]);

const daysInMonth = computed(() => {
  return new Date(currentYear.value, currentMonth.value + 1, 0).getDate();
});

const firstDayOfMonth = computed(() => {
  return new Date(currentYear.value, currentMonth.value, 1).getDay();
});

const changeMonth = (step) => {
  let newMonth = currentMonth.value + step;
  if (newMonth > 11) {
    currentMonth.value = 0;
    currentYear.value++;
  } else if (newMonth < 0) {
    currentMonth.value = 11;
    currentYear.value--;
  } else {
    currentMonth.value = newMonth;
  }
};

const isSelectedDate = (day) => {
  return day === internalSelectedFullDate.value.getDate() &&
         currentMonth.value === internalSelectedFullDate.value.getMonth() &&
         currentYear.value === internalSelectedFullDate.value.getFullYear();
};

const isToday = (day) => {
  return day === currentDate.getDate() &&
         currentMonth.value === currentDate.getMonth() &&
         currentYear.value === currentDate.getFullYear();
};

const isDisabled = (day) => {
  const dateToCheck = new Date(currentYear.value, currentMonth.value, day);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return dateToCheck < today;
};

const updateSelection = (day) => {
   if (isDisabled(day)) return;
   const newDate = new Date(currentYear.value, currentMonth.value, day);
   newDate.setHours(parseInt(selectedHour.value) || 0);
   newDate.setMinutes(parseInt(selectedMinute.value) || 0);
   internalSelectedFullDate.value = newDate;
};

const updateTime = () => {
    const h = parseInt(selectedHour.value);
    const m = parseInt(selectedMinute.value);
    
    const d = new Date(internalSelectedFullDate.value);
    d.setHours(h);
    d.setMinutes(m);
    internalSelectedFullDate.value = d;
};

const confirmSelection = () => {
    updateTime();
    emit('update:modelValue', internalSelectedFullDate.value);
    emit('close');
};
</script>
