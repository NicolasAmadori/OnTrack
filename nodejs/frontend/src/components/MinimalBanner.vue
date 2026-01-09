<template>
  <div
      class="h-[15vh] w-full flex flex-col px-6 md:px-3 mb-3 relative py-4 bg-lessdark"
  >
    <div class="flex items-center justify-between w-full h-12 z-10">

      <div class="flex items-center gap-2">
        <button
            @click.stop="sidebar.toggleSidebar"
            class="bg-transparent border-0 cursor-pointer transition-transform duration-200 hover:scale-110 md:hidden flex items-center"
            title="Open menu"
        >
          <i class="bi bi-list leading-none" :style="iconStyle"></i>
        </button>

        <div v-if="goBackIcon" class="w-px h-6 bg-current opacity-30 mx-1 md:hidden"></div>

        <button
            v-if="goBackIcon"
            @click="goBack"
            class="bg-transparent border-0 transition-transform duration-200 hover:scale-110 cursor-pointer flex items-center"
            title="Go back"
        >
          <i class="bi bi-chevron-left text-2xl leading-none" :style="backIconStyle"></i>
          <span class="text-md font-bold uppercase tracking-tight" :style="textLinkStyle">Back</span>
        </button>
      </div>

      <h1
          class="text-3xl bg-transparent text-right wrap-break-word max-w-[60%] m-0 leading-none"
          :style="titleStyle"
      >
        {{ title }}
      </h1>
    </div>

    <div class="mt-auto self-end">
      <h3 v-if="subtitle" class="text-2xl bg-transparent text-right" :style="subtitleStyle">
        {{ subtitle }}
      </h3>
    </div>
  </div>
</template>

<script setup>
import { computed, inject } from 'vue';
import { useRouter } from 'vue-router';

const sidebar = inject('sidebarControl');
const router = useRouter();

const props = defineProps({
  title: { type: String, default: 'OnTrack' },
  subtitle: { type: String, default: '' },
  goBackIcon: { type: Boolean, default: false }
});

const goBack = () => router.back();

const titleStyle = computed(() => ({
  color: props.admin ? 'var(--black)' : 'var(--white)'
}));

const subtitleStyle = computed(() => ({
  color: props.admin ? 'var(--black)' : 'var(--bright)'
}));

const iconStyle = computed(() => ({
  color: props.admin ? 'var(--black)' : 'var(--white)',
  fontSize: '2.2rem'
}));

const backIconStyle = computed(() => ({
  color: props.admin ? 'var(--black)' : 'var(--bright)'
}));

const textLinkStyle = computed(() => ({
  color: props.admin ? 'var(--black)' : 'var(--white)',
  marginLeft: '-4px'
}));
</script>