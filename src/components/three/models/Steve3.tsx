'use client'

import { useAnimations, useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useEffect, useRef } from 'react'
import * as THREE from 'three'

interface Steve3Props {
  position?: [number, number, number]
  rotation?: [number, number, number]
  scale?: number | [number, number, number]
  material?: THREE.Material
  castShadow?: boolean
  receiveShadow?: boolean
  isAudioPlaying?: boolean
}

export default function Steve3(props: Steve3Props) {
  const groupRef = useRef<THREE.Group>(null!)
  const { scene, animations } = useGLTF('/models/good-steve.glb')
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
  
  // Add gentle bobble animation
  useFrame((state) => {
    if (groupRef.current) {
      const time = state.clock.getElapsedTime()
      
      // Gentle bobbing motion
      groupRef.current.position.y = (props.position?.[1] || 0) + Math.sin(time * 1.2) * 0.05
      
      // Slight rotation sway
      groupRef.current.rotation.y = (props.rotation?.[1] || 0) + Math.sin(time * 0.8) * 0.02
      
      // Very subtle breathing-like scale
      const breathScale = 1 + Math.sin(time * 2) * 0.01
      groupRef.current.scale.setScalar((props.scale as number || 1) * breathScale)
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
      <primitive object={scene} castShadow={props.castShadow} receiveShadow={props.receiveShadow} rotation={[-0.1, 0, 0]} />
    </group>
  )
}