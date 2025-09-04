export interface Prompt {
  id: string
  title: string
  content: string
  category: string
  author?: string
  sourceUrl?: string
  tags: string[]
  images: {
    gemini?: string
    gpt4o?: string
  }
  createdAt: Date
  updatedAt: Date
}

export interface Category {
  id: string
  name: string
  description: string
  icon: string
  promptCount: number
}

export interface FilterOptions {
  categories: string[]
  tags: string[]
  authors: string[]
  hasImages: boolean
}

export interface ParsedCase {
  caseNumber: number
  title: string
  author: string
  sourceUrl: string
  geminiImage: string
  gpt4oImage: string
  prompt: string
  notes?: string
  requiresUpload?: boolean
}