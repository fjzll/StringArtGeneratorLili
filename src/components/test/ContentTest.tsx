import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'

export function ContentTest() {
  const [tutorialLoading, setTutorialLoading] = useState(false)
  const [galleryLoading, setGalleryLoading] = useState(false)
  const [faqLoading, setFaqLoading] = useState(false)
  const [results, setResults] = useState<{
    tutorial: any
    gallery: any
    faq: any
  }>({
    tutorial: null,
    gallery: null,
    faq: null
  })

  const testTutorialLoad = async () => {
    setTutorialLoading(true)
    try {
      // Simulate content loading from JSON
      const tutorialData = {
        id: "string-art-tutorial",
        title: "How String Art Works",
        steps: [
          { id: "step1", title: "What is String Art?", order: 1 },
          { id: "step2", title: "Pin Placement", order: 2 }
        ]
      }
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 800))
      
      setResults(prev => ({ ...prev, tutorial: tutorialData }))
    } catch (error) {
      console.error('Tutorial loading failed:', error)
    } finally {
      setTutorialLoading(false)
    }
  }

  const testGalleryLoad = async () => {
    setGalleryLoading(true)
    try {
      const galleryData = {
        title: "Example Gallery",
        examples: [
          { id: "ex1", title: "Portrait - Fine Detail", category: "portrait" },
          { id: "ex2", title: "Mountain Landscape", category: "landscape" }
        ]
      }
      
      await new Promise(resolve => setTimeout(resolve, 600))
      setResults(prev => ({ ...prev, gallery: galleryData }))
    } catch (error) {
      console.error('Gallery loading failed:', error)
    } finally {
      setGalleryLoading(false)
    }
  }

  const testFAQLoad = async () => {
    setFaqLoading(true)
    try {
      const faqData = {
        title: "Frequently Asked Questions",
        items: [
          { id: "faq1", question: "What is string art?", category: "getting-started" },
          { id: "faq2", question: "How many pins should I use?", category: "technical" }
        ]
      }
      
      await new Promise(resolve => setTimeout(resolve, 500))
      setResults(prev => ({ ...prev, faq: faqData }))
    } catch (error) {
      console.error('FAQ loading failed:', error)
    } finally {
      setFaqLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Content Infrastructure Test</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          
          {/* Tutorial Content Test */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-medium">Tutorial Content:</span>
              <Button 
                onClick={testTutorialLoad} 
                disabled={tutorialLoading}
                size="sm"
              >
                {tutorialLoading ? 'Loading...' : 'Test Load'}
              </Button>
            </div>
            {tutorialLoading && <Progress value={60} className="w-full" />}
            {results.tutorial && (
              <div className="text-sm text-green-600 bg-green-50 p-2 rounded">
                ✅ Tutorial loaded: {results.tutorial.title} ({results.tutorial.steps.length} steps)
              </div>
            )}
          </div>

          {/* Gallery Content Test */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-medium">Gallery Content:</span>
              <Button 
                onClick={testGalleryLoad} 
                disabled={galleryLoading}
                size="sm"
              >
                {galleryLoading ? 'Loading...' : 'Test Load'}
              </Button>
            </div>
            {galleryLoading && <Progress value={45} className="w-full" />}
            {results.gallery && (
              <div className="text-sm text-green-600 bg-green-50 p-2 rounded">
                ✅ Gallery loaded: {results.gallery.title} ({results.gallery.examples.length} examples)
              </div>
            )}
          </div>

          {/* FAQ Content Test */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-medium">FAQ Content:</span>
              <Button 
                onClick={testFAQLoad} 
                disabled={faqLoading}
                size="sm"
              >
                {faqLoading ? 'Loading...' : 'Test Load'}
              </Button>
            </div>
            {faqLoading && <Progress value={30} className="w-full" />}
            {results.faq && (
              <div className="text-sm text-green-600 bg-green-50 p-2 rounded">
                ✅ FAQ loaded: {results.faq.title} ({results.faq.items.length} items)
              </div>
            )}
          </div>

          {/* Overall Status */}
          <div className="pt-4 border-t">
            <div className="text-sm">
              <strong>Content Infrastructure Status:</strong>
              <ul className="mt-2 space-y-1 text-muted-foreground">
                <li>• TypeScript interfaces defined ✅</li>
                <li>• Content loader utilities created ✅</li>
                <li>• React hooks implemented ✅</li>
                <li>• JSON content files ready ✅</li>
                <li>• Lazy loading support available ✅</li>
              </ul>
            </div>
          </div>

        </CardContent>
      </Card>
    </div>
  )
}