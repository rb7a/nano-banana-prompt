<template>
  <nav class="flex items-center space-x-2 text-sm text-gray-600">
    <template v-for="(item, index) in items" :key="index">
      <RouterLink
        v-if="item.to && index < items.length - 1"
        :to="item.to"
        class="hover:text-primary-600 transition-colors"
      >
        {{ item.label }}
      </RouterLink>
      <span v-else class="text-gray-900 font-medium">
        {{ item.label }}
      </span>
      
      <svg
        v-if="index < items.length - 1"
        class="w-4 h-4 text-gray-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
      </svg>
    </template>
  </nav>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'

interface BreadcrumbItem {
  label: string
  to?: string
}

interface Props {
  items: BreadcrumbItem[]
}

defineProps<Props>()
</script>