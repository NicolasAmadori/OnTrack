<template>
  <div class="rounded-xl flex flex-col mb-4 overflow-hidden shadow-md transition-all duration-500">
    <div
      class="group bg-lesslight p-4 rounded-t-xl cursor-pointer relative"
      @click="toggleExpand"
    >
      <div
        v-if="reservation.passengers.length > 1"
        class="absolute top-0 right-0 bg-dark text-bright px-3 py-1 rounded-bl-xl text-sm"
      >
        {{ reservation.passengers.length }}x <i class="bi bi-people-fill"></i>
      </div>

      <div class="flex justify-between items-center mb-1">
        <span class="text-dark font-mono text-lg">
          {{ new Date(reservation.departure_time).toLocaleDateString('en-UK') }}
        </span>
      </div>

      <div class="flex justify-between items-center mb-1">
        <span class="text-darker text-lg">
          From <b class="font-bold">{{ reservation.origin }}</b>
        </span>
        <span class="text-darker font-mono font-bold text-xl">
          {{ reservation.price_currency }}{{ reservation.price_amount.toFixed(2) }}
        </span>
      </div>

      <div class="flex justify-between items-center">
        <span class="text-darker text-lg">
          To <b class="font-bold">{{ reservation.destination }}</b>
        </span>
        <div class="flex items-center gap-2">
          <span class="text-darker font-mono">{{ reservation.duration }}</span>
          <i
            class="bi text-xl transition-transform duration-200 group-hover:text-bright text-darker"
            :class="expanded ? 'bi-chevron-up' : 'bi-chevron-down'"
          ></i>
        </div>
      </div>
    </div>

    <div class="bg-light relative rounded-b-xl flex flex-col transition-all duration-300">
      
      <div v-if="!expanded" class="p-4 pr-12">
        <div class="flex flex-col">
            <div class="font-mono text-xl font-bold text-black">
                {{ formatTime(reservation.departure_time) }} → {{ formatTime(reservation.arrival_time) }}
            </div>
            <div class="flex">
              <template v-for="(logo, index) in uniqueTrainLogos" :key="index">
                 <img
                    :src="logo"
                    class="h-6 w-auto object-contain"
                    alt="Train Logo"
                />
                <span v-if="index < uniqueTrainLogos.length - 1" class="mx-2 text-black text-[15px] font-bold">
                  /
                </span>
              </template>
            </div>
        </div>
      </div>

      <div v-else class="p-4 pr-12 flex flex-col gap-4">
        <div v-for="(node, index) in reservation.nodes" :key="node._id">
            <div v-if="index > 0" class="flex items-center gap-1 ml-2 py-2 text-gray-500">
              <i class="bi bi-arrow-down text-lg"></i>
              <span class="text-sm font-mono">{{ calculateSwapDuration(reservation.nodes[index-1].arrival_time, node.departure_time) }}</span>
            </div>

            <div class="flex flex-col gap-1">
                <div class="flex items-center gap-3 flex-wrap">
                    <span class="font-mono text-lg text-black">
                        <span class="font-bold">{{ formatTime(node.departure_time) }}</span> → <span class="font-bold">{{ formatTime(node.arrival_time) }}</span>
                    </span>
                    <span class="text-dark font-mono font-medium">{{ node.train.train_id }}</span>
                    <img :src="getTrainLogo(node.train.denomination)" class="h-5 w-auto object-contain" alt="Train Logo" />
                </div>
                <div class="text-black">
                    {{ node.origin }} - {{ node.destination }}
                </div>
            </div>
        </div>
      </div>

      <button 
        class="absolute bottom-4 right-4 text-dark hover:text-bright border-none bg-transparent cursor-pointer p-0 z-10"
        @click.stop="deleteReservation"
        title="Delete reservation"
      >
        <i class="bi bi-trash3-fill text-2xl"></i>
      </button>

    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { getTrainLogo } from '@/util/trainLogos';

const props = defineProps({
  reservation: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['delete']);

const expanded = ref(false);

const uniqueTrainLogos = computed(() => {
    const logos = [];
    if(props.reservation.nodes && Array.isArray(props.reservation.nodes)) {
        props.reservation.nodes.forEach(node => {
            if(node.train) {
                logos.push(getTrainLogo(node.train.denomination));
            }
        });
    }
    return Array.from(logos);
});

const toggleExpand = () => {
    expanded.value = !expanded.value;
};

const deleteReservation = () => {
    emit('delete', props.reservation._id);
};

const formatTime = (dateStr) => {
    if (!dateStr) return '';
    try {
        const d = new Date(dateStr);
        return d.toLocaleTimeString('en-UK', { hour: '2-digit', minute: '2-digit' });
    } catch (e) {
        return dateStr;
    }
};

const calculateSwapDuration = (startStr, endStr) => {
    try {
        const start = new Date(startStr);
        const end = new Date(endStr);
        const diffMs = end - start;
        if (diffMs < 0) return '0m';
        
        const diffMins = Math.floor(diffMs / 60000);
        const hours = Math.floor(diffMins / 60);
        const mins = diffMins % 60;
        
        if (hours > 0) return `${hours}h ${mins}m`;
        return `${mins}m`;
    } catch (e) {
        return '-';
    }
};
</script>
