import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { ContentSection } from "@/components/layout"
import { ExampleCard } from "./ExampleCard"

interface GalleryExample {
  id: string
  title: string
  originalImage: string
  stringArtImage: string
  description: string
  settings: {
    numberOfPins: number
    numberOfLines: number
    lineWeight: number
    imgSize: number
  }
  stats: {
    processingTime: string
    threadLength: string
    complexity: string
  }
}

interface GalleryCategory {
  id: string
  name: string
  description: string
  icon: string
  examples: GalleryExample[]
}

interface GalleryData {
  title: string
  subtitle: string
  categories: GalleryCategory[]
  inspiration: {
    title: string
    items: Array<{
      title: string
      description: string
      example: string
    }>
  }
}

export function GallerySection() {
  const [galleryData, setGalleryData] = useState<GalleryData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeCategory, setActiveCategory] = useState<string>('fine-detail')

  useEffect(() => {
    // Lazy load gallery content
    const loadGalleryContent = async () => {
      try {
        const response = await fetch('/content/gallery/gallery.json')
        if (!response.ok) {
          throw new Error('Failed to load gallery content')
        }
        const data = await response.json()
        setGalleryData(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load gallery')
        console.error('Gallery loading error:', err)
      } finally {
        setLoading(false)
      }
    }

    // Use Intersection Observer to lazy load when section comes into view
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !galleryData) {
          loadGalleryContent()
        }
      },
      { threshold: 0.1 }
    )

    const section = document.getElementById('gallery')
    if (section) {
      observer.observe(section)
    }

    return () => {
      if (section) {
        observer.unobserve(section)
      }
    }
  }, [galleryData, loading])

  if (loading) {
    return (
      <ContentSection id="gallery">
        <div className="text-center space-y-6">
          <h2 className="text-3xl font-bold">Gallery</h2>
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-muted rounded w-3/4 mx-auto"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2].map((i) => (
                <div key={i} className="h-64 bg-muted rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </ContentSection>
    )
  }

  if (error || !galleryData) {
    return (
      <ContentSection id="gallery">
        <div className="text-center space-y-6">
          <h2 className="text-3xl font-bold">Gallery</h2>
          <div className="text-muted-foreground">
            {error || 'Gallery content is currently unavailable. Please try again later.'}
          </div>
        </div>
      </ContentSection>
    )
  }

  const activeCategoryData = galleryData.categories.find(cat => cat.id === activeCategory) || galleryData.categories[0]

  return (
    <ContentSection id="gallery" className="space-y-20 py-12">
      {/* Header */}
      <div className="text-center space-y-4 mb-16">
        <h2 className="text-3xl md:text-4xl font-bold">{galleryData.title}</h2>
      </div>

      {/* Gallery Examples */}
      <div className="flex justify-center px-4">
        <div className="w-full max-w-2xl">
          {activeCategoryData.examples.map((example) => (
            <div key={example.id} className="mb-12">
              <ExampleCard example={example} categoryName={activeCategoryData.name} />
              
              {/* Dot Navigation positioned under the string art (centered) */}
              <div className="grid grid-cols-2 mt-4">
                <div></div>
                <div className="flex justify-center items-center gap-3">
                  {galleryData.categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setActiveCategory(category.id)}
                      className={`
                        relative w-3 h-3 rounded-full transition-all duration-300 hover:scale-125 group
                        ${activeCategory === category.id 
                          ? 'bg-primary' 
                          : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
                        }
                      `}
                      aria-label={`View ${category.name} examples`}
                    >
                      {/* Tooltip */}
                      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                        <div className="bg-popover text-popover-foreground text-xs px-2 py-1 rounded-md shadow-md whitespace-nowrap border">
                          <div className="flex items-center gap-1">
                            <span>{category.icon}</span>
                            <span>{category.name}</span>
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Inspiration Tips */}
      <div className="space-y-8">
        <h3 className="text-2xl font-bold text-center">{galleryData.inspiration.title}</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {galleryData.inspiration.items.map((tip, index) => (
            <Card key={index} className="card-hover">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  {index + 1}
                </div>
                <h4 className="font-semibold mb-2">{tip.title}</h4>
                <p className="text-sm text-muted-foreground">{tip.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </ContentSection>
  )
}