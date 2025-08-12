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
  count = 120, // Doubled for more spectacular effect
  spread = 8,  // Wider spread for immersive experience
  height = 5,  // Taller for more dramatic presence  
  depth = 4,   // Deeper for 3D immersion
  speed = 0.8, // Slightly faster base movement
  rotationIntensity = 0.5, // More rotation
  floatIntensity = 1.0,    // More floating motion
  audioData,
  isAudioPlaying = false
}: FloatingParticlesProps) {
  
  // Always create music-reactive materials (simplified)
  const particleMaterials = useMemo(() => {
    console.log('FloatingParticles: Creating music-reactive materials for', count, 'particles')
    
    const materials = Array.from({ length: count }, (_, index) => {
      // Create varied color palettes for more visual diversity
      const colorVariants = [
        {
          baseColor: new THREE.Color('#D98616'), // Steve's main orange
          bassColor: new THREE.Color('#B87014'), // Steve's dark orange for bass
          midColor: new THREE.Color('#E5A94A'), // Steve's light orange for mid  
          trebleColor: new THREE.Color('#FF9A1F'), // Steve's bright orange for treble
          beatColor: new THREE.Color('#F5F4F0')   // Steve's off-white for beats
        },
        {
          baseColor: new THREE.Color('#E5A94A'), // Steve's light orange variant
          bassColor: new THREE.Color('#D98616'), // Steve's main orange
          midColor: new THREE.Color('#FF9A1F'),  // Steve's bright orange
          trebleColor: new THREE.Color('#F5F4F0'), // Steve's off-white
          beatColor: new THREE.Color('#CEC4B6')   // Steve's cream
        },
        {
          baseColor: new THREE.Color('#C3B094'), // Steve's light brown
          bassColor: new THREE.Color('#916332'), // Steve's dark brown for bass
          midColor: new THREE.Color('#D98616'),  // Steve's orange for mid
          trebleColor: new THREE.Color('#E5A94A'), // Steve's light orange for treble
          beatColor: new THREE.Color('#F5F4F0')   // Steve's off-white for beats
        }
      ]
      
      const variant = colorVariants[index % colorVariants.length]
      return new MusicReactiveMaterial(variant)
    })
    
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
          {/* Use varied geometric shapes for more visual interest */}
          {index % 3 === 0 ? (
            <sphereGeometry args={[0.03, 8, 6]} />
          ) : index % 3 === 1 ? (
            <boxGeometry args={[0.04, 0.04, 0.04]} />
          ) : (
            <octahedronGeometry args={[0.035, 0]} />
          )}
          {particleMaterials && particleMaterials[index] ? (
            <primitive object={particleMaterials[index]} attach="material" />
          ) : (
            <meshStandardMaterial 
              color="#D98616"
              metalness={0.8}
              roughness={0.1}
              emissive="#D98616"
              emissiveIntensity={0.4}
            />
          )}
        </mesh>
      ))}
    </Float>
  )
}