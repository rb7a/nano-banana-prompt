import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useFiltersStore = defineStore('filters', () => {
  const searchQuery = ref('')
  const selectedCategories = ref<string[]>([])
  const selectedTags = ref<string[]>([])
  const selectedAuthors = ref<string[]>([])
  const showOnlyWithImages = ref(false)

  // Computed
  const hasActiveFilters = computed(() => {
    return (
      searchQuery.value.length > 0 ||
      selectedCategories.value.length > 0 ||
      selectedTags.value.length > 0 ||
      selectedAuthors.value.length > 0 ||
      showOnlyWithImages.value
    )
  })

  const activeFiltersCount = computed(() => {
    let count = 0
    if (searchQuery.value.length > 0) count++
    if (selectedCategories.value.length > 0) count++
    if (selectedTags.value.length > 0) count++
    if (selectedAuthors.value.length > 0) count++
    if (showOnlyWithImages.value) count++
    return count
  })

  // Actions
  const setSearchQuery = (query: string) => {
    searchQuery.value = query
  }

  const setCategories = (categories: string[]) => {
    selectedCategories.value = categories
  }

  const addCategory = (category: string) => {
    if (!selectedCategories.value.includes(category)) {
      selectedCategories.value.push(category)
    }
  }

  const removeCategory = (category: string) => {
    const index = selectedCategories.value.indexOf(category)
    if (index > -1) {
      selectedCategories.value.splice(index, 1)
    }
  }

  const setTags = (tags: string[]) => {
    selectedTags.value = tags
  }

  const addTag = (tag: string) => {
    if (!selectedTags.value.includes(tag)) {
      selectedTags.value.push(tag)
    }
  }

  const removeTag = (tag: string) => {
    const index = selectedTags.value.indexOf(tag)
    if (index > -1) {
      selectedTags.value.splice(index, 1)
    }
  }

  const setAuthors = (authors: string[]) => {
    selectedAuthors.value = authors
  }

  const addAuthor = (author: string) => {
    if (!selectedAuthors.value.includes(author)) {
      selectedAuthors.value.push(author)
    }
  }

  const removeAuthor = (author: string) => {
    const index = selectedAuthors.value.indexOf(author)
    if (index > -1) {
      selectedAuthors.value.splice(index, 1)
    }
  }

  const setShowOnlyWithImages = (value: boolean) => {
    showOnlyWithImages.value = value
  }

  const resetFilters = () => {
    searchQuery.value = ''
    selectedCategories.value = []
    selectedTags.value = []
    selectedAuthors.value = []
    showOnlyWithImages.value = false
  }

  const resetSearchOnly = () => {
    searchQuery.value = ''
  }

  return {
    // State
    searchQuery,
    selectedCategories,
    selectedTags,
    selectedAuthors,
    showOnlyWithImages,
    
    // Computed
    hasActiveFilters,
    activeFiltersCount,
    
    // Actions
    setSearchQuery,
    setCategories,
    addCategory,
    removeCategory,
    setTags,
    addTag,
    removeTag,
    setAuthors,
    addAuthor,
    removeAuthor,
    setShowOnlyWithImages,
    resetFilters,
    resetSearchOnly,
  }
})