<template>
  <div class="user-item-container">
    <div class="email-section">
      <span class="font-mono text-darker text-sm truncate px-3">
        {{ email }}
      </span>
    </div>

    <div class="actions-section px-2 px-md-3 gap-2 gap-md-3">
      <button
          class="action-btn"
          @click.stop="$emit('toggle-admin')"
          :title="isAdmin ? 'Remove Admin Rights' : 'Grant Admin Rights'"
      >
        <i
            class="bi text-2xl transition-colors"
            :class="isAdmin ? 'bi-shield-fill-check text-darker' : 'bi-shield-check text-darker opacity-70 hover:opacity-100'"
        ></i>
      </button>

      <button
          class="action-btn"
          @click.stop="$emit('delete')"
          title="Delete User"
      >
        <i class="bi bi-trash3-fill text-bright text-2xl hover:text-red transition-colors"></i>
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  email: {
    type: String,
    required: true
  },
  isAdmin: {
    type: Boolean,
    default: false
  }
})

defineEmits(['delete', 'toggle-admin'])
</script>

<style scoped>
.user-item-container {
  display: flex;
  width: 100%;
  border-radius: 0.75rem;
  overflow: hidden;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  transition: transform 0.1s ease-in-out, box-shadow 0.2s;
  background-color: transparent;
  margin-bottom: 0.75rem;
  height: 47px;
}

.user-item-container:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 10px -2px rgba(0, 0, 0, 0.15);
}

.email-section {
  flex: 1;
  background-color: var(--light);
  display: flex;
  align-items: center;
  min-width: 0;
}

.actions-section {
  background-color: #d6ccc4; /* Tonalità più scura per la barra azioni */
  display: flex;
  align-items: center;
}

.action-btn {
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.25rem;
  transition: transform 0.1s;
}

.action-btn:active {
  transform: scale(0.9);
}
</style>