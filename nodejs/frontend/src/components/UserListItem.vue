<template>
  <div class="group relative mb-3 flex h-11.75 items-stretch overflow-hidden rounded-xl bg-transparent shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg mx-4 xl:mx-40  ">

    <router-link
        :to="`/admin/user-management/${id}`"
        class="flex flex-1 items-center min-w-0 bg-light px-3"
    >
      <span class="truncate font-mono text-sm text-darker">
        {{ email }}
      </span>
    </router-link>

    <div class="flex items-center bg-[#d6ccc4] px-2 md:px-3 gap-2 md:gap-3">

      <button
          class="flex items-center justify-center p-1 transition-transform active:scale-90 cursor-pointer"
          @click.stop="$emit('toggle-admin')"
          :title="isAdmin ? 'Remove Admin Rights' : 'Grant Admin Rights'"
      >
        <i
            class="bi text-2xl transition-colors"
            :class="isAdmin
            ? 'bi-shield-fill-check text-darker'
            : 'bi-shield-check text-darker opacity-70 hover:opacity-100'"
        ></i>
      </button>

      <button
          class="flex items-center justify-center p-1 transition-transform active:scale-90 cursor-pointer"
          @click.stop="$emit('delete')"
          title="Delete User"
      >
        <i class="bi bi-trash3-fill text-2xl text-bright transition-colors hover:text-red-500"></i>
      </button>

    </div>
  </div>
</template>

<script setup>
defineProps({
  id: { type: [String, Number], required: true },
  email: { type: String, required: true },
  isAdmin: { type: Boolean, default: false }
})
defineEmits(['delete', 'toggle-admin'])
</script>