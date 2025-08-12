'use client'

import { useAnimations, useGLTF } from '@react-three/drei'
import { useEffect, useRef } from 'react'
import * as THREE from 'three'

interface SteveProps {
  position?: [number, number, number]
  rotation?: [number, number, number]
  scale?: number | [number, number, number]
  material?: THREE.Material
  castShadow?: boolean
  receiveShadow?: boolean
  isAudioPlaying?: boolean
}

export default function Steve(props: SteveProps) {
  const groupRef = useRef<THREE.Group>(null!)
  const startTime = Date.now()
  console.log('🤖 Steve: Component rendering/mounting at', startTime, 'ms')
  
  console.log('🤖 Steve: About to call useGLTF at', Date.now(), 'ms')
  const { scene, animations } = useGLTF('/models/Steve-walk.glb')
  const { actions, names } = useAnimations(animations, groupRef)
  const afterGLTF = Date.now()
  console.log('🤖 Steve: useGLTF returned at', afterGLTF, 'ms, scene ready:', !!scene, 'animations:', animations?.length || 0, 'took:', (afterGLTF - startTime), 'ms')
  
  useEffect(() => {
    const effectTime = Date.now()
    console.log('🤖 Steve: Scene object ready in useEffect at', effectTime, 'ms, scene ready:', !!scene)
    console.log('🤖 Steve: Available animations:', names)
    
    // Set up the first available animation
    if (names.length > 0) {
      const firstAnimation = names[0]
      console.log('🤖 Steve: Setting up animation:', firstAnimation)
      const action = actions[firstAnimation]
      if (action) {
        action.reset().fadeIn(0.5).play()
        // Initial state based on audio
        action.paused = !props.isAudioPlaying
        console.log('🤖 Steve: Animation setup complete, paused:', action.paused)
      }
    }
    
    console.log('🤖 Steve: About to return <primitive> element to renderer')
  }, [actions, names])
  
  // Separate effect to control animation playback based on audio state
  useEffect(() => {
    if (names.length > 0) {
      const firstAnimation = names[0]
      const action = actions[firstAnimation]
      if (action) {
        if (props.isAudioPlaying) {
          action.paused = false
          console.log('🤖 Steve: Resuming animation - audio started')
        } else {
          action.paused = true
          console.log('🤖 Steve: Pausing animation - audio stopped')
        }
      }
    }
  }, [props.isAudioPlaying, actions, names])
  
  console.log('🤖 Steve: Returning <group> with <primitive object> at', Date.now(), 'ms')
  
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