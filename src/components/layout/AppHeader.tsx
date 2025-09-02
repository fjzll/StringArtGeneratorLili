import { Button } from "@/components/ui/button"
import { Menu, Download, HelpCircle } from "lucide-react"

interface AppHeaderProps {
  onNavigate?: (section: string) => void
  onShowHelp?: () => void
  onToggleMobileMenu?: () => void
  isMobileMenuOpen?: boolean
  className?: string
}

export function AppHeader({ onNavigate, onShowHelp, onToggleMobileMenu, isMobileMenuOpen, className }: AppHeaderProps) {
  return (
    <header className={`sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 ${className}`}>
      <div className="container flex h-14 items-center justify-between">
        {/* Logo and Navigation */}
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">SA</span>
            </div>
            <span className="font-semibold">String Art Generator</span>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
            <button 
              onClick={() => onNavigate?.('generator')}
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              Generator
            </button>
            <button 
              onClick={() => onNavigate?.('tutorial')}
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              Tutorial
            </button>
            <button 
              onClick={() => onNavigate?.('gallery')}
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              Gallery
            </button>
            <button 
              onClick={() => onNavigate?.('faq')}
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              FAQ
            </button>
          </nav>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-2">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={onShowHelp}
            className="hidden sm:inline-flex"
          >
            <HelpCircle className="h-4 w-4 mr-2" />
            Help
          </Button>
          
          {/* Mobile menu button */}
          <Button 
            variant="ghost" 
            size="sm"
            className="md:hidden"
            onClick={onToggleMobileMenu}
          >
            <Menu className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <nav className="container py-4 space-y-2">
            <button 
              onClick={() => onNavigate?.('generator')}
              className="block w-full text-left py-3 px-4 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground rounded-md"
            >
              Generator
            </button>
            <button 
              onClick={() => onNavigate?.('tutorial')}
              className="block w-full text-left py-3 px-4 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground rounded-md"
            >
              Tutorial
            </button>
            <button 
              onClick={() => onNavigate?.('gallery')}
              className="block w-full text-left py-3 px-4 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground rounded-md"
            >
              Gallery
            </button>
            <button 
              onClick={() => onNavigate?.('faq')}
              className="block w-full text-left py-3 px-4 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground rounded-md"
            >
              FAQ
            </button>
          </nav>
        </div>
      )}
    </header>
  )
}
