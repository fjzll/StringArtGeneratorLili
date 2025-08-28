import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface ExampleCardProps {
  example: {
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
  categoryName: string
}

export function ExampleCard({ example, categoryName }: ExampleCardProps) {
  const [originalLoading, setOriginalLoading] = useState(true)
  const [stringArtLoading, setStringArtLoading] = useState(true)

  return (
    <Card className="card-hover overflow-hidden">
      <div className="relative">
        {/* Side-by-Side Image Display with Aligned Descriptions */}
        <div className="grid grid-cols-2 gap-6">
          {/* Original Image Column */}
          <div className="space-y-3">
            <div className="aspect-square relative overflow-hidden bg-muted rounded-lg">
              {originalLoading && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
              <img
                src={example.originalImage}
                alt={`${example.title} - Original`}
                className="w-full h-full object-cover"
                onLoad={() => setOriginalLoading(false)}
                onError={() => setOriginalLoading(false)}
              />
              {/* Original Badge */}
              <div className="absolute top-2 left-2">
                <Badge variant="secondary" className="backdrop-blur-sm bg-background/80 text-xs">
                  Original
                </Badge>
              </div>
            </div>
          </div>

          {/* String Art Image Column */}
          <div className="space-y-3">
            <div className="aspect-square relative overflow-hidden bg-muted rounded-lg">
              {stringArtLoading && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
              <img
                src={example.stringArtImage}
                alt={`${example.title} - String Art`}
                className="w-full h-full object-cover"
                onLoad={() => setStringArtLoading(false)}
                onError={() => setStringArtLoading(false)}
              />
              {/* String Art Badge */}
              <div className="absolute top-2 left-2">
                <Badge variant="default" className="backdrop-blur-sm bg-primary/80 text-xs">
                  {categoryName}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}