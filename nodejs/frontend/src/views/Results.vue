<template>
  <MinimalBanner title="Results" imageType="passenger" subtitle="Cesena -> Bologna Centrale" goBackIcon/>
  <template v-for="(items, date) in groupedResults" :key="date">

    <div class="row fs-4 dark mx-4 xl:mx-40 mt-4">{{ date }}</div>

    <ResultListItem
        v-for="r in items"
        :key="r.id"
        :id="r.id"
        :time="`${r.starting} -> ${r.arrival}`"
        :price="r.price"
        :logos="r.logos"
        :highlighted="r.highlighted"
    />
  </template>
</template>

<script setup>
import { computed } from 'vue';
import MinimalBanner from "@/components/MinimalBanner.vue";
import ResultListItem from "@/components/ResultListItem.vue";

const results = [
  {id: "1", date:"Tuesday 18/12/2025", starting:"07:09", arrival:"08:10", price:"22,50€", highlighted: false, logos:["frecciarossa"]},
  {id: "2", date:"Tuesday 18/12/2025", starting:"07:09", arrival:"08:10", price:"22,50€", highlighted: false, logos:["intercity"]},
  {id: "3", date:"Tuesday 18/12/2025", starting:"07:09", arrival:"08:10", price:"22,50€", highlighted: false, logos:["regionale"]},
  {id: "4", date:"Wednesday 19/12/2025", starting:"07:09", arrival:"08:10", price:"22,50€", highlighted: false, logos:["regionaleVeloce"]},
  {id: "5", date:"Wednesday 19/12/2025", starting:"07:09", arrival:"08:10", price:"22,50€", highlighted: true, logos:["italo"]},
  {id: "6", date:"Wednesday 19/12/2025", starting:"07:09", arrival:"08:10", price:"22,50€", highlighted: false, logos:["frecciarossa", "regionaleVeloce", "frecciarossa"]},
  {id: "7", date:"Wednesday 19/12/2025", starting:"07:09", arrival:"08:10", price:"22,50€", highlighted: false, logos:["frecciarossa", "intercity", "frecciarossa"]},
  {id: "8", date:"Wednesday 19/12/2025", starting:"07:09", arrival:"08:10", price:"22,50€", highlighted: false},
  {id: "9", date:"Wednesday 19/12/2025", starting:"07:09", arrival:"08:10", price:"22,50€", highlighted: false},
]

const groupedResults = computed(() => {
  return results.reduce((acc, result) => {
    if (!acc[result.date]) {
      acc[result.date] = [];
    }
    acc[result.date].push(result);
    return acc;
  }, {});
});
</script>