import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"

interface Section {
  id: string
  label: string
}

interface NavigationDotsProps {
  sections: Section[]
  className?: string
  orientation?: "vertical" | "horizontal"
  position?: "left" | "right" | "bottom"
}

export function NavigationDots({ 
  sections, 
  className,
  orientation = "vertical",
  position = "right"
}: NavigationDotsProps) {
  const [activeSection, setActiveSection] = useState<string>("")

  useEffect(() => {
    const observers = new Map<string, IntersectionObserver>()

    sections.forEach(({ id }) => {
      const element = document.getElementById(id)
      if (element) {
        const observer = new IntersectionObserver(
          ([entry]) => {
            if (entry.isIntersecting) {
              setActiveSection(id)
            }
          },
          {
            threshold: 0.5,
            rootMargin: "-80px 0px -80px 0px" // Account for header
          }
        )
        observer.observe(element)
        observers.set(id, observer)
      }
    })

    return () => {
      observers.forEach(observer => observer.disconnect())
    }
  }, [sections])

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }

  const positionClasses = {
    left: "fixed left-4 top-1/2 -translate-y-1/2 z-40",
    right: "fixed right-4 top-1/2 -translate-y-1/2 z-40", 
    bottom: "fixed bottom-4 left-1/2 -translate-x-1/2 z-40"
  }

  const containerClasses = {
    vertical: "flex flex-col space-y-3",
    horizontal: "flex flex-row space-x-3"
  }

  return (
    <nav 
      className={cn(
        "hidden lg:block", // Only show on desktop
        positionClasses[position],
        className
      )}
      role="navigation"
      aria-label="Page sections"
    >
      <div className={cn(
        containerClasses[orientation],
        "bg-background/80 backdrop-blur-sm rounded-full p-2 border border-border/50 shadow-sm"
      )}>
        {sections.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => scrollToSection(id)}
            className={cn(
              "relative w-3 h-3 rounded-full border-2 transition-all duration-300 hover:scale-125 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2",
              activeSection === id
                ? "bg-primary border-primary shadow-sm scale-110"
                : "bg-transparent border-border hover:border-primary/50"
            )}
            aria-label={`Navigate to ${label}`}
            title={label}
          />
        ))}
      </div>
    </nav>
  )
}

// Mobile navigation dots (horizontal at bottom)
export function MobileNavigationDots({ sections, className }: Pick<NavigationDotsProps, 'sections' | 'className'>) {
  return (
    <NavigationDots
      sections={sections}
      orientation="horizontal"
      position="bottom"
      className={cn("lg:hidden", className)}
    />
  )
}

// Hook for managing section navigation
export function useSectionNavigation(sections: Section[]) {
  const [activeSection, setActiveSection] = useState<string>("")

  useEffect(() => {
    const observers = new Map<string, IntersectionObserver>()

    sections.forEach(({ id }) => {
      const element = document.getElementById(id)
      if (element) {
        const observer = new IntersectionObserver(
          ([entry]) => {
            if (entry.isIntersecting) {
              setActiveSection(id)
            }
          },
          {
            threshold: 0.5,
            rootMargin: "-80px 0px -80px 0px"
          }
        )
        observer.observe(element)
        observers.set(id, observer)
      }
    })

    return () => {
      observers.forEach(observer => observer.disconnect())
    }
  }, [sections])

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }

  return {
    activeSection,
    scrollToSection
  }
}