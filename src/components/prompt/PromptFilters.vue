<template>
  <div class="flex items-center space-x-4">
    <!-- Category Filter -->
    <div class="relative">
      <button
        @click="showCategoryFilter = !showCategoryFilter"
        class="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
      >
        <span>分类</span>
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
        </svg>
      </button>
      
      <!-- Category Dropdown -->
      <div
        v-if="showCategoryFilter"
        class="absolute top-full left-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-10"
      >
        <div class="p-4 space-y-2 max-h-64 overflow-y-auto">
          <label
            v-for="category in categories"
            :key="category.id"
            class="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded"
          >
            <input
              type="checkbox"
              :value="category.id"
              v-model="selectedCategories"
              class="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <span class="text-sm">{{ category.name }}</span>
            <span class="text-xs text-gray-500">({{ category.promptCount }})</span>
          </label>
        </div>
      </div>
    </div>

    <!-- Clear Filters -->
    <button
      v-if="hasActiveFilters"
      @click="clearFilters"
      class="text-sm text-gray-500 hover:text-gray-700 transition-colors"
    >
      清除筛选
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { usePromptsStore } from '@/stores/prompts'
import { useFiltersStore } from '@/stores/filters'

const promptsStore = usePromptsStore()
const filtersStore = useFiltersStore()

const showCategoryFilter = ref(false)

const categories = computed(() => promptsStore.categories)
const selectedCategories = computed({
  get: () => filtersStore.selectedCategories,
  set: (value) => filtersStore.setCategories(value)
})

const hasActiveFilters = computed(() => 
  filtersStore.selectedCategories.length > 0
)

const clearFilters = () => {
  filtersStore.resetFilters()
}

// Close dropdowns when clicking outside
const handleClickOutside = (event: Event) => {
  const target = event.target as HTMLElement
  if (!target.closest('.relative')) {
    showCategoryFilter.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>