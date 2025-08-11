'use client'

import React, { useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface GroupBProps {
  position?: [number, number, number]
  rotation?: [number, number, number]
  scale?: number
  opacity?: number
  material?: THREE.Material
}

export default function GroupB({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  opacity = 1,
  material
}: GroupBProps) {
  
  // Create materials for different objects
  const cubeMaterial = useMemo(() => {
    if (material) return material
    return new THREE.MeshStandardMaterial({
      color: '#3b82f6', // Blue
      metalness: 0.8,
      roughness: 0.2,
      transparent: true,
      opacity
    })
  }, [material, opacity])

  const sphereMaterial = useMemo(() => {
    if (material) return material
    return new THREE.MeshStandardMaterial({
      color: '#8b5cf6', // Purple
      metalness: 0.9,
      roughness: 0.1,
      transparent: true,
      opacity
    })
  }, [material, opacity])

  const clawMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: '#f97316', // Orange
      metalness: 0.7,
      roughness: 0.3,
      emissive: '#f97316',
      emissiveIntensity: 0.1,
      transparent: true,
      opacity
    })
  }, [opacity])

  // Add subtle animation
  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.005
    }
  })

  const groupRef = React.useRef<THREE.Group>(null!)

  return (
    <group ref={groupRef} position={position} rotation={rotation} scale={scale}>
      {/* Central Cube */}
      <mesh position={[0, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.3, 0.3, 0.3]} />
        <primitive object={cubeMaterial} />
      </mesh>

      {/* Floating Sphere */}
      <mesh position={[0.5, 0.3, 0.2]} castShadow receiveShadow>
        <sphereGeometry args={[0.15, 32, 32]} />
        <primitive object={sphereMaterial} />
      </mesh>

      {/* Orange Claws - arranged in a circular pattern */}
      {Array.from({ length: 6 }, (_, i) => {
        const angle = (i / 6) * Math.PI * 2
        const radius = 0.6
        const x = Math.cos(angle) * radius
        const z = Math.sin(angle) * radius
        const y = Math.sin(angle * 3) * 0.1 // Vertical wave

        return (
          <group key={i} position={[x, y, z]} rotation={[0, angle, 0]}>
            {/* Claw base */}
            <mesh position={[0, 0, 0]} castShadow receiveShadow>
              <cylinderGeometry args={[0.03, 0.05, 0.2, 8]} />
              <primitive object={clawMaterial} />
            </mesh>
            
            {/* Claw tip */}
            <mesh position={[0.08, 0, 0]} rotation={[0, 0, -0.3]} castShadow receiveShadow>
              <coneGeometry args={[0.02, 0.1, 6]} />
              <primitive object={clawMaterial} />
            </mesh>

            {/* Inner claw */}
            <mesh position={[-0.08, 0.05, 0]} rotation={[0, 0, 0.3]} castShadow receiveShadow>
              <coneGeometry args={[0.015, 0.08, 6]} />
              <primitive object={clawMaterial} />
            </mesh>
          </group>
        )
      })}

      {/* Additional geometric details */}
      <mesh position={[-0.4, -0.2, 0.3]} rotation={[0.5, 0, 0.3]} castShadow receiveShadow>
        <octahedronGeometry args={[0.1, 0]} />
        <primitive object={sphereMaterial} />
      </mesh>

      <mesh position={[0.2, -0.4, -0.2]} rotation={[0.3, 0.7, 0]} castShadow receiveShadow>
        <tetrahedronGeometry args={[0.08, 0]} />
        <primitive object={cubeMaterial} />
      </mesh>
    </group>
  )
}