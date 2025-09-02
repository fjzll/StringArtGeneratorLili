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
      minimal: "py-6 md:py-8 lg:py-10",
      compact: "py-10 md:py-14 lg:py-18",
      normal: "py-16 md:py-20 lg:py-24",
      large: "py-20 md:py-28 lg:py-36"
    }

    const variantClasses = {
      default: "",
      glass: "glass-effect",
      bordered: "border-2 border-border rounded-xl"
    }

    return (
      <section
        ref={ref}
        id={id}
        className={cn(
          "w-full scroll-mt-20", // Account for sticky header (increased from 16 to 20)
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
      spacing="compact" 
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