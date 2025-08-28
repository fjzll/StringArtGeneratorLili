import { useState, useEffect } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
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
        if (entry.isIntersecting && !galleryData && !loading) {
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
    <ContentSection id="gallery" className="space-y-12">
      {/* Header */}
      <div className="text-center space-y-4">
        <h2 className="text-3xl md:text-4xl font-bold">{galleryData.title}</h2>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          {galleryData.subtitle}
        </p>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap justify-center gap-2 sm:gap-4">
        {galleryData.categories.map((category) => (
          <Button
            key={category.id}
            variant={activeCategory === category.id ? "default" : "outline"}
            onClick={() => setActiveCategory(category.id)}
            className="flex items-center gap-2 transition-all duration-200"
          >
            <span className="text-lg">{category.icon}</span>
            <span className="hidden sm:inline">{category.name}</span>
            <span className="sm:hidden">{category.name.split(' ')[0]}</span>
          </Button>
        ))}
      </div>

      {/* Active Category Description */}
      {activeCategoryData && (
        <div className="text-center">
          <Card className="glass-effect max-w-2xl mx-auto">
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-2 flex items-center justify-center gap-2">
                <span className="text-2xl">{activeCategoryData.icon}</span>
                {activeCategoryData.name}
              </h3>
              <p className="text-muted-foreground">{activeCategoryData.description}</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Gallery Examples */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {activeCategoryData.examples.map((example) => (
          <ExampleCard key={example.id} example={example} />
        ))}
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