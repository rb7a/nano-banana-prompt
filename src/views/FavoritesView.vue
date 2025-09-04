<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="text-center py-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-4">我的收藏</h1>
      <p class="text-gray-600">管理你收藏的提示词</p>
    </div>

    <!-- Actions -->
    <div class="flex flex-col md:flex-row gap-4 items-center justify-between">
      <div class="w-full md:w-96">
        <SearchBar placeholder="在收藏中搜索..." />
      </div>
      
      <div class="flex gap-2">
        <button
          v-if="favoritePrompts.length > 0"
          @click="exportFavorites"
          class="btn-secondary"
        >
          导出收藏
        </button>
        <button
          v-if="favoritePrompts.length > 0"
          @click="clearAllFavorites"
          class="px-4 py-2 text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-colors"
        >
          清空收藏
        </button>
      </div>
    </div>

    <!-- Content -->
    <div v-if="isLoading">
      <LoadingSpinner size="lg" text="加载中..." />
    </div>
    
    <div v-else-if="favoritePrompts.length === 0" class="text-center py-16">
      <div class="text-6xl mb-6">💝</div>
      <h3 class="text-xl font-semibold text-gray-900 mb-2">还没有收藏任何提示词</h3>
      <p class="text-gray-600 mb-8">浏览提示词并点击心形图标来收藏它们</p>
      <RouterLink to="/" class="btn-primary">
        开始浏览
      </RouterLink>
    </div>
    
    <div v-else>
      <div class="flex items-center justify-between mb-4">
        <p class="text-gray-600">
          共收藏 {{ favoritePrompts.length }} 个提示词
        </p>
      </div>
      <PromptGrid :prompts="favoritePrompts" />
    </div>

    <!-- Clear Confirmation Modal -->
    <div
      v-if="showClearModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      @click="showClearModal = false"
    >
      <div
        class="bg-white rounded-xl p-6 max-w-md mx-4"
        @click.stop
      >
        <h3 class="text-lg font-semibold text-gray-900 mb-4">确认清空收藏</h3>
        <p class="text-gray-600 mb-6">
          此操作将清空所有收藏的提示词，且无法撤销。确定要继续吗？
        </p>
        <div class="flex gap-3 justify-end">
          <button
            @click="showClearModal = false"
            class="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            取消
          </button>
          <button
            @click="confirmClearAll"
            class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            确认清空
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import SearchBar from '@/components/common/SearchBar.vue'
import PromptGrid from '@/components/prompt/PromptGrid.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import { usePromptsStore } from '@/stores/prompts'
import { useFavoritesStore } from '@/stores/favorites'

const promptsStore = usePromptsStore()
const favoritesStore = useFavoritesStore()

const isLoading = ref(true)
const showClearModal = ref(false)

const favoritePrompts = computed(() => {
  return promptsStore.prompts.filter(prompt => 
    favoritesStore.favorites.includes(prompt.id)
  )
})

const exportFavorites = () => {
  const data = {
    exportDate: new Date().toISOString(),
    favorites: favoritePrompts.value.map(prompt => ({
      id: prompt.id,
      title: prompt.title,
      content: prompt.content,
      category: prompt.category,
      author: prompt.author,
      sourceUrl: prompt.sourceUrl,
    }))
  }
  
  const blob = new Blob([JSON.stringify(data, null, 2)], { 
    type: 'application/json' 
  })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `nano-banana-favorites-${new Date().toISOString().split('T')[0]}.json`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

const clearAllFavorites = () => {
  showClearModal.value = true
}

const confirmClearAll = () => {
  favoritesStore.clearAll()
  showClearModal.value = false
}

onMounted(async () => {
  try {
    await promptsStore.loadPrompts()
  } catch (error) {
    console.error('Failed to load prompts:', error)
  } finally {
    isLoading.value = false
  }
})
</script>