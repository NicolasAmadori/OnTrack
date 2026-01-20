<template>
    <div class="fixed inset-0 z-[3000] flex items-center justify-center">
        <div 
            class="absolute inset-0 bg-black/70"
            @click="$emit('close')"
        ></div>

        <div class="relative w-full max-w-lg p-6 bg-white rounded-lg shadow-xl m-4">
            <div class="flex items-center justify-between mb-4">
                <h2 class="text-xl font-bold text-dark">
                    {{ title }}
                </h2>
                <button 
                    @click="$emit('close')"
                    class="text-dark hover:text-bright focus:outline-none focus:ring-2 focus:ring-bright rounded transition-colors"
                    aria-label="Close"
                >
                    <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
            <div>
                <slot></slot>
            </div>

        </div>
    </div>
</template>

<script setup>
defineProps({
    title: {
        type: String,
        required: true,
        default: 'Select'
    }
})

defineEmits(['close'])
</script>