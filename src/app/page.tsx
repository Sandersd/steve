'use client'

import SteveExperienceCanvas from '@/components/three/SteveExperienceCanvas'
import AudioPlayer from '@/components/ui/AudioPlayer'
import ExperienceLoader from '@/components/ui/ExperienceLoader'
import { useAudioAnalyzer } from '@/hooks/useAudioAnalyzer'
import { useModelsReady } from '@/hooks/useModelLoader'
import { useResponsiveThree } from '@/hooks/useThreePerformance'
import { Suspense, useCallback, useState } from 'react'

export default function Home() {
  const { deviceTier, settings } = useResponsiveThree()
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null)
  const [experienceStarted, setExperienceStarted] = useState(false)
  const [shouldAutoPlay, setShouldAutoPlay] = useState(false)
  
  // Track model loading
  const modelsLoaded = useModelsReady(['/models/Steve-walk.glb'])
  
  // Audio analysis hook
  const { audioData, isPlaying } = useAudioAnalyzer({ 
    audioElement,
    fftSize: 512,
    beatThreshold: 0.08
  })

  const handleAudioRef = useCallback((audio: HTMLAudioElement | null) => {
    setAudioElement(audio)
  }, [])

  const handleStartExperience = useCallback(() => {
    console.log('🐟 Starting Steve the Dancing Fish experience!')
    setExperienceStarted(true)
    setShouldAutoPlay(true)
  }, [])

  return (
    <>
      {/* Audio Player - Always available for immediate playback */}
      <AudioPlayer 
        src="/steve.mp3"
        autoPlay={shouldAutoPlay}
        loop={true}
        volume={0.15}
        onAudioRef={handleAudioRef}
      />
      
      {/* Always render the experience in background for instant model loading */}
      <div style={{ visibility: experienceStarted ? 'visible' : 'hidden' }}>
        <div data-page="steve-fish">
          
          {/* Main WebGL Experience - Pinned Section */}
          <div className="experience-container">
            <Suspense 
              fallback={
                <div className="absolute inset-0 flex items-center justify-center" style={{background: 'linear-gradient(135deg, var(--steve-orange), var(--steve-orange-bright))'}}>
                  <div className="flex flex-col items-center space-y-4">
                    <div className="text-4xl animate-bounce">🐟</div>
                    <div className="text-white text-sm">Steve is getting ready to dance...</div>
                  </div>
                </div>
              }
            >
              <SteveExperienceCanvas
                performance={{
                  enableShadows: settings.shadows,
                  antialias: settings.antialias,
                  pixelRatio: settings.pixelRatio,
                  shadowMapSize: settings.shadowMapSize
                }}
                audioData={audioData}
                isAudioPlaying={isPlaying}
              />
            </Suspense>

            {/* Hero Copy - Fades out early */}
            <div id="heroCopy" className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
              <div className="text-center text-white px-6">
                <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight transform hover:scale-105 transition-transform duration-300" style={{
                  fontFamily: 'var(--font-orbitron)', 
                  letterSpacing: '0.05em', 
                  textShadow: '3px 3px 0px #916332, 6px 6px 0px rgba(0,0,0,0.3), 0 0 20px rgba(255,154,31,0.5)',
                  background: 'linear-gradient(45deg, #FFE66D, #FF9A1F, #D98616)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}>
                  LE POISSON STEVE
                </h1>
              </div>
            </div>

            {/* Big Text: "HE IS ORAAAANGE" */}
            <div id="orangeText" className="absolute left-1/2 -translate-x-1/2 top-1/4 z-30 opacity-0 transform rotate-1" style={{pointerEvents: 'none'}}>
              <h2 className="text-6xl md:text-8xl font-black leading-none text-center transform hover:scale-105 transition-transform duration-500" style={{
                fontFamily: 'var(--font-orbitron)',
                background: 'linear-gradient(45deg, #FF6B35, #FF9A1F, #FFE66D, #FF9A1F)',
                backgroundSize: '300% 100%',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                textShadow: '4px 4px 0px #916332, 8px 8px 0px rgba(0,0,0,0.3)',
                letterSpacing: '0.02em',
                animation: 'subtle-bounce 1.5s ease-in-out infinite, rainbow-shimmer 2s ease-in-out infinite'
              }}>
                HE IS<br />ORAAAANGE
              </h2>
            </div>

            {/* Big Text: "HE HAS ARMS" */}
            <div id="armsText" className="absolute right-8 top-1/3 z-30 opacity-0 transform rotate-3" style={{pointerEvents: 'none'}}>
              <h2 className="text-6xl md:text-8xl font-black leading-none transform hover:scale-105 transition-transform duration-500" style={{
                fontFamily: 'var(--font-orbitron)',
                background: 'linear-gradient(45deg, #FFE66D, #FF9A1F, #D98616)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                textShadow: '4px 4px 0px #916332, 8px 8px 0px rgba(0,0,0,0.3)',
                letterSpacing: '0.02em',
                animation: 'subtle-bounce 1.8s ease-in-out infinite, gentle-float 2.5s ease-in-out infinite'
              }}>
                HE HAS<br />ARMS
              </h2>
            </div>

            {/* Big Text: "AND LEGS" */}
            <div id="legsText" className="absolute left-8 top-1/2 z-30 opacity-0 transform -rotate-2" style={{pointerEvents: 'none'}}>
              <h2 className="text-6xl md:text-8xl font-black leading-none transform hover:scale-105 transition-transform duration-500" style={{
                fontFamily: 'var(--font-orbitron)',
                background: 'linear-gradient(135deg, #FF9A1F, #FFE66D, #F7931E)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                textShadow: '4px 4px 0px #916332, 8px 8px 0px rgba(0,0,0,0.3)',
                letterSpacing: '0.02em',
                animation: 'subtle-wiggle 2s ease-in-out infinite, gentle-float 2.2s ease-in-out infinite'
              }}>
                AND<br />LEGS
              </h2>
            </div>

            {/* Big Text: "PA-LA-LA" */}
            <div id="palalalaText" className="absolute bottom-16 left-1/2 -translate-x-1/2 z-30 opacity-0 transform rotate-1" style={{pointerEvents: 'none'}}>
              <div className="text-center">
                <h2 className="text-7xl md:text-9xl font-black leading-none transform hover:scale-105 transition-transform duration-500" style={{
                  fontFamily: 'var(--font-orbitron)',
                  background: 'linear-gradient(90deg, #FFE66D, #FF9A1F, #FFE66D, #F7931E)',
                  backgroundSize: '300% 100%',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  textShadow: '5px 5px 0px #916332, 10px 10px 0px rgba(0,0,0,0.3)',
                  letterSpacing: '0.05em',
                  animation: 'rainbow-shimmer 1.5s ease-in-out infinite, gentle-pulse 2s ease-in-out infinite, gentle-float 2.5s ease-in-out infinite'
                }}>
                  PA-LA-LA
                </h2>
                <h3 className="text-4xl md:text-5xl font-bold mt-2 transform hover:scale-105 transition-transform duration-500" style={{
                  fontFamily: 'var(--font-orbitron)',
                  background: 'linear-gradient(90deg, #FF9A1F, #FFE66D, #FF9A1F)',
                  backgroundSize: '200% 100%',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  textShadow: '3px 3px 0px #916332, 6px 6px 0px rgba(0,0,0,0.2)',
                  letterSpacing: '0.03em',
                  animation: 'rainbow-shimmer 1.8s ease-in-out infinite, gentle-float 2.2s ease-in-out infinite'
                }}>
                  pa-la-la
                </h3>
              </div>
            </div>

            {/* Made with love by LooksGoodLabs */}
            <div className="absolute bottom-4 left-4 z-30" style={{pointerEvents: 'auto'}}>
              <a 
                href="https://looksgoodlabs.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-white/70 hover:text-white transition-colors text-sm font-medium"
                style={{
                  fontFamily: 'var(--font-space-grotesk)',
                  textShadow: '1px 1px 0px rgba(0,0,0,0.5)'
                }}
              >
                Made with ❤️ by LooksGoodLabs
              </a>
            </div>
          </div>
        </div>
      </div>
      
      {!experienceStarted && (
        <ExperienceLoader 
          onStartExperience={handleStartExperience}
          modelsLoaded={modelsLoaded}
        />
      )}
    </>
  )
}