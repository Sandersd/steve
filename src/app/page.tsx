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
      {!experienceStarted && (
        <ExperienceLoader 
          onStartExperience={handleStartExperience}
          modelsLoaded={modelsLoaded}
        />
      )}
      
      {experienceStarted && (
        <div data-page="steve-fish">
          {/* Fixed Header */}
          <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
            <nav style={{background: 'rgba(217, 134, 22, 0.9)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(217, 134, 22, 0.3)'}}>
              <div className="max-w-7xl mx-auto px-6">
                <div className="flex items-center justify-between h-16">
                  {/* Logo */}
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{background: 'var(--steve-orange-bright)'}}>
                      <span className="text-2xl font-bold text-white">S</span>
                    </div>
                    <span className="text-2xl font-bold text-white">Steve le Poisson</span>
                  </div>

                  {/* Navigation */}
                  <div className="hidden md:flex items-center space-x-8">
                    <a href="#dance" className="text-white/80 hover:text-white transition-colors text-sm font-medium">
                      Dance Moves
                    </a>
                    <a href="#features" className="text-white/80 hover:text-white transition-colors text-sm font-medium">
                      About Steve
                    </a>
                    <a href="#memes" className="text-white/80 hover:text-white transition-colors text-sm font-medium">
                      Memes
                    </a>
                    <a href="#music" className="text-white/80 hover:text-white transition-colors text-sm font-medium">
                      Music
                    </a>
                  </div>

                  {/* Fun Status */}
                  <div className="flex items-center space-x-4">
                    <div className="hidden sm:flex items-center space-x-2 px-3 py-1 rounded-full" style={{background: 'rgba(255, 255, 255, 0.2)'}}>
                      <div className="w-2 h-2 rounded-full animate-bounce" style={{background: 'var(--steve-orange-bright)'}}></div>
                      <span className="text-white text-xs font-medium">Steve is Dancing!</span>
                    </div>
                  </div>
                </div>
              </div>
            </nav>
          </header>
          
          {/* Audio Player */}
          <AudioPlayer 
            src="/steve.mp3"
            autoPlay={shouldAutoPlay}
            loop={true}
            volume={0.15}
            onAudioRef={handleAudioRef}
          />
          
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
                <div className="inline-flex items-center px-6 py-3 backdrop-blur-sm border border-white/20 rounded-full text-sm mb-8" style={{background: 'rgba(217, 134, 22, 0.3)'}}>
                  <span className="font-bold">Le Poisson Qui Danse</span>
                </div>
                <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
                  Steve le Poisson
                </h1>
                <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed">
                  Il est orange, il a des bras et des jambes!<br />
                  Watch Steve dance with 120 musical particles in this meme-tastic experience!
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button className="px-8 py-4 text-white rounded-xl transition-all transform hover:scale-105 font-bold shadow-2xl pointer-events-auto text-lg" style={{background: 'linear-gradient(to right, var(--steve-orange-bright), var(--steve-orange-light))'}}>
                    Watch Steve Dance
                  </button>
                </div>
              </div>
            </div>

            {/* Side Panel - Steve's Stats */}
            <div id="sidePanel" className="absolute right-8 top-1/2 -translate-y-1/2 w-80 backdrop-blur-md border rounded-xl p-6 z-30 opacity-0" style={{background: 'rgba(217, 134, 22, 0.9)', borderColor: 'rgba(255, 255, 255, 0.3)'}}>
              <div className="flex items-center mb-4">
                <span className="text-white font-bold">Steve's Dance Stats</span>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-white/80 text-sm">Dance Power</span>
                  <span className="text-white font-bold text-sm">MAXIMUM!</span>
                </div>
                <div className="w-full rounded-full h-2" style={{background: 'rgba(255, 255, 255, 0.2)'}}>
                  <div className="h-2 rounded-full animate-pulse" style={{background: 'linear-gradient(to right, var(--steve-orange-bright), var(--steve-orange-light))', width: '100%'}}></div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-white/80 text-sm">Orangeness</span>
                  <span className="text-white font-bold text-sm">Ultra Orange</span>
                </div>
                <div className="w-full rounded-full h-2" style={{background: 'rgba(255, 255, 255, 0.2)'}}>
                  <div className="h-2 rounded-full" style={{background: 'var(--steve-orange)', width: '100%'}}></div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-white/80 text-sm">Musical Vibes</span>
                  <span className="text-white font-bold text-sm">Pa-la-la!</span>
                </div>
                <div className="w-full rounded-full h-2" style={{background: 'rgba(255, 255, 255, 0.2)'}}>
                  <div className="h-2 rounded-full animate-pulse" style={{background: 'linear-gradient(to right, var(--steve-orange), var(--steve-orange-bright))', width: '95%'}}></div>
                </div>
              </div>
              
              <div className="mt-6 p-3 border rounded-lg" style={{background: 'rgba(255, 255, 255, 0.1)', borderColor: 'rgba(255, 255, 255, 0.3)'}}>
                <div className="flex items-center">
                  <span className="text-white text-sm font-medium">Steve is très beau!</span>
                </div>
              </div>
            </div>

            {/* Left Panel - Additional card */}
            <div id="leftPanel" className="absolute left-8 top-1/3 w-72 backdrop-blur-md border rounded-xl p-6 z-30 opacity-0" style={{background: 'rgba(217, 134, 22, 0.9)', borderColor: 'rgba(255, 255, 255, 0.3)'}}>
              <div className="mb-4">
                <span className="text-white font-bold">Steve's Features</span>
              </div>
              <div className="space-y-3">
                <div className="p-3 border rounded-lg" style={{background: 'rgba(255, 255, 255, 0.1)', borderColor: 'rgba(255, 255, 255, 0.3)'}}>
                  <h4 className="text-white font-medium text-sm mb-1">Il est orange!</h4>
                  <p className="text-white/70 text-xs">The most perfectly orange fish you've ever seen</p>
                </div>
                <div className="p-3 border rounded-lg" style={{background: 'rgba(255, 255, 255, 0.1)', borderColor: 'rgba(255, 255, 255, 0.3)'}}>
                  <h4 className="text-white font-medium text-sm mb-1">Il a des bras et des jambes!</h4>
                  <p className="text-white/70 text-xs">Unlike regular fish, Steve has arms and legs</p>
                </div>
                <div className="p-3 border rounded-lg" style={{background: 'rgba(255, 255, 255, 0.1)', borderColor: 'rgba(255, 255, 255, 0.3)'}}>
                  <h4 className="text-white font-medium text-sm mb-1">Magical Powers!</h4>
                  <p className="text-white/70 text-xs">Can swim on land AND walk in water</p>
                </div>
              </div>
            </div>

            {/* Bottom Panel - Final card with lyrics */}
            <div id="bottomPanel" className="absolute bottom-8 left-1/2 -translate-x-1/2 w-96 backdrop-blur-md border rounded-xl p-6 z-30 opacity-0" style={{background: 'rgba(217, 134, 22, 0.9)', borderColor: 'rgba(255, 255, 255, 0.3)'}}>
              <div className="text-center">
                <h3 className="text-white font-bold mb-4">Steve's Song</h3>
                <div className="text-lg text-white/90 font-mono animate-bounce mb-3">
                  🎵 Pa-la-la, pa-la-la 🎵
                </div>
                <div className="text-sm text-white/80 mb-2">
                  La-la, la-la, la-la-la ♪
                </div>
                <p className="text-white/70 text-xs italic">
                  Steve's dancing is 100% organic and meme-powered
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}