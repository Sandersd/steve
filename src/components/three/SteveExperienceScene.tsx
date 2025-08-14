'use client'

import { Environment } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useEffect, useMemo, useState, memo } from 'react'
import * as THREE from 'three'

import type { SceneProps } from '@/types/three'
import type { CornerSettings } from '@/components/admin/CornerAdminPanel'
import FloatingParticles from './FloatingParticles'
import Steve from './models/Steve'
import Steve3 from './models/Steve3'
import SteveArms from './models/SteveArms'
import SteveLegs from './models/SteveLegs'
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
  groupCRef?: React.RefObject<THREE.Group>
  groupDRef?: React.RefObject<THREE.Group>
  bgBitsRef?: React.RefObject<THREE.Group>
  adminSettings?: CornerSettings | null
}

/**
 * Steve's Experience Scene following exact choreography structure
 */
const SteveExperienceScene = memo(function SteveExperienceScene({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  audioData,
  isAudioPlaying = false,
  groupARef,
  groupBRef,
  groupCRef,
  groupDRef,
  bgBitsRef,
  adminSettings
}: SteveExperienceSceneProps) {
  
  // Removed frequent console logging for performance
  
  // Create pearlescent material for Steve (async)
  const [pearlescentMaterial, setPearlescentMaterial] = useState<PearlescentMaterial | null>(null)
  
  useEffect(() => {
    // Create material immediately (no delay)
    const material = new PearlescentMaterial({
      colorPrimary: new THREE.Color('#D98616'), // Steve's orange
      colorSecondary: new THREE.Color('#E5A94A'), // Steve's light orange
      colorAccent: new THREE.Color('#FF9A1F'), // Steve's bright orange
      fresnelPower: 2.0,
      rimIntensity: 1.2,
      fresnelBias: 0.05
    })
    setPearlescentMaterial(material)
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
          position={adminSettings ? [adminSettings.steveX, adminSettings.steveY, adminSettings.steveZ] : [0.4, -0.2, 0]}
          rotation={adminSettings ? [adminSettings.steveRotX, adminSettings.steveRotY, adminSettings.steveRotZ] : [0, 0, 0]}
          scale={adminSettings?.steveScale || 0.4}
          castShadow
          receiveShadow
          isAudioPlaying={isAudioPlaying}
          audioData={audioData}
        />
      </group>

      {/* groupB: Steve Arms coming from sides */}
      <group ref={groupBRef}>
        <SteveArms 
          position={adminSettings ? [adminSettings.armsX, adminSettings.armsY, adminSettings.armsZ] : [0.1, 0.64, 0.86]}
          rotation={adminSettings ? [adminSettings.armsRotX, adminSettings.armsRotY, adminSettings.armsRotZ] : [0, -2.73159265358979, 0]}
          scale={adminSettings ? [adminSettings.armsScaleX, adminSettings.armsScaleY, adminSettings.armsScaleZ] : [0.85, 1.43, 0.38]}
          castShadow
          receiveShadow
          isAudioPlaying={isAudioPlaying}
        />
      </group>

      {/* groupC: Steve Legs hanging from top */}
      <group ref={groupCRef}>
        <SteveLegs 
          position={adminSettings ? [adminSettings.legsX, adminSettings.legsY, adminSettings.legsZ] : [-0.5, -0.56, 0]}
          rotation={adminSettings ? [adminSettings.legsRotX, adminSettings.legsRotY, adminSettings.legsRotZ] : [0, 0.188407346410207, -0.011592653589793]}
          scale={adminSettings ? [adminSettings.legsScaleX, adminSettings.legsScaleY, adminSettings.legsScaleZ] : [1.13, 1.42, 1.49]}
          castShadow
          receiveShadow
          isAudioPlaying={isAudioPlaying}
        />
      </group>

      {/* groupD: Steve3 rising from bottom with PA-LA-LA */}
      <group ref={groupDRef}>
        <Steve3 
          position={adminSettings ? [adminSettings.steve3X, adminSettings.steve3Y, adminSettings.steve3Z] : [0.42, 0, 0]}
          rotation={adminSettings ? [adminSettings.steve3RotX, adminSettings.steve3RotY, adminSettings.steve3RotZ] : [0, -2.20159265358979, -0.061592653589793]}
          scale={adminSettings?.steve3Scale || 1.2}
          castShadow
          receiveShadow
          isAudioPlaying={isAudioPlaying}
        />
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
})

export default SteveExperienceScene