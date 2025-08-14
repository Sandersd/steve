'use client'

import { useAnimations, useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useEffect, useRef } from 'react'
import * as THREE from 'three'

interface SteveLegsProps {
  position?: [number, number, number]
  rotation?: [number, number, number]
  scale?: number | [number, number, number]
  material?: THREE.Material
  castShadow?: boolean
  receiveShadow?: boolean
  isAudioPlaying?: boolean
}

export default function SteveLegs(props: SteveLegsProps) {
  const groupRef = useRef<THREE.Group>(null!)
  const { scene, animations } = useGLTF('/models/good-steve-legs.glb')
  const { actions, names } = useAnimations(animations, groupRef)
  
  useEffect(() => {
    
    // Set up the first available animation
    if (names.length > 0) {
      const firstAnimation = names[0]
      const action = actions[firstAnimation]
      if (action) {
        action.reset().play()
        // Initial state based on audio
        action.paused = !props.isAudioPlaying
      }
    }
    
  }, [actions, names])
  
  // Separate effect to control animation playback based on audio state
  useEffect(() => {
    if (names.length > 0) {
      const firstAnimation = names[0]
      const action = actions[firstAnimation]
      if (action) {
        if (props.isAudioPlaying) {
          action.paused = false
        } else {
          action.paused = true
        }
      }
    }
  }, [props.isAudioPlaying, actions, names])
  
  // Add wiggle animation
  useFrame((state) => {
    if (groupRef.current) {
      const time = state.clock.getElapsedTime()
      
      // Legs wiggle with different phase than arms
      groupRef.current.rotation.z = Math.cos(time * 2.5) * 0.04 // Opposite phase wiggle
      groupRef.current.rotation.x = Math.sin(time * 1.8) * 0.025 // Different frequency
      
      // Swaying motion
      groupRef.current.position.x = (props.position?.[0] || 0) + Math.sin(time * 1.5) * 0.03
    }
  })
  
  // Apply material directly if provided
  if (props.material && scene) {
    scene.traverse((child: THREE.Object3D) => {
      if ('isMesh' in child && child.isMesh && props.material) {
        (child as THREE.Mesh).material = props.material
      }
    })
  }
  
  return (
    <group ref={groupRef} position={props.position} rotation={props.rotation} scale={props.scale}>
      <primitive object={scene} castShadow={props.castShadow} receiveShadow={props.receiveShadow} />
    </group>
  )
}