<template>
  <div class="rounded-xl flex flex-col mb-4 overflow-hidden transition-all duration-300" :class="[{ 'shadow-md': !expanded }, disabled ? 'opacity-60' : '']">
    <div
      class="group bg-lesslight p-4 rounded-t-xl cursor-pointer relative hover:opacity-90"
      @click="toggleExpand"
    >
      <div
        v-if="num_passengers > 1"
        class="absolute top-0 right-0 bg-dark text-bright px-3 py-1 rounded-bl-xl text-sm"
      >
        {{ num_passengers }}x <i class="bi bi-people-fill"></i>
      </div>

      <div class="flex justify-between items-center mb-1">
        <span class="text-dark font-mono text-lg lg:text-xl">
          {{ new Date(departure_time).toLocaleDateString('en-UK') }}
        </span>
      </div>

      <div class="flex justify-between items-center mb-1">
        <span class="text-darker text-xl lg:text-2xl">
          From <b class="font-bold">{{ origin }}</b>
        </span>
        <span class="text-darker font-mono font-bold text-xl lg:text-2xl">
          {{ price_currency }}{{ price_amount.toFixed(2) }}
        </span>
      </div>

      <div class="flex justify-between items-center">
        <span class="text-darker text-xl lg:text-2xl">
          To <b class="font-bold">{{ destination }}</b>
        </span>
        <div class="flex items-center gap-2">
          <span class="text-darker font-mono text-lg lg:text-xl">{{ duration }}</span>
          <i
            class="bi text-2xl transition-transform duration-200 group-hover:text-bright text-darker"
            :class="expanded ? 'bi-chevron-up' : 'bi-chevron-down'"
          ></i>
        </div>
      </div>
    </div>

    <div v-if="cancelled" class="bg-red text-white text-center font-bold py-1 text-lg tracking-widest">
      TRAIN CANCELLED
    </div>

    <div class="bg-light relative rounded-b-xl flex flex-col transition-all duration-300">
      
      <div v-if="!expanded" class="p-4 pr-12">
        <div class="flex flex-col">
            <div class="font-mono text-xl lg:text-2xl font-bold text-black">
                {{ formatTime(departure_time) }} → {{ formatTime(arrival_time) }}
            </div>
            <div class="flex content-center items-center">
              <template v-for="(logo, index) in trainLogos" :key="index">
                 <img
                    :src="logo"
                    class="h-3 lg:h-4 w-auto object-contain"
                    alt="Train Logo"
                />
                <span v-if="index < trainLogos.length - 1" class="mx-2 text-black text-[15px] font-bold">
                  /
                </span>
              </template>
            </div>
        </div>
      </div>

      <div v-else class="p-4 pr-12 flex flex-col gap-4">
        <div v-for="(node, index) in nodes" :key="node._id">
            <div v-if="index > 0" class="flex items-center gap-1 ml-2 py-2 text-gray-500">
              <i class="bi bi-arrow-down text-lg"></i>
              <span class="text-sm font-mono">{{ calculateSwapDuration(nodes[index-1].arrival_time, node.departure_time) }}</span>
            </div>

            <div class="flex flex-col gap-1" :class="node.train.cancelled ? 'line-through' : ''">
                <div class="flex items-center gap-3 flex-wrap">
                    <span class="font-mono text-xl lg:text-2xl text-black">
                        <span class="font-bold">{{ formatTime(node.departure_time) }}</span> → <span class="font-bold">{{ formatTime(node.arrival_time) }}</span>
                    </span>
                    <span class="text-dark font-mono font-semibold">{{ node.train.code }}</span>
                    <img :src="getTrainLogo(node.train.logo_id)" class="h-3 lg:h-4 w-auto object-contain" alt="Train Logo" />
                </div>
                <div class="text-black text-lg lg:text-xl">
                    {{ node.origin }} - {{ node.destination }}
                </div>
            </div>
        </div>
      </div>

      <div class="absolute bottom-4 right-4">
        <button
          v-if="reservation_id"
          class="text-dark hover:text-bright border-none bg-transparent cursor-pointer p-0 z-10 mr-2"
          @click.stop="$emit('showDetails', reservation_id)"
          title="View reservation details"
        >
          <i class="bi bi-info-circle-fill text-2xl"></i>
        </button>


        <button 
          v-if="reservation_id"
          class="text-dark hover:text-bright border-none bg-transparent cursor-pointer p-0 z-10"
          @click.stop="$emit('delete', reservation_id)"
          title="Delete reservation"
        >
          <i class="bi bi-trash3-fill text-2xl"></i>
        </button>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { getTrainLogo } from '@/util/trainLogos';
import { formatTime } from '@/util/dateTime';
import { formatDuration } from '@/util/trip';
const props = defineProps({
  departure_time: { type: String, required: true },
  arrival_time: { type: String, required: true },
  origin: { type: String, required: true },
  destination: { type: String, required: true },
  duration: { type: String, required: true },
  price_amount: { type: Number, required: true },
  price_currency: { type: String, required: true },
  nodes: { type: Array, required: true  },
  num_passengers: { type: Number, default: 1 },
  reservation_id: { type: String }
});

const emit = defineEmits(['delete']);

const expanded = ref(false);
const cancelled = computed(() => props.nodes.some(node => node.train.cancelled));
const disabled = computed(() => cancelled.value || props.arrival_time < new Date().toISOString());

const trainLogos = computed(() => {
    const logos = [];
    if(props.nodes && Array.isArray(props.nodes)) {
        props.nodes.forEach(node => {
            if(node.train.logo_id) {
                logos.push(getTrainLogo(node.train.logo_id));
            }
        });
    }
    return Array.from(logos);
});

const toggleExpand = () => {
    expanded.value = !expanded.value;
};

const calculateSwapDuration = (startStr, endStr) => {
    try {
        const start = new Date(startStr);
        const end = new Date(endStr);
        const diffMs = end - start;
        if (diffMs < 0) return '0m';

        return formatDuration(diffMs);
    } catch (e) {
        return '-';
    }
};
</script>
