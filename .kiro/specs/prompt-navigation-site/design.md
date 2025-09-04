# Design Document

## Overview

The Prompt Navigation Site will be a modern, responsive web application built with Vue 3, TypeScript, and TailwindCSS. The application will provide an intuitive interface for browsing, searching, and managing AI image generation prompts from the Nano Banana collection. The design emphasizes usability, performance, and visual appeal while maintaining a clean, professional aesthetic.

## Architecture

### Frontend Architecture

-   **Framework**: Vue 3 with Composition API
-   **Language**: TypeScript for type safety and better developer experience
-   **Styling**: TailwindCSS for utility-first CSS framework
-   **State Management**: Pinia for centralized state management
-   **Routing**: Vue Router for client-side navigation
-   **Build Tool**: Vite for fast development and optimized builds

### Component Structure

```
src/
├── components/
│   ├── common/
│   │   ├── AppHeader.vue
│   │   ├── AppFooter.vue
│   │   ├── SearchBar.vue
│   │   └── LoadingSpinner.vue
│   ├── prompt/
│   │   ├── PromptCard.vue
│   │   ├── PromptGrid.vue
│   │   ├── PromptDetail.vue
│   │   └── PromptFilters.vue
│   └── navigation/
│       ├── CategoryNav.vue
│       └── Breadcrumb.vue
├── views/
│   ├── HomeView.vue
│   ├── CategoryView.vue
│   ├── FavoritesView.vue
│   └── SearchView.vue
├── stores/
│   ├── prompts.ts
│   ├── favorites.ts
│   └── filters.ts
├── types/
│   └── prompt.ts
└── utils/
    ├── clipboard.ts
    └── storage.ts
```

## Components and Interfaces

### Core Data Types

```typescript
interface Prompt {
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

interface Category {
    id: string
    name: string
    description: string
    icon: string
    promptCount: number
}

interface FilterOptions {
    categories: string[]
    tags: string[]
    authors: string[]
    hasImages: boolean
}
```

### Key Components

#### PromptCard Component

-   Displays prompt preview with image thumbnail
-   Copy button with visual feedback
-   Favorite toggle button
-   Author attribution and source link
-   Responsive design for different screen sizes

#### SearchBar Component

-   Real-time search with debouncing
-   Search suggestions and autocomplete
-   Clear search functionality
-   Keyboard navigation support

#### PromptFilters Component

-   Multi-select category filters
-   Tag-based filtering
-   Author filtering
-   Clear all filters option

#### CategoryNav Component

-   Visual category navigation with icons
-   Prompt count per category
-   Responsive grid layout
-   Hover effects and animations

## Data Models

### Prompt Data Structure

The application will parse the existing README.md content to extract:

-   Case numbers and titles
-   Prompt content in Chinese and English
-   Author information from Twitter/X handles
-   Source URLs
-   Image URLs for both Gemini and GPT-4o versions
-   Categories based on prompt types (3D, Animation, Art styles, etc.)

### Local Storage Schema

```typescript
interface StorageData {
    favorites: string[] // Array of prompt IDs
    recentSearches: string[]
    userPreferences: {
        theme: 'light' | 'dark'
        language: 'zh' | 'en'
        gridSize: 'small' | 'medium' | 'large'
    }
}
```

## Error Handling

### Error Types and Handling

1. **Network Errors**: Display retry mechanisms and offline indicators
2. **Image Loading Errors**: Show placeholder images with retry options
3. **Clipboard API Errors**: Fallback to manual text selection
4. **Storage Errors**: Graceful degradation when localStorage is unavailable

### Error UI Components

-   Toast notifications for temporary errors
-   Error boundaries for component-level failures
-   Fallback UI states for missing data

## Testing Strategy

### Unit Testing

-   Component testing with Vue Test Utils
-   Store testing with Pinia testing utilities
-   Utility function testing with Vitest
-   TypeScript type checking

### Integration Testing

-   User interaction flows
-   Search and filter functionality
-   Clipboard operations
-   Local storage persistence

### E2E Testing

-   Critical user journeys
-   Cross-browser compatibility
-   Mobile responsiveness
-   Performance benchmarks

## Performance Considerations

### Optimization Strategies

1. **Virtual Scrolling**: For large prompt lists to maintain smooth scrolling
2. **Image Lazy Loading**: Load images only when they enter the viewport
3. **Search Debouncing**: Prevent excessive API calls during typing
4. **Component Code Splitting**: Lazy load route components
5. **Asset Optimization**: Compress images and use modern formats (WebP)

### Caching Strategy

-   Browser caching for static assets
-   Local storage for user preferences and favorites
-   Memory caching for frequently accessed prompts

## Accessibility Features

### WCAG 2.1 Compliance

-   Semantic HTML structure
-   ARIA labels and roles
-   Keyboard navigation support
-   Screen reader compatibility
-   Color contrast compliance
-   Focus management

### Responsive Design

-   Mobile-first approach
-   Flexible grid layouts
-   Touch-friendly interface elements
-   Adaptive typography scaling

## Security Considerations

### Data Protection

-   Input sanitization for search queries
-   XSS prevention in prompt content display
-   Safe external link handling
-   Content Security Policy implementation

### Privacy

-   No personal data collection
-   Local-only storage for user preferences
-   Transparent data usage policies
