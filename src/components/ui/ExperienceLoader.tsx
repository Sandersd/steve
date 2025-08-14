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
    <div className={`fixed inset-0 z-50 flex items-center justify-center ${className}`} style={{background: 'linear-gradient(135deg, var(--steve-orange), var(--steve-orange-bright))'}}>
      <div className="text-center px-6">
        {/* Cartoon-y Logo */}
        <div className="mb-12">
          <h1 className="text-5xl font-bold text-white mb-3" style={{
            fontFamily: 'var(--font-orbitron)',
            textShadow: '3px 3px 0px #916332, 6px 6px 0px rgba(0,0,0,0.3)',
            letterSpacing: '0.05em'
          }}>LE POISSON STEVE</h1>
        </div>

        {/* Fixed height container to prevent jumping */}
        <div className="h-32 flex flex-col justify-center">
          {!showStartButton ? (
            <>
              {/* Stylized Loading */}
              <div className="mb-8">
                <div className="w-48 h-3 rounded-full mx-auto mb-6 overflow-hidden border-2" style={{
                  background: 'rgba(145, 99, 50, 0.3)',
                  borderColor: '#916332'
                }}>
                  <div 
                    className="h-full rounded-full transition-all duration-300 ease-out"
                    style={{ 
                      width: `${loadingProgress}%`, 
                      background: 'linear-gradient(90deg, #FFE66D, #FF9A1F)',
                      boxShadow: '0 0 10px rgba(255,154,31,0.5)'
                    }}
                  />
                </div>
                <p className="text-sm font-medium" style={{
                  color: '#FFF8E1',
                  textShadow: '1px 1px 0px #916332'
                }}>{loadingText}</p>
              </div>
            </>
          ) : (
            <>
              {/* Start Button */}
              <div className="mb-8">
                <button
                  onClick={onStartExperience}
                  className="px-12 py-4 rounded-xl transition-all transform hover:scale-110 font-bold text-lg border-2 border-yellow-300"
                  style={{
                    background: 'linear-gradient(45deg, var(--steve-orange-bright), var(--steve-orange-light), #FFE66D)',
                    color: 'white',
                    textShadow: '2px 2px 0px #916332',
                    boxShadow: '0 8px 25px rgba(255,154,31,0.4), inset 0 2px 4px rgba(255,255,255,0.3)'
                  }}
                >
                  Dance with Steve
                </button>
              </div>
            </>
          )}
        </div>

      </div>
    </div>
  )
}