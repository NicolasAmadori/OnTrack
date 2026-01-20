<template>
  <div
      class="h-[30vh] w-full flex flex-col px-6 md:px-3 mb-3 relative py-4"
      :style="bannerStyle"
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
          <span class="text-sm font-bold uppercase tracking-tight" :style="textLinkStyle">Back</span>
        </button>
      </div>

      <h1
            class="text-3xl bg-transparent text-right max-w-[60%] m-0 leading-none break-normal"
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
    <slot></slot>
  </div>
</template>

<script setup>
import bannerStation from '@/assets/images/banners/station.png';
import bannerTickets from '@/assets/images/banners/tickets.png';
import bannerPassenger from '@/assets/images/banners/passenger.png';
import bannerOnboard from '@/assets/images/banners/onboard.png';
import { computed, inject } from 'vue';
import { useRouter } from 'vue-router';

const sidebar = inject('sidebarControl');
const router = useRouter();

const props = defineProps({
  title: { type: String, default: 'OnTrack' },
  imageType: {
    type: String,
    default: 'station',
    validator: (value) => ['station', 'tickets', 'passenger', 'onboard'].includes(value)
  },
  subtitle: { type: String, default: '' },
  admin: { type: Boolean, default: false },
  goBackIcon: { type: Boolean, default: false }
});

const images = {
  station: bannerStation,
  tickets: bannerTickets,
  passenger: bannerPassenger,
  onboard: bannerOnboard
};

const goBack = () => router.back();

const bannerStyle = computed(() => {
  const selectedImage = images[props.imageType] || images.station;
  const gradientColor = props.admin
      ? 'rgba(249, 116, 77, 0.8)'
      : 'rgba(19, 77, 87, 0.8)';

  return {
    backgroundImage: `linear-gradient(to bottom, ${gradientColor}, ${gradientColor}), url(${selectedImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center center'
  };
});

const titleStyle = computed(() => ({
  color: props.admin ? 'var(--black)' : 'var(--white)'
}));

const subtitleStyle = computed(() => ({
  color: props.admin ? 'var(--black)' : 'var(--white)'
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