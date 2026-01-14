<template>
    <BasePopup :title="title" @close="$emit('cancel')">
        <p>{{ question }}</p>
        <div class="mt-6 flex justify-end space-x-4 font-semibold">
            <button 
                @click="$emit('confirm')" 
                class="px-4 py-2 text-dark border button-border hover:bg-red hover:text-white rounded transition-colors">
                Confirm
            </button>
            <button
                @click="$emit('cancel')" 
                class="px-4 py-2 bg-bright text-dark rounded hover:bg-lessbright transition-colors"
            >
                Go Back
            </button>
        </div>
    </BasePopup>
</template>

<script setup>
import BasePopup from './BasePopup.vue';

defineProps({
    title: {
        type: String,
        default: 'Confirmation Dialog'
    },
    question: {
        type: String,
        required: true
    }
});
</script>