'use client'

import { useRef, useLayoutEffect, ReactNode, useState, useCallback } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import { Group } from 'three'
import * as THREE from 'three'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import type { CameraSettings } from '@/types/three'

// Register GSAP plugin
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

// Define keyframes in one place to prevent camera pop
const CAM_START = { x: 0.2, y: 0.4, z: 1.8, rx: 0, ry: 0, rz: 0 }
const CAM_END   = { x: 0.6, y: 0.3, z: 1.6, rx: -0.1, ry: 0.2, rz: 0 }

const GROUP_START = { rx: -0.1, ry: Math.PI * 0.45, rz: 0 }
const GROUP_END   = { rx: -0.2, ry: Math.PI * 0.6, rz: 0 }

interface CameraRigProps {
  children?: ReactNode
  trigger?: string
  cameraStart?: CameraSettings
  cameraEnd?: CameraSettings
  groupRotationStart?: [number, number, number]
  groupRotationEnd?: [number, number, number]
  scrollStart?: string
  scrollEnd?: string
  scrub?: boolean | number
  pin?: boolean
  enableMouseParallax?: boolean
  parallaxIntensity?: number
}

/**
 * Camera rig that handles GSAP ScrollTrigger animations for both camera and scene objects
 */
export default function CameraRig({
  children,
  trigger = 'body',
  cameraStart,
  cameraEnd,
  groupRotationStart,
  groupRotationEnd,
  scrollStart = 'top bottom',
  scrollEnd = 'bottom bottom',
  scrub = 1,
  pin = false,
  enableMouseParallax = true,
  parallaxIntensity = 0.1
}: CameraRigProps) {
  const { camera, viewport } = useThree()
  const groupRef = useRef<Group>(null!)
  const [mouse, setMouse] = useState({ x: 0, y: 0 })
  const mouseTargetRef = useRef({ x: 0, y: 0 })
  const mouseLerpRef = useRef({ x: 0, y: 0 })

  // Mouse tracking for parallax effect
  const handleMouseMove = useCallback((event: MouseEvent) => {
    // Normalize mouse position to -1 to 1 range
    const x = (event.clientX / window.innerWidth) * 2 - 1
    const y = -(event.clientY / window.innerHeight) * 2 + 1
    
    mouseTargetRef.current = { x, y }
  }, [])

  useLayoutEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined' || !groupRef.current) return

    const cam = camera
    const grp = groupRef.current

    // Add mouse event listener for parallax
    if (enableMouseParallax) {
      window.addEventListener('mousemove', handleMouseMove)
    }

    // Helper: apply our start pose to prevent pop
    const applyStartPose = () => {
      gsap.set(cam.position, { x: CAM_START.x, y: CAM_START.y, z: CAM_START.z })
      gsap.set(cam.rotation, { x: CAM_START.rx, y: CAM_START.ry, z: CAM_START.rz })
      gsap.set(grp.rotation, { x: GROUP_START.rx, y: GROUP_START.ry, z: GROUP_START.rz })
      cam.updateProjectionMatrix()
    }

    // 1) Apply BEFORE ScrollTrigger creates any tweens
    applyStartPose()

    // 2) Build the timeline with .to() only (start is already set)
    const tl = gsap.timeline({
      defaults: { ease: 'none', overwrite: 'auto' },
      scrollTrigger: {
        trigger,
        start: scrollStart,
        end: scrollEnd,
        scrub,
        pin,
        // Re-apply start pose on refresh to avoid snap after resize/orientation changes
        onRefreshInit: applyStartPose,
      },
    })

    // Use .to with end values ONLY (since we already set the start)
    tl.to(cam.position, { x: CAM_END.x, y: CAM_END.y, z: CAM_END.z }, 0)
    tl.to(cam.rotation, { 
      x: CAM_END.rx, 
      y: CAM_END.ry, 
      z: CAM_END.rz,
      onUpdate: () => {
        // Update base camera rotation for mouse parallax
        baseRotationRef.current.camera.x = cam.rotation.x
        baseRotationRef.current.camera.y = cam.rotation.y
        baseRotationRef.current.camera.z = cam.rotation.z
      }
    }, 0)
    tl.to(grp.rotation, { 
      x: GROUP_END.rx, 
      y: GROUP_END.ry, 
      z: GROUP_END.rz,
      onUpdate: () => {
        // Update base group rotation for mouse parallax
        baseRotationRef.current.group.x = grp.rotation.x
        baseRotationRef.current.group.y = grp.rotation.y
        baseRotationRef.current.group.z = grp.rotation.z
      }
    }, 0)

    return () => {
      if (enableMouseParallax) {
        window.removeEventListener('mousemove', handleMouseMove)
      }
      tl.scrollTrigger?.kill()
      tl.kill()
    }
  }, [camera, trigger, scrollStart, scrollEnd, scrub, pin, enableMouseParallax, handleMouseMove])

  // Store base rotations to add mouse offset to
  const baseRotationRef = useRef({ camera: { x: 0, y: 0, z: 0 }, group: { x: 0, y: 0, z: 0 } })

  // Mouse parallax animation frame
  useFrame((state, delta) => {
    if (!enableMouseParallax) return

    // Smooth lerp towards mouse target
    mouseLerpRef.current.x = THREE.MathUtils.lerp(mouseLerpRef.current.x, mouseTargetRef.current.x, delta * 3)
    mouseLerpRef.current.y = THREE.MathUtils.lerp(mouseLerpRef.current.y, mouseTargetRef.current.y, delta * 3)

    // Calculate very subtle mouse influence (much smaller values)
    const mouseInfluence = {
      x: mouseLerpRef.current.x * parallaxIntensity * 0.1, // Much smaller multiplier
      y: mouseLerpRef.current.y * parallaxIntensity * 0.1
    }

    // Set camera rotation as base + mouse offset (don't accumulate)
    camera.rotation.x = baseRotationRef.current.camera.x + mouseInfluence.y
    camera.rotation.y = baseRotationRef.current.camera.y + mouseInfluence.x
    
    // Apply even subtler influence to the group
    if (groupRef.current) {
      groupRef.current.rotation.x = baseRotationRef.current.group.x + mouseInfluence.y * 0.3
      groupRef.current.rotation.y = baseRotationRef.current.group.y + mouseInfluence.x * 0.3
    }
  })

  return <group ref={groupRef}>{children}</group>
}

// Re-export THREE for convenience
export * as THREE from 'three'