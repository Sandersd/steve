'use client'

import { useEffect, useRef, useState, useCallback } from 'react'

interface AudioData {
  volume: number
  bass: number
  mid: number
  treble: number
  frequencies: Uint8Array
  beat: boolean
  beatStrength: number
}

interface UseAudioAnalyzerProps {
  audioElement?: HTMLAudioElement | null
  fftSize?: number
  beatThreshold?: number
}

export function useAudioAnalyzer({
  audioElement,
  fftSize = 256,
  beatThreshold = 0.3
}: UseAudioAnalyzerProps = {}) {
  const [audioData, setAudioData] = useState<AudioData>({
    volume: 0,
    bass: 0,
    mid: 0,
    treble: 0,
    frequencies: new Uint8Array(0),
    beat: false,
    beatStrength: 0
  })
  
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  
  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null)
  const dataArrayRef = useRef<Uint8Array | null>(null)
  const animationFrameRef = useRef<number | null>(null)
  
  // Beat detection variables
  const lastBeatTimeRef = useRef<number>(0)
  const energyHistoryRef = useRef<number[]>([])

  const initializeAudioContext = useCallback(async () => {
    if (!audioElement || audioContextRef.current) return
    
    try {
      // Create audio context
      const audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
      audioContextRef.current = audioContext
      
      // Create analyser
      const analyser = audioContext.createAnalyser()
      analyser.fftSize = fftSize
      analyser.smoothingTimeConstant = 0.3 // Much more responsive (was 0.8)
      analyserRef.current = analyser
      
      // Create source and connect
      const source = audioContext.createMediaElementSource(audioElement)
      sourceRef.current = source
      
      source.connect(analyser)
      analyser.connect(audioContext.destination)
      
      // Create data array
      const dataArray = new Uint8Array(analyser.frequencyBinCount)
      dataArrayRef.current = dataArray
      
      setIsAnalyzing(true)
      console.log('Audio analyzer initialized')
    } catch (error) {
      console.error('Failed to initialize audio analyzer:', error)
    }
  }, [audioElement, fftSize])

  const analyze = useCallback(() => {
    if (!analyserRef.current || !dataArrayRef.current) {
      console.log('🚨 useAudioAnalyzer: analyze() called but missing dependencies', {
        hasAnalyser: !!analyserRef.current,
        hasDataArray: !!dataArrayRef.current
      })
      return
    }
    
    const analyser = analyserRef.current
    const dataArray = dataArrayRef.current
    
    // Get frequency data
    const tempArray = new Uint8Array(dataArray.length)
    analyser.getByteFrequencyData(tempArray)
    dataArray.set(tempArray)
    
    // Debug: Log that we're actually analyzing (disabled for performance)
    // if (Math.random() < 0.01) {
    //   console.log('🔍 useAudioAnalyzer: analyze() running', { bufferLength: dataArray.length })
    // }
    
    // Calculate frequency bands with better separation
    const bufferLength = dataArray.length
    const bassEnd = Math.floor(bufferLength * 0.15) // 0-15% for more bass sensitivity
    const midEnd = Math.floor(bufferLength * 0.6)   // 15-60% for broader mid range
    // Treble is 60-100%
    
    let bass = 0, mid = 0, treble = 0, total = 0
    
    // Bass frequencies (amplified for more responsiveness)
    for (let i = 0; i < bassEnd; i++) {
      bass += dataArray[i]
    }
    bass = (bass / bassEnd / 255) * 2.5 // Amplify bass response
    bass = Math.min(bass, 1) // Cap at 1
    
    // Mid frequencies (amplified)
    for (let i = bassEnd; i < midEnd; i++) {
      mid += dataArray[i]
    }
    mid = (mid / (midEnd - bassEnd) / 255) * 2.0 // Amplify mid response
    mid = Math.min(mid, 1) // Cap at 1
    
    // Treble frequencies (amplified)
    for (let i = midEnd; i < bufferLength; i++) {
      treble += dataArray[i]
    }
    treble = (treble / (bufferLength - midEnd) / 255) * 2.5 // Amplify treble response
    treble = Math.min(treble, 1) // Cap at 1
    
    // Overall volume (amplified for better responsiveness)
    for (let i = 0; i < bufferLength; i++) {
      total += dataArray[i]
    }
    const volume = Math.min((total / bufferLength / 255) * 2.0, 1) // Amplify and cap volume
    
    // Beat detection algorithm
    const currentTime = Date.now()
    const energy = bass * 2 + mid + treble * 0.5 // Weight bass more for beat detection
    
    // Store energy history for beat detection (shorter history for more responsive beats)
    energyHistoryRef.current.push(energy)
    if (energyHistoryRef.current.length > 20) { // ~20 frames ≈ 0.33 seconds at 60fps - much more responsive
      energyHistoryRef.current.shift()
    }
    
    // Calculate average energy over recent history
    const averageEnergy = energyHistoryRef.current.reduce((a, b) => a + b, 0) / energyHistoryRef.current.length
    const variance = energyHistoryRef.current.reduce((acc, val) => acc + Math.pow(val - averageEnergy, 2), 0) / energyHistoryRef.current.length
    const threshold = (-0.0025714 * variance) + 1.5142857 // Dynamic threshold
    
    // Detect beat
    let beat = false
    let beatStrength = 0
    
    if (energy > threshold && energy > averageEnergy * (1 + beatThreshold)) {
      // Check if enough time has passed since last beat (prevent double triggers)
      if (currentTime - lastBeatTimeRef.current > 100) { // Minimum 100ms between beats (was 200ms) - more frequent beats
        beat = true
        beatStrength = Math.min((energy - averageEnergy) / averageEnergy, 1)
        lastBeatTimeRef.current = currentTime
      }
    }
    
    // Update audio data
    const newAudioData = {
      volume,
      bass,
      mid,
      treble,
      frequencies: new Uint8Array(dataArray), // Create a copy
      beat,
      beatStrength
    }
    
    setAudioData(newAudioData)
    
    // Debug: Log when we have significant audio data (disabled for performance)
    // if (volume > 0.01 && Math.random() < 0.01) {
    //   console.log('🎧 useAudioAnalyzer: Generated audio data', { volume: volume.toFixed(3), beat })
    // }
    
    // Continue analyzing
    animationFrameRef.current = requestAnimationFrame(analyze)
  }, [beatThreshold])

  // Start analysis when audio plays
  useEffect(() => {
    if (!audioElement) return
    
    const updatePlayingState = () => {
      // Audio is considered "playing" if it's not paused AND not muted
      const isActuallyPlaying = !audioElement.paused && !audioElement.muted
      setIsPlaying(isActuallyPlaying)
      
      if (isActuallyPlaying) {
        // Start analysis
        if (audioContextRef.current?.state === 'suspended') {
          console.log('useAudioAnalyzer: Resuming suspended audio context')
          audioContextRef.current.resume()
        }
        
        if (analyserRef.current) {
          console.log('🎯 useAudioAnalyzer: Starting analysis loop')
          // Cancel any existing animation frame first
          if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current)
          }
          analyze()
        }
      } else {
        // Stop analysis
        console.log('useAudioAnalyzer: Stopping analysis (paused or muted)')
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current)
          animationFrameRef.current = null
        }
      }
    }
    
    const handlePlay = () => {
      console.log('useAudioAnalyzer: Audio play event triggered')
      updatePlayingState()
    }
    
    const handlePause = () => {
      console.log('useAudioAnalyzer: Audio paused')
      updatePlayingState()
    }
    
    const handleVolumeChange = () => {
      console.log('useAudioAnalyzer: Volume/mute changed, muted:', audioElement.muted)
      updatePlayingState()
    }
    
    audioElement.addEventListener('play', handlePlay)
    audioElement.addEventListener('pause', handlePause)
    audioElement.addEventListener('volumechange', handleVolumeChange)
    
    return () => {
      audioElement.removeEventListener('play', handlePlay)
      audioElement.removeEventListener('pause', handlePause)
      audioElement.removeEventListener('volumechange', handleVolumeChange)
    }
  }, [audioElement, analyze, isAnalyzing])

  // Initialize when audio element is available
  useEffect(() => {
    if (audioElement && !audioContextRef.current) {
      // Try to initialize immediately since user interaction already occurred with Start Experience
      console.log('useAudioAnalyzer: Initializing audio context immediately (user already interacted)')
      initializeAudioContext()
      
      // Fallback: if immediate initialization fails, wait for additional user interaction
      const handleUserInteraction = () => {
        if (!audioContextRef.current) {
          console.log('useAudioAnalyzer: Fallback user interaction detected, initializing audio context')
          initializeAudioContext()
        }
        document.removeEventListener('click', handleUserInteraction)
        document.removeEventListener('touchstart', handleUserInteraction)
        document.removeEventListener('keydown', handleUserInteraction)
      }
      
      // Small delay for fallback listeners in case immediate init fails
      setTimeout(() => {
        if (!audioContextRef.current) {
          document.addEventListener('click', handleUserInteraction)
          document.addEventListener('touchstart', handleUserInteraction)
          document.addEventListener('keydown', handleUserInteraction)
        }
      }, 100)
      
      return () => {
        document.removeEventListener('click', handleUserInteraction)
        document.removeEventListener('touchstart', handleUserInteraction)
        document.removeEventListener('keydown', handleUserInteraction)
      }
    }
  }, [audioElement, initializeAudioContext])

  // Cleanup
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close()
      }
    }
  }, [])

  return {
    audioData,
    isAnalyzing,
    isPlaying
  }
}