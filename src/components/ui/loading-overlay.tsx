import { useEffect, useState } from 'react'

interface LoadingOverlayProps {
  isVisible: boolean
  onHide?: () => void
}

export function LoadingOverlay({ isVisible, onHide }: LoadingOverlayProps) {
  const [shouldRender, setShouldRender] = useState(isVisible)

  useEffect(() => {
    if (isVisible) {
      setShouldRender(true)
    } else {
      const timer = setTimeout(() => {
        setShouldRender(false)
        onHide?.()
      }, 300) // Match fade duration
      return () => clearTimeout(timer)
    }
  }, [isVisible, onHide])

  if (!shouldRender) return null

  return (
    <div 
      className={`
        fixed inset-0 z-50 bg-background
        flex items-center justify-center
        transition-opacity duration-300 ease-out
        ${isVisible ? 'opacity-100' : 'opacity-0'}
      `}
      style={{ backdropFilter: 'blur(8px)' }}
    >
      <div className="text-center space-y-4">
        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto" />
        <div className="space-y-2">
          <h2 className="text-heading-sm font-semibold text-foreground">Loading String Art Generator</h2>
          <p className="text-body-sm text-muted-foreground">Preparing your mathematical art tools...</p>
        </div>
      </div>
    </div>
  )
}