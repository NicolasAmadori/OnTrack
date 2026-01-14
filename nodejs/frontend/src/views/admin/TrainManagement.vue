<template>
    <BaseBanner title="Train Management" imageType="station" admin/>
    
    <div class="flex flex-col mt-5 gap-2">
        <BaseSelect
            iconName="bi-calendar-event-fill"
            :text="formattedDate"
            @click="showDatePopup = true"
        />
        <SearchBar v-model="searchQuery" @search="updateTrains" placeholder="Search for a train"/>

        <div class="flex flex-col mt-2">
            <TrainListItem 
                v-for="train in trains" 
                :key="train._id"
                :code="train.code"
                :logo_id="train.logo_id"
                :cancelled="train.cancelled"
                @delete="trainToDelete = train" 
            />
            <div v-if="trains.length === 0" class="text-center text-gray-400 font-mono mt-4 text-lg">
                No trains found.
            </div>
        </div>
    </div>

    <DateTimePopup 
        v-if="showDatePopup"
        v-model="selectedDate"
        dateOnly
        @close="showDatePopup = false"
    />
    <ConfirmationPopup 
        v-if="trainToDelete"
        :title="trainToDelete.cancelled ? 'Restore Train' : 'Cancel Train'"
        :question="trainToDelete.cancelled ? 'Are you sure you want to restore this train?' : 'Are you sure you want to cancel this train?'" 
        @confirm="delTrain(trainToDelete._id)" 
        @cancel="trainToDelete = null"
    />

</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import BaseSelect from '@/components/BaseSelect.vue';
import BaseBanner from "@/components/BaseBanner.vue";
import SearchBar from "@/components/SearchBar.vue";
import TrainListItem from "@/components/TrainListItem.vue";
import DateTimePopup from "@/components/DateTimePopup.vue";
import ConfirmationPopup from '../../components/ConfirmationPopup.vue';
import { formatDate } from "@/util/dateTime";
import { get_trains, delete_train } from '@/api/trains';

const showDatePopup = ref(false);
const selectedDate = ref(new Date());
const searchQuery = ref("");
const trains = ref([]);
const trainToDelete = ref(null);

const formattedDate = computed(() => formatDate(selectedDate.value));

const updateTrains = async () => {
    try {
        trains.value = await get_trains(localStorage.getItem('authToken'), selectedDate.value, searchQuery.value);
    } catch (error) {
        console.error('Error fetching trains:', error);
    }
}

onMounted(() => {
    updateTrains();
});

watch([selectedDate, searchQuery], () => {
    updateTrains();
});

const delTrain = async (trainId) => {
    trainToDelete.value = null;
    try {
        await delete_train(localStorage.getItem('authToken'), trainId);
    } catch (error) {
        console.error('Error deleting train:', error);
    }
    updateTrains();
};

</script>