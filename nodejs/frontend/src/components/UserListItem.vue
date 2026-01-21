<template>
  <BaseListItem class="mb-2" clickable>
    <template #left>
      <router-link
        :to="`/admin/user-management/${id}`"
        class="flex flex-1 items-center min-w-0 h-full"
      >
        <span class="truncate font-mono md:text-base text-sm font-medium text-black">
          {{ email }}
        </span>
      </router-link>
    </template>

    <template #right>
      <button
        class="flex items-center justify-center p-1 transition-transform active:scale-90 cursor-pointer"
        @click.stop="$emit('toggle-admin')"
        :title="isAdmin ? 'Remove Admin Rights' : 'Grant Admin Rights'"
      >
        <i
          class="bi text-2xl text-darker transition-colors hover:text-bright"
          :class="
            isAdmin
              ? 'bi-shield-fill-check opacity-80'
              : 'bi-shield-check'
          "
        ></i>
      </button>

      <button
        class="flex items-center justify-center p-1 transition-transform active:scale-90 cursor-pointer"
        @click.stop="$emit('delete')"
        title="Delete User"
      >
        <i class="bi bi-trash3-fill text-2xl text-darker transition-colors hover:text-red"></i>
      </button>
    </template>
  </BaseListItem>
</template>

<script setup>
import BaseListItem from '@/components/BaseListItem.vue';

defineProps({
  id: { type: [String, Number], required: true },
  email: { type: String, required: true },
  isAdmin: { type: Boolean, default: false }
})
defineEmits(['delete', 'toggle-admin'])
</script>