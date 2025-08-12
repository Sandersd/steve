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
  const [loadingText, setLoadingText] = useState('Initializing Steve...')
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
          setLoadingText('Steve is almost ready to dance!')
          return 90
        } else {
          // Normal loading progression
          const texts = [
            'Initializing Steve...',
            'Teaching Steve to dance...',
            'Loading orange particles...',
            'Preparing Pa-la-la music...',
            'Steve is getting ready...'
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
    <div className={`fixed inset-0 z-50 flex items-center justify-center ${className}`} style={{background: 'linear-gradient(135deg, var(--steve-dark-brown), var(--steve-orange-dark))'}}>
      <div className="text-center px-6">
        {/* Minimal Logo */}
        <div className="mb-12">
          <h1 className="text-5xl font-bold text-white mb-3">STEVE</h1>
        </div>

        {!showStartButton ? (
          <>
            {/* Minimal Loading */}
            <div className="mb-8">
              <div className="w-48 h-1 rounded-full mx-auto mb-6 overflow-hidden" style={{background: 'var(--steve-dark-brown)'}}>
                <div 
                  className="h-full rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${loadingProgress}%`, background: 'var(--steve-orange)' }}
                />
              </div>
              <p className="text-sm" style={{color: 'var(--steve-cream)'}}>{loadingText}</p>
            </div>
          </>
        ) : (
          <>
            {/* Start Button */}
            <div className="mb-8">
              <button
                onClick={onStartExperience}
                className="px-12 py-4 rounded-lg transition-all transform hover:scale-105 font-semibold text-lg"
                style={{background: 'var(--steve-orange)', color: 'white'}}
                onMouseEnter={(e) => e.target.style.background = 'var(--steve-orange-bright)'}
                onMouseLeave={(e) => e.target.style.background = 'var(--steve-orange)'}
              >
🐟 Enter Steve's World 🕺
              </button>
            </div>
          </>
        )}

      </div>
    </div>
  )
}