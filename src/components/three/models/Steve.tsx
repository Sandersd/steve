'use client'

import { useAnimations, useGLTF } from '@react-three/drei'
import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'

interface SteveProps {
  position?: [number, number, number]
  rotation?: [number, number, number]
  scale?: number | [number, number, number]
  material?: THREE.Material
  castShadow?: boolean
  receiveShadow?: boolean
  isAudioPlaying?: boolean
  audioData?: {
    volume: number
    bass: number
    mid: number
    treble: number
    beat: boolean
    beatStrength: number
  }
}

export default function Steve(props: SteveProps) {
  const groupRef = useRef<THREE.Group>(null!)
  const [currentAnimIndex, setCurrentAnimIndex] = useState(0)
  const animationTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  
  // Removed performance-impacting console logs
  const { scene, animations } = useGLTF('/models/good-steve-dance.glb')
  const { actions, names } = useAnimations(animations, groupRef)
  
  // Function to play random animation
  const playRandomAnimation = () => {
    if (names.length > 0) {
      // Stop current animation
      const currentAction = actions[names[currentAnimIndex]]
      if (currentAction) {
        currentAction.fadeOut(0.2) // Faster transition for beat sync
      }
      
      // Calculate random index (avoid repeating current)
      let nextIndex = currentAnimIndex
      if (names.length > 1) {
        do {
          nextIndex = Math.floor(Math.random() * names.length)
        } while (nextIndex === currentAnimIndex)
      }
      setCurrentAnimIndex(nextIndex)
      
      // Play next animation
      const nextAction = actions[names[nextIndex]]
      if (nextAction) {
        nextAction.reset().fadeIn(0.2).play()
        nextAction.paused = !props.isAudioPlaying
      }
    }
  }
  
  // Beat detection effect
  useEffect(() => {
    if (props.audioData?.beat && props.isAudioPlaying && names.length > 1) {
      // Change animation on strong beats
      if (props.audioData.beatStrength > 0.7) {
        playRandomAnimation()
      }
    }
  }, [props.audioData?.beat])
  
  useEffect(() => {
    const effectTime = Date.now()
    
    // Set up the first animation
    if (names.length > 0) {
      const firstAnimation = names[0]
      const action = actions[firstAnimation]
      if (action) {
        action.reset().play()
        action.paused = !props.isAudioPlaying
        
        // No auto-cycling timeout needed - using beat sync instead
      }
    }
    
    return () => {
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current)
      }
    }
  }, [actions, names])
  
  // Control animation playback and cycling based on audio state
  useEffect(() => {
    if (names.length > 0) {
      const currentAction = actions[names[currentAnimIndex]]
      if (currentAction) {
        if (props.isAudioPlaying) {
          currentAction.paused = false
          
          // Beat sync will handle animation changes
        } else {
          currentAction.paused = true
          
          // Stop cycling
          if (animationTimeoutRef.current) {
            clearTimeout(animationTimeoutRef.current)
            animationTimeoutRef.current = undefined
          }
        }
      }
    }
  }, [props.isAudioPlaying, actions, names, currentAnimIndex])
  
  // Removed performance-impacting console log
  
  // Apply material adjustments to reduce shininess
  useEffect(() => {
    if (scene) {
      scene.traverse((child: THREE.Object3D) => {
        if ('isMesh' in child && child.isMesh) {
          const mesh = child as THREE.Mesh
          if (mesh.material && 'metalness' in mesh.material) {
            const mat = mesh.material as THREE.MeshStandardMaterial
            mat.metalness = Math.max(0, mat.metalness - 0.3) // Reduce metalness
            mat.roughness = Math.min(1, mat.roughness + 0.2) // Increase roughness
            if (mat.emissiveIntensity) {
              mat.emissiveIntensity *= 0.5 // Reduce glow
            }
          }
        }
      })
    }
  }, [scene])
  
  // Apply custom material if provided
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