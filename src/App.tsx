import { useState, useRef } from 'react'
import { generateStringArt } from './lib/algorithms/stringArtEngine'
import type { StringArtResult, OptimizationProgress } from './types'

// Layout Components
import { 
  AppHeader, 
  HeroSection,
  NavigationDots,
  FloatingActions 
} from './components/layout'

// UI Components  
import { Button } from './components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from './components/ui/card'
import { Progress } from './components/ui/progress'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './components/ui/accordion'

// Content Components
import { TutorialSection, GallerySection, FAQSection } from './components/content'

// Test Components (temporary)
import { FoundationTest } from './components/test/FoundationTest'

interface PresetConfig {
  id: string
  name: string
  description: string
  icon: string
  config: {
    numberOfPins: number
    numberOfLines: number
    lineWeight: number
    imgSize: number
  }
}

function App() {
  // Core State
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [result, setResult] = useState<StringArtResult | null>(null)
  const [progress, setProgress] = useState<OptimizationProgress | null>(null)
  const [error, setError] = useState<string | null>(null)
  
  // UI State
  const [showFoundationTest, setShowFoundationTest] = useState(false)
  const [selectedPreset, setSelectedPreset] = useState<string>('fine')
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  
  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  
  // Parameters (will be set by presets or advanced settings)
  const [numberOfPins, setNumberOfPins] = useState(288)
  const [numberOfLines, setNumberOfLines] = useState(4000)
  const [lineWeight, setLineWeight] = useState(20)
  const [imgSize, setImgSize] = useState(500)

  // Preset configurations
  const presets: PresetConfig[] = [
    {
      id: 'fine',
      name: 'Fine Detail',
      description: 'High precision with fine lines for detailed images',
      icon: '✨',
      config: { numberOfPins: 360, numberOfLines: 4000, lineWeight: 15, imgSize: 500 }
    },
    {
      id: 'bold',
      name: 'Bold Impact',
      description: 'Strong lines and high contrast for dramatic effect',
      icon: '🔥',
      config: { numberOfPins: 216, numberOfLines: 3000, lineWeight: 35, imgSize: 500 }
    },
    {
      id: 'soft',
      name: 'Soft Portrait',
      description: 'Gentle lines perfect for portraits and organic shapes',
      icon: '🌸',
      config: { numberOfPins: 288, numberOfLines: 2500, lineWeight: 25, imgSize: 500 }
    },
    {
      id: 'pro',
      name: 'Professional',
      description: 'Balanced settings optimized for exhibition quality',
      icon: '👑',
      config: { numberOfPins: 324, numberOfLines: 3500, lineWeight: 20, imgSize: 500 }
    }
  ]

  // Navigation sections for smooth scrolling
  const sections = [
    { id: 'generator', label: 'Generator' },
    { id: 'gallery', label: 'Gallery' },
    { id: 'tutorial', label: 'Tutorial' },
    { id: 'faq', label: 'FAQ' }
  ]

  // Apply preset configuration
  const applyPreset = (presetId: string) => {
    const preset = presets.find(p => p.id === presetId)
    if (preset) {
      setSelectedPreset(presetId)
      setNumberOfPins(preset.config.numberOfPins)
      setNumberOfLines(preset.config.numberOfLines)
      setLineWeight(preset.config.lineWeight)
      setImgSize(preset.config.imgSize)
    }
  }

  // Navigation handler
  const handleNavigation = (section: string) => {
    const element = document.getElementById(section)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
    // Close mobile menu after navigation
    setIsMobileMenuOpen(false)
  }

  // Mobile menu toggle handler
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  // Scroll to top handler
  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Download handler for generated string art
  const handleDownload = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    // Create a link element to trigger download
    const link = document.createElement('a')
    link.download = `string-art-${Date.now()}.png`
    link.href = canvas.toDataURL('image/png')
    
    // Trigger download
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Try Again handler - reset everything and go back to generator
  const handleTryAgain = () => {
    // Reset all states
    setSelectedImage(null)
    setResult(null)
    setProgress(null)
    setError(null)
    setIsProcessing(false)
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
    
    // Navigate to generator section
    handleNavigation('generator')
  }


  // Enhanced drag & drop state for mobile
  const [isDragOver, setIsDragOver] = useState(false)

  const processFile = (file: File) => {
    // Check file size (warn if > 5MB)
    if (file.size > 5 * 1024 * 1024) {
      // Large image detected - no alert needed
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      setSelectedImage(e.target?.result as string)
      setResult(null)
      setError(null)
    }
    reader.readAsDataURL(file)
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    processFile(file)
  }

  // Enhanced drag & drop handlers for mobile and desktop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    
    const files = Array.from(e.dataTransfer.files)
    const imageFile = files.find(file => file.type.startsWith('image/'))
    
    if (imageFile) {
      processFile(imageFile)
    } else {
      // Invalid file type - no alert needed
    }
  }

  const generateArt = async () => {
    if (!selectedImage) return

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
        } catch (error) {
          console.error('Generation failed:', error)
          const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
          setError(errorMessage)
        } finally {
          setIsProcessing(false)
        }
      }
      img.src = selectedImage
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to process image'
      setError(errorMessage)
      setIsProcessing(false)
    }
  }

  // Touch interaction handlers for canvas
  const handleCanvasTouch = (e: React.TouchEvent<HTMLCanvasElement>) => {
    // Prevent default touch behaviors like scrolling
    e.preventDefault()
    
    // Basic touch feedback
    const canvas = e.currentTarget
    canvas.style.transform = 'scale(0.99)'
    setTimeout(() => {
      canvas.style.transform = 'scale(1)'
    }, 100)
  }

  // Progressive drawing function (same as original)
  const drawProgressiveLines = (lineSequence: number[], pinCoordinates: any[], currentImgSize: number, upToLineIndex: number) => {
    const canvas = canvasRef.current
    if (!canvas || !lineSequence || !pinCoordinates) return

    const ctx = canvas.getContext('2d')!
    canvas.width = 600
    canvas.height = 600
    const scale = canvas.width / currentImgSize

    // Clear and redraw
    ctx.fillStyle = 'white'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    const center = canvas.width / 2

    // Circle boundary
    ctx.strokeStyle = '#e5e7eb' // Light gray border
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.arc(center, center, (canvas.width / 2) - 5, 0, Math.PI * 2)
    ctx.stroke()

    // Draw lines
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.15)' // Semi-transparent black lines
    ctx.lineWidth = 1.0
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    
    const linesToDraw = Math.min(upToLineIndex, lineSequence.length - 1)
    
    for (let i = 0; i < linesToDraw; i++) {
      const pin1Index = lineSequence[i]
      const pin2Index = lineSequence[i + 1]
      const pin1 = pinCoordinates[pin1Index]
      const pin2 = pinCoordinates[pin2Index]
      
      if (pin1 && pin2 && pin1[0] !== undefined && pin1[1] !== undefined) {
        ctx.beginPath()
        ctx.moveTo(pin1[0] * scale, pin1[1] * scale)
        ctx.lineTo(pin2[0] * scale, pin2[1] * scale)
        ctx.stroke()
      }
    }

    // Draw pins
    ctx.fillStyle = 'rgba(34, 139, 230, 0.6)' // Semi-transparent blue pins
    pinCoordinates.forEach(([x, y]) => {
      if (x !== undefined && y !== undefined) {
        ctx.beginPath()
        ctx.arc(x * scale, y * scale, 1.5, 0, Math.PI * 2)
        ctx.fill()
      }
    })
  }

  // Test mode (temporary)
  if (showFoundationTest) {
    return (
      <div className="min-h-screen bg-background">
        <Button 
          onClick={() => setShowFoundationTest(false)}
          variant="destructive"
          className="fixed top-4 right-4 z-50"
        >
          Back to App
        </Button>
        <FoundationTest />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <AppHeader 
        onNavigate={handleNavigation}
        onToggleMobileMenu={toggleMobileMenu}
        isMobileMenuOpen={isMobileMenuOpen}
      />

      {/* Navigation Dots */}
      <NavigationDots sections={sections} />

      {/* Test Mode Toggle (temporary) */}
      <Button 
        onClick={() => setShowFoundationTest(true)}
        variant="outline"
        size="sm"
        className="fixed top-4 left-4 z-40"
      >
        Phase 2A Test
      </Button>

      {/* Main Content */}
      <main>
        {/* Hero Section */}
        <HeroSection id="generator">
          <div className="text-center space-y-6 sm:space-y-8">
            <div className="space-y-4">
              <h1 className="text-display-md sm:text-display-lg lg:text-display-xl font-extrabold tracking-tight px-4 bg-gradient-to-b from-foreground to-foreground/80 bg-clip-text text-transparent">
                String Art Generator
              </h1>
              <p className="text-body-lg sm:text-heading-sm text-muted-foreground max-w-3xl mx-auto px-4 leading-relaxed">
                Transform your photos into beautiful mathematical string art using advanced algorithms and customizable presets.
              </p>
            </div>
            <div className="text-caption text-brand font-medium px-4">
              AI-Powered • Mathematical Precision • Exhibition Quality
            </div>
          </div>
        </HeroSection>

        {/* Generator Section */}
        <div className="w-full scroll-mt-16 py-8 md:py-12 lg:py-16">
          <div className="container-apple">
            <div className="space-y-8 sm:space-y-10 lg:space-y-12">
          {/* Image Upload Area */}
          <Card className="card-hover border-2">
            <CardHeader className="pb-6">
              <CardTitle className="text-heading-lg font-semibold">Upload Your Image</CardTitle>
              <p className="text-body-sm text-subtle mt-2">
                Choose a high-contrast photo for the best string art results. JPG, PNG, and WebP formats are supported.
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Drag & Drop Upload Area */}
                <div 
                  className={`
                    border-2 border-dashed rounded-lg p-6 sm:p-8 text-center transition-all cursor-pointer
                    min-h-[200px] sm:min-h-[240px] flex flex-col items-center justify-center
                    ${selectedImage 
                      ? 'border-primary bg-primary/5' 
                      : isDragOver 
                        ? 'border-primary bg-primary/10 scale-[1.02]'
                        : 'border-border hover:border-primary/50 hover:bg-accent/50 active:bg-accent/75'
                    }
                  `}
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      fileInputRef.current?.click()
                    }
                  }}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  
                  {selectedImage ? (
                    <div className="space-y-3 sm:space-y-4">
                      <img 
                        src={selectedImage} 
                        alt="Selected" 
                        className="max-w-full h-auto mx-auto max-h-48 sm:max-h-64 object-contain rounded-lg shadow-sm"
                      />
                      <p className="text-body-sm text-subtle">
                        Tap to change image
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3 sm:space-y-4">
                      <div className={`text-5xl sm:text-6xl transition-transform ${isDragOver ? 'scale-110' : ''}`}>
                        {isDragOver ? '🎯' : '📸'}
                      </div>
                      <div className="space-y-2">
                        <p className="text-heading-sm font-medium">
                          {isDragOver ? 'Drop your image here!' : 'Drop your image here'}
                        </p>
                        <p className="text-body-sm text-subtle px-4">
                          {isDragOver 
                            ? 'Release to upload your image' 
                            : 'or tap to browse files'
                          }
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Preset Selection */}
          <div className={!selectedImage ? "opacity-50" : ""}>
            {/* Preset Selection */}
            <Card className="card-hover border-2">
              <CardHeader className="pb-6">
                <CardTitle className="text-heading-lg font-semibold">Choose Style Preset</CardTitle>
                <p className="text-body-sm text-subtle mt-2">
                  Each preset is optimized for different image types and artistic styles. Fine-tune with advanced settings if needed.
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                  {presets.map((preset) => (
                    <Card 
                      key={preset.id}
                      className={`cursor-pointer transition-all button-press ${
                        selectedPreset === preset.id 
                          ? 'ring-2 ring-primary bg-primary/5 scale-[0.98]' 
                          : 'hover:shadow-md active:scale-[0.96]'
                      }`}
                      onClick={() => applyPreset(preset.id)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          applyPreset(preset.id)
                        }
                      }}
                    >
                      <CardContent className="p-5 sm:p-6 text-center min-h-[140px] sm:min-h-[160px] flex flex-col justify-center">
                        <div className="text-4xl sm:text-5xl mb-3 sm:mb-4">{preset.icon}</div>
                        <h3 className="text-heading-sm font-semibold mb-2">{preset.name}</h3>
                        <p className="text-body-sm text-subtle leading-relaxed">
                          {preset.description}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                
                {/* Advanced Settings Accordion */}
                <div className="mt-8 pt-8 border-t border-border">
                  <Accordion type="single" collapsible>
                    <AccordionItem value="advanced-settings">
                      <AccordionTrigger className="hover:no-underline text-heading-sm font-medium">
                        Advanced Settings
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-8 pt-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                              <label className="block text-body-sm font-medium mb-3 text-emphasis">
                                Number of Pins: {numberOfPins}
                              </label>
                              <input
                                type="range"
                                min="36"
                                max="360"
                                step="36"
                                value={numberOfPins}
                                onChange={(e) => setNumberOfPins(Number(e.target.value))}
                                disabled={isProcessing}
                                className="w-full"
                              />
                              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                                <span>36 (fast)</span>
                                <span>360 (detailed)</span>
                              </div>
                              <p className="text-body-sm text-subtle mt-2 leading-relaxed">
                                More pins create finer detail but increase processing time.
                              </p>
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium mb-2">
                                Number of Lines: {numberOfLines}
                              </label>
                              <input
                                type="range"
                                min="100"
                                max="4000"
                                step="100"
                                value={numberOfLines}
                                onChange={(e) => setNumberOfLines(Number(e.target.value))}
                                disabled={isProcessing}
                                className="w-full"
                              />
                              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                                <span>100 (light)</span>
                                <span>4000 (dense)</span>
                              </div>
                              <p className="text-xs text-muted-foreground mt-1">
                                More lines create darker, richer results.
                              </p>
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium mb-2">
                                Line Weight: {lineWeight}
                              </label>
                              <input
                                type="range"
                                min="5"
                                max="50"
                                step="5"
                                value={lineWeight}
                                onChange={(e) => setLineWeight(Number(e.target.value))}
                                disabled={isProcessing}
                                className="w-full"
                              />
                              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                                <span>5 (thin)</span>
                                <span>50 (thick)</span>
                              </div>
                              <p className="text-xs text-muted-foreground mt-1">
                                Controls the visual thickness of string lines.
                              </p>
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium mb-2">
                                Canvas Size: {imgSize}px
                              </label>
                              <input
                                type="range"
                                min="200"
                                max="600"
                                step="50"
                                value={imgSize}
                                onChange={(e) => setImgSize(Number(e.target.value))}
                                disabled={isProcessing}
                                className="w-full"
                              />
                              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                                <span>200px (fast)</span>
                                <span>600px (quality)</span>
                              </div>
                              <p className="text-xs text-muted-foreground mt-1">
                                Higher resolution improves quality but takes longer.
                              </p>
                            </div>
                          </div>
                          
                          <div className="bg-muted/50 rounded-lg p-6">
                            <h4 className="text-heading-sm font-medium mb-3 text-brand">💡 Pro Tips</h4>
                            <ul className="text-body-sm text-subtle space-y-2">
                              <li>• Use high contrast images for better definition</li>
                              <li>• Portrait photos work best with 288+ pins</li>
                              <li>• Start with presets, then fine-tune if needed</li>
                              <li>• Large settings may take 30+ seconds to process</li>
                            </ul>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Generate Button */}
          <Button
              onClick={generateArt}
              disabled={!selectedImage || isProcessing}
              size="lg"
              className="w-full px-8 py-6 sm:py-8 text-heading-sm font-semibold min-h-[60px] sm:min-h-[72px] active:scale-[0.98] transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              {isProcessing ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  Generating...
                </div>
              ) : (
                'Generate String Art'
              )}
            </Button>

          {/* Progress Display */}
          {progress && (
            <Card className="glass-effect border-2">
              <CardContent className="p-8">
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-heading-md font-semibold">Generating Your String Art</h3>
                    <span className="text-heading-sm font-medium text-brand">
                      {progress.percentComplete.toFixed(1)}%
                    </span>
                  </div>
                  
                  <Progress value={progress.percentComplete} className="w-full" />
                  
                  <div className="grid grid-cols-2 gap-6 text-body-sm text-subtle">
                    <div className="space-y-1">
                      <div className="text-caption text-emphasis">LINES DRAWN</div>
                      <div className="font-medium">{progress.linesDrawn} / {progress.totalLines}</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-caption text-emphasis">THREAD LENGTH</div>
                      <div className="font-medium">{progress.threadLength.toFixed(2)}″</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Error Display */}
          {error && (
            <Card className="border-destructive bg-destructive/5 border-2">
              <CardContent className="p-6">
                <div className="flex items-start space-x-3">
                  <div className="text-2xl">⚠️</div>
                  <div>
                    <h4 className="text-heading-sm font-medium text-destructive mb-2">Generation Error</h4>
                    <p className="text-body-sm text-destructive/80">{error}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Canvas Results */}
          {(progress || result) && (
            <Card className="card-hover border-2">
              <CardHeader className="pb-6">
                <CardTitle className="text-heading-lg font-semibold">String Art Result</CardTitle>
                <p className="text-body-sm text-subtle mt-2">
                  Your generated string art with mathematical precision and artistic beauty.
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <canvas
                    ref={canvasRef}
                    className="border border-border rounded-lg w-full max-w-md mx-auto block touch-none select-none transition-transform duration-100"
                    style={{ aspectRatio: '1/1' }}
                    onTouchStart={handleCanvasTouch}
                    onTouchEnd={(e) => e.preventDefault()}
                  />
                  
                  {result && (
                    <div className="bg-muted/50 rounded-lg p-6 space-y-4">
                      <h4 className="text-heading-sm font-medium text-emphasis mb-4">Generation Details</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <div className="text-caption text-emphasis">PROCESSING TIME</div>
                          <div className="text-body-sm font-medium">{(result.processingTimeMs / 1000).toFixed(1)}s</div>
                        </div>
                        <div className="space-y-1">
                          <div className="text-caption text-emphasis">TOTAL LINES</div>
                          <div className="text-body-sm font-medium">{result.lineSequence.length}</div>
                        </div>
                        <div className="space-y-1">
                          <div className="text-caption text-emphasis">THREAD LENGTH</div>
                          <div className="text-body-sm font-medium">{result.totalThreadLength.toFixed(2)}″</div>
                        </div>
                        <div className="space-y-1">
                          <div className="text-caption text-emphasis">ANCHOR PINS</div>
                          <div className="text-body-sm font-medium">{result.parameters.numberOfPins}</div>
                        </div>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row gap-3 pt-6">
                        <Button 
                          variant="outline" 
                          className="flex-1 min-h-[52px] text-body-sm font-medium active:scale-[0.98] transition-all duration-200"
                          onClick={handleDownload}
                        >
                          <span className="mr-2">📥</span>
                          Download PNG
                        </Button>
                        <Button 
                          variant="outline" 
                          className="flex-1 min-h-[52px] text-body-sm font-medium active:scale-[0.98] transition-all duration-200"
                          onClick={handleTryAgain}
                        >
                          <span className="mr-2">🔄</span>
                          Create New
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
            </div>
          </div>
        </div>

        {/* Visual Separator */}
        <div className="w-full py-8">
          <div className="container-apple">
            <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent"></div>
          </div>
        </div>


        {/* Gallery Section */}
        <GallerySection />

        {/* Tutorial Section */}
        <TutorialSection />

        {/* FAQ Section */}
        <FAQSection />
      </main>

      {/* Floating Actions */}
      <FloatingActions 
        onScrollToTop={handleScrollToTop}
        onShowHelp={() => handleNavigation('faq')}
      />

    </div>
  )
}

export default App