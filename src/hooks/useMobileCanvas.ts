import { useRef, useCallback, useEffect, useState } from 'react'

export interface CanvasTransform {
  scale: number
  translateX: number
  translateY: number
}

export interface UseMobileCanvasOptions {
  minScale?: number
  maxScale?: number
  enablePan?: boolean
  enableZoom?: boolean
  smoothness?: number
  resetOnDoubleClick?: boolean
}

export interface MobileCanvasHandlers {
  onTouchStart: (event: React.TouchEvent<HTMLCanvasElement>) => void
  onTouchMove: (event: React.TouchEvent<HTMLCanvasElement>) => void
  onTouchEnd: (event: React.TouchEvent<HTMLCanvasElement>) => void
  onWheel: (event: React.WheelEvent<HTMLCanvasElement>) => void
  onDoubleClick: (event: React.MouseEvent<HTMLCanvasElement>) => void
  resetTransform: () => void
  setTransform: (transform: Partial<CanvasTransform>) => void
}

export function useMobileCanvas(options: UseMobileCanvasOptions = {}): [
  React.RefObject<HTMLCanvasElement | null>,
  CanvasTransform,
  MobileCanvasHandlers
] {
  const {
    minScale = 0.5,
    maxScale = 4,
    enablePan = true,
    enableZoom = true,
    resetOnDoubleClick = true,
  } = options

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [transform, setTransformState] = useState<CanvasTransform>({
    scale: 1,
    translateX: 0,
    translateY: 0,
  })

  // Touch tracking state
  const lastTouchesRef = useRef<React.Touch[]>([])
  const lastDistanceRef = useRef<number>(0)
  const isPanningRef = useRef<boolean>(false)
  const isZoomingRef = useRef<boolean>(false)
  const animationFrameRef = useRef<number | undefined>(undefined)
  const visualFeedbackTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined)

  // Get distance between two touches
  const getTouchDistance = useCallback((touch1: React.Touch, touch2: React.Touch): number => {
    const dx = touch1.clientX - touch2.clientX
    const dy = touch1.clientY - touch2.clientY
    return Math.sqrt(dx * dx + dy * dy)
  }, [])

  // Get center point between two touches
  const getTouchCenter = useCallback((touch1: React.Touch, touch2: React.Touch): { x: number; y: number } => {
    return {
      x: (touch1.clientX + touch2.clientX) / 2,
      y: (touch1.clientY + touch2.clientY) / 2,
    }
  }, [])

  // Constrain scale within bounds
  const constrainScale = useCallback((scale: number): number => {
    return Math.max(minScale, Math.min(maxScale, scale))
  }, [minScale, maxScale])

  // Constrain pan within canvas bounds
  const constrainPan = useCallback((translateX: number, translateY: number, scale: number): { x: number; y: number } => {
    if (!canvasRef.current) return { x: translateX, y: translateY }

    const canvas = canvasRef.current
    const rect = canvas.getBoundingClientRect()
    
    // Calculate the scaled canvas dimensions
    const scaledWidth = rect.width * scale
    const scaledHeight = rect.height * scale
    
    // Maximum translation limits
    const maxTranslateX = Math.max(0, (scaledWidth - rect.width) / 2)
    const maxTranslateY = Math.max(0, (scaledHeight - rect.height) / 2)
    
    return {
      x: Math.max(-maxTranslateX, Math.min(maxTranslateX, translateX)),
      y: Math.max(-maxTranslateY, Math.min(maxTranslateY, translateY))
    }
  }, [])

  // Smooth transform update with RAF
  const updateTransform = useCallback((newTransform: Partial<CanvasTransform>) => {
    setTransformState(current => {
      const updated = { ...current, ...newTransform }
      
      // Constrain scale
      updated.scale = constrainScale(updated.scale)
      
      // Constrain pan
      const constrainedPan = constrainPan(updated.translateX, updated.translateY, updated.scale)
      updated.translateX = constrainedPan.x
      updated.translateY = constrainedPan.y
      
      return updated
    })
  }, [constrainScale, constrainPan])

  // Touch start handler
  const onTouchStart = useCallback((event: React.TouchEvent<HTMLCanvasElement>) => {
    event.preventDefault()
    
    const touches = Array.from(event.touches)
    lastTouchesRef.current = touches

    if (touches.length === 1) {
      // Single touch - start panning
      isPanningRef.current = true
      isZoomingRef.current = false
    } else if (touches.length === 2 && enableZoom) {
      // Two touches - start zooming
      isPanningRef.current = false
      isZoomingRef.current = true
      lastDistanceRef.current = getTouchDistance(touches[0], touches[1])
    }

    // Add visual feedback with proper cleanup
    const canvas = event.currentTarget
    canvas.style.filter = 'brightness(0.95)'
    
    // Clear any existing visual feedback timeout
    if (visualFeedbackTimeoutRef.current) {
      clearTimeout(visualFeedbackTimeoutRef.current)
    }
  }, [enableZoom, getTouchDistance])

  // Touch move handler
  const onTouchMove = useCallback((event: React.TouchEvent<HTMLCanvasElement>) => {
    event.preventDefault()
    
    const touches = Array.from(event.touches)
    const lastTouches = lastTouchesRef.current

    if (touches.length === 1 && lastTouches.length === 1 && enablePan && isPanningRef.current) {
      // Single touch pan
      const touch = touches[0]
      const lastTouch = lastTouches[0]
      
      const deltaX = touch.clientX - lastTouch.clientX
      const deltaY = touch.clientY - lastTouch.clientY
      
      updateTransform({
        translateX: transform.translateX + deltaX,
        translateY: transform.translateY + deltaY
      })
    } else if (touches.length === 2 && lastTouches.length === 2 && enableZoom && isZoomingRef.current) {
      // Two touch zoom and pan
      const currentDistance = getTouchDistance(touches[0], touches[1])
      const lastDistance = lastDistanceRef.current
      
      if (lastDistance > 0) {
        // Calculate zoom
        const scaleChange = currentDistance / lastDistance
        const newScale = transform.scale * scaleChange
        
        // Get center point for zoom origin
        const center = getTouchCenter(touches[0], touches[1])
        const canvas = event.currentTarget
        const rect = canvas.getBoundingClientRect()
        const originX = center.x - rect.left - rect.width / 2
        const originY = center.y - rect.top - rect.height / 2
        
        // Apply zoom with origin point
        const scaleDiff = newScale - transform.scale
        const newTranslateX = transform.translateX - originX * scaleDiff / transform.scale
        const newTranslateY = transform.translateY - originY * scaleDiff / transform.scale
        
        updateTransform({
          scale: newScale,
          translateX: newTranslateX,
          translateY: newTranslateY
        })
      }
      
      lastDistanceRef.current = currentDistance
    }

    lastTouchesRef.current = touches
  }, [
    enablePan, 
    enableZoom, 
    isPanningRef, 
    isZoomingRef, 
    transform, 
    getTouchDistance, 
    getTouchCenter, 
    updateTransform
  ])

  // Touch end handler
  const onTouchEnd = useCallback((event: React.TouchEvent<HTMLCanvasElement>) => {
    event.preventDefault()
    
    const touches = Array.from(event.touches)
    lastTouchesRef.current = touches

    if (touches.length === 0) {
      // All touches ended - clear touch references to prevent leaks
      isPanningRef.current = false
      isZoomingRef.current = false
      lastDistanceRef.current = 0
      lastTouchesRef.current = [] // Clear touch references
    } else if (touches.length === 1) {
      // Switch from zoom to pan
      isPanningRef.current = true
      isZoomingRef.current = false
      lastDistanceRef.current = 0
    }

    // Remove visual feedback with timeout cleanup
    const canvas = event.currentTarget
    canvas.style.filter = 'brightness(1)'
    canvas.style.transform = 'scale(1)'
    
    // Clear any pending visual feedback timeouts
    if (visualFeedbackTimeoutRef.current) {
      clearTimeout(visualFeedbackTimeoutRef.current)
      visualFeedbackTimeoutRef.current = undefined
    }
  }, [])

  // Mouse wheel handler for desktop
  const onWheel = useCallback((event: React.WheelEvent<HTMLCanvasElement>) => {
    if (!enableZoom) return
    
    event.preventDefault()
    
    const delta = event.deltaY > 0 ? 0.9 : 1.1
    const newScale = transform.scale * delta
    
    // Get mouse position for zoom origin
    const canvas = event.currentTarget
    const rect = canvas.getBoundingClientRect()
    const originX = event.clientX - rect.left - rect.width / 2
    const originY = event.clientY - rect.top - rect.height / 2
    
    // Apply zoom with origin point
    const scaleDiff = newScale - transform.scale
    const newTranslateX = transform.translateX - originX * scaleDiff / transform.scale
    const newTranslateY = transform.translateY - originY * scaleDiff / transform.scale
    
    updateTransform({
      scale: newScale,
      translateX: newTranslateX,
      translateY: newTranslateY
    })
  }, [enableZoom, transform, updateTransform])

  // Double click to reset
  const onDoubleClick = useCallback((event: React.MouseEvent<HTMLCanvasElement>) => {
    if (resetOnDoubleClick) {
      event.preventDefault()
      updateTransform({
        scale: 1,
        translateX: 0,
        translateY: 0
      })
    }
  }, [resetOnDoubleClick, updateTransform])

  // Reset transform function
  const resetTransform = useCallback(() => {
    updateTransform({
      scale: 1,
      translateX: 0,
      translateY: 0
    })
  }, [updateTransform])

  // Manual transform setter
  const setTransform = useCallback((newTransform: Partial<CanvasTransform>) => {
    updateTransform(newTransform)
  }, [updateTransform])

  // Apply transform to canvas
  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const { scale, translateX, translateY } = transform
    
    // Apply CSS transform for hardware acceleration
    canvas.style.transform = `translate3d(${translateX}px, ${translateY}px, 0) scale(${scale})`
    canvas.style.transformOrigin = 'center center'
    canvas.style.transition = isPanningRef.current || isZoomingRef.current ? 'none' : 'transform 0.1s ease-out'
  }, [transform])

  // Comprehensive cleanup to prevent memory leaks
  useEffect(() => {
    return () => {
      // Cancel any pending animation frames
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
      
      // Clear any pending visual feedback timeouts
      if (visualFeedbackTimeoutRef.current) {
        clearTimeout(visualFeedbackTimeoutRef.current)
      }
      
      // Clear touch references to prevent memory leaks
      lastTouchesRef.current = []
      lastDistanceRef.current = 0
      isPanningRef.current = false
      isZoomingRef.current = false
    }
  }, [])

  const handlers: MobileCanvasHandlers = {
    onTouchStart,
    onTouchMove,
    onTouchEnd,
    onWheel,
    onDoubleClick,
    resetTransform,
    setTransform,
  }

  return [canvasRef, transform, handlers]
}