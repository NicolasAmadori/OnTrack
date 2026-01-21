<template>
  <BaseBanner title="My Trip" imageType="onboard" :subtitle="selectedNode ? selectedNode.train.code : ''"/>
  <div v-if="activeNodes && activeNodes.length > 0">
      <div v-if="activeNodes.length > 1">

        <BaseSelect
          iconName="bi-train-front-fill"
          :text="selectedNode ? selectedNode.train.code : 'Select an active train'"
          :options="activeNodes.map(n => n.train.code)"
          v-model="selectedNode"
          @select="selectedNode = activeNodes.find(n => n.train.code === $event)"
          class="mt-3 mx-2"
        />
      </div>
    
    <div v-if="selectedNode" class="mb-5">
      <div class="flex flex-wrap justify-center gap-6 mt-4 mb-4 mx-6 xl:mx-46 text-3xl text-dark text-center">
        <!-- <div class="d-flex mb-2">
        <i class="bi bi-people-fill mr-2"></i>
        <span class="font-semibold">{{ selectedNode.train.reservedSeats ? selectedNode.train.reservedSeats.length : 0 }}</span>
        </div> -->

        <div class="flex items-center">
        <i class="bi bi-hourglass-split mr-2"></i>
        <span class="font-semibold">{{ formatDuration(getTimeDifference(selectedNode.arrival_time)) }}</span>
        </div>

        <div class="flex items-center" :class="getDelayClass(selectedNode.train.delay)">
        <i class="bi bi-clock-fill mr-2"></i>
        <span class="font-semibold">{{ formatDuration(selectedNode.train.delay * 60000) }}</span>
        </div>
      </div>
      <div v-if="selectedNode.train.bathrooms" class="flex flex-col items-center my-3">
  
          <div class="flex flex-col w-fit">
            
            <img src="@/assets/images/train.svg" class="lg:h-16 mx-auto"/>

            <div class="flex justify-between w-full px-4">
                <div v-for="(bathroom, index) in selectedNode.train.bathrooms.slice(0, 2)" :key="index" class="flex flex-col items-center">
                <i 
                  class="bi bi-badge-wc-fill text-6xl" 
                  :class="bathroom.isOccupied ? 'text-red' : 'text-green'">
                </i>
                <i 
                  @click="bathroom.isOccupied && toggleNotification(selectedNode.train._id, index)"
                  @keydown.enter.prevent="bathroom.isOccupied && toggleNotification(selectedNode.train._id, index)"
                  @keydown.space.prevent="bathroom.isOccupied && toggleNotification(selectedNode.train._id, index)"
                  :tabindex="bathroom.isOccupied ? 0 : -1"
                  role="button"
                  aria-label="Toggle notification"
                  :aria-disabled="!bathroom.isOccupied"
                  class="bi text-2xl focus:outline-none focus:ring-2 focus:ring-bright rounded transition-colors"
                  :class="[
                    !bathroom.isOccupied ? 'text-disabled pointer-events-none' : 'cursor-pointer text-dark hover:text-bright',
                    selectedNode.train.bathrooms[index].queue.length > 0 ? 'bi-bell-fill' : 'bi-bell'
                  ]">
                </i>
                </div>
            </div>
            
          </div>
      </div>

      <NodeTicket
        v-for="(passenger, index) in passengers"
        :key="index"
        :first_name="passenger.first_name"
        :last_name="passenger.last_name"
        :seats="passenger.seats.filter(s => s.node._id === selectedNode._id)"
        :class="index > 0 ? 'border-t-2 border-white border-dashed' : ''"
      />
    </div>
  </div>
  <div v-else class="text-center text-disabled mt-10">
    You have no active trips.
  </div>
</template>

<script setup>
import BaseBanner from "@/components/BaseBanner.vue";
import BaseSelect from "@/components/BaseSelect.vue";
import NodeTicket from "@/components/NodeTicket.vue";
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';
import { createErrors } from '@/api/util.js';
import { toggle_user_to_bathroom_queue } from "@/api/trains";
import { getActiveReservations } from '@/api/reservations.js';
import { getDelayClass, formatDuration, getTimeDifference } from "@/util/dateTime.js";
import { localAuthToken, localId } from "@/util/auth.js";
import { emitEvent, onEvent, offEvent } from "@/router/useSocket.js";

const activeNodes = ref([]);
const selectedNode = ref(null);
const passengers = computed(() => {
  if (!data || !data.passengers || !selectedNode.value) return [];
  return data.passengers.filter(p => p.seats.some(s => s.node._id.toString() === selectedNode.value._id.toString()));
});
let data = null;

const fetchActiveNodes = async () => {
  try {
    data = await getActiveReservations(localAuthToken.value, localId.value);
    activeNodes.value = data.nodes;
    if (activeNodes.value.length === 1) {
      selectedNode.value = activeNodes.value[0];
    }
  } catch (error) {
    createErrors(['Error fetching active nodes: ' + error.message]);
  }
};

const toggleNotification = async (trainId, bathroomIndex) => {
  try {
    const train = selectedNode.value.train;
    if (train.bathrooms[bathroomIndex].queue.includes(localStorage.getItem('id'))) {
      train.bathrooms[bathroomIndex].queue = train.bathrooms[bathroomIndex].queue.filter(userId => userId !== localStorage.getItem('id'));
    } else {
      train.bathrooms[bathroomIndex].queue.push(localStorage.getItem('id'));
    } 
    return await toggle_user_to_bathroom_queue(localStorage.getItem('authToken'), trainId, bathroomIndex, localStorage.getItem('id'));
  } catch (error) {
    createErrors(['Error updating bathroom status: ' + error.message]);
  }  
};

const handleTrainUpdate = (data) => {
    if (selectedNode.value && selectedNode.value.train._id === data.trainId) {
        if (data.bathrooms) {
            selectedNode.value.train.bathrooms = data.bathrooms;
        }
        if (data.delay !== undefined) {
             selectedNode.value.train.delay = data.delay;
        }
        if (data.cancelled !== undefined) {
             selectedNode.value.train.cancelled = data.cancelled;
        }
    }
    const node = activeNodes.value.find(n => n.train._id === data.trainId);
    if (node) {
        if (data.bathrooms) node.train.bathrooms = data.bathrooms;
        if (data.delay !== undefined) node.train.delay = data.delay;
        if (data.cancelled !== undefined) node.train.cancelled = data.cancelled;
    }
};

watch(selectedNode, (newVal, oldVal) => {
    if (oldVal) {
        emitEvent('leave_room', `train_${oldVal.train.code}`);
    }
    if (newVal) {
        emitEvent('join_room', `train_${newVal.train.code}`);
    }
});

onMounted(() => {
    fetchActiveNodes();
    onEvent('train_update', handleTrainUpdate);
});

onUnmounted(() => {
    offEvent('train_update', handleTrainUpdate);
    if (selectedNode.value) {
        emitEvent('leave_room', `train_${selectedNode.value.train.code}`);
    }
});
</script>