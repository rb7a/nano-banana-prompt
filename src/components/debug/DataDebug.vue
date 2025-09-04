<template>
    <div class="bg-gray-100 p-4 rounded-lg text-xs">
        <h3 class="font-bold mb-2">数据调试信息</h3>
        <div class="space-y-2">
            <div>提示词数量: {{ prompts.length }}</div>
            <div>分类数量: {{ categories.length }}</div>
            <div>加载状态: {{ isLoading ? '加载中' : '已完成' }}</div>
            <div v-if="error" class="text-red-600">错误: {{ error }}</div>

            <details v-if="prompts.length > 0" class="mt-4">
                <summary class="cursor-pointer font-medium">查看前3个提示词</summary>
                <div class="mt-2 space-y-2">
                    <div v-for="prompt in prompts.slice(0, 3)" :key="prompt.id" class="bg-white p-2 rounded">
                        <div class="font-medium">{{ prompt.title }}</div>
                        <div class="text-gray-600">{{ prompt.content.substring(0, 100) }}...</div>
                        <div class="text-gray-500">分类: {{ prompt.category }} | 作者: {{ prompt.author }}</div>
                    </div>
                </div>
            </details>

            <details v-if="categories.length > 0" class="mt-4">
                <summary class="cursor-pointer font-medium">查看分类</summary>
                <div class="mt-2 space-y-1">
                    <div v-for="category in categories" :key="category.id" class="bg-white p-2 rounded">{{ category.icon }} {{ category.name }} ({{ category.promptCount }})</div>
                </div>
            </details>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { usePromptsStore } from '@/stores/prompts'

const promptsStore = usePromptsStore()

const prompts = computed(() => promptsStore.prompts)
const categories = computed(() => promptsStore.categories)
const isLoading = computed(() => promptsStore.isLoading)
const error = computed(() => promptsStore.error)
</script>
