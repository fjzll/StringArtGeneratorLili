import { useState, useEffect } from "react"
// Removed unused Card imports
import { ContentSection } from "@/components/layout"
import { TutorialStep } from "./TutorialStep"

// SEO-friendly inline content - this ensures search engines can crawl the tutorial content
const TUTORIAL_SEO_CONTENT = {
  title: "How to Create String Art",
  subtitle: "Transform your photos into mathematical masterpieces with our step-by-step guide",
  steps: [
    {
      id: "upload",
      title: "Upload Your Image",
      description: "Choose a high-contrast photo for the best string art results",
      content: "Click or drag your image into the upload area. The best images for string art are high-contrast photos with clear subjects - portraits, silhouettes, and bold graphics work exceptionally well.",
      tips: [
        "Use images with good contrast between light and dark areas",
        "Portrait photos often produce stunning results",
        "Avoid images with lots of fine detail or busy backgrounds",
        "JPG, PNG, and WebP formats are supported"
      ],
      expandable: {
        title: "Learn More: Choosing the Perfect Image",
        content: [
          {
            subtitle: "What Makes a Great String Art Image?",
            text: "String art works by connecting lines between pins to create darker areas where lines overlap. High-contrast images with clear boundaries between light and dark regions translate best into this medium."
          },
          {
            subtitle: "Image Quality Tips",
            text: "Higher resolution images (at least 500x500 pixels) provide more detail for the algorithm to work with. However, extremely large images (over 5MB) may take longer to process."
          },
          {
            subtitle: "Subject Matter That Works Well",
            text: "Portraits, architectural silhouettes, animals, and graphic designs with strong shapes tend to produce the most striking string art. Abstract or heavily textured images may not translate as effectively."
          }
        ]
      },
      order: 1
    },
    {
      id: "presets",
      title: "Choose a Style Preset",
      description: "Select from our optimized presets or customize your own settings",
      content: "Pick from four carefully tuned presets designed for different effects: Fine Detail for precision work, Bold Impact for dramatic results, Soft Portrait for gentle rendering, or Professional for balanced quality.",
      tips: [
        "Fine Detail: Best for portraits and detailed images",
        "Bold Impact: Creates dramatic, high-contrast results",
        "Soft Portrait: Gentle rendering perfect for faces",
        "Professional: Balanced settings for exhibition-quality results"
      ],
      expandable: {
        title: "Learn More: Understanding String Art Parameters",
        content: [
          {
            subtitle: "Number of Pins",
            text: "More pins (up to 360) allow for finer detail and smoother curves, but increase processing time. Fewer pins (36-144) create more geometric, stylized results."
          },
          {
            subtitle: "Number of Lines",
            text: "More lines create darker, richer images with better detail reproduction. Fewer lines produce lighter, more minimalist results. Most images look best with 2500-4000 lines."
          },
          {
            subtitle: "Line Weight",
            text: "Controls the visual thickness of string lines. Higher weights create bolder, more visible lines, while lower weights produce subtle, delicate effects."
          },
          {
            subtitle: "Canvas Size",
            text: "Larger canvas sizes provide more precision but take longer to process. 500px is optimal for most images, balancing quality and speed."
          }
        ]
      },
      order: 2
    },
    {
      id: "generate",
      title: "Generate Your String Art",
      description: "Watch as the algorithm creates your mathematical masterpiece",
      content: "Click 'Generate String Art' to start the process. You'll see real-time progress as the algorithm calculates optimal string paths and draws lines progressively on the canvas.",
      tips: [
        "Generation typically takes 5-30 seconds depending on settings",
        "Watch the progress bar for real-time updates",
        "The canvas shows lines being drawn in real-time",
        "Higher settings (more pins/lines) take longer but produce better quality"
      ],
      expandable: {
        title: "Learn More: How the Algorithm Works",
        content: [
          {
            subtitle: "Mathematical Optimization",
            text: "Our algorithm uses advanced mathematical optimization to find the sequence of lines that best approximates your image. It calculates which line connections will darken the right areas while keeping light areas bright."
          },
          {
            subtitle: "Progressive Rendering",
            text: "Lines are added one by one, with each new line chosen to make the overall image more accurate. You can watch this process happen in real-time on the canvas."
          },
          {
            subtitle: "Pin Placement Strategy",
            text: "Pins are evenly distributed around a circle, mimicking traditional string art setups. The algorithm considers the distance between pins when choosing optimal line paths."
          }
        ]
      },
      order: 3
    },
    {
      id: "results",
      title: "View & Save Your Creation",
      description: "Admire your string art and save it for physical creation",
      content: "Once generation is complete, you'll see your finished string art along with detailed statistics. The result shows exactly how the physical piece would look with real string and pins.",
      tips: [
        "The statistics show total thread length needed for physical creation",
        "Pin count and line count help estimate materials needed",
        "Processing time indicates the complexity of your image",
        "Use the download feature to save high-resolution images"
      ],
      expandable: {
        title: "Learn More: From Digital to Physical",
        content: [
          {
            subtitle: "Materials Needed",
            text: "To create the physical piece, you'll need a circular board, pins (small nails work well), and string or embroidery thread. The statistics tell you exactly how much thread you'll need."
          },
          {
            subtitle: "Construction Process",
            text: "Mark pin positions around your circular board, hammer in pins, then follow the line sequence shown in the result. Each line connects two specific pins in the exact order calculated by the algorithm."
          },
          {
            subtitle: "String Art Tips",
            text: "Use contrasting thread colors (black thread on white board is classic), maintain consistent tension, and follow the sequence precisely for best results. The algorithm's order is crucial for the final image quality."
          }
        ]
      },
      order: 4
    }
  ],
  quickStart: {
    title: "Quick Start (30 seconds)",
    steps: [
      "Upload a high-contrast image",
      "Choose a preset (try 'Fine Detail' first)",
      "Click 'Generate String Art'",
      "Watch your masterpiece emerge!"
    ]
  }
}

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
  const [tutorialData, setTutorialData] = useState<TutorialData | null>(TUTORIAL_SEO_CONTENT)
  const [loading] = useState(false) // Start with SEO content loaded
  const [error] = useState<string | null>(null)

  useEffect(() => {
    // Optional: Load fresh content from JSON to override SEO content
    // This ensures the content can be updated without code changes
    const loadFreshContent = async () => {
      try {
        const response = await fetch('/content/tutorial/tutorial.json')
        if (response.ok) {
          const data = await response.json()
          // Only update if the fetched data is different from SEO content
          if (JSON.stringify(data) !== JSON.stringify(TUTORIAL_SEO_CONTENT)) {
            setTutorialData(data)
          }
        }
      } catch (err) {
        // Silently fail - SEO content is already loaded
        console.info('Using embedded tutorial content for SEO')
      }
    }

    // Use Intersection Observer for performance optimization
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          loadFreshContent()
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
  }, [])

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