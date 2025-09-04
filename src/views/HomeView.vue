<template>
    <div class="space-y-8">
        <!-- Hero Section -->
        <section class="text-center py-12">
            <div class="max-w-3xl mx-auto">
                <h1 class="text-4xl md:text-5xl font-bold text-gray-900 mb-6">🍌 Nano Banana 提示词精选</h1>
                <p class="text-xl text-gray-600 mb-8 leading-relaxed">
                    精选的 AI 图像生成提示词合集，支持 Gemini 和 GPT-4o 模型<br />
                    为你的创意表达提供无限灵感
                </p>

                <!-- Search Bar -->
                <div class="max-w-2xl mx-auto">
                    <SearchBar />
                </div>
            </div>
        </section>

        <!-- Stats -->
        <section class="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div class="card text-center p-6">
                <div class="text-3xl font-bold text-primary-600 mb-2">100+</div>
                <div class="text-gray-600">精选提示词</div>
            </div>
            <div class="card text-center p-6">
                <div class="text-3xl font-bold text-secondary-600 mb-2">10+</div>
                <div class="text-gray-600">创意分类</div>
            </div>
            <div class="card text-center p-6">
                <div class="text-3xl font-bold text-green-600 mb-2">2</div>
                <div class="text-gray-600">AI 模型支持</div>
            </div>
        </section>

        <!-- Categories -->
        <section>
            <h2 class="text-2xl font-bold text-gray-900 mb-6 text-center">浏览分类</h2>
            <CategoryNav />
        </section>

        <!-- Debug Info (temporary) -->
        <!-- <section class="mb-8">
            <DataDebug />
        </section> -->

        <!-- Featured Prompts -->
        <section>
            <div class="flex items-center justify-between mb-6">
                <h2 class="text-2xl font-bold text-gray-900">精选提示词</h2>
                <RouterLink to="/search" class="text-primary-600 hover:text-primary-700 font-medium"> 查看全部 → </RouterLink>
            </div>

            <div v-if="isLoading">
                <LoadingSpinner size="lg" text="加载中..." />
            </div>

            <div v-else>
                <PromptGrid :prompts="featuredPrompts" />
            </div>
        </section>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import SearchBar from '@/components/common/SearchBar.vue'
import CategoryNav from '@/components/navigation/CategoryNav.vue'
import PromptGrid from '@/components/prompt/PromptGrid.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import DataDebug from '@/components/debug/DataDebug.vue'
import { usePromptsStore } from '@/stores/prompts'
import type { Prompt } from '@/types/prompt'

const promptsStore = usePromptsStore()
const isLoading = ref(true)
const featuredPrompts = ref<Prompt[]>([])

onMounted(async () => {
    try {
        await promptsStore.loadPrompts()
        // Get first 6 prompts as featured
        featuredPrompts.value = promptsStore.prompts.slice(0, 6)
    } catch (error) {
        console.error('Failed to load prompts:', error)
    } finally {
        isLoading.value = false
    }
})
</script>
