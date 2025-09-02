import type { AppContent, TutorialSection, GallerySection, FAQSection, AssetInfo } from '@/types/content'

// Asset path resolver
export class AssetResolver {
  private static baseAssetPath = '/src/content'

  static tutorial(filename: string): string {
    return `${this.baseAssetPath}/tutorial/assets/${filename}`
  }

  static gallery(filename: string): string {
    return `${this.baseAssetPath}/gallery/images/${filename}`
  }

  static getAssetInfo(path: string): AssetInfo {
    const filename = path.split('/').pop() || ''
    const extension = filename.split('.').pop()?.toLowerCase()
    
    return {
      path,
      alt: filename.replace(/\.[^/.]+$/, '').replace(/-/g, ' '),
      format: extension as AssetInfo['format']
    }
  }

  // Optimize image path based on screen size and connection
  static getOptimizedImagePath(path: string, _options?: {
    width?: number
    quality?: number
    format?: 'webp' | 'jpg' | 'png'
  }): string {
    // In a real app, this would handle image optimization
    // For now, just return the original path
    return path
  }
}

// Content loading utilities
export class ContentLoader {
  private static cache = new Map<string, any>()

  // Load and cache content
  static async loadContent<T>(path: string): Promise<T> {
    if (this.cache.has(path)) {
      return this.cache.get(path)
    }

    try {
      // In Vite, we can import JSON files directly
      const module = await import(path)
      const data = module.default || module
      
      this.cache.set(path, data)
      return data
    } catch (error) {
      console.error(`Failed to load content from ${path}:`, error)
      throw new Error(`Content loading failed: ${path}`)
    }
  }

  // Load tutorial content
  static async loadTutorial(): Promise<TutorialSection> {
    return this.loadContent<TutorialSection>('@/content/tutorial/tutorial.json')
  }

  // Load gallery content
  static async loadGallery(): Promise<GallerySection> {
    return this.loadContent<GallerySection>('@/content/gallery/gallery.json')
  }

  // Load FAQ content
  static async loadFAQ(): Promise<FAQSection> {
    return this.loadContent<FAQSection>('@/content/faq/faq.json')
  }

  // Load all content
  static async loadAllContent(): Promise<AppContent> {
    try {
      const [tutorial, gallery, faq] = await Promise.all([
        this.loadTutorial(),
        this.loadGallery(),
        this.loadFAQ()
      ])

      return {
        tutorial,
        gallery,
        faq,
        meta: {
          version: '1.0.0',
          lastUpdated: new Date().toISOString(),
          author: 'String Art Generator'
        }
      }
    } catch (error) {
      console.error('Failed to load app content:', error)
      throw error
    }
  }

  // Clear cache
  static clearCache(): void {
    this.cache.clear()
  }

  // Preload content for better performance
  static async preloadContent(): Promise<void> {
    try {
      await this.loadAllContent()
    } catch (error) {
      console.warn('Content preloading failed:', error)
    }
  }
}

// Connection-aware loading
export class SmartContentLoader {
  private static isSlowConnection(): boolean {
    // Check if user is on a slow connection
    const connection = (navigator as any).connection
    if (!connection) return false
    
    return connection.effectiveType === '2g' || 
           connection.effectiveType === 'slow-2g' ||
           connection.saveData === true
  }

  // Load content with connection awareness
  static async loadSmartContent<T>(path: string, fallback?: T): Promise<T> {
    const isSlowConn = this.isSlowConnection()
    
    if (isSlowConn && fallback) {
      // On slow connections, return fallback immediately and load in background
      ContentLoader.loadContent<T>(path).catch(console.warn)
      return fallback
    }

    return ContentLoader.loadContent<T>(path)
  }

  // Progressive content loading
  static async loadProgressively(): Promise<Partial<AppContent>> {
    const content: Partial<AppContent> = {}

    // Load critical content first
    try {
      content.tutorial = await ContentLoader.loadTutorial()
    } catch (error) {
      console.warn('Tutorial loading failed:', error)
    }

    // Load less critical content
    setTimeout(async () => {
      try {
        content.gallery = await ContentLoader.loadGallery()
        content.faq = await ContentLoader.loadFAQ()
      } catch (error) {
        console.warn('Secondary content loading failed:', error)
      }
    }, 1000) // Delay secondary content

    return content
  }
}