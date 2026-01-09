<template>
  <div
      class="h-[30vh] w-full flex flex-col items-end justify-between px-12 mb-3 relative"
      :style="bannerStyle"
  >
    <div class="absolute top-0 left-0 flex items-center py-1 px-3 gap-2 z-10">

      <button
          @click.stop="sidebar.toggleSidebar"
          class="bg-transparent border-0 cursor-pointer transition-transform duration-200 hover:scale-110 md:hidden"
          title="Open menu"
      >
        <i class="bi bi-list" :style="iconStyle"></i>
      </button>

      <div v-if="goBackIcon" class="w-px h-6 bg-current opacity-30 mx-1 md:hidden"></div>

      <button
          v-if="goBackIcon"
          @click="goBack"
          class="bg-transparent border-0 transition-transform duration-200 hover:scale-110 cursor-pointer flex items-center"
          title="Go back"
      >
        <i class="bi bi-chevron-left text-2xl" :style="backIconStyle"></i>
        <span class="text-sm font-bold uppercase tracking-tight" :style="textLinkStyle">Back</span>
      </button>
    </div>

    <div class="flex flex-col items-end w-full z-0">
      <h1
          class="text-2xl md:text-3xl my-3 bg-transparent text-right break-words max-w-[70%] sm:max-w-[80%] md:max-w-full"
          :style="titleStyle"
      >
        {{ title }}
      </h1>
      <h3 class="text-2xl self-end bg-transparent text-right" :style="subtitleStyle">
        {{ subtitle }}
      </h3>
    </div>
    <slot></slot>
  </div>
</template>

<script setup>
import bannerStation from '@/assets/images/banner_station.png';
import bannerTickets from '@/assets/images/banner_tickets.png';
import bannerPassenger from '@/assets/images/banner_passenger.png';
import bannerOnboard from '@/assets/images/banner_onboard.png';
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

const textLinkStyle = computed(() => ({
  color: props.admin ? 'var(--black)' : 'var(--white)',
  marginLeft: '-4px'
}));

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
  color: props.admin ? 'var(--black)' : 'var(--bright)'
}));

const iconStyle = computed(() => ({
  color: props.admin ? 'var(--black)' : 'var(--white)',
  fontSize: '2.2rem'
}));

const backIconStyle = computed(() => ({
  color: props.admin ? 'var(--black)' : 'var(--bright)'
}));
</script>