import React, { Component, type ReactNode } from 'react'
import { Card, CardContent } from './card'
import { Button } from './button'

interface CanvasErrorBoundaryState {
  hasError: boolean
  error?: Error
}

interface CanvasErrorBoundaryProps {
  children: ReactNode
  onReset?: () => void
  fallback?: ReactNode
}

export class CanvasErrorBoundary extends Component<CanvasErrorBoundaryProps, CanvasErrorBoundaryState> {
  constructor(props: CanvasErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): CanvasErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Canvas Error Boundary caught an error:', error, errorInfo)
    
    // Log additional context for canvas-related errors
    if (error.message.includes('canvas') || error.message.includes('context')) {
      console.error('Canvas-specific error detected:', {
        message: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack
      })
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined })
    this.props.onReset?.()
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <Card className="border-destructive bg-destructive/5 border-2 max-w-lg mx-auto">
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <div className="text-4xl">⚠️</div>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-destructive">
                  Canvas Error
                </h3>
                <p className="text-sm text-muted-foreground">
                  Something went wrong with the canvas rendering. This might be due to:
                </p>
                <ul className="text-xs text-muted-foreground text-left space-y-1">
                  <li>• Browser memory limitations</li>
                  <li>• Large image processing</li>
                  <li>• Hardware acceleration issues</li>
                </ul>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-2">
                <Button 
                  onClick={this.handleReset}
                  variant="outline"
                  size="sm"
                  className="flex-1"
                >
                  Try Again
                </Button>
                <Button 
                  onClick={() => window.location.reload()}
                  variant="destructive"
                  size="sm"
                  className="flex-1"
                >
                  Refresh Page
                </Button>
              </div>
              
              {this.state.error && (
                <details className="text-left">
                  <summary className="text-xs text-muted-foreground cursor-pointer hover:text-foreground">
                    Technical Details
                  </summary>
                  <pre className="text-xs text-muted-foreground mt-2 p-2 bg-muted rounded overflow-auto">
                    {this.state.error.message}
                  </pre>
                </details>
              )}
            </div>
          </CardContent>
        </Card>
      )
    }

    return this.props.children
  }
}
