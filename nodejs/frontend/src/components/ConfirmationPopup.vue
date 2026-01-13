<template>
    <BasePopup :title="title" @close="$emit('cancel')">
        <p>{{ question }}</p>
        <div class="mt-6 flex justify-end space-x-4">
            <button 
                @click="$emit('confirm')" 
                class="px-4 py-2 bg-red text-white rounded hover:bg-red-700 transition-colors">
                Confirm
            </button>
            <button
                @click="$emit('cancel')" 
                class="px-4 py-2 bg-gray-300 text-dark rounded hover:bg-gray-400 transition-colors"
            >
                Cancel
            </button>
        </div>
    </BasePopup>
</template>

<script setup lang="ts">
import BasePopup from './BasePopup.vue';

defineProps<{
    title: {
        type: String,
        default: 'Confirmation Dialog'
    };
    question: {
        type: String,
        required: true
    }
}>();
</script>