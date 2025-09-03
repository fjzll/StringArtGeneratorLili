import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"

interface AppHeaderProps {
  onNavigate?: (section: string) => void
  onToggleMobileMenu?: () => void
  isMobileMenuOpen?: boolean
  className?: string
}

export function AppHeader({ onNavigate, onToggleMobileMenu, isMobileMenuOpen, className }: AppHeaderProps) {
  return (
    <header className={`sticky top-0 z-50 w-full border-b-2 bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/80 ${className}`}>
      <div className="container flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo and Navigation */}
        <div className="flex items-center space-x-8">
          <button 
            onClick={() => onNavigate?.('generator')}
            className="flex items-center space-x-3 hover:opacity-80 transition-opacity cursor-pointer"
            aria-label="Go to String Art Generator home"
          >
            <div className="h-9 w-9 flex items-center justify-center">
              <img 
                src="/favicon.svg" 
                alt="String Art Generator Logo"
                className="h-8 w-8"
              />
            </div>
            <span className="text-heading-sm font-semibold hidden sm:block">String Art Generator</span>
            <span className="text-heading-sm font-semibold sm:hidden">String Art</span>
          </button>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-2">
            <button 
              onClick={() => onNavigate?.('generator')}
              className="touch-target nav-mobile text-body-sm font-medium transition-all duration-200 hover:text-brand text-subtle hover:scale-105 px-3 py-2 rounded-lg hover:bg-accent/50"
            >
              Generator
            </button>
            <button 
              onClick={() => onNavigate?.('tutorial')}
              className="touch-target nav-mobile text-body-sm font-medium transition-all duration-200 hover:text-brand text-subtle hover:scale-105 px-3 py-2 rounded-lg hover:bg-accent/50"
            >
              Tutorial
            </button>
            <button 
              onClick={() => onNavigate?.('gallery')}
              className="touch-target nav-mobile text-body-sm font-medium transition-all duration-200 hover:text-brand text-subtle hover:scale-105 px-3 py-2 rounded-lg hover:bg-accent/50"
            >
              Gallery
            </button>
            <button 
              onClick={() => onNavigate?.('faq')}
              className="touch-target nav-mobile text-body-sm font-medium transition-all duration-200 hover:text-brand text-subtle hover:scale-105 px-3 py-2 rounded-lg hover:bg-accent/50"
            >
              FAQ
            </button>
          </nav>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-3">
          {/* Mobile menu button */}
          <Button 
            variant="ghost" 
            size="sm"
            className="md:hidden touch-target-lg touch-feedback hover:bg-accent transition-colors rounded-lg"
            onClick={onToggleMobileMenu}
            aria-label="Toggle mobile menu"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>
      
      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t-2 bg-background/98 backdrop-blur-md supports-[backdrop-filter]:bg-background/90 shadow-lg animate-fade-in">
          <nav className="container py-4 space-y-2 px-4 mobile-spacing">
            <button 
              onClick={() => onNavigate?.('generator')}
              className="block w-full text-left touch-target-lg touch-feedback text-body-sm font-medium transition-all duration-200 hover:bg-accent hover:text-accent-foreground rounded-lg px-4 py-3 focus-mobile"
            >
              <div className="flex items-center space-x-3">
                <span className="text-lg">🎨</span>
                <span>Generator</span>
              </div>
            </button>
            <button 
              onClick={() => onNavigate?.('tutorial')}
              className="block w-full text-left touch-target-lg touch-feedback text-body-sm font-medium transition-all duration-200 hover:bg-accent hover:text-accent-foreground rounded-lg px-4 py-3 focus-mobile"
            >
              <div className="flex items-center space-x-3">
                <span className="text-lg">📚</span>
                <span>Tutorial</span>
              </div>
            </button>
            <button 
              onClick={() => onNavigate?.('gallery')}
              className="block w-full text-left touch-target-lg touch-feedback text-body-sm font-medium transition-all duration-200 hover:bg-accent hover:text-accent-foreground rounded-lg px-4 py-3 focus-mobile"
            >
              <div className="flex items-center space-x-3">
                <span className="text-lg">🖼️</span>
                <span>Gallery</span>
              </div>
            </button>
            <button 
              onClick={() => onNavigate?.('faq')}
              className="block w-full text-left touch-target-lg touch-feedback text-body-sm font-medium transition-all duration-200 hover:bg-accent hover:text-accent-foreground rounded-lg px-4 py-3 focus-mobile"
            >
              <div className="flex items-center space-x-3">
                <span className="text-lg">❓</span>
                <span>FAQ</span>
              </div>
            </button>
          </nav>
        </div>
      )}
    </header>
  )
}
