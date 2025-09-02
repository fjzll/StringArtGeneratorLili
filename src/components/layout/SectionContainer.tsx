import { forwardRef, type ReactNode } from "react"
import { cn } from "@/lib/utils"

interface SectionContainerProps {
  id?: string
  className?: string
  children: ReactNode
  variant?: "default" | "glass" | "bordered"
  spacing?: "normal" | "large" | "compact" | "minimal"
  centered?: boolean
}

export const SectionContainer = forwardRef<HTMLDivElement, SectionContainerProps>(
  ({ id, className, children, variant = "default", spacing = "normal", centered = false, ...props }, ref) => {
    const spacingClasses = {
      minimal: "py-4 md:py-6",
      compact: "py-8 md:py-12",
      normal: "py-12 md:py-16 lg:py-20",
      large: "py-16 md:py-24 lg:py-32"
    }

    const variantClasses = {
      default: "",
      glass: "glass-effect",
      bordered: "border border-border rounded-lg"
    }

    return (
      <section
        ref={ref}
        id={id}
        className={cn(
          "w-full scroll-mt-16", // Account for sticky header
          spacingClasses[spacing],
          variantClasses[variant],
          className
        )}
        {...props}
      >
        <div 
          className={cn(
            "container-apple", // Apple-style container
            centered && "text-center"
          )}
        >
          {children}
        </div>
      </section>
    )
  }
)

SectionContainer.displayName = "SectionContainer"

// Specialized section components for common use cases
export function HeroSection({ children, ...props }: Omit<SectionContainerProps, 'variant' | 'spacing'>) {
  return (
    <SectionContainer 
      variant="default" 
      spacing="minimal" 
      centered
      {...props}
    >
      {children}
    </SectionContainer>
  )
}

export function ContentSection({ children, ...props }: Omit<SectionContainerProps, 'variant' | 'spacing'>) {
  return (
    <SectionContainer 
      variant="default" 
      spacing="normal"
      {...props}
    >
      {children}
    </SectionContainer>
  )
}

export function GlassSection({ children, ...props }: Omit<SectionContainerProps, 'variant'>) {
  return (
    <SectionContainer 
      variant="glass"
      {...props}
    >
      {children}
    </SectionContainer>
  )
}