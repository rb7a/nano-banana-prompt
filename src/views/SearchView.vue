<template>
  <div class="space-y-6">
    <!-- Search Header -->
    <div class="text-center py-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-4">搜索提示词</h1>
      <div class="max-w-2xl mx-auto">
        <SearchBar />
      </div>
    </div>

    <!-- Filters -->
    <div class="flex justify-center">
      <PromptFilters />
    </div>

    <!-- Search Results -->
    <div v-if="isLoading">
      <LoadingSpinner size="lg" text="搜索中..." />
    </div>
    
    <div v-else-if="!hasSearched" class="text-center py-16">
      <div class="text-6xl mb-6">🔍</div>
      <h3 class="text-xl font-semibold text-gray-900 mb-2">开始搜索</h3>
      <p class="text-gray-600 mb-8">输入关键词来搜索相关的提示词</p>
      
      <!-- Search Suggestions -->
      <div class="max-w-2xl mx-auto">
        <h4 class="text-sm font-medium text-gray-700 mb-3">热门搜索：</h4>
        <div class="flex flex-wrap gap-2 justify-center">
          <button
            v-for="suggestion in searchSuggestions"
            :key="suggestion"
            @click="searchSuggestion(suggestion)"
            class="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors"
          >
            {{ suggestion }}
          </button>
        </div>
      </div>
    </div>
    
    <div v-else-if="searchResults.length === 0" class="text-center py-16">
      <div class="text-6xl mb-6">😅</div>
      <h3 class="text-xl font-semibold text-gray-900 mb-2">没有找到相关结果</h3>
      <p class="text-gray-600 mb-6">
        没有找到与 "{{ currentQuery }}" 相关的提示词
      </p>
      <div class="space-y-4">
        <p class="text-sm text-gray-500">建议：</p>
        <ul class="text-sm text-gray-600 space-y-1">
          <li>• 检查拼写是否正确</li>
          <li>• 尝试使用更通用的关键词</li>
          <li>• 使用不同的搜索词组合</li>
        </ul>
      </div>
    </div>
    
    <div v-else>
      <div class="flex items-center justify-between mb-6">
        <div>
          <p class="text-gray-600">
            找到 {{ searchResults.length }} 个相关提示词
          </p>
          <p v-if="currentQuery" class="text-sm text-gray-500 mt-1">
            搜索关键词：{{ currentQuery }}
          </p>
        </div>
        
        <button
          @click="clearSearch"
          class="text-gray-500 hover:text-gray-700 text-sm"
        >
          清除搜索
        </button>
      </div>
      
      <PromptGrid :prompts="searchResults" :highlight-query="currentQuery" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import SearchBar from '@/components/common/SearchBar.vue'
import PromptFilters from '@/components/prompt/PromptFilters.vue'
import PromptGrid from '@/components/prompt/PromptGrid.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import { usePromptsStore } from '@/stores/prompts'
import { useFiltersStore } from '@/stores/filters'

const route = useRoute()
const router = useRouter()
const promptsStore = usePromptsStore()
const filtersStore = useFiltersStore()

const isLoading = ref(false)
const hasSearched = ref(false)

const currentQuery = computed(() => route.query.q as string || '')

const searchResults = computed(() => {
  if (!currentQuery.value) return []
  return promptsStore.searchPrompts(currentQuery.value)
})

const searchSuggestions = [
  '3D', '动漫', '艺术', '创意', '可爱', '未来主义', 
  '复古', '极简', '卡通', '写实'
]

const searchSuggestion = (suggestion: string) => {
  router.push({ name: 'search', query: { q: suggestion } })
}

const clearSearch = () => {
  router.push({ name: 'search' })
  filtersStore.resetFilters()
}

// Watch for query changes
watch(currentQuery, (newQuery) => {
  if (newQuery) {
    hasSearched.value = true
    filtersStore.setSearchQuery(newQuery)
  } else {
    hasSearched.value = false
    filtersStore.resetFilters()
  }
}, { immediate: true })

onMounted(async () => {
  try {
    isLoading.value = true
    await promptsStore.loadPrompts()
  } catch (error) {
    console.error('Failed to load prompts:', error)
  } finally {
    isLoading.value = false
  }
})
</script>