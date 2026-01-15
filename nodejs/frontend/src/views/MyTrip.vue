<template>
  <BaseBanner title="My Trip" imageType="onboard" :subtitle="selectedNode ? selectedNode.train.code : ''"/>
  <div v-if="activeNodes && activeNodes.length > 0">
      <BaseSelect
        iconName="bi-train-front-fill"
        :text="selectedNode ? selectedNode.train.code : 'Select an active train'"
        :options="activeNodes.map(n => n.train.code)"
        v-model="selectedNode"
        @select="selectedNode = activeNodes.find(n => n.train.code === $event); console.log('Selected Node:', selectedNode);"
        class="mt-3 mx-2"
      />
    
    <div v-if="selectedNode" class="d-flex flex-column align-items-center mt-4 mb-4 mx-6 xl:mx-46 text-3xl text-dark">
      <!-- <div class="d-flex mb-2">
        <i class="bi bi-people-fill mr-2"></i>
        <span class="font-semibold">{{ selectedNode.train.reservedSeats ? selectedNode.train.reservedSeats.length : 0 }}</span>
      </div> -->

      <div  class="d-flex mb-2">
        <i class="bi bi-hourglass-split mr-2"></i>
        <span class="font-semibold">{{ formatDuration(getTimeDifference(selectedNode.arrival_time)) }}</span>
      </div>

      <div class="d-flex mb-2" :class="getDelayClass(selectedNode.train.delay)">
        <i class="bi bi-clock-fill mr-2"></i>
        <span class="font-semibold">{{ formatDuration(selectedNode.train.delay * 60000) }}</span>
      </div>

      <div v-if="selectedNode.train.bathrooms" class="flex flex-col items-center mt-3">
  
      <div class="flex flex-col w-fit">
          
          <img src="@/assets/images/train.svg" class="lg:h-16 mx-auto"/>

          <div class="flex justify-between w-full px-4">
            <i 
              class="bi bi-badge-wc-fill text-6xl" 
              :class="selectedNode.train.bathrooms[0]?.isOccupied ? 'text-red' : 'text-green'">
            </i>
            <i 
              class="bi bi-badge-wc-fill text-6xl" 
              :class="selectedNode.train.bathrooms[1]?.isOccupied ? 'text-red' : 'text-green'">
            </i>
          </div>
          
        </div>
      </div>
     
    </div>
  </div>
  <div v-else class="text-center text-disabled mt-10">
    You have no active trips.
  </div>
</template>

<script setup>
import BaseBanner from "@/components/BaseBanner.vue";
import BaseSelect from "@/components/BaseSelect.vue";
import { onMounted, ref } from 'vue';
import { createErrors } from '@/api/util.js';
import { getActiveReservations } from '@/api/reservations.js';
import { getDelayClass, formatDuration, getTimeDifference } from "@/util/dateTime.js";

const activeNodes = ref([]);
const selectedNode = ref(null);

const fetchActiveNodes = async () => {
  try {
    activeNodes.value = await getActiveReservations(localStorage.getItem('authToken'), localStorage.getItem('id'));
  } catch (error) {
    createErrors(['Error fetching active nodes: ' + error.message]);
  }
};

onMounted(fetchActiveNodes);
</script>