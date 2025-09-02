import * as React from "react"
import { cn } from "@/lib/utils"

export interface MobileSliderProps {
  min: number
  max: number
  step?: number
  value: number
  onValueChange: (value: number) => void
  disabled?: boolean
  className?: string
  trackClassName?: string
  thumbClassName?: string
  label?: string
  showValue?: boolean
  formatValue?: (value: number) => string
  orientation?: "horizontal" | "vertical"
}

const MobileSlider = React.forwardRef<HTMLInputElement, MobileSliderProps>(
  ({
    min,
    max,
    step = 1,
    value,
    onValueChange,
    disabled = false,
    className,
    trackClassName,
    thumbClassName,
    label,
    showValue = true,
    formatValue = (val) => val.toString(),
    orientation = "horizontal",
    ...props
  }, ref) => {
    const [isDragging, setIsDragging] = React.useState(false)
    const [dragValue, setDragValue] = React.useState(value)
    
    // Calculate percentage for positioning
    const percentage = ((value - min) / (max - min)) * 100
    
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = parseFloat(event.target.value)
      onValueChange(newValue)
    }

    const handleTouchStart = () => {
      setIsDragging(true)
      setDragValue(value)
    }

    const handleTouchEnd = () => {
      setIsDragging(false)
      setDragValue(value)
    }

    const handleInput = (event: React.FormEvent<HTMLInputElement>) => {
      if (isDragging) {
        const newValue = parseFloat((event.target as HTMLInputElement).value)
        setDragValue(newValue)
        onValueChange(newValue)
      }
    }

    return (
      <div className={cn("space-y-3", className)}>
        {label && (
          <div className="flex justify-between items-center">
            <label className="text-body-sm font-medium text-emphasis">
              {label}
            </label>
            {showValue && (
              <span className="text-body-sm font-medium text-brand bg-primary/10 px-2 py-1 rounded-md">
                {formatValue(isDragging ? dragValue : value)}
              </span>
            )}
          </div>
        )}
        
        <div className="relative">
          <input
            ref={ref}
            type="range"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={handleChange}
            onInput={handleInput}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            disabled={disabled}
            className={cn(
              // Base styles
              "w-full h-2 bg-transparent cursor-pointer appearance-none",
              "focus:outline-none focus-mobile",
              
              // Track styles
              "slider-mobile",
              
              // Disabled state
              disabled && "opacity-50 cursor-not-allowed",
              
              // Custom track class
              trackClassName
            )}
            style={{
              background: `linear-gradient(to right, 
                hsl(var(--primary)) 0%, 
                hsl(var(--primary)) ${percentage}%, 
                hsl(var(--muted)) ${percentage}%, 
                hsl(var(--muted)) 100%)`
            }}
            {...props}
          />
          
          {/* Touch feedback overlay */}
          {isDragging && (
            <div 
              className="absolute -top-2 -bottom-2 bg-primary/10 rounded-lg pointer-events-none transition-opacity"
              style={{
                left: `max(0%, min(${percentage}% - 14px, calc(100% - 28px)))`,
                width: '28px'
              }}
            />
          )}
        </div>
        
        {/* Value indicators */}
        <div className="flex justify-between text-xs text-muted-foreground mt-1">
          <span>{formatValue(min)}</span>
          <span>{formatValue(max)}</span>
        </div>
        
        {/* Touch zones for easier interaction on mobile */}
        <div className="flex justify-between mt-2 gap-2 sm:hidden">
          <button
            type="button"
            onClick={() => onValueChange(Math.max(min, value - step * 10))}
            disabled={disabled || value <= min}
            className="touch-target-lg bg-muted hover:bg-muted/80 rounded-lg transition-colors disabled:opacity-50"
            aria-label={`Decrease ${label || 'value'} by ${step * 10}`}
          >
            <span className="text-lg">➖</span>
          </button>
          
          <div className="flex-1 flex justify-center items-center">
            <span className="text-body-sm text-subtle">
              Tap and drag to adjust
            </span>
          </div>
          
          <button
            type="button"
            onClick={() => onValueChange(Math.min(max, value + step * 10))}
            disabled={disabled || value >= max}
            className="touch-target-lg bg-muted hover:bg-muted/80 rounded-lg transition-colors disabled:opacity-50"
            aria-label={`Increase ${label || 'value'} by ${step * 10}`}
          >
            <span className="text-lg">➕</span>
          </button>
        </div>
      </div>
    )
  }
)

MobileSlider.displayName = "MobileSlider"

export { MobileSlider }