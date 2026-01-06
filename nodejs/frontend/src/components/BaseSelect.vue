<template>
    <div class="base-select-container mb-2 shadow-sm active:shadow-none" @click="handleClick">
        <i :class="`bi ${iconName} left-icon`"></i>
        
        <span class="select-text">{{ text }}</span>
        
        <div class="chevron-container">
            <i class="bi bi-chevron-down chevron-icon"></i>
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

<style scoped>
.base-select-container {
    display: flex;
    align-items: center;
    background-color: var(--light);
    border-radius: 8px;
    overflow: hidden;
    cursor: pointer;
    height: 48px;
    transition: opacity 0.2s;
}

.base-select-container:hover {
    opacity: 0.9;
}

.left-icon {
    color: var(--lessdark);
    font-size: 1.2rem;
    margin-left: 12px;
    margin-right: 12px;
}

.select-text {
    color: var(--black);
    flex-grow: 1;
    font-weight: 500;
    user-select: none;
}

.chevron-container {
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: var(--lesslight);
    color: var(--lessdark);
    height: 100%;
    width: 48px;
    border-top-right-radius: 8px;
    border-bottom-right-radius: 8px;
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
}

.chevron-icon {
    font-size: 1.1rem;
}
</style>