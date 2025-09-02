import { useState, useEffect } from 'react'
import { useInView } from 'react-intersection-observer'
import type { 
  AppContent, 
  TutorialSection, 
  GallerySection, 
  FAQSection,
  ContentLoadState 
} from '@/types/content'
import { ContentLoader, SmartContentLoader } from '@/lib/content/contentLoader'

// Generic content loading hook
export function useContentLoader<T>(
  loader: () => Promise<T>,
  options?: {
    immediate?: boolean
    fallback?: T
    onError?: (error: Error) => void
  }
) {
  const [state, setState] = useState<ContentLoadState>({
    isLoading: options?.immediate ?? true,
    error: null,
    data: options?.fallback || null
  })

  const loadContent = async () => {
    if (state.isLoading) return // Prevent multiple loads

    setState(prev => ({ ...prev, isLoading: true, error: null }))

    try {
      const data = await loader()
      setState({ isLoading: false, error: null, data })
    } catch (error) {
      const err = error as Error
      setState({ isLoading: false, error: err.message, data: null })
      options?.onError?.(err)
    }
  }

  useEffect(() => {
    if (options?.immediate ?? true) {
      loadContent()
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return {
    ...state,
    reload: loadContent,
    isReady: !state.isLoading && !state.error && state.data !== null
  }
}

// Tutorial content hook
export function useTutorial(immediate = true) {
  return useContentLoader<TutorialSection>(
    () => ContentLoader.loadTutorial(),
    { immediate }
  )
}

// Gallery content hook
export function useGallery(immediate = true) {
  return useContentLoader<GallerySection>(
    () => ContentLoader.loadGallery(),
    { immediate }
  )
}

// FAQ content hook
export function useFAQ(immediate = true) {
  return useContentLoader<FAQSection>(
    () => ContentLoader.loadFAQ(),
    { immediate }
  )
}

// All content hook with smart loading
export function useAppContent(options?: { 
  progressive?: boolean
  smart?: boolean 
}) {
  const [state, setState] = useState<ContentLoadState>({
    isLoading: true,
    error: null,
    data: null
  })

  useEffect(() => {
    const loadContent = async () => {
      try {
        let data: AppContent | Partial<AppContent>

        if (options?.progressive) {
          data = await SmartContentLoader.loadProgressively()
        } else if (options?.smart) {
          data = await SmartContentLoader.loadSmartContent('@/content/app.json')
        } else {
          data = await ContentLoader.loadAllContent()
        }

        setState({ isLoading: false, error: null, data })
      } catch (error) {
        setState({ 
          isLoading: false, 
          error: (error as Error).message, 
          data: null 
        })
      }
    }

    loadContent()
  }, [options?.progressive, options?.smart])

  return state
}

// Lazy loading hook with intersection observer
export function useLazyContent<T>(
  loader: () => Promise<T>,
  options?: {
    threshold?: number
    rootMargin?: string
    triggerOnce?: boolean
    fallback?: T
  }
) {
  const { ref, inView } = useInView({
    threshold: options?.threshold ?? 0.1,
    rootMargin: options?.rootMargin ?? '50px',
    triggerOnce: options?.triggerOnce ?? true
  })

  const contentState = useContentLoader<T>(
    loader,
    { 
      immediate: false,
      fallback: options?.fallback
    }
  )

  // Load content when in view
  useEffect(() => {
    if (inView && !contentState.isReady && !contentState.isLoading) {
      contentState.reload()
    }
  }, [inView, contentState])

  return {
    ref,
    inView,
    ...contentState
  }
}

// Hook for preloading content
export function useContentPreloader() {
  const [isPreloaded, setIsPreloaded] = useState(false)

  useEffect(() => {
    const preload = async () => {
      try {
        await ContentLoader.preloadContent()
        setIsPreloaded(true)
      } catch (error) {
        console.warn('Content preloading failed:', error)
      }
    }

    // Preload after a short delay to not block initial render
    const timer = setTimeout(preload, 100)
    return () => clearTimeout(timer)
  }, [])

  return { isPreloaded }
}

// Hook for managing content visibility based on scroll position
export function useContentVisibility(threshold = 0.3) {
  const [visibleSections, setVisibleSections] = useState<string[]>([])

  const registerSection = (sectionId: string) => {
    const { ref, inView } = useInView({ threshold })
    
    useEffect(() => {
      if (inView) {
        setVisibleSections(prev => 
          prev.includes(sectionId) ? prev : [...prev, sectionId]
        )
      } else {
        setVisibleSections(prev => prev.filter(id => id !== sectionId))
      }
    }, [inView, sectionId])

    return ref
  }

  return {
    visibleSections,
    registerSection,
    isVisible: (sectionId: string) => visibleSections.includes(sectionId)
  }
}