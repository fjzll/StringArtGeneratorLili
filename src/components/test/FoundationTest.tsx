import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Progress } from "@/components/ui/progress"
import { useState } from "react"
import { ContentTest } from "./ContentTest"

export function FoundationTest() {
  const [sliderValue, setSliderValue] = useState([50])
  const [progress] = useState(75)

  return (
    <div className="p-8 max-w-2xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-center">Phase 2A Foundation Test</h1>
      
      {/* Test Apple-style Typography */}
      <div className="text-center space-y-2">
        <p className="text-lg text-muted-foreground">
          Testing Apple-style design system and shadcn/ui components
        </p>
      </div>

      {/* Test Card Component */}
      <Card className="card-hover">
        <CardHeader>
          <CardTitle>shadcn/ui Components Test</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          
          {/* Test Button Components */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Button Variants:</h3>
            <div className="flex flex-wrap gap-2">
              <Button variant="default" className="button-press">Default</Button>
              <Button variant="secondary" className="button-press">Secondary</Button>
              <Button variant="outline" className="button-press">Outline</Button>
              <Button variant="ghost" className="button-press">Ghost</Button>
            </div>
            
            {/* Debug: Test basic Tailwind classes */}
            <div className="mt-4 p-2 border-2 border-dashed border-gray-300">
              <p className="text-xs text-gray-500 mb-2">Debug: Basic Tailwind Test</p>
              <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors">
                Basic Tailwind Button
              </button>
              <button className="ml-2 bg-gray-200 text-gray-800 px-4 py-2 rounded border border-gray-300 hover:bg-gray-300">
                Basic Gray Button
              </button>
            </div>
          </div>

          {/* Test Slider Component */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Slider: {sliderValue[0]}</h3>
            <div className="w-full">
              <Slider
                value={sliderValue}
                onValueChange={setSliderValue}
                max={100}
                step={1}
                className="w-full"
              />
              {/* Fallback HTML slider for testing */}
              <div className="mt-2">
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={sliderValue[0]}
                  onChange={(e) => setSliderValue([parseInt(e.target.value)])}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${sliderValue[0]}%, #e5e7eb ${sliderValue[0]}%, #e5e7eb 100%)`
                  }}
                />
                <div className="text-xs text-gray-500 mt-1">
                  ↑ HTML slider (backup) - Value: {sliderValue[0]}
                </div>
              </div>
            </div>
          </div>

          {/* Test Progress Component */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Progress: {progress}%</h3>
            <Progress value={progress} className="w-full" />
          </div>

        </CardContent>
      </Card>

      {/* Test Design System Classes */}
      <Card className="glass-effect">
        <CardContent className="pt-6">
          <h3 className="font-medium mb-2">Design System Test:</h3>
          <ul className="space-y-1 text-sm text-muted-foreground">
            <li>✅ Apple-style system fonts</li>
            <li>✅ CSS custom properties</li>
            <li>✅ Tailwind CSS integration</li>
            <li>✅ Glass effect utility</li>
            <li>✅ Card hover animations</li>
            <li>✅ Button press effects</li>
          </ul>
        </CardContent>
      </Card>

      {/* Content Infrastructure Test */}
      <ContentTest />

    </div>
  )
}