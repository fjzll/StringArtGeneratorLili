// Tutorial content types
export interface TutorialStep {
  id: string
  title: string
  description: string
  content: string
  animation?: string // Path to GIF or animation
  duration?: number // Animation duration in ms
  order: number
  isInteractive?: boolean
  interactiveConfig?: {
    pins?: number
    lines?: number
    weight?: number
  }
}

export interface TutorialSection {
  id: string
  title: string
  description: string
  steps: TutorialStep[]
}

// Gallery content types
export interface GalleryExample {
  id: string
  title: string
  description: string
  image: string // Path to example image
  thumbnail?: string // Path to thumbnail (optional, will generate from image)
  category: 'portrait' | 'landscape' | 'abstract' | 'architecture' | 'nature'
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  settings: {
    pins: number
    lines: number
    weight: number
    imgSize: number
    minDistance?: number
  }
  stats: {
    threadLength?: number // in inches
    generationTime?: number // in seconds
    complexity: 'low' | 'medium' | 'high'
  }
  tags: string[]
}

export interface GallerySection {
  title: string
  description: string
  examples: GalleryExample[]
  categories: Array<{
    id: string
    name: string
    description: string
    icon: string
  }>
}

// FAQ content types
export interface FAQItem {
  id: string
  question: string
  answer: string
  category: 'getting-started' | 'technical' | 'troubleshooting' | 'advanced'
  tags: string[]
  order: number
  isPopular?: boolean
}

export interface FAQSection {
  title: string
  description: string
  categories: Array<{
    id: string
    name: string
    description: string
    icon: string
  }>
  items: FAQItem[]
}

// Main content structure
export interface AppContent {
  tutorial: TutorialSection
  gallery: GallerySection
  faq: FAQSection
  meta: {
    version: string
    lastUpdated: string
    author: string
  }
}

// Content loading states
export interface ContentLoadState {
  isLoading: boolean
  error: string | null
  data: any | null
}

// Asset types
export interface AssetInfo {
  path: string
  alt: string
  width?: number
  height?: number
  size?: number // file size in bytes
  format?: 'webp' | 'jpg' | 'png' | 'gif'
}