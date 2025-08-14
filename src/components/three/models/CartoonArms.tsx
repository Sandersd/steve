'use client'

import { useFrame } from '@react-three/fiber'
import { useRef, useMemo } from 'react'
import * as THREE from 'three'

interface CartoonArmsProps {
  position?: [number, number, number]
  rotation?: [number, number, number]
  scale?: number | [number, number, number]
  color?: string
  wiggleSpeed?: number
  wiggleIntensity?: number
}

export default function CartoonArms({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  color = '#FF9A1F',
  wiggleSpeed = 2,
  wiggleIntensity = 0.15
}: CartoonArmsProps) {
  const leftArmRef = useRef<THREE.Group>(null!)
  const rightArmRef = useRef<THREE.Group>(null!)
  
  // Create arm material
  const material = useMemo(() => new THREE.MeshStandardMaterial({
    color: color,
    roughness: 0.3,
    metalness: 0.1,
    emissive: color,
    emissiveIntensity: 0.05
  }), [color])
  
  // Create hand material (slightly different shade) - less bright
  const handMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#E5A94A',
    roughness: 0.45,
    metalness: 0.02,
    emissive: '#E5A94A',
    emissiveIntensity: 0.01
  }), [])
  
  // Animate wiggling
  useFrame((state) => {
    const time = state.clock.elapsedTime
    
    // Left arm wiggle
    if (leftArmRef.current) {
      // Base rotation for coming in at angle
      leftArmRef.current.rotation.z = -Math.PI / 4 // -45 degrees base
      
      // Add wiggle motion with multiple sine waves for organic movement
      const wiggle1 = Math.sin(time * wiggleSpeed) * wiggleIntensity
      const wiggle2 = Math.sin(time * wiggleSpeed * 1.5 + Math.PI / 3) * wiggleIntensity * 0.5
      const wiggle3 = Math.sin(time * wiggleSpeed * 0.7 - Math.PI / 4) * wiggleIntensity * 0.3
      
      leftArmRef.current.rotation.z += wiggle1 + wiggle2 + wiggle3
      leftArmRef.current.rotation.x = Math.sin(time * wiggleSpeed * 0.8) * wiggleIntensity * 0.3
      leftArmRef.current.rotation.y = Math.cos(time * wiggleSpeed * 1.2) * wiggleIntensity * 0.2
    }
    
    // Right arm wiggle (offset for variety)
    if (rightArmRef.current) {
      // Base rotation for coming in at angle
      rightArmRef.current.rotation.z = Math.PI / 4 // 45 degrees base
      
      // Add wiggle motion with offset phase
      const wiggle1 = Math.sin(time * wiggleSpeed + Math.PI / 2) * wiggleIntensity
      const wiggle2 = Math.sin(time * wiggleSpeed * 1.3 + Math.PI / 6) * wiggleIntensity * 0.5
      const wiggle3 = Math.sin(time * wiggleSpeed * 0.9) * wiggleIntensity * 0.3
      
      rightArmRef.current.rotation.z += wiggle1 + wiggle2 + wiggle3
      rightArmRef.current.rotation.x = Math.sin(time * wiggleSpeed * 0.9 + Math.PI) * wiggleIntensity * 0.3
      rightArmRef.current.rotation.y = Math.cos(time * wiggleSpeed * 1.1 + Math.PI / 3) * wiggleIntensity * 0.2
    }
  })
  
  // Helper function to create fingers - point up toward top of screen
  const createFinger = (fingerLength: number, fingerThickness: number, offsetX: number, offsetY: number, offsetZ: number) => (
    <group position={[offsetX, offsetY, offsetZ]} rotation={[0, 0, Math.PI / 2]}>
      <mesh castShadow receiveShadow>
        <capsuleGeometry args={[fingerThickness, fingerLength, 6, 8]} />
        <primitive object={handMaterial} attach="material" />
      </mesh>
    </group>
  )
  
  return (
    <group position={position} rotation={rotation} scale={scale}>
      {/* Left Arm - simplified tube */}
      <group ref={leftArmRef} position={[-2, 0, 0]}>
        {/* Single arm tube */}
        <mesh castShadow receiveShadow>
          <capsuleGeometry args={[0.3, 3, 12, 24]} />
          <primitive object={material} attach="material" />
        </mesh>
        
        {/* Hand at the end */}
        <group position={[0, 1.8, 0]} rotation={[0, 0, Math.PI / 2]}>
          {/* Palm - using wider rounded capsule to connect with fingers */}
          <mesh castShadow receiveShadow>
            <capsuleGeometry args={[0.15, 0.4, 8, 16]} />
            <primitive object={handMaterial} attach="material" />
          </mesh>
          
          {/* Fingers - positioned at top of rotated palm */}
          {createFinger(0.2, 0.06, 0.25, -0.15, 0)}
          {createFinger(0.22, 0.06, 0.27, -0.05, 0)}
          {createFinger(0.22, 0.06, 0.27, 0.05, 0)}
          {createFinger(0.2, 0.06, 0.25, 0.15, 0)}
          {/* Thumb */}
          {createFinger(0.15, 0.07, 0.08, -0.22, 0.05)}
        </group>
      </group>
      
      {/* Right Arm - simplified tube */}
      <group ref={rightArmRef} position={[2, 0, 0]}>
        {/* Single arm tube */}
        <mesh castShadow receiveShadow>
          <capsuleGeometry args={[0.3, 3, 12, 24]} />
          <primitive object={material} attach="material" />
        </mesh>
        
        {/* Hand at the end */}
        <group position={[0, 1.8, 0]} rotation={[0, 0, Math.PI / 2]}>
          {/* Palm - using wider rounded capsule to connect with fingers */}
          <mesh castShadow receiveShadow>
            <capsuleGeometry args={[0.15, 0.4, 8, 16]} />
            <primitive object={handMaterial} attach="material" />
          </mesh>
          
          {/* Fingers - positioned at top of rotated palm */}
          {createFinger(0.2, 0.06, 0.25, 0.15, 0)}
          {createFinger(0.22, 0.06, 0.27, 0.05, 0)}
          {createFinger(0.22, 0.06, 0.27, -0.05, 0)}
          {createFinger(0.2, 0.06, 0.25, -0.15, 0)}
          {/* Thumb */}
          {createFinger(0.15, 0.07, 0.08, 0.22, 0.05)}
        </group>
      </group>
    </group>
  )
}