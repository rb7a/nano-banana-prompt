<template>
  <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
    <RouterLink
      v-for="category in categories"
      :key="category.id"
      :to="`/category/${category.id}`"
      class="card p-6 text-center hover:shadow-lg transition-all duration-200 group"
    >
      <div class="text-3xl mb-3 group-hover:scale-110 transition-transform duration-200">
        {{ category.icon }}
      </div>
      <h3 class="font-semibold text-gray-900 mb-2">{{ category.name }}</h3>
      <p class="text-sm text-gray-600 mb-3">{{ category.description }}</p>
      <div class="text-xs text-primary-600 font-medium">
        {{ category.promptCount }} 个提示词
      </div>
    </RouterLink>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { usePromptsStore } from '@/stores/prompts'

const promptsStore = usePromptsStore()

const categories = computed(() => promptsStore.categories)
</script>