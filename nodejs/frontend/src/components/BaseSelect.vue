<template>
    <div class="flex items-center bg-light rounded-lg overflow-hidden cursor-pointer h-12 shadow-sm transition-opacity duration-200 hover:opacity-80 active:shadow-none mb-2 mx-3 xl:mx-40" @click="handleClick">
        <i :class="`bi ${iconName} text-dark text-lg mx-3`"></i>
        
        <span class="text-gray-900 flex-grow font-medium select-none truncate">{{ text }}</span>
        
        <div class="flex items-center justify-center bg-lesslight text-dark h-full w-12 border-l border-lesslight hover:text-bright transition-colors">
            <i class="bi bi-chevron-down text-lg"></i>
        </div>
    </div>
</template>

<script>
export default {
    name: "BaseSelect",
    props: {
        iconName: {
            type: String,
            required: true,
            default: "bi-info-circle-fill",
        },
        text: {
            type: String,
            required: true,
            default: "Select Option",
        },
    },
    methods: {
        handleClick() {
            this.$emit('click');
        },
    },
};
</script>