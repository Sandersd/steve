'use client'

import { Environment } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useMemo, useEffect, useState } from 'react'
import * as THREE from 'three'

import type { SceneProps } from '@/types/three'
import FloatingParticles from './FloatingParticles'
import Steve from './models/Steve'
import PearlescentMaterial from './shaders/PearlescentMaterial'

interface MainSceneProps extends SceneProps {
  enableEnvironment?: boolean
  enableParticles?: boolean
  particleCount?: number
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
 * Main 3D scene containing all the objects and lighting
 */
export default function Scene({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  enableEnvironment = true,
  enableParticles = true,
  particleCount = 60,
  audioData,
  isAudioPlaying = false
}: MainSceneProps) {
  
  const sceneStartTime = Date.now()
  console.log('🎭 Scene: Component rendering/mounting at', sceneStartTime, 'ms')
  
  useEffect(() => {
    const sceneMountTime = Date.now()
    console.log('🎭 Scene: Component MOUNTED at', sceneMountTime, 'ms, took:', (sceneMountTime - sceneStartTime), 'ms')
    return () => {
      console.log('🎭 Scene: Component UNMOUNTING')
    }
  }, [])
  
  // Debug: Log when Scene receives audio data (disabled for performance)
  // if (audioData && audioData.volume > 0.01) {
  //   console.log('🎭 Scene.tsx - Received Audio Data:', { volume: audioData.volume.toFixed(3), beat: audioData.beat })
  // }

  // Create pearlescent material with green→sky blue→baby pink gradient (async)
  const [pearlescentMaterial, setPearlescentMaterial] = useState<PearlescentMaterial | null>(null)
  
  useEffect(() => {
    const matStartTime = Date.now()
    console.log('💫 Scene: Creating PearlescentMaterial at', matStartTime, 'ms')
    
    // Create material asynchronously to not block initial render
    const timer = setTimeout(() => {
      const material = new PearlescentMaterial({
        colorPrimary: new THREE.Color('#98ff98'), // Soft mint green
        colorSecondary: new THREE.Color('#87ceeb'), // Sky blue
        colorAccent: new THREE.Color('#ffb6c1'), // Baby pink (back to original)
        fresnelPower: 2.0,
        rimIntensity: 1.2,
        fresnelBias: 0.05
      })
      const matEndTime = Date.now()
      console.log('💫 Scene: PearlescentMaterial created at', matEndTime, 'ms, took:', (matEndTime - matStartTime), 'ms')
      setPearlescentMaterial(material)
    }, 0)
    
    return () => clearTimeout(timer)
  }, [])
  
  // Fallback material while pearlescent material is loading
  const fallbackMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#98ff98', // Match original green
    metalness: 0.9,
    roughness: 0.1
  }), [])

  // Animate the material over time
  useFrame((state) => {
    if (pearlescentMaterial && pearlescentMaterial.time !== undefined) {
      pearlescentMaterial.time = state.clock.elapsedTime
    }
  })

  return (
    <group position={position} rotation={rotation} scale={scale}>
      {/* Environment and lighting */}
      {enableEnvironment && (
        <>
          <Environment preset="studio" background={false} />
          
          {/* Additional custom lighting - increased for better reflections */}
          <ambientLight intensity={0.8} />
          <directionalLight 
            position={[5, 5, 5]} 
            intensity={1.5}
            castShadow
            shadow-mapSize={[2048, 2048]}
            shadow-camera-far={50}
            shadow-camera-left={-10}
            shadow-camera-right={10}
            shadow-camera-top={10}
            shadow-camera-bottom={-10}
          />
          
          {/* Rim lights for dramatic effect - boosted intensity */}
          <pointLight position={[-3, 2, -3]} intensity={0.8} color="#81d4fa" />
          <pointLight position={[3, -2, 3]} intensity={0.6} color="#ffb3ba" />
          <pointLight position={[0, 3, 0]} intensity={0.5} color="#ffffff" />
        </>
      )}

      {/* Main hand model with pearlescent material */}
      {/* <HandPlaceholder 
        material={pearlescentMaterial}
        position={[0, -0.2, 0]}
        scale={0.9}
        castShadow
        receiveShadow
      /> */}
      <Steve 
        material={pearlescentMaterial || fallbackMaterial}
        position={[0, 0, 0]}
        scale={0.4}
        castShadow
        receiveShadow
      />

      {/* Pearl sphere demonstration */}
      <mesh position={[0.8, 0.3, 0.2]} castShadow receiveShadow>
        <sphereGeometry args={[0.15, 64, 64]} />
        <primitive object={pearlescentMaterial || fallbackMaterial} attach="material" />
      </mesh>

      {/* Additional geometric shapes to show material versatility */}
      <mesh position={[-0.6, 0.1, 0.3]} rotation={[0.3, 0.4, 0]} castShadow receiveShadow>
        <torusGeometry args={[0.12, 0.05, 16, 32]} />
        <primitive object={pearlescentMaterial || fallbackMaterial} attach="material" />
      </mesh>

      <mesh position={[0.2, -0.4, -0.3]} rotation={[0.5, 0, 0.3]} castShadow receiveShadow>
        <octahedronGeometry args={[0.1]} />
        <primitive object={pearlescentMaterial || fallbackMaterial} attach="material" />
      </mesh>

      {/* Floating particles system */}
      {enableParticles && (
        <>
          <FloatingParticles 
            count={particleCount}
            spread={8}
            height={5}
            depth={4}
            speed={0.8}
            rotationIntensity={0.4}
            floatIntensity={0.6}
            audioData={audioData}
            isAudioPlaying={isAudioPlaying}
          />
        </>
      )}

    </group>
  )
}