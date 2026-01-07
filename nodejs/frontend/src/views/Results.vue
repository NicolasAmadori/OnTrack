<template>
  <MinimalBanner title="Results" imageType="passenger" subtitle="Cesena -> Bologna Centrale" goBackIcon/>
  <ResultListItem
      key="1"
      id="1"
      time="07:09 -> 08:10"
      price="22,50€"
  />

  <ResultListItem
      key="2"
      id="2"
      time="07:09 -> 08:10"
      price="22,50€"
      highlighted
  />
</template>

<script setup>
import MinimalBanner from "@/components/MinimalBanner.vue";
import ResultListItem from "@/components/ResultListItem.vue";
</script>