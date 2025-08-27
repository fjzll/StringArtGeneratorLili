import { useState, useRef } from 'react'
import { generateStringArt } from './lib/algorithms/stringArtEngine'
import type { StringArtResult, OptimizationProgress } from './types'

function App() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [result, setResult] = useState<StringArtResult | null>(null)
  const [progress, setProgress] = useState<OptimizationProgress | null>(null)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  
  // Parameters that user can adjust - set to original backup defaults
  const [numberOfPins, setNumberOfPins] = useState(288)
  const [numberOfLines, setNumberOfLines] = useState(4000)
  const [lineWeight, setLineWeight] = useState(20)
  const [imgSize, setImgSize] = useState(500)

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      setSelectedImage(e.target?.result as string)
      setResult(null)
      setError(null)
    }
    reader.readAsDataURL(file)
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
              minDistance: Math.max(2, Math.floor(numberOfPins / 36)), // Dynamic based on pins
              imgSize,
            },
            (progressUpdate) => {
              setProgress(progressUpdate)
            }
          )

          setResult(stringArtResult)
          drawResult(stringArtResult)
        } catch (error) {
          console.error('Generation failed:', error)
          setError(error instanceof Error ? error.message : 'Unknown error occurred')
        } finally {
          setIsProcessing(false)
        }
      }
      img.src = selectedImage
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to process image')
      setIsProcessing(false)
    }
  }

  const drawResult = (result: StringArtResult) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')!
    canvas.width = 600
    canvas.height = 600

    // Clear canvas with white background
    ctx.fillStyle = 'white'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Match original scaling: SCALE = 20 in original, but we adapt to canvas size
    const scale = canvas.width / result.parameters.imgSize
    const center = canvas.width / 2

    // Draw circle boundary (lighter)
    ctx.strokeStyle = '#eee'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.arc(center, center, (canvas.width / 2) - 5, 0, Math.PI * 2)
    ctx.stroke()

    // Draw string lines with balanced opacity
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.15)' // Reduced from 0.4 to 0.15 - much lighter
    ctx.lineWidth = 1.0 // Reduced from 1.5 to 1.0
    ctx.lineCap = 'round' // Smoother line endings
    ctx.lineJoin = 'round'
    
    // Use source-over for normal blending (no multiply - that was too dark)
    ctx.globalCompositeOperation = 'source-over'
    
    for (let i = 0; i < result.lineSequence.length - 1; i++) {
      const pin1 = result.pinCoordinates[result.lineSequence[i]]
      const pin2 = result.pinCoordinates[result.lineSequence[i + 1]]
      
      ctx.beginPath()
      ctx.moveTo(pin1[0] * scale, pin1[1] * scale)
      ctx.lineTo(pin2[0] * scale, pin2[1] * scale)
      ctx.stroke()
    }

    // Draw pins (smaller and less prominent)
    ctx.fillStyle = 'rgba(255, 0, 0, 0.6)'
    result.pinCoordinates.forEach(([x, y]) => {
      ctx.beginPath()
      ctx.arc(x * scale, y * scale, 1.5, 0, Math.PI * 2)
      ctx.fill()
    })
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
          String Art Generator - Phase 1 Test
        </h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">Upload Image</h2>
            
            <div className="space-y-4">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              
              {selectedImage && (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                  <img 
                    src={selectedImage} 
                    alt="Selected" 
                    className="max-w-full h-auto mx-auto max-h-64 object-contain"
                  />
                </div>
              )}
              
              {/* Parameter Controls */}
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <h3 className="font-semibold text-gray-700">Generation Parameters</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
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
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>36</span>
                      <span>360</span>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
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
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>100</span>
                      <span>4000</span>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
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
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>5</span>
                      <span>50</span>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Image Size: {imgSize}px
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
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>200</span>
                      <span>600</span>
                    </div>
                  </div>
                </div>
                
                <div className="text-xs text-gray-600 bg-white rounded p-2">
                  <strong>Tips:</strong> More pins = finer detail, more lines = darker result, higher weight = stronger lines.
                  Higher values increase processing time.
                </div>
              </div>
              
              <button
                onClick={generateArt}
                disabled={!selectedImage || isProcessing}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
              >
                {isProcessing ? 'Generating...' : 'Generate String Art'}
              </button>
              
              {progress && (
                <div className="bg-gray-100 rounded-lg p-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Progress: {progress.percentComplete.toFixed(1)}%</span>
                    <span>{progress.linesDrawn} / {progress.totalLines} lines</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${progress.percentComplete}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Thread length: {progress.threadLength.toFixed(2)} inches
                  </p>
                </div>
              )}
              
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              )}
            </div>
          </div>

          {/* Output Section */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">String Art Result</h2>
            
            <canvas
              ref={canvasRef}
              className="border border-gray-300 rounded-lg w-full max-w-md mx-auto"
              style={{ aspectRatio: '1/1' }}
            />
            
            {result && (
              <div className="mt-4 space-y-2 text-sm text-gray-600">
                <p><strong>Processing time:</strong> {(result.processingTimeMs / 1000).toFixed(1)}s</p>
                <p><strong>Total lines:</strong> {result.lineSequence.length}</p>
                <p><strong>Thread length:</strong> {result.totalThreadLength.toFixed(2)} inches</p>
                <p><strong>Pins used:</strong> {result.parameters.numberOfPins}</p>
              </div>
            )}
          </div>
        </div>
        
        <div className="mt-8 bg-blue-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-800 mb-2">Phase 1 Test Interface</h3>
          <p className="text-blue-700 text-sm">
            This is a basic test interface to demonstrate the extracted algorithms from Phase 1. 
            Upload an image and click "Generate String Art" to see the algorithms in action. 
            The processing uses reduced parameters for faster testing.
          </p>
        </div>
      </div>
    </div>
  )
}

export default App
