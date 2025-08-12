'use client'

import { Environment } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useEffect, useMemo, useState } from 'react'
import * as THREE from 'three'

import type { SceneProps } from '@/types/three'
import FloatingParticles from './FloatingParticles'
import Steve from './models/Steve'
import PearlescentMaterial from './shaders/PearlescentMaterial'

interface SteveExperienceSceneProps extends SceneProps {
  audioData?: {
    volume: number
    bass: number
    mid: number
    treble: number
    beat: boolean
    beatStrength: number
  }
  isAudioPlaying?: boolean
  groupARef?: React.RefObject<THREE.Group>
  groupBRef?: React.RefObject<THREE.Group>
  bgBitsRef?: React.RefObject<THREE.Group>
}

/**
 * Steve's Experience Scene following exact choreography structure
 */
export default function SteveExperienceScene({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  audioData,
  isAudioPlaying = false,
  groupARef,
  groupBRef,
  bgBitsRef
}: SteveExperienceSceneProps) {
  
  console.log('🐟 Steve Experience Scene: Rendering')
  
  // Create pearlescent material for Steve (async)
  const [pearlescentMaterial, setPearlescentMaterial] = useState<PearlescentMaterial | null>(null)
  
  useEffect(() => {
    console.log('🐟 Creating Steve\'s pearlescent material')
    
    // Create material asynchronously
    const timer = setTimeout(() => {
      const material = new PearlescentMaterial({
        colorPrimary: new THREE.Color('#D98616'), // Steve's orange
        colorSecondary: new THREE.Color('#E5A94A'), // Steve's light orange
        colorAccent: new THREE.Color('#FF9A1F'), // Steve's bright orange
        fresnelPower: 2.0,
        rimIntensity: 1.2,
        fresnelBias: 0.05
      })
      console.log('🐟 Steve\'s material ready!')
      setPearlescentMaterial(material)
    }, 0)
    
    return () => clearTimeout(timer)
  }, [])
  
  // Fallback material for Steve
  const fallbackMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#D98616', // Steve's main orange
    metalness: 0.9,
    roughness: 0.1
  }), [])

  // Orange material for groupB shapes
  const orangeMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#FF9A1F', // Steve's bright orange
    metalness: 0.8,
    roughness: 0.2,
    emissive: '#D98616',
    emissiveIntensity: 0.1
  }), [])

  // Animate materials over time
  useFrame((state) => {
    if (pearlescentMaterial && pearlescentMaterial.time !== undefined) {
      pearlescentMaterial.time = state.clock.elapsedTime
    }
  })

  return (
    <group position={position} rotation={rotation} scale={scale}>
      
      {/* Environment and lighting with warmer tones */}
      <Environment preset="studio" background={false} />
      
      {/* Warmer lighting for Steve's world */}
      <ambientLight intensity={0.6} color="#FFF8E1" />
      <directionalLight 
        position={[5, 5, 5]} 
        intensity={1.2}
        color="#FFE0B2"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-far={50}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />
      
      {/* Warm rim lights */}
      <pointLight position={[-3, 2, -3]} intensity={0.6} color="#FFB74D" />
      <pointLight position={[3, -2, 3]} intensity={0.4} color="#FFCC80" />
      <pointLight position={[0, 3, 0]} intensity={0.3} color="#FFF3E0" />

      {/* groupA: Steve (main character) */}
      <group ref={groupARef}>
        <Steve 
          // material={pearlescentMaterial || fallbackMaterial}
          position={[0, 0, 0]}
          scale={0.5} // Much larger scale for new model
          castShadow
          receiveShadow
          isAudioPlaying={isAudioPlaying}
        />
      </group>

      {/* groupB: Geometric shapes cluster with orange elements */}
      <group ref={groupBRef}>
        {/* Cube */}
        <mesh position={[-0.2, 0.1, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.15, 0.15, 0.15]} />
          <primitive object={orangeMaterial} attach="material" />
        </mesh>

        {/* Sphere */}
        <mesh position={[0.1, -0.1, 0.1]} castShadow receiveShadow>
          <sphereGeometry args={[0.1, 16, 16]} />
          <primitive object={pearlescentMaterial || fallbackMaterial} attach="material" />
        </mesh>

        {/* Orange "claws" - torus shapes */}
        <mesh position={[0, 0.2, -0.1]} rotation={[0.3, 0.4, 0]} castShadow receiveShadow>
          <torusGeometry args={[0.08, 0.03, 8, 16]} />
          <primitive object={orangeMaterial} attach="material" />
        </mesh>
        
        <mesh position={[0.2, -0.2, 0]} rotation={[0.7, 0.2, 0.5]} castShadow receiveShadow>
          <torusGeometry args={[0.06, 0.02, 8, 16]} />
          <primitive object={orangeMaterial} attach="material" />
        </mesh>

        {/* Additional geometric element */}
        <mesh position={[-0.1, 0, -0.2]} rotation={[0.5, 0, 0.3]} castShadow receiveShadow>
          <octahedronGeometry args={[0.08]} />
          <primitive object={pearlescentMaterial || fallbackMaterial} attach="material" />
        </mesh>
      </group>

      {/* bgBits: Music visualization particles */}
      <group ref={bgBitsRef}>
        <FloatingParticles 
          count={60} // Slightly fewer for better performance in choreographed scene
          spread={6}
          height={4}
          depth={3}
          speed={0.6}
          rotationIntensity={0.3}
          floatIntensity={0.5}
          audioData={audioData}
          isAudioPlaying={isAudioPlaying}
        />
      </group>

    </group>
  )
}