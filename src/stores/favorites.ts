import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import { Storage } from '@/utils/storage'

const FAVORITES_KEY = 'nano-banana-favorites'

export const useFavoritesStore = defineStore('favorites', () => {
  const favorites = ref<string[]>([])

  // Initialize from localStorage
  const initializeFavorites = () => {
    favorites.value = Storage.get(FAVORITES_KEY, [])
  }

  // Watch for changes and persist to localStorage
  watch(
    favorites,
    (newFavorites) => {
      Storage.set(FAVORITES_KEY, newFavorites)
    },
    { deep: true }
  )

  // Actions
  const add = (promptId: string) => {
    if (!favorites.value.includes(promptId)) {
      favorites.value.push(promptId)
    }
  }

  const remove = (promptId: string) => {
    const index = favorites.value.indexOf(promptId)
    if (index > -1) {
      favorites.value.splice(index, 1)
    }
  }

  const toggle = (promptId: string) => {
    if (favorites.value.includes(promptId)) {
      remove(promptId)
    } else {
      add(promptId)
    }
  }

  const isFavorite = (promptId: string) => {
    return favorites.value.includes(promptId)
  }

  const clearAll = () => {
    favorites.value = []
  }

  const getCount = () => {
    return favorites.value.length
  }

  // Initialize on store creation
  initializeFavorites()

  return {
    favorites,
    add,
    remove,
    toggle,
    isFavorite,
    clearAll,
    getCount,
  }
})