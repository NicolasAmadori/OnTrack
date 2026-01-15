<template>
  <div
      class="relative mb-2 mx-3 xl:mx-40"
      :class="isOpen ? 'z-50' : ''"
      ref="selectContainer"
  >

    <div
        class="group flex items-center bg-light rounded-lg overflow-hidden cursor-pointer h-15 shadow-sm transition-opacity duration-200 hover:opacity-80 active:shadow-none relative"
        @click="togglePopup"
    >
      <i :class="`bi ${iconName} text-lessdark text-xl mx-3`"></i>
      <span class="text-gray-900 grow font-medium select-none truncate">
        {{ displaySelection }}
      </span>
      <div class="flex items-center justify-center bg-lesslight text-lessdark h-full w-12 border-l border-lesslight group-hover:text-bright transition-colors">
        <i class="bi bi-grid-3x3-gap-fill text-xl"></i>
      </div>
    </div>

    <div
        v-if="isOpen"
        class="fixed inset-0 bg-black/50 transition-opacity z-40"
        @click="isOpen = false"
    ></div>

    <div
        v-if="isOpen && trains.length"
        class="fixed top-25 xs:right-5 right-15 sm:right-40 md:right-56 lg:right-88 xl:right-120 2xl:right-152 z-50 bg-lighter rounded-lg shadow-xl overflow-hidden border border-lesslight w-80 max-h-[80vh] flex flex-col"
    >

      <button
          @click.stop="isOpen = false"
          class="absolute top-0 right-0 z-10 p-1.5 text-dark hover:bg-lesslight rounded-2xl transition-colors"
      >
        <i class="bi bi-x-lg text-3xl"></i>
      </button>

      <div class="flex items-center justify-center mt-6 pt-2 pb-2 gap-3 shrink-0 bg-lighter border-lesslight relative">
        <button
            @click.stop="prevTrain"
            :disabled="currentTrainIndex === 0"
            class="p-2 hover:bg-lesslight rounded-full disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <i class="bi bi-caret-left-fill text-3xl text-dark"></i>
        </button>

        <div class="font-bold text-2xl text-dark">
          {{ currentTrain.code }}
        </div>

        <button
            @click.stop="nextTrain"
            :disabled="currentTrainIndex === trains.length - 1"
            class="p-2 hover:bg-lesslight rounded-full disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <i class="bi bi-caret-right-fill text-3xl text-dark"></i>
        </button>
      </div>

      <div class="flex justify-center gap-4 text-xs mb-2 py-2 text-gray-500 shrink-0 bg-lighter">
        <div class="flex items-center"><span class="w-3 h-3 bg-white border-dark border rounded-sm mr-1"></span> Free</div>
        <div class="flex items-center"><span class="w-3 h-3 bg-dark rounded-sm mr-1"></span> Occupied</div>
        <div class="flex items-center"><span class="w-3 h-3 bg-bright rounded-sm mr-1"></span> Selected</div>
      </div>

      <div class="overflow-y-auto p-4 bg-lighter custom-scrollbar">
        <div class="flex flex-col gap-2">
          <div
              v-for="rowNum in 30"
              :key="`row-${rowNum}`"
              class="flex justify-center gap-3"
          >
            <div
                v-for="colChar in ['A', 'B', 'C', 'D']"
                :key="`seat-${colChar}${rowNum}`"
            >
              <div
                  @click="handleSeatClick(colChar, rowNum)"
                  :class="[
                    'w-10 h-10 flex items-center justify-center rounded text-sm font-bold transition-all duration-200 select-none border',
                    getSeatClasses(colChar, rowNum)
                  ]"
                  :title="isOccupied(colChar, rowNum) ? 'Occupied' : `Seat ${colChar}${rowNum}`"
              >
                {{ colChar }}{{ rowNum }}
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  iconName: {
    type: String,
    default: "bi-luggage-fill",
  },
  placeholder: {
    type: String,
    default: "Select your set",
  },
  trains: {
    type: Array,
    required: true,
    default: () => [],
  },
});

const emit = defineEmits(['select', 'click-empty']);

const isOpen = ref(false);
const currentTrainIndex = ref(0);
const selectContainer = ref(null);
const seatSelectionMap = ref(new Map());

const currentTrain = computed(() => {
  return props.trains[currentTrainIndex.value] || { code: 'N/A', occupied: [] };
});

const displaySelection = computed(() => {
  if (!seatSelectionMap.value.keys()) return props.placeholder;
  return Array.from(seatSelectionMap.value.values()).join(" / ");
});

const togglePopup = () => {
  if (props.trains && props.trains.length > 0) {
    isOpen.value = !isOpen.value;
  } else {
    emit('click-empty');
  }
};

const prevTrain = () => {
  if (currentTrainIndex.value > 0) {
    currentTrainIndex.value--;
  }
};

const nextTrain = () => {
  if (currentTrainIndex.value < props.trains.length - 1) {
    currentTrainIndex.value++;
  }
};

const getSeatId = (colChar, rowNum) => `${colChar}${rowNum}`;

const isOccupied = (colChar, rowNum) => {
  const seatId = getSeatId(colChar, rowNum);
  return currentTrain.value.occupied && currentTrain.value.occupied.includes(seatId);
};

const handleSeatClick = (colChar, rowNum) => {
  if (isOccupied(colChar, rowNum)) return;

  const seatId = getSeatId(colChar, rowNum);
  seatSelectionMap.value.set(currentTrain.value.code, seatId);
  emit('select', seatSelectionMap.value);
};

const getSeatClasses = (colChar, rowNum) => {
  const seatId = getSeatId(colChar, rowNum);
  const occupied = isOccupied(colChar, rowNum);

  const isSelected = seatSelectionMap.value.has(currentTrain.value.code) && seatSelectionMap.value.get(currentTrain.value.code) === seatId;

  let style;
  if (isSelected) {
    style = 'bg-bright text-dark border-transparent cursor-pointer';
  } else if (occupied) {
    style = 'bg-dark text-white border-transparent cursor-not-allowed';
  } else {
    style = 'bg-white text-dark border-dark hover:bg-bright hover:border-none cursor-pointer';
  }

  if (colChar === "B") {
    style += " mr-4"
  }

  if (rowNum % 10 === 0) {
    style += " mb-8"
  }

  return style;
};
</script>