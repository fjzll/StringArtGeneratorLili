import { useState, useEffect } from "react"
import { ArrowUp, HelpCircle, Download, Share2, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface FloatingAction {
  id: string
  icon: React.ReactNode
  label: string
  onClick: () => void
  primary?: boolean
  showWhen?: "always" | "scrolled" | "generating" | "completed"
}

interface FloatingActionsProps {
  actions?: FloatingAction[]
  onScrollToTop?: () => void
  onShowHelp?: () => void
  onDownload?: () => void
  onShare?: () => void
  onSettings?: () => void
  className?: string
}

export function FloatingActions({
  actions,
  onScrollToTop,
  onShowHelp,
  onDownload,
  onShare,
  onSettings,
  className
}: FloatingActionsProps) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)

  // Track scroll position
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 200)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Default actions if none provided
  const defaultActions: FloatingAction[] = [
    {
      id: "scroll-top",
      icon: <ArrowUp className="h-5 w-5" />,
      label: "Scroll to top",
      onClick: () => {
        window.scrollTo({ top: 0, behavior: "smooth" })
        onScrollToTop?.()
      },
      showWhen: "scrolled",
      primary: true
    },
    {
      id: "help",
      icon: <HelpCircle className="h-4 w-4" />,
      label: "Help & FAQ",
      onClick: () => onShowHelp?.(),
      showWhen: "always"
    },
    {
      id: "download",
      icon: <Download className="h-4 w-4" />,
      label: "Download result",
      onClick: () => onDownload?.(),
      showWhen: "completed"
    },
    {
      id: "share",
      icon: <Share2 className="h-4 w-4" />,
      label: "Share result",
      onClick: () => onShare?.(),
      showWhen: "completed"
    }
  ]

  const finalActions = actions || defaultActions

  // Filter actions based on current state
  const visibleActions = finalActions.filter(action => {
    if (action.showWhen === "always") return true
    if (action.showWhen === "scrolled") return isScrolled
    if (action.showWhen === "generating") return false // TODO: Add generating state
    if (action.showWhen === "completed") return false // TODO: Add completed state
    return true
  })

  const primaryAction = visibleActions.find(action => action.primary)
  const secondaryActions = visibleActions.filter(action => !action.primary)

  if (visibleActions.length === 0) return null

  return (
    <div 
      className={cn(
        "fixed bottom-6 right-4 sm:right-6 z-50 flex flex-col-reverse items-end space-y-reverse space-y-3",
        "thumb-zone-safe",
        className
      )}
    >
      {/* Secondary actions (show when expanded) */}
      {isExpanded && secondaryActions.length > 0 && (
        <div className="flex flex-col-reverse space-y-reverse space-y-3 animate-fade-in">
          {secondaryActions.map((action) => (
            <Button
              key={action.id}
              variant="secondary"
              size="sm"
              onClick={action.onClick}
              className={cn(
                "touch-target-lg rounded-full shadow-lg backdrop-blur-sm bg-background/90 border border-border/50",
                "hover:scale-110 active:scale-95 transition-all duration-200 group touch-feedback",
                "focus-mobile"
              )}
              aria-label={action.label}
              title={action.label}
            >
              {action.icon}
            </Button>
          ))}
        </div>
      )}

      {/* Primary action */}
      {primaryAction && (
        <div className="relative">
          {/* Tooltip */}
          {!isExpanded && (
            <div className="absolute right-16 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none hidden sm:block">
              <div className="bg-foreground text-background px-3 py-2 rounded-lg text-xs whitespace-nowrap shadow-lg">
                {primaryAction.label}
              </div>
              <div className="absolute left-full top-1/2 -translate-y-1/2 border-4 border-transparent border-l-foreground"></div>
            </div>
          )}

          <Button
            variant="default"
            size="lg"
            onClick={() => {
              primaryAction.onClick()
            }}
            onBlur={() => {
              // Close expanded menu when focus leaves
              setTimeout(() => setIsExpanded(false), 150)
            }}
            className={cn(
              "touch-target-xl rounded-full shadow-xl",
              "hover:scale-110 active:scale-95 transition-all duration-200 group",
              "bg-primary hover:bg-primary/90 text-primary-foreground",
              "touch-feedback focus-mobile",
              isExpanded && secondaryActions.length > 0 && "rotate-45"
            )}
            aria-label={primaryAction.label}
            title={primaryAction.label}
          >
            {primaryAction.icon}
          </Button>
        </div>
      )}

      {/* Mobile-specific actions */}
      <div className="sm:hidden fixed bottom-6 left-4 thumb-zone-safe">
        {onSettings && (
          <Button
            variant="secondary"
            size="sm"
            onClick={onSettings}
            className="touch-target-lg rounded-full shadow-lg backdrop-blur-sm bg-background/90 border border-border/50 touch-feedback focus-mobile"
            aria-label="Settings"
            title="Settings"
          >
            <Settings className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  )
}

// Specialized floating action components
export function ScrollToTopButton({ className }: { className?: string }) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 200)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  if (!isVisible) return null

  return (
    <Button
      variant="default"
      size="lg"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className={cn(
        "fixed bottom-6 right-4 sm:right-6 z-50 touch-target-lg rounded-full shadow-xl",
        "hover:scale-110 active:scale-95 transition-all duration-200",
        "animate-fade-in touch-feedback focus-mobile thumb-zone-safe",
        className
      )}
      aria-label="Scroll to top"
      title="Scroll to top"
    >
      <ArrowUp className="h-5 w-5" />
    </Button>
  )
}

export function HelpButton({ 
  onClick,
  className 
}: { 
  onClick?: () => void
  className?: string 
}) {
  return (
    <Button
      variant="secondary"
      size="sm"
      onClick={onClick}
      className={cn(
        "fixed bottom-6 left-4 sm:left-6 z-50 touch-target-lg rounded-full shadow-lg",
        "backdrop-blur-sm bg-background/90 border border-border/50",
        "hover:scale-110 transition-all duration-200 touch-feedback focus-mobile thumb-zone-safe",
        className
      )}
      aria-label="Help & FAQ"
      title="Help & FAQ"
    >
      <HelpCircle className="h-4 w-4" />
    </Button>
  )
}