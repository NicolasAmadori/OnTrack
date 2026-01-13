<template>
  <MinimalBanner
      title="Results"
      imageType="passenger"
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
    />
  </template>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import MinimalBanner from "@/components/MinimalBanner.vue";
import ResultListItem from "@/components/ResultListItem.vue";
import { searchSolution } from "@/api/solutions.js";

const route = useRoute();
const results = ref([]);
const loading = ref(false);

const routeSubtitle = computed(() => {
  const from = route.query.fromName || 'Origin';
  const to = route.query.toName || 'Destination';
  return `${from} → ${to}`;
});

const formatTime = (dateStr) => {
  if (!dateStr) return '';
  try {
    const d = new Date(dateStr);
    return d.toLocaleTimeString('en-UK', { hour: '2-digit', minute: '2-digit' });
  } catch (e) {
    return dateStr;
  }
};

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
    console.log(data);
    const amounts = data
        .map(res => res.solution)
        .filter(sol => sol.status === "SALEABLE" && sol.price)
        .map(sol => sol.price.amount);

    const minPrice = amounts.length > 0 ? Math.min(...amounts) : null;

    results.value = data
        .map(res => res.solution)
        .filter(sol => sol.status === "SALEABLE")
        .map(sol => ({
          id: sol.id,
          date: new Date(sol.departureTime).toLocaleDateString('en-GB', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          }),
          startingTime: formatTime(sol.departureTime),
          arrivalTime: formatTime(sol.arrivalTime),
          price: sol.price ? sol.price.amount.toFixed(2) + sol.price.currency : 'N/A',
          startingStation: sol.origin,
          arrivalStation: sol.destination,
          highlighted: sol.price && sol.price.amount === minPrice,
          logos: sol.trains.map(t => t.logoId)
        }));
    console.log(results.value);
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
  fetchResults();
});

watch(() => route.query, () => {
  fetchResults();
});
</script>