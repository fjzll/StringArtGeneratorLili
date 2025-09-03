import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { ContentSection } from "@/components/layout"
import { Search, ChevronRight } from "lucide-react"

// SEO-friendly inline FAQ content - ensures search engines can crawl FAQ content
const FAQ_SEO_CONTENT = {
  title: "Frequently Asked Questions",
  description: "Find answers to common questions about string art generation",
  categories: [
    {
      id: "getting-started",
      name: "Getting Started",
      description: "Basic questions for new users",
      icon: "🚀",
      questions: [
        {
          id: "what-is-string-art",
          question: "What is string art and how does this generator work?",
          answer: "String art is a traditional craft where thread is wound between pins to create images. Our generator uses computer algorithms to analyze your photo and calculate the optimal sequence of lines between pins that will recreate your image using just thread. The result is a pattern you can follow to create physical string art."
        },
        {
          id: "what-images-work-best",
          question: "What types of images work best for string art?",
          answer: "High contrast images with clear light and dark areas work best. Portraits, architectural photos, and images with defined shadows produce excellent results. Avoid very busy or low-contrast images as they may not translate well to the limited resolution of string art."
        }
      ]
    },
    {
      id: "technical",
      name: "Technical",
      description: "How the algorithms and settings work",
      icon: "⚙️",
      questions: [
        {
          id: "how-many-pins",
          question: "How many pins should I use?",
          answer: "For beginners, start with 144-216 pins for a good balance of detail and complexity. More pins (288-360) allow finer detail but require more precision. Fewer pins (36-120) create bold, minimalist designs that are easier to recreate physically."
        },
        {
          id: "generation-time",
          question: "Why does generation take so long?",
          answer: "The algorithm considers thousands of possible lines to find the optimal sequence. More pins and lines exponentially increase computation time. Generation typically takes 30 seconds to 2 minutes depending on your settings and device performance."
        },
        {
          id: "mobile-support",
          question: "Does this work on mobile devices?",
          answer: "Yes! The generator is fully responsive and works on phones and tablets. However, complex generations with many pins and lines may be slower on mobile devices. We recommend starting with simpler settings on mobile."
        }
      ]
    },
    {
      id: "troubleshooting",
      name: "Troubleshooting",
      description: "Common issues and solutions",
      icon: "🔧",
      questions: [
        {
          id: "blank-result",
          question: "Why is my result blank or very light?",
          answer: "This usually means your image has low contrast or the settings don't match your image type. Try increasing the line weight, adding more lines, or choosing an image with stronger contrast between light and dark areas."
        },
        {
          id: "too-dark",
          question: "My string art is too dark or heavy?",
          answer: "Reduce the number of lines, decrease the line weight, or increase the minimum distance between pins. Dark, high-contrast images often need fewer lines to look good as string art."
        }
      ]
    },
    {
      id: "advanced",
      name: "Advanced",
      description: "Tips for experienced users",
      icon: "⚡",
      questions: [
        {
          id: "physical-recreation",
          question: "How do I recreate this physically?",
          answer: "You'll need a circular frame, pins/nails, and thread. Mark pin positions evenly around your frame, then follow the generated line sequence, winding thread from pin to pin in order. The downloadable result shows the complete pattern."
        },
        {
          id: "thread-length",
          question: "How much thread do I need?",
          answer: "The generator shows estimated thread length in the results. Generally, you'll need 200-1000 inches of thread depending on your settings. We recommend having 20% extra thread to account for mistakes and adjustments."
        }
      ]
    }
  ]
}

interface FAQQuestion {
  id: string
  question: string
  answer: string
}

interface FAQCategory {
  id: string
  name: string
  description?: string
  icon: string
  questions: FAQQuestion[]
}

interface FAQData {
  title: string
  description?: string
  subtitle?: string
  categories: FAQCategory[]
  contact?: {
    title: string
    description: string
    items: Array<{
      title: string
      description: string
      action: string
    }>
  }
}

export function FAQSection() {
  const [faqData, setFaqData] = useState<FAQData | null>(FAQ_SEO_CONTENT)
  const [loading] = useState(false) // Start with SEO content loaded
  const [error] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")


  useEffect(() => {
    // Optional: Load fresh content from JSON to override SEO content
    const loadFreshContent = async () => {
      try {
        const response = await fetch('/content/faq/faq.json')
        if (response.ok) {
          const data = await response.json()
          // Transform the data to match our interface if needed
          const transformedData = {
            title: data.title,
            description: data.description,
            subtitle: data.description, // For backward compatibility
            categories: data.categories.map((cat: any) => ({
              ...cat,
              questions: data.items ? data.items.filter((item: any) => item.category === cat.id) : cat.questions || []
            }))
          }
          // Only update if the fetched data is significantly different
          if (transformedData.categories.length > 0) {
            setFaqData(transformedData)
          }
        }
      } catch (err) {
        // Silently fail - SEO content is already loaded
        console.info('Using embedded FAQ content for SEO')
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

    const section = document.getElementById('faq')
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
      <ContentSection id="faq">
        <div className="text-center space-y-6">
          <h2 className="text-3xl font-bold">FAQ</h2>
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-muted rounded w-3/4 mx-auto"></div>
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-12 bg-muted rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </ContentSection>
    )
  }

  if (error || !faqData) {
    return (
      <ContentSection id="faq">
        <div className="text-center space-y-6">
          <h2 className="text-3xl font-bold">FAQ</h2>
          <div className="text-muted-foreground">
            {error || 'FAQ content is currently unavailable. Please try again later.'}
          </div>
        </div>
      </ContentSection>
    )
  }



  // Get all questions for search results
  const allQuestions = faqData.categories.flatMap(category => 
    category.questions.map(q => ({ ...q, categoryId: category.id, categoryName: category.name }))
  )
  
  const searchResults = searchTerm 
    ? allQuestions.filter(q =>
        q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.answer.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : []



  return (
    <ContentSection id="faq" className="space-y-12">
      {/* Header */}
      <div className="text-center space-y-4">
        <h2 className="text-3xl md:text-4xl font-bold">{faqData.title}</h2>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          {faqData.subtitle || faqData.description}
        </p>
      </div>

      {/* Search */}
      <Card className="border-none shadow-none bg-transparent">
        <CardContent className="p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search frequently asked questions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
        </CardContent>
      </Card>

      {searchTerm ? (
        // Search Results
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold">
              Search Results ({searchResults.length})
            </h3>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setSearchTerm("")}
            >
              Clear Search
            </Button>
          </div>

          {searchResults.length > 0 ? (
            <Accordion type="single" collapsible className="space-y-4">
              {searchResults.map((result) => (
                <AccordionItem key={result.id} value={result.id} className="border rounded-lg px-4">
                  <AccordionTrigger className="text-left hover:no-underline">
                    <div>
                      <div className="font-medium">{result.question}</div>
                      <div className="text-sm text-muted-foreground mt-1">
                        {result.categoryName}
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pb-4">
                    <p className="text-muted-foreground">{result.answer}</p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <div className="text-4xl mb-4">🔍</div>
                <h3 className="text-lg font-medium mb-2">No results found</h3>
                <p className="text-muted-foreground">
                  Try different keywords or browse categories below
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      ) : (
        // Accordion-Style Categories
        <div className="space-y-4">
          <Accordion type="multiple" className="space-y-4">
            {faqData.categories.map((category) => (
              <AccordionItem key={category.id} value={category.id} className="border rounded-lg">
                <AccordionTrigger className="px-6 py-4 hover:no-underline">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{category.icon}</span>
                    <div className="text-left">
                      <h3 className="text-lg font-semibold">{category.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {category.questions.length} question{category.questions.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4">
                  <div className="space-y-4">
                    <Accordion type="single" collapsible className="space-y-3">
                      {category.questions.map((question) => (
                        <AccordionItem key={question.id} value={question.id} className="border rounded-lg px-4">
                          <AccordionTrigger className="text-left hover:no-underline py-3">
                            <span className="font-medium text-sm">{question.question}</span>
                          </AccordionTrigger>
                          <AccordionContent className="pb-3">
                            <p className="text-muted-foreground text-sm leading-relaxed">{question.answer}</p>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      )}

      {/* Contact/Help Section */}
      {faqData.contact && (
        <div className="space-y-8">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-2">{faqData.contact.title}</h3>
            <p className="text-muted-foreground">{faqData.contact.description}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {faqData.contact.items.map((item, index) => (
              <Card key={index} className="card-hover">
                <CardContent className="p-6 text-center space-y-4">
                  <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto">
                    {index === 0 ? '🎨' : index === 1 ? '📚' : '🔧'}
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">{item.title}</h4>
                    <p className="text-sm text-muted-foreground mb-4">{item.description}</p>
                  </div>
                  <Button variant="outline" className="group">
                    {item.action}
                    <ChevronRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </ContentSection>
  )
}