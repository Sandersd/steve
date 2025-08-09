'use client'

import { useMemo } from 'react'
import { Float, Instances, Instance } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import PearlescentMaterial from './shaders/PearlescentMaterial'

interface FloatingParticlesProps {
  count?: number
  spread?: number
  height?: number
  depth?: number
  speed?: number
  rotationIntensity?: number
  floatIntensity?: number
  material?: any
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
  material
}: FloatingParticlesProps) {
  
  // Create particle materials if custom material is provided
  const particleMaterials = useMemo(() => {
    if (!material) return null
    // Create a clone of the material for each particle to ensure proper rendering
    return Array.from({ length: count }, () => material.clone())
  }, [count, material])

  // Animate all particle materials
  useFrame((state) => {
    if (particleMaterials) {
      particleMaterials.forEach(mat => {
        if (mat && mat.time !== undefined) {
          mat.time = state.clock.elapsedTime
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
              color="#98ff98"
              metalness={0.9}
              roughness={0.1}
              emissive="#98ff98"
              emissiveIntensity={0.2}
            />
          )}
        </mesh>
      ))}
    </Float>
  )
}