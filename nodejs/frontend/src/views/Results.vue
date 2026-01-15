<template>
  <MinimalBanner
      title="Results"
      :subtitle="routeSubtitle"
      goBackIcon
  />

  <div v-if="loading" class="flex justify-center mt-10">
    <span class="text-xl text-dark">Searching for trains...</span>
  </div>

  <div v-else-if="!loading && results.length === 0" class="text-center mt-10 text-xl text-red">
    No trains found for this search.
  </div>

  <template v-else v-for="(items, date) in groupedResults" :key="date">
    <div class="row fs-4 dark mx-4 xl:mx-40 mt-4 font-bold">{{ date }}</div>

    <ResultListItem
        v-for="r in items"
        :key="r.id"
        :id="r.id"
        :time="`${r.startingTime} → ${r.arrivalTime}`"
        :price="r.price"
        :origin="r.startingStation"
        :destination="r.arrivalStation"
        :logos="r.logos"
        :highlighted="r.highlighted"
        :passengers=passengers
    />
  </template>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import MinimalBanner from "@/components/MinimalBanner.vue";
import ResultListItem from "@/components/ResultListItem.vue";
import { searchSolution } from "@/api/solutions.js";
import { formatDate, formatTime } from "@/util/dateTime.js";

const route = useRoute();
const results = ref([]);
const loading = ref(false);

const passengers = computed(() => {
  return Number(route.query.passengers);
});

const routeSubtitle = computed(() => {
  const from = route.query.fromName || 'Origin';
  const to = route.query.toName || 'Destination';
  return `${from} → ${to}`;
});

const fetchResults = async () => {
  loading.value = true;
  results.value = [];

  try {
    const data = await searchSolution(
        localStorage.getItem("authToken"),
        route.query.from,
        route.query.to,
        route.query.date,
        route.query.passengers
    );
    const amounts = data
        .map(res => res.solution)
        .map(sol => sol.price.amount);

    const minPrice = amounts.length > 0 ? Math.min(...amounts) : null;

    results.value = data
        .map(res => res.solution)
        .map(sol => ({
          id: sol.id,
          date: formatDate(sol.departureTime),
          startingTime: formatTime(sol.departureTime),
          arrivalTime: formatTime(sol.arrivalTime),
          price: sol.price ? sol.price.amount.toFixed(2) + sol.price.currency : 'N/A',
          startingStation: sol.origin,
          arrivalStation: sol.destination,
          highlighted: sol.price && sol.price.amount === minPrice,
          logos: sol.trains.map(t => t.logoId),
          rawData: sol
        }));
  } catch (error) {
    console.error("Errore nel recupero treni:", error);
  } finally {
    loading.value = false;
  }
};

const groupedResults = computed(() => {
  return results.value.reduce((acc, result) => {
    if (!acc[result.date]) {
      acc[result.date] = [];
    }
    acc[result.date].push(result);
    return acc;
  }, {});
});

onMounted(() => {
  passengers.value = history.state.passengers;
  fetchResults();
});

watch(() => route.query, () => {
  fetchResults();
});
</script>