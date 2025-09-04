<template>
  <div class="relative">
    <div class="relative">
      <input
        v-model="searchQuery"
        type="text"
        :placeholder="placeholder"
        class="input-field pl-10 pr-10"
        @input="handleInput"
        @keydown.enter="handleSearch"
        @focus="showSuggestions = true"
      />
      
      <!-- Search Icon -->
      <div class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
        </svg>
      </div>
      
      <!-- Clear Button -->
      <button
        v-if="searchQuery"
        @click="clearSearch"
        class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { debounce } from '@/utils/debounce'

interface Props {
  placeholder?: string
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: '搜索提示词...'
})

const router = useRouter()
const route = useRoute()

const searchQuery = ref('')
const showSuggestions = ref(false)

// Initialize search query from URL
if (route.query.q) {
  searchQuery.value = route.query.q as string
}

const debouncedSearch = debounce((query: string) => {
  if (query.trim()) {
    router.push({ name: 'search', query: { q: query.trim() } })
  }
}, 300)

const handleInput = () => {
  debouncedSearch(searchQuery.value)
}

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    router.push({ name: 'search', query: { q: searchQuery.value.trim() } })
  }
}

const clearSearch = () => {
  searchQuery.value = ''
  if (route.name === 'search') {
    router.push({ name: 'search' })
  }
}

// Watch for route changes to update search query
watch(() => route.query.q, (newQuery) => {
  searchQuery.value = (newQuery as string) || ''
})
</script>