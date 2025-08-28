import { useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp, CheckCircle2, Lightbulb } from "lucide-react"

interface TutorialStepProps {
  step: {
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
  }
}

export function TutorialStep({ step }: TutorialStepProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <Card className="card-hover">
      <CardHeader>
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-lg font-bold shrink-0">
            {step.order}
          </div>
          <div className="flex-1 space-y-2">
            <CardTitle className="text-xl">{step.title}</CardTitle>
            <p className="text-muted-foreground">{step.description}</p>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Main Content */}
        <p className="text-base leading-relaxed">{step.content}</p>

        {/* Tips Section */}
        {step.tips.length > 0 && (
          <div className="bg-blue-50 dark:bg-blue-950/30 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-3 flex items-center gap-2">
              <Lightbulb className="h-4 w-4" />
              Quick Tips
            </h4>
            <ul className="space-y-2">
              {step.tips.map((tip, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-blue-800 dark:text-blue-200">
                  <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5 text-blue-600 dark:text-blue-400" />
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Expandable Section */}
        {step.expandable && (
          <div className="border-t border-border pt-6">
            <Button
              variant="ghost"
              onClick={() => setIsExpanded(!isExpanded)}
              className="w-full justify-between p-0 h-auto hover:bg-transparent"
            >
              <span className="text-primary font-medium">{step.expandable.title}</span>
              {isExpanded ? (
                <ChevronUp className="h-4 w-4 text-primary" />
              ) : (
                <ChevronDown className="h-4 w-4 text-primary" />
              )}
            </Button>

            {isExpanded && (
              <div className="mt-6 space-y-6 animate-fade-in">
                {step.expandable.content.map((section, index) => (
                  <div key={index} className="bg-muted/50 rounded-lg p-6">
                    <h5 className="font-semibold text-foreground mb-3">
                      {section.subtitle}
                    </h5>
                    <p className="text-muted-foreground leading-relaxed">
                      {section.text}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}