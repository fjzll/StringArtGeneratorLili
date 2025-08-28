import { useState, useEffect } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { ContentSection } from "@/components/layout"
import { TutorialStep } from "./TutorialStep"

interface TutorialData {
  title: string
  subtitle: string
  steps: Array<{
    id: string
    title: string
    description: string
    content: string
    tips: string[]
    expandable?: {
      title: string
      content: Array<{
        subtitle: string
        text: string
      }>
    }
    order: number
  }>
  quickStart: {
    title: string
    steps: string[]
  }
}

export function TutorialSection() {
  const [tutorialData, setTutorialData] = useState<TutorialData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Lazy load tutorial content
    const loadTutorialContent = async () => {
      try {
        const response = await fetch('/content/tutorial/tutorial.json')
        if (!response.ok) {
          throw new Error('Failed to load tutorial content')
        }
        const data = await response.json()
        setTutorialData(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load tutorial')
        console.error('Tutorial loading error:', err)
      } finally {
        setLoading(false)
      }
    }

    // Use Intersection Observer to lazy load when section comes into view
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !tutorialData) {
          loadTutorialContent()
        }
      },
      { threshold: 0.1 }
    )

    const section = document.getElementById('tutorial')
    if (section) {
      observer.observe(section)
    }

    return () => {
      if (section) {
        observer.unobserve(section)
      }
    }
  }, [tutorialData, loading])

  if (loading) {
    return (
      <ContentSection id="tutorial">
        <div className="text-center space-y-6">
          <h2 className="text-3xl font-bold">How It Works</h2>
          <div className="animate-pulse">
            <div className="h-4 bg-muted rounded w-3/4 mx-auto mb-4"></div>
            <div className="h-4 bg-muted rounded w-1/2 mx-auto"></div>
          </div>
        </div>
      </ContentSection>
    )
  }

  if (error || !tutorialData) {
    return (
      <ContentSection id="tutorial">
        <div className="text-center space-y-6">
          <h2 className="text-3xl font-bold">How It Works</h2>
          <div className="text-muted-foreground">
            {error || 'Tutorial content is currently unavailable. Please try again later.'}
          </div>
        </div>
      </ContentSection>
    )
  }

  return (
    <ContentSection id="tutorial" className="space-y-12">
      {/* Header */}
      <div className="text-center space-y-4">
        <h2 className="text-3xl md:text-4xl font-bold">{tutorialData.title}</h2>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          {tutorialData.subtitle}
        </p>
      </div>


      {/* Tutorial Steps */}
      <div className="space-y-8">
        {tutorialData.steps
          .sort((a, b) => a.order - b.order)
          .map((step) => (
            <TutorialStep key={step.id} step={step} />
          ))}
      </div>

    </ContentSection>
  )
}