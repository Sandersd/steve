'use client'

import { useEffect, useRef, useState } from 'react'

interface AudioPlayerProps {
  src: string
  autoPlay?: boolean
  loop?: boolean
  volume?: number
  className?: string
  onAudioRef?: (audioElement: HTMLAudioElement | null) => void
}

export default function AudioPlayer({
  src,
  autoPlay = false,
  loop = true,
  volume = 0.5,
  className = '',
  onAudioRef
}: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [hasUserInteracted, setHasUserInteracted] = useState(false)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    // Pass audio ref to parent component
    if (onAudioRef) {
      onAudioRef(audio)
    }

    // Set up audio properties
    audio.volume = volume
    audio.loop = loop

    // Handle play/pause state changes
    const handlePlay = () => {
      console.log('🎵 AudioPlayer: Audio started playing')
      setIsPlaying(true)
    }
    const handlePause = () => {
      console.log('⏸️ AudioPlayer: Audio paused')
      setIsPlaying(false)
    }
    const handleEnded = () => {
      console.log('⏹️ AudioPlayer: Audio ended')
      setIsPlaying(false)
    }

    const handleLoadStart = () => console.log('📥 AudioPlayer: Started loading audio')
    const handleCanPlay = () => console.log('✅ AudioPlayer: Audio can play')
    const handleError = (e: Event) => console.log('❌ AudioPlayer: Audio error', e)

    audio.addEventListener('play', handlePlay)
    audio.addEventListener('pause', handlePause)
    audio.addEventListener('ended', handleEnded)
    audio.addEventListener('loadstart', handleLoadStart)
    audio.addEventListener('canplay', handleCanPlay)
    audio.addEventListener('error', handleError)

    // Auto-play after user interaction (required by browsers)
    const handleUserInteraction = () => {
      setHasUserInteracted(true)
      document.removeEventListener('click', handleUserInteraction)
      document.removeEventListener('keydown', handleUserInteraction)
      document.removeEventListener('touchstart', handleUserInteraction)
    }

    document.addEventListener('click', handleUserInteraction)
    document.addEventListener('keydown', handleUserInteraction)
    document.addEventListener('touchstart', handleUserInteraction)

    return () => {
      audio.removeEventListener('play', handlePlay)
      audio.removeEventListener('pause', handlePause)
      audio.removeEventListener('ended', handleEnded)
      audio.removeEventListener('loadstart', handleLoadStart)
      audio.removeEventListener('canplay', handleCanPlay)
      audio.removeEventListener('error', handleError)
      document.removeEventListener('click', handleUserInteraction)
      document.removeEventListener('keydown', handleUserInteraction)
      document.removeEventListener('touchstart', handleUserInteraction)
    }
  }, [volume, loop, onAudioRef])

  // Auto-play when autoPlay becomes true
  useEffect(() => {
    if (autoPlay && audioRef.current) {
      console.log('AudioPlayer: Auto-playing (Start Experience clicked)')
      // Small delay to ensure audio is ready
      const timer = setTimeout(() => {
        if (audioRef.current && audioRef.current.paused) {
          audioRef.current.play().catch((error) => {
            console.log('AudioPlayer: Auto-play failed:', error)
          })
        }
      }, 100)
      return () => clearTimeout(timer)
    }
  }, [autoPlay]) // Watch for autoPlay changes

  const togglePlay = () => {
    const audio = audioRef.current
    if (!audio) return

    if (isPlaying) {
      audio.pause()
    } else {
      audio.play().catch(console.log)
    }
  }

  const toggleMute = () => {
    const audio = audioRef.current
    if (!audio) return

    audio.muted = !audio.muted
    setIsMuted(audio.muted)
  }

  return (
    <>
      <audio ref={audioRef} src={src} preload="auto" />
      
      {/* Audio Controls */}
      <div className={`audio-controls ${className}`}>
        <button
          onClick={togglePlay}
          className="audio-control-btn play-pause-btn"
          title={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? (
            // Pause icon
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <rect x="6" y="4" width="4" height="16" />
              <rect x="14" y="4" width="4" height="16" />
            </svg>
          ) : (
            // Play icon
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="5,3 19,12 5,21" />
            </svg>
          )}
        </button>

        <button
          onClick={toggleMute}
          className="audio-control-btn mute-btn"
          title={isMuted ? 'Unmute' : 'Mute'}
        >
          {isMuted ? (
            // Muted icon
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
            </svg>
          ) : (
            // Volume icon
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
            </svg>
          )}
        </button>
      </div>
    </>
  )
}