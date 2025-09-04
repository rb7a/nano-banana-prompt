<template>
  <div class="space-y-6">
    <!-- Breadcrumb -->
    <Breadcrumb :items="breadcrumbItems" />

    <!-- Category Header -->
    <div class="text-center py-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-4">
        {{ categoryInfo?.name || '分类' }}
      </h1>
      <p v-if="categoryInfo?.description" class="text-gray-600 max-w-2xl mx-auto">
        {{ categoryInfo.description }}
      </p>
    </div>

    <!-- Filters and Search -->
    <div class="flex flex-col md:flex-row gap-4 items-center justify-between">
      <div class="w-full md:w-96">
        <SearchBar placeholder="在当前分类中搜索..." />
      </div>
      <PromptFilters />
    </div>

    <!-- Results -->
    <div v-if="isLoading">
      <LoadingSpinner size="lg" text="加载中..." />
    </div>
    
    <div v-else-if="filteredPrompts.length === 0" class="text-center py-12">
      <div class="text-6xl mb-4">🔍</div>
      <h3 class="text-xl font-semibold text-gray-900 mb-2">没有找到相关提示词</h3>
      <p class="text-gray-600 mb-6">尝试调整搜索条件或浏览其他分类</p>
      <RouterLink to="/" class="btn-primary">
        返回首页
      </RouterLink>
    </div>
    
    <div v-else>
      <div class="flex items-center justify-between mb-4">
        <p class="text-gray-600">
          找到 {{ filteredPrompts.length }} 个提示词
        </p>
      </div>
      <PromptGrid :prompts="filteredPrompts" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import Breadcrumb from '@/components/navigation/Breadcrumb.vue'
import SearchBar from '@/components/common/SearchBar.vue'
import PromptFilters from '@/components/prompt/PromptFilters.vue'
import PromptGrid from '@/components/prompt/PromptGrid.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import { usePromptsStore } from '@/stores/prompts'
import { useFiltersStore } from '@/stores/filters'

const route = useRoute()
const promptsStore = usePromptsStore()
const filtersStore = useFiltersStore()

const isLoading = ref(true)
const categoryId = computed(() => route.params.id as string)

const categoryInfo = computed(() => {
  return promptsStore.categories.find(cat => cat.id === categoryId.value)
})

const filteredPrompts = computed(() => {
  return promptsStore.getPromptsByCategory(categoryId.value)
})

const breadcrumbItems = computed(() => [
  { label: '首页', to: '/' },
  { label: categoryInfo.value?.name || '分类', to: `/category/${categoryId.value}` }
])

onMounted(async () => {
  try {
    await promptsStore.loadPrompts()
  } catch (error) {
    console.error('Failed to load prompts:', error)
  } finally {
    isLoading.value = false
  }
})

// Reset filters when category changes
watch(categoryId, () => {
  filtersStore.resetFilters()
})
</script>