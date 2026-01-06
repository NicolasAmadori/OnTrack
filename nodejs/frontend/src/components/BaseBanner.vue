<template>
  <div class="banner d-flex flex-column align-items-end justify-content-between px-5 mb-3" :style="bannerStyle">
    <h1 class="banner-title my-3">{{ title }}</h1>
    <h3 class="banner-subtitle align-self-end">{{ subtitle }}</h3>
  </div>
</template>

<script setup>
import bannerStation from '@/assets/images/banner_station.png';
import bannerTickets from '@/assets/images/banner_tickets.png';
import bannerPassenger from '@/assets/images/banner_passenger.png';
import bannerOnboard from '@/assets/images/banner_onboard.png';
import { computed } from 'vue';

const props = defineProps({
title: {
    type: String,
    default: 'OnTrack'
},
imageType: {
    type: String,
    default: 'station', 
    validator: (value) => ['station', 'tickets', 'passenger', 'onboard'].includes(value)
},
subtitle: {
    type: String,
    default: '',
},
admin: {
  type: Boolean,
  default: false
}
});

const images = {
    station: bannerStation,
    tickets: bannerTickets,
    passenger: bannerPassenger,
    onboard: bannerOnboard
};

const bannerStyle = computed(() => {
  const selectedImage = images[props.imageType] || images.station;
  const gradientColor = props.admin
      ? 'rgba(249, 116, 77, 0.8)'
      : 'rgba(19, 77, 87, 0.8)';

  return {
    backgroundImage: `
      linear-gradient(to bottom, ${gradientColor}, ${gradientColor}),
      url(${selectedImage})
    `,
    backgroundSize: 'cover',
    backgroundPosition: 'center center'
  };
});
</script>

<style scoped>
.banner {
    height: 30vh;
    width: 100%;
}

.banner-title {
    color: var(--white);
    margin-bottom: 0 !important;
    font-size: 2rem;
    background-color: transparent;
}

.banner-subtitle {
    color: var(--bright);
    font-size: 1.5rem;
    background-color: transparent;
}
</style>