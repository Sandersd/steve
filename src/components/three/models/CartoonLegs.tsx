'use client'

import { useFrame } from '@react-three/fiber'
import { useRef, useMemo } from 'react'
import * as THREE from 'three'

interface CartoonLegsProps {
  position?: [number, number, number]
  rotation?: [number, number, number]
  scale?: number | [number, number, number]
  color?: string
  wiggleSpeed?: number
  wiggleIntensity?: number
}

export default function CartoonLegs({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  color = '#FF9A1F',
  wiggleSpeed = 2,
  wiggleIntensity = 0.1
}: CartoonLegsProps) {
  const leftLegRef = useRef<THREE.Group>(null!)
  const rightLegRef = useRef<THREE.Group>(null!)
  
  // Create leg material
  const material = useMemo(() => new THREE.MeshStandardMaterial({
    color: color,
    roughness: 0.3,
    metalness: 0.1,
    emissive: color,
    emissiveIntensity: 0.05
  }), [color])
  
  // Create foot material (slightly different shade)
  const footMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#E5A94A',
    roughness: 0.45,
    metalness: 0.02,
    emissive: '#E5A94A',
    emissiveIntensity: 0.01
  }), [])
  
  // Animate wiggling
  useFrame((state) => {
    const time = state.clock.elapsedTime
    
    // Left leg wiggle
    if (leftLegRef.current) {
      // Add subtle wiggle motion - less intense than arms
      const wiggle1 = Math.sin(time * wiggleSpeed) * wiggleIntensity
      const wiggle2 = Math.sin(time * wiggleSpeed * 1.2 + Math.PI / 4) * wiggleIntensity * 0.5
      
      leftLegRef.current.rotation.x = wiggle1 + wiggle2
      leftLegRef.current.rotation.z = Math.sin(time * wiggleSpeed * 0.8) * wiggleIntensity * 0.3
    }
    
    // Right leg wiggle (offset for variety)
    if (rightLegRef.current) {
      // Add wiggle motion with offset phase
      const wiggle1 = Math.sin(time * wiggleSpeed + Math.PI / 3) * wiggleIntensity
      const wiggle2 = Math.sin(time * wiggleSpeed * 1.1 + Math.PI / 2) * wiggleIntensity * 0.5
      
      rightLegRef.current.rotation.x = wiggle1 + wiggle2
      rightLegRef.current.rotation.z = Math.sin(time * wiggleSpeed * 0.9 + Math.PI) * wiggleIntensity * 0.3
    }
  })
  
  // Helper function to create toes - point forward toward screen
  const createToe = (toeLength: number, toeThickness: number, offsetX: number, offsetY: number, offsetZ: number) => (
    <mesh position={[offsetX, offsetY, offsetZ]} rotation={[Math.PI / 2, 0, 0]} castShadow receiveShadow>
      <capsuleGeometry args={[toeThickness, toeLength, 6, 8]} />
      <primitive object={footMaterial} attach="material" />
    </mesh>
  )
  
  return (
    <group position={position} rotation={rotation} scale={scale}>
      {/* Left Leg - single tube hanging down */}
      <group ref={leftLegRef} position={[-1, 1, 0]}>
        {/* Single leg tube - longer and simpler */}
        <mesh castShadow receiveShadow>
          <capsuleGeometry args={[0.22, 3.5, 12, 24]} />
          <primitive object={material} attach="material" />
        </mesh>
        
        {/* Foot at the bottom */}
        <group position={[0, -2.2, 0]}>
          {/* Foot base */}
          <mesh castShadow receiveShadow>
            <capsuleGeometry args={[0.12, 0.6, 8, 16]} />
            <primitive object={footMaterial} attach="material" />
          </mesh>
          
          {/* Toes pointing forward */}
          {createToe(0.15, 0.04, -0.15, -0.1, 0.3)}
          {createToe(0.18, 0.04, -0.05, -0.1, 0.35)}
          {createToe(0.18, 0.04, 0.05, -0.1, 0.35)}
          {createToe(0.15, 0.04, 0.15, -0.1, 0.3)}
        </group>
      </group>
      
      {/* Right Leg - single tube hanging down */}
      <group ref={rightLegRef} position={[1, 1, 0]}>
        {/* Single leg tube - longer and simpler */}
        <mesh castShadow receiveShadow>
          <capsuleGeometry args={[0.22, 3.5, 12, 24]} />
          <primitive object={material} attach="material" />
        </mesh>
        
        {/* Foot at the bottom */}
        <group position={[0, -2.2, 0]}>
          {/* Foot base */}
          <mesh castShadow receiveShadow>
            <capsuleGeometry args={[0.12, 0.6, 8, 16]} />
            <primitive object={footMaterial} attach="material" />
          </mesh>
          
          {/* Toes pointing forward */}
          {createToe(0.15, 0.04, 0.15, -0.1, 0.3)}
          {createToe(0.18, 0.04, 0.05, -0.1, 0.35)}
          {createToe(0.18, 0.04, -0.05, -0.1, 0.35)}
          {createToe(0.15, 0.04, -0.15, -0.1, 0.3)}
        </group>
      </group>
    </group>
  )
}