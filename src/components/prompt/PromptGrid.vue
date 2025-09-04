<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    <PromptCard
      v-for="prompt in prompts"
      :key="prompt.id"
      :prompt="prompt"
      :highlight-query="highlightQuery"
    />
  </div>
</template>

<script setup lang="ts">
import PromptCard from './PromptCard.vue'
import type { Prompt } from '@/types/prompt'

interface Props {
  prompts: Prompt[]
  highlightQuery?: string
}

defineProps<Props>()
</script>