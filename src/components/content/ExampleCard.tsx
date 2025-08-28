import { useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Eye, Clock, Ruler, Hash } from "lucide-react"

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
}

export function ExampleCard({ example }: ExampleCardProps) {
  const [showOriginal, setShowOriginal] = useState(false)
  const [imageLoading, setImageLoading] = useState(true)

  const complexityColors = {
    Low: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    Medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200", 
    High: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
  }

  return (
    <Card className="card-hover overflow-hidden">
      <div className="relative group">
        {/* Image Display */}
        <div className="aspect-square relative overflow-hidden bg-muted">
          {imageLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
          
          <img
            src={showOriginal ? example.originalImage : example.stringArtImage}
            alt={example.title}
            className="w-full h-full object-cover transition-opacity duration-300"
            onLoad={() => setImageLoading(false)}
            onError={() => setImageLoading(false)}
          />

          {/* Image Toggle Overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200">
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setShowOriginal(!showOriginal)}
                className="backdrop-blur-sm bg-background/80"
              >
                <Eye className="h-4 w-4 mr-2" />
                {showOriginal ? 'Show String Art' : 'Show Original'}
              </Button>
            </div>
          </div>

          {/* Current View Badge */}
          <div className="absolute top-3 left-3">
            <Badge variant="secondary" className="backdrop-blur-sm bg-background/80">
              {showOriginal ? 'Original' : 'String Art'}
            </Badge>
          </div>
        </div>

        <CardHeader>
          <CardTitle className="text-lg">{example.title}</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Description */}
          <p className="text-sm text-muted-foreground leading-relaxed">
            {example.description}
          </p>

          {/* Statistics */}
          <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <div>
                <div className="text-xs text-muted-foreground">Processing</div>
                <div className="text-sm font-medium">{example.stats.processingTime}</div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Ruler className="h-4 w-4 text-muted-foreground" />
              <div>
                <div className="text-xs text-muted-foreground">Thread</div>
                <div className="text-sm font-medium">{example.stats.threadLength}</div>
              </div>
            </div>
          </div>

          {/* Settings Summary */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Complexity</span>
              <Badge className={complexityColors[example.stats.complexity as keyof typeof complexityColors] || complexityColors.Medium}>
                {example.stats.complexity}
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
              <div>Pins: {example.settings.numberOfPins}</div>
              <div>Lines: {example.settings.numberOfLines}</div>
              <div>Weight: {example.settings.lineWeight}</div>
              <div>Size: {example.settings.imgSize}px</div>
            </div>
          </div>

          {/* Settings Details (Expandable) */}
          <details className="group/details">
            <summary className="cursor-pointer text-sm font-medium text-primary hover:text-primary/80 transition-colors">
              View Technical Details
              <span className="ml-1 group-open/details:rotate-180 transition-transform inline-block">▼</span>
            </summary>
            
            <div className="mt-3 space-y-3 text-xs">
              <div className="bg-background rounded-lg p-3 border">
                <h5 className="font-medium mb-2 flex items-center gap-1">
                  <Hash className="h-3 w-3" />
                  Algorithm Parameters
                </h5>
                <div className="grid grid-cols-1 gap-1">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Number of Pins:</span>
                    <span className="font-mono">{example.settings.numberOfPins}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Number of Lines:</span>
                    <span className="font-mono">{example.settings.numberOfLines}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Line Weight:</span>
                    <span className="font-mono">{example.settings.lineWeight}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Canvas Size:</span>
                    <span className="font-mono">{example.settings.imgSize}px</span>
                  </div>
                </div>
              </div>
            </div>
          </details>
        </CardContent>
      </div>
    </Card>
  )
}