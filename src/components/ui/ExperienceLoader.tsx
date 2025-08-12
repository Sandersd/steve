'use client'

import { useEffect, useState } from 'react'

interface ExperienceLoaderProps {
  onStartExperience: () => void
  modelsLoaded?: boolean
  className?: string
}

export default function ExperienceLoader({ 
  onStartExperience, 
  modelsLoaded = false,
  className = ''
}: ExperienceLoaderProps) {
  const [loadingProgress, setLoadingProgress] = useState(0)
  const [loadingText, setLoadingText] = useState('Initializing 3D Studio...')
  const [showStartButton, setShowStartButton] = useState(false)

  // Simulate loading progress
  useEffect(() => {
    const interval = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev >= 90 && modelsLoaded) {
          // Models are loaded, complete the progress
          clearInterval(interval)
          setLoadingText('Experience ready!')
          setTimeout(() => setShowStartButton(true), 500)
          return 100
        } else if (prev >= 90) {
          // Waiting for models
          setLoadingText('Loading 3D models...')
          return 90
        } else {
          // Normal loading progression
          const texts = [
            'Initializing 3D Studio...',
            'Loading shaders...',
            'Preparing audio system...',
            'Setting up materials...',
            'Loading 3D models...'
          ]
          const textIndex = Math.floor((prev / 100) * texts.length)
          setLoadingText(texts[textIndex] || texts[texts.length - 1])
          return prev + (Math.random() * 15) + 5
        }
      })
    }, 150)

    return () => clearInterval(interval)
  }, [modelsLoaded])

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center bg-slate-900 ${className}`}>
      <div className="text-center px-6">
        {/* Minimal Logo */}
        <div className="mb-12">
          <h1 className="text-5xl font-bold text-white mb-3">3D Studio</h1>
        </div>

        {!showStartButton ? (
          <>
            {/* Minimal Loading */}
            <div className="mb-8">
              <div className="w-48 h-1 bg-slate-800 rounded-full mx-auto mb-6 overflow-hidden">
                <div 
                  className="h-full bg-white rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${loadingProgress}%` }}
                />
              </div>
              <p className="text-slate-400 text-sm">{loadingText}</p>
            </div>
          </>
        ) : (
          <>
            {/* Start Button */}
            <div className="mb-8">
              <button
                onClick={onStartExperience}
                className="px-12 py-4 bg-white text-slate-900 rounded-lg hover:bg-slate-100 transition-all transform hover:scale-105 font-semibold text-lg"
              >
                Enter
              </button>
            </div>
          </>
        )}

      </div>
    </div>
  )
}