<template>
  <div class="mb-5 w-full relative">
    <div class="relative mx-2 xl:mx-40">

      <input
          type="text"
          :id="id"
          v-model="query"
          @input="onInputHandler"
          @blur="onBlur"
          autocomplete="off"
          role="combobox"
          aria-autocomplete="list"
          aria-controls="suggestions-list"
          :aria-expanded="isOpen"
          aria-haspopup="listbox"
          placeholder="Search station"
          class="h-15 w-full bg-lighter text-black text-lg py-4 px-3 border-none outline-none placeholder:text-lessdark placeholder:transition-opacity placeholder:duration-200 focus:placeholder:opacity-0 rounded-xl transition-all"
          :class="{ 'ring-2 ring-red': invalid, 'focus:bg-white': !invalid }"
          v-bind="$attrs"
      />

      <ul
          v-if="isOpen && filteredSuggestions.length"
          id="suggestions-list"
          class="absolute left-0 right-0 top-full mt-2 z-50 bg-white rounded-xl shadow-xl max-h-50 overflow-y-auto py-2"
          role="listbox"
      >
        <li
            v-for="(item, index) in filteredSuggestions"
            :key="item.id"
            class="px-4 py-3 text-lg cursor-pointer hover:bg-gray-100 transition-colors text-black"
            role="option"
            @mousedown.prevent="selectSuggestion(item)"
        >
          {{ item.displayName }}
        </li>
      </ul>

      <div
          v-if="invalid"
          class="absolute bottom-full left-0 mb-1 ml-1 text-white text-sm font-medium bg-red rounded-t-2xl px-2"
      >
        Select a valid station from the list.
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { get_stations } from '@/api/stations.js'
import { localAuthToken } from "@/util/auth.js";

const props = defineProps({
  modelValue: String,
  id: String
})

const emit = defineEmits(['update:modelValue'])

const query = ref('') //display name
const filteredSuggestions = ref([])
const isOpen = ref(false)
const invalid = ref(false)

let debounceTimeout = null
let justSelected = false
let previousDisplayName = null

async function onInputHandler() {
  justSelected = false
  invalid.value = false

  if (query.value.trim().length < 1) {
    filteredSuggestions.value = []
    isOpen.value = false
    emit('update:modelValue', '')
    return
  }

  clearTimeout(debounceTimeout)
  debounceTimeout = setTimeout(async () => {
    try {
      const results = await get_stations(localAuthToken.value, query.value);
      filteredSuggestions.value = results.slice(0, 10)
      isOpen.value = filteredSuggestions.value.length > 0
    } catch (error) {
      console.error('Error stations fetch:', error)
      filteredSuggestions.value = []
      isOpen.value = false
    }
  }, 300)
}

function selectSuggestion(station) {
  query.value = station.displayName
  previousDisplayName = station.displayName
  isOpen.value = false
  invalid.value = false
  justSelected = true
  emit('update:modelValue', String(station.id))
}

function onBlur() {
  const trimmed = query.value.trim()

  if (trimmed === '') {
    query.value = ''
    emit('update:modelValue', '')
    invalid.value = true
    isOpen.value = false
    previousDisplayName = null
    return
  }

  const match = filteredSuggestions.value.find(
      s => s.displayName === query.value
  )

  if (justSelected) {
    if (!match) {
      query.value = ''
      invalid.value = true
      emit('update:modelValue', '')
    }
  } else {
    justSelected = true
    invalid.value = false

    if (!match) {
      query.value = previousDisplayName || ''
      if (!previousDisplayName) {
        emit('update:modelValue', '')
        invalid.value = true
      }
    } else {
      previousDisplayName = query.value
      emit('update:modelValue', String(match.id))
    }
  }
  isOpen.value = false
}

function setDisplayValue(name) {
  query.value = name || '';
  previousDisplayName = name || null;
  invalid.value = false;
  justSelected = true;
  filteredSuggestions.value = [{id:"", name:"", displayName:query.value}];
}

defineExpose({
  setDisplayValue,
  query
});
</script>