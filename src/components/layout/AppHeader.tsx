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
          <div className="flex items-center space-x-3">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-sm">
              <span className="text-primary-foreground font-bold text-sm">SA</span>
            </div>
            <span className="text-heading-sm font-semibold hidden sm:block">String Art Generator</span>
            <span className="text-heading-sm font-semibold sm:hidden">String Art</span>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <button 
              onClick={() => onNavigate?.('generator')}
              className="text-body-sm font-medium transition-all duration-200 hover:text-brand text-subtle hover:scale-105"
            >
              Generator
            </button>
            <button 
              onClick={() => onNavigate?.('tutorial')}
              className="text-body-sm font-medium transition-all duration-200 hover:text-brand text-subtle hover:scale-105"
            >
              Tutorial
            </button>
            <button 
              onClick={() => onNavigate?.('gallery')}
              className="text-body-sm font-medium transition-all duration-200 hover:text-brand text-subtle hover:scale-105"
            >
              Gallery
            </button>
            <button 
              onClick={() => onNavigate?.('faq')}
              className="text-body-sm font-medium transition-all duration-200 hover:text-brand text-subtle hover:scale-105"
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
            className="md:hidden p-2 h-10 w-10 hover:bg-accent transition-colors"
            onClick={onToggleMobileMenu}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>
      
      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t-2 bg-background/98 backdrop-blur-md supports-[backdrop-filter]:bg-background/90 shadow-lg">
          <nav className="container py-6 space-y-1 px-4">
            <button 
              onClick={() => onNavigate?.('generator')}
              className="block w-full text-left py-4 px-4 text-body-sm font-medium transition-all duration-200 hover:bg-accent hover:text-accent-foreground rounded-lg active:scale-98"
            >
              Generator
            </button>
            <button 
              onClick={() => onNavigate?.('tutorial')}
              className="block w-full text-left py-4 px-4 text-body-sm font-medium transition-all duration-200 hover:bg-accent hover:text-accent-foreground rounded-lg active:scale-98"
            >
              Tutorial
            </button>
            <button 
              onClick={() => onNavigate?.('gallery')}
              className="block w-full text-left py-4 px-4 text-body-sm font-medium transition-all duration-200 hover:bg-accent hover:text-accent-foreground rounded-lg active:scale-98"
            >
              Gallery
            </button>
            <button 
              onClick={() => onNavigate?.('faq')}
              className="block w-full text-left py-4 px-4 text-body-sm font-medium transition-all duration-200 hover:bg-accent hover:text-accent-foreground rounded-lg active:scale-98"
            >
              FAQ
            </button>
          </nav>
        </div>
      )}
    </header>
  )
}
