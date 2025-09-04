<template>
    <div class="card p-6 group">
        <!-- Image -->
        <div v-if="prompt.images.gemini || prompt.images.gpt4o" class="mb-4">
            <img :src="prompt.images.gemini || prompt.images.gpt4o" :alt="prompt.title" class="w-full h-48 object-cover rounded-lg" loading="lazy" @error="handleImageError" />
        </div>

        <!-- Content -->
        <div class="space-y-3">
            <!-- Title -->
            <h3 class="font-semibold text-gray-900 line-clamp-2">
                {{ prompt.title }}
            </h3>

            <!-- Preview -->
            <p class="text-gray-600 text-sm line-clamp-3">
                {{ prompt.content }}
            </p>

            <!-- Meta -->
            <div class="flex items-center justify-between text-xs text-gray-500">
                <span class="bg-gray-100 px-2 py-1 rounded">{{ prompt.category }}</span>
            </div>

            <!-- Actions -->
            <div class="flex items-center justify-between pt-2">
                <div class="flex items-center space-x-2">
                    <!-- Copy Button -->
                    <button
                        @click="copyPrompt"
                        class="flex items-center space-x-1 px-3 py-1 bg-primary-50 text-primary-600 rounded-lg hover:bg-primary-100 transition-colors text-sm"
                        :class="{ 'bg-green-50 text-green-600': copied }"
                    >
                        <svg v-if="!copied" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                            ></path>
                        </svg>
                        <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                        <span>{{ copied ? '已复制' : '复制' }}</span>
                    </button>

                    <!-- Favorite Button -->
                    <button
                        @click="toggleFavorite"
                        class="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                        :class="{ 'text-red-500': isFavorite, 'text-gray-400': !isFavorite }"
                    >
                        <svg class="w-5 h-5" :fill="isFavorite ? 'currentColor' : 'none'" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                            ></path>
                        </svg>
                    </button>
                </div>

                <!-- Source Link -->
                <a v-if="prompt.sourceUrl" :href="prompt.sourceUrl" target="_blank" rel="noopener noreferrer" class="text-gray-400 hover:text-gray-600 transition-colors">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                        ></path>
                    </svg>
                </a>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Prompt } from '@/types/prompt'
import { useFavoritesStore } from '@/stores/favorites'
import { copyToClipboard } from '@/utils/clipboard'

interface Props {
    prompt: Prompt
    highlightQuery?: string
}

const props = defineProps<Props>()

const favoritesStore = useFavoritesStore()
const copied = ref(false)

const isFavorite = computed(() => favoritesStore.favorites.includes(props.prompt.id))

const copyPrompt = async () => {
    try {
        await copyToClipboard(props.prompt.content)
        copied.value = true
        setTimeout(() => {
            copied.value = false
        }, 2000)
    } catch (error) {
        console.error('Failed to copy:', error)
    }
}

const toggleFavorite = () => {
    favoritesStore.toggle(props.prompt.id)
}

const handleImageError = (event: Event) => {
    const img = event.target as HTMLImageElement
    img.style.display = 'none'
}
</script>

<style scoped>
.line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.line-clamp-3 {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
}
</style>
