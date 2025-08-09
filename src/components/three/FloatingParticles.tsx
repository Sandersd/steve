'use client'

import { useMemo } from 'react'
import { Float, Instances, Instance } from '@react-three/drei'
import * as THREE from 'three'

interface FloatingParticlesProps {
  count?: number
  spread?: number
  height?: number
  depth?: number
  speed?: number
  rotationIntensity?: number
  floatIntensity?: number
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
  floatIntensity = 0.7
}: FloatingParticlesProps) {
  
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
      <Instances limit={count + 10} castShadow receiveShadow>
        <boxGeometry args={[0.05, 0.03, 0.02]} />
        <meshStandardMaterial 
          color="#ffffff"
          metalness={0.8}
          roughness={0.2}
          transparent
          opacity={0.9}
        />
        
        {particleData.map((particle, index) => (
          <Instance
            key={index}
            position={particle.position}
            rotation={particle.rotation}
            scale={particle.scale}
          />
        ))}
      </Instances>
    </Float>
  )
}