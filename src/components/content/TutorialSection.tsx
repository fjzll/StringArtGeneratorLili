import { useState, useEffect } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
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
  troubleshooting: {
    title: string
    items: Array<{
      problem: string
      solution: string
    }>
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
        if (entry.isIntersecting && !tutorialData && !loading) {
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

      {/* Quick Start */}
      <Card className="glass-effect">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            ⚡ {tutorialData.quickStart.title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {tutorialData.quickStart.steps.map((step, index) => (
              <div 
                key={index}
                className="flex items-center gap-3 p-3 bg-background/50 rounded-lg border"
              >
                <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                  {index + 1}
                </div>
                <span className="text-sm font-medium">{step}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tutorial Steps */}
      <div className="space-y-8">
        {tutorialData.steps
          .sort((a, b) => a.order - b.order)
          .map((step) => (
            <TutorialStep key={step.id} step={step} />
          ))}
      </div>

      {/* Troubleshooting */}
      <Card className="border-amber-200 bg-amber-50/50 dark:border-amber-800 dark:bg-amber-950/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-amber-800 dark:text-amber-200">
            🔧 {tutorialData.troubleshooting.title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible>
            {tutorialData.troubleshooting.items.map((item, index) => (
              <AccordionItem key={index} value={`troubleshooting-${index}`}>
                <AccordionTrigger className="text-left">
                  {item.problem}
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-muted-foreground">{item.solution}</p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>
    </ContentSection>
  )
}