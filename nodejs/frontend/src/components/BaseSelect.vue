<template>
    <div class="relative mb-2 mx-3 xl:mx-40" ref="selectContainer">
        <div 
            class="group flex items-center bg-light rounded-lg overflow-hidden cursor-pointer h-15 shadow-sm transition-opacity duration-200 hover:opacity-80 active:shadow-none" 
            @click="handleClick"
        >
            <i :class="`bi ${iconName} text-lessdark text-xl mx-3`"></i>
            
            <span class="text-gray-900 flex-grow font-medium select-none truncate">{{ text }}</span>
            
            <div class="flex items-center justify-center bg-lesslight text-lessdark h-full w-12 border-l border-lesslight group-hover:text-bright transition-colors">
                <i :class="`bi ${isOpen ? 'bi-chevron-up' : 'bi-chevron-down'} text-xl`"></i>
            </div>
        </div>

        <div 
            v-if="isOpen && options.length"
            class="absolute top-full left-0 right-0 mt-1 bg-lighter rounded-lg shadow-lg z-50 overflow-hidden border border-lesslight"
        >
            <div 
                v-for="(option, index) in options" 
                :key="index"
                class="px-4 py-3 hover:bg-lesslight cursor-pointer text-gray-900 border-b border-lesslight last:border-0 transition-colors"
                @click="selectOption(option)"
            >
                {{ option }}
            </div>
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
        options: {
            type: Array,
            default: () => [],
        },
    },
    data() {
        return {
            isOpen: false,
        };
    },
    mounted() {
        document.addEventListener('click', this.clickOutside);
    },
    beforeUnmount() {
        document.removeEventListener('click', this.clickOutside);
    },
    methods: {
        handleClick() {
            if (this.options && this.options.length > 0) {
                this.isOpen = !this.isOpen;
            } else {
                this.$emit('click');
            }
        },
        selectOption(option) {
            this.isOpen = false;
            this.$emit('select', option);
        },
        clickOutside(event) {
            if (this.$refs.selectContainer && !this.$refs.selectContainer.contains(event.target)) {
                this.isOpen = false;
            }
        }
    },
};
</script>