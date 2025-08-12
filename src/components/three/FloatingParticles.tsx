'use client'

import { useMemo } from 'react'
import { Float } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import MusicReactiveMaterial from './shaders/MusicReactiveMaterial'

interface FloatingParticlesProps {
  count?: number
  spread?: number
  height?: number
  depth?: number
  speed?: number
  rotationIntensity?: number
  floatIntensity?: number
  audioData?: {
    volume: number
    bass: number
    mid: number
    treble: number
    beat: boolean
    beatStrength: number
  }
  isAudioPlaying?: boolean
}

/**
 * A system of floating instanced particles for ambient scene decoration
 */
export default function FloatingParticles({
  count = 60,
  spread = 4,
  height = 2,
  depth = 2,
  speed = 0.6,
  rotationIntensity = 0.3,
  floatIntensity = 0.7,
  audioData,
  isAudioPlaying = false
}: FloatingParticlesProps) {
  
  // Always create music-reactive materials (simplified)
  const particleMaterials = useMemo(() => {
    console.log('FloatingParticles: Creating music-reactive materials for', count, 'particles')
    
    const materials = Array.from({ length: count }, () => new MusicReactiveMaterial({
      baseColor: new THREE.Color('#ff8c42'), // Bright orange base
      bassColor: new THREE.Color('#ff6b35'), // Deep orange for bass
      midColor: new THREE.Color('#ffa726'), // Medium orange for mid  
      trebleColor: new THREE.Color('#ffcc80'), // Light orange for treble
      beatColor: new THREE.Color('#fff3e0') // Very light orange for beats
    }))
    
    console.log('🎶 FloatingParticles: Created', materials.length, 'music-reactive materials')
    return materials
  }, [count]) // Only depend on count

  // Animate all particle materials and update audio data
  useFrame((state) => {
    if (particleMaterials) {
      particleMaterials.forEach(mat => {
        // Update time for all materials - but freeze time when paused for instant stop
        if (mat && 'time' in mat && typeof (mat as { time?: number }).time !== 'undefined') {
          if (isAudioPlaying) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (mat as any).time = state.clock.elapsedTime
          }
          // When paused, don't update time - this freezes the animation instantly
        }
        
        // Update audio data for all materials (they're all music-reactive now)
        if (mat instanceof MusicReactiveMaterial) {
          if (audioData && isAudioPlaying && audioData.volume > 0.01) {
            // ONLY use real audio data when music is actively playing AND has volume
            mat.updateAudioData(audioData)
            // Debug: Log audio data updates (throttled to avoid spam)
            if (audioData.volume > 0.01 && Math.random() < 0.001) {
              console.log('🎵 FloatingParticles: Updating material', { volume: audioData.volume.toFixed(3), beat: audioData.beat, isAudioPlaying })
            }
          } else {
            // When audio is paused OR stopped OR muted, use zero values
            mat.updateAudioData({
              volume: 0, // No volume when paused - this stops the animation
              bass: 0,
              mid: 0,
              treble: 0,
              beat: false,
              beatStrength: 0
            })
            // Debug: Log when using stopped state (throttled)
            if (Math.random() < 0.001) {
              console.log('⏸️ FloatingParticles: Using stopped audio data', { isAudioPlaying, hasVolume: audioData?.volume && audioData.volume > 0.01 })
            }
          }
        }
      })
    }
  })
  
  // Generate particle data once
  const particleData = useMemo(() => {
    return Array.from({ length: count }, () => ({
      position: [
        THREE.MathUtils.randFloatSpread(spread),
        THREE.MathUtils.randFloat(-height * 0.5, height * 0.5),
        THREE.MathUtils.randFloatSpread(depth)
      ] as const,
      rotation: [
        THREE.MathUtils.randFloatSpread(Math.PI),
        THREE.MathUtils.randFloatSpread(Math.PI), 
        THREE.MathUtils.randFloatSpread(Math.PI)
      ] as const,
      scale: THREE.MathUtils.randFloat(0.5, 1.5)
    }))
  }, [count, spread, height, depth])

  return (
    <Float 
      speed={speed}
      rotationIntensity={rotationIntensity}
      floatIntensity={floatIntensity}
    >
      {/* Use individual meshes with cloned materials for proper rendering */}
      {particleData.map((particle, index) => (
        <mesh
          key={index}
          position={particle.position}
          rotation={particle.rotation}
          scale={particle.scale}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[0.05, 0.03, 0.02]} />
          {particleMaterials && particleMaterials[index] ? (
            <primitive object={particleMaterials[index]} attach="material" />
          ) : (
            <meshStandardMaterial 
              color="#ff8c42"
              metalness={0.8}
              roughness={0.1}
              emissive="#ff8c42"
              emissiveIntensity={0.4}
            />
          )}
        </mesh>
      ))}
    </Float>
  )
}