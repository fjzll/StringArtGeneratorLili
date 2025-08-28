import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { ContentSection } from "@/components/layout"
import { Search, ChevronRight } from "lucide-react"

interface FAQQuestion {
  id: string
  question: string
  answer: string
}

interface FAQCategory {
  id: string
  name: string
  icon: string
  questions: FAQQuestion[]
}

interface FAQData {
  title: string
  subtitle: string
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
  const [faqData, setFaqData] = useState<FAQData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")


  useEffect(() => {
    // Lazy load FAQ content
    const loadFAQContent = async () => {
      try {
        const response = await fetch('/content/faq/faq.json')
        if (!response.ok) {
          throw new Error('Failed to load FAQ content')
        }
        const data = await response.json()
        setFaqData(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load FAQ')
        console.error('FAQ loading error:', err)
      } finally {
        setLoading(false)
      }
    }

    // Use Intersection Observer to lazy load when section comes into view
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !faqData) {
          loadFAQContent()
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
  }, [faqData, loading])

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
          {faqData.subtitle}
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