'use client'

import React, { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface BgBitsProps {
  count?: number
  opacity?: number
  scale?: number
  speed?: number
}

export default function BgBits({
  count = 20,
  opacity = 0.7,
  scale = 1,
  speed = 1
}: BgBitsProps) {
  const groupRef = useRef<THREE.Group>(null!)
  
  // Generate random floating rectangles/particles
  const particles = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      position: [
        THREE.MathUtils.randFloatSpread(8), // x: -4 to 4
        THREE.MathUtils.randFloatSpread(6), // y: -3 to 3
        THREE.MathUtils.randFloatSpread(4)  // z: -2 to 2
      ] as [number, number, number],
      rotation: [
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      ] as [number, number, number],
      scale: THREE.MathUtils.randFloat(0.1, 0.3),
      rotationSpeed: THREE.MathUtils.randFloat(0.001, 0.005),
      driftSpeed: THREE.MathUtils.randFloat(0.0005, 0.002),
      shape: Math.random() > 0.5 ? 'box' : 'plane', // Mix of 3D boxes and flat rectangles
      color: Math.random() > 0.7 ? '#64b5f6' : Math.random() > 0.4 ? '#81c784' : '#fff'
    }))
  }, [count])

  const emissiveMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      transparent: true,
      opacity: opacity * 0.3,
      emissive: '#64b5f6',
      emissiveIntensity: 0.2,
      metalness: 0,
      roughness: 1,
    })
  }, [opacity])

  // Animate the particles
  useFrame((state) => {
    if (!groupRef.current) return
    
    const time = state.clock.elapsedTime * speed
    
    groupRef.current.children.forEach((child, i) => {
      // Only animate particles we have data for (skip the extra glowing bits)
      if (i >= particles.length) return
      
      const particle = particles[i]
      if (child instanceof THREE.Mesh && particle) {
        // Rotation
        child.rotation.x += particle.rotationSpeed
        child.rotation.y += particle.rotationSpeed * 0.7
        child.rotation.z += particle.rotationSpeed * 0.3
        
        // Slow drift
        child.position.x += Math.sin(time * particle.driftSpeed + i) * 0.001
        child.position.y += Math.cos(time * particle.driftSpeed * 0.7 + i) * 0.0005
        child.position.z += Math.sin(time * particle.driftSpeed * 0.3 + i) * 0.0003
      }
    })
  })

  return (
    <group ref={groupRef} scale={scale}>
      {particles.map((particle, i) => (
        <mesh
          key={particle.id}
          position={particle.position}
          rotation={particle.rotation}
          scale={particle.scale}
          castShadow={false}
          receiveShadow={false}
        >
          {particle.shape === 'box' ? (
            <boxGeometry args={[1, 1, 0.1]} />
          ) : (
            <planeGeometry args={[1, 0.6]} />
          )}
          <meshStandardMaterial
            color={particle.color}
            transparent
            opacity={opacity * (Math.random() > 0.3 ? 0.4 : 0.8)}
            metalness={0.1}
            roughness={0.9}
            emissive={i % 7 === 0 ? '#64b5f6' : '#000000'}
            emissiveIntensity={i % 7 === 0 ? 0.1 : 0}
          />
        </mesh>
      ))}
      
      {/* Add some special glowing bits */}
      {Array.from({ length: 3 }, (_, i) => (
        <mesh
          key={`glow-${i}`}
          position={[
            THREE.MathUtils.randFloatSpread(6),
            THREE.MathUtils.randFloatSpread(4),
            THREE.MathUtils.randFloatSpread(3)
          ]}
          scale={0.05}
        >
          <sphereGeometry args={[1, 16, 16]} />
          <primitive object={emissiveMaterial} />
        </mesh>
      ))}
    </group>
  )
}