// Example of how to integrate the Toast system into your String Art Generator app

import React from 'react'
import { Toaster } from '@/components/ui/toaster'
import { useToast } from '@/components/ui/use-toast'
import { Button } from '@/components/ui/button'
import { ToastAction } from '@/components/ui/toast'

// Example: Update your main App.tsx
export function AppWithToasts() {
  const { toast } = useToast()

  // Example success toast for when string art generation completes
  const showSuccessToast = () => {
    toast({
      title: "String Art Generated!",
      description: "Your masterpiece is ready to download.",
      variant: "success",
    })
  }

  // Example error toast for when generation fails
  const showErrorToast = (error: string) => {
    toast({
      title: "Generation Failed",
      description: error,
      variant: "destructive",
      action: (
        <ToastAction 
          altText="Try again"
          onClick={() => {
            // Retry logic here
            console.log("Retrying...")
          }}
        >
          Try again
        </ToastAction>
      ),
    })
  }

  // Example info toast for when user uploads an image
  const showImageUploadToast = (filename: string) => {
    toast({
      title: "Image Uploaded",
      description: `${filename} is ready for processing.`,
    })
  }

  // Example warning toast for large images
  const showLargeImageWarning = () => {
    toast({
      title: "Large Image Detected",
      description: "Processing may take longer than usual. Consider resizing for faster results.",
      action: (
        <ToastAction 
          altText="Resize"
          onClick={() => {
            // Resize logic here
            console.log("Resizing image...")
          }}
        >
          Resize
        </ToastAction>
      ),
    })
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Your existing app content */}
      
      {/* Example buttons to trigger toasts */}
      <div className="fixed bottom-4 left-4 space-y-2 z-50">
        <Button onClick={showSuccessToast} variant="default" size="sm">
          Test Success Toast
        </Button>
        <Button onClick={() => showErrorToast("Failed to process image")} variant="destructive" size="sm">
          Test Error Toast
        </Button>
        <Button onClick={() => showImageUploadToast("example.jpg")} variant="outline" size="sm">
          Test Info Toast
        </Button>
        <Button onClick={showLargeImageWarning} variant="secondary" size="sm">
          Test Warning Toast
        </Button>
      </div>

      {/* IMPORTANT: Add the Toaster component at the end of your app */}
      <Toaster />
    </div>
  )
}

// Example: Integration in your existing generateArt function
export const generateArtWithToasts = async () => {
  const { toast } = useToast()
  
  if (!selectedImage) {
    toast({
      title: "No Image Selected",
      description: "Please upload an image before generating string art.",
      variant: "destructive",
    })
    return
  }

  // Show processing toast
  toast({
    title: "Processing Started",
    description: "Your string art is being generated...",
  })

  setIsProcessing(true)
  setError(null)
  setProgress(null)

  try {
    const img = new Image()
    img.onload = async () => {
      try {
        const stringArtResult = await generateStringArt(
          img,
          {
            numberOfPins,
            numberOfLines,
            lineWeight,
            minDistance: Math.max(2, Math.floor(numberOfPins / 36)),
            imgSize,
          },
          (progressUpdate, currentLineSequence, pinCoordinates) => {
            setProgress(progressUpdate)
            
            if (currentLineSequence && pinCoordinates) {
              requestAnimationFrame(() => {
                drawProgressiveLines(currentLineSequence, pinCoordinates, imgSize, progressUpdate.linesDrawn)
              })
            }
          }
        )

        setResult(stringArtResult)
        
        // Success toast
        toast({
          title: "String Art Complete!",
          description: `Generated with ${stringArtResult.lineSequence.length} lines in ${(stringArtResult.processingTimeMs / 1000).toFixed(1)}s`,
          variant: "success",
          action: (
            <ToastAction altText="Download" onClick={() => {/* download logic */}}>
              Download
            </ToastAction>
          ),
        })

      } catch (error) {
        console.error('Generation failed:', error)
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
        setError(errorMessage)
        
        // Error toast
        toast({
          title: "Generation Failed",
          description: errorMessage,
          variant: "destructive",
          action: (
            <ToastAction altText="Try again" onClick={() => generateArtWithToasts()}>
              Try again
            </ToastAction>
          ),
        })
      } finally {
        setIsProcessing(false)
      }
    }
    img.src = selectedImage
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to process image'
    setError(errorMessage)
    setIsProcessing(false)
    
    toast({
      title: "Processing Error",
      description: errorMessage,
      variant: "destructive",
    })
  }
}

// Example: Toast for image upload with file size validation
export const handleImageUploadWithToasts = (event: React.ChangeEvent<HTMLInputElement>) => {
  const { toast } = useToast()
  const file = event.target.files?.[0]
  
  if (!file) return

  // Validate file size (example: 5MB limit)
  const maxSize = 5 * 1024 * 1024 // 5MB
  if (file.size > maxSize) {
    toast({
      title: "File Too Large",
      description: "Please select an image smaller than 5MB.",
      variant: "destructive",
    })
    return
  }

  const reader = new FileReader()
  reader.onload = (e) => {
    setSelectedImage(e.target?.result as string)
    setResult(null)
    setError(null)
    
    // Success toast for upload
    toast({
      title: "Image Uploaded Successfully",
      description: `${file.name} is ready for processing.`,
      variant: "success",
    })
  }
  
  reader.onerror = () => {
    toast({
      title: "Upload Failed",
      description: "Failed to read the selected file.",
      variant: "destructive",
    })
  }
  
  reader.readAsDataURL(file)
}

// Example: Auto-dismissing toast with custom duration
export const showAutoToast = () => {
  const { toast } = useToast()
  
  toast({
    title: "Auto-dismiss Toast",
    description: "This toast will disappear automatically.",
    duration: 3000, // 3 seconds
  })
}

// Example: Programmatic toast dismissal
export const showDismissibleToast = () => {
  const { toast } = useToast()
  
  const { dismiss } = toast({
    title: "Dismissible Toast",
    description: "You can dismiss this programmatically.",
    duration: Infinity, // Won't auto-dismiss
  })
  
  // Dismiss after some condition
  setTimeout(() => {
    dismiss()
  }, 5000)
}