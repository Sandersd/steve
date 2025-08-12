'use client'

import { useFrame, useThree } from '@react-three/fiber'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ReactNode, useCallback, useLayoutEffect, useRef } from 'react'
import * as THREE from 'three'
import { Group } from 'three'

// Register GSAP plugin
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

// Enhanced keyframes for more dramatic and spectacular animations
const CAM_START = { x: 0.3, y: 0.6, z: 2.2, rx: 0, ry: 0, rz: 0 }
const CAM_MID1  = { x: 0.8, y: 0.2, z: 1.4, rx: -0.15, ry: 0.3, rz: 0.05 }
const CAM_MID2  = { x: -0.4, y: 0.8, z: 1.8, rx: 0.1, ry: -0.2, rz: -0.05 }
const CAM_END   = { x: 0.1, y: 0.4, z: 1.2, rx: -0.2, ry: 0.15, rz: 0 }

const GROUP_START = { rx: -0.1, ry: Math.PI * 0.4, rz: 0 }
const GROUP_MID1  = { rx: 0.1, ry: Math.PI * 0.8, rz: 0.1 }
const GROUP_MID2  = { rx: -0.3, ry: Math.PI * 1.2, rz: -0.1 }
const GROUP_END   = { rx: 0.05, ry: Math.PI * 1.6, rz: 0.05 }

interface CameraRigProps {
  children?: ReactNode
  trigger?: string
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
  scrollStart = 'top bottom',
  scrollEnd = 'bottom bottom',
  scrub = 1,
  pin = false,
  enableMouseParallax = true,
  parallaxIntensity = 0.15 // Enhanced parallax for more responsiveness
}: CameraRigProps) {
  const { camera } = useThree()
  const groupRef = useRef<Group>(null!)
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

    // 2) Build the timeline with multiple keyframes for cinematic movement
    const tl = gsap.timeline({
      defaults: { ease: 'power2.inOut', overwrite: 'auto' },
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

    // Camera movement with multiple dramatic keyframes
    tl.to(cam.position, { 
      x: CAM_MID1.x, y: CAM_MID1.y, z: CAM_MID1.z,
      ease: 'power3.out'
    }, 0)
    .to(cam.position, { 
      x: CAM_MID2.x, y: CAM_MID2.y, z: CAM_MID2.z,
      ease: 'power2.inOut'
    }, 0.4)
    .to(cam.position, { 
      x: CAM_END.x, y: CAM_END.y, z: CAM_END.z,
      ease: 'power3.in'
    }, 0.7)
    
    // Camera rotation with enhanced cinematics
    tl.to(cam.rotation, { 
      x: CAM_MID1.rx, y: CAM_MID1.ry, z: CAM_MID1.rz,
      ease: 'power3.out',
      onUpdate: () => {
        baseRotationRef.current.camera.x = cam.rotation.x
        baseRotationRef.current.camera.y = cam.rotation.y
        baseRotationRef.current.camera.z = cam.rotation.z
      }
    }, 0)
    .to(cam.rotation, { 
      x: CAM_MID2.rx, y: CAM_MID2.ry, z: CAM_MID2.rz,
      ease: 'power2.inOut'
    }, 0.4)
    .to(cam.rotation, { 
      x: CAM_END.rx, y: CAM_END.ry, z: CAM_END.rz,
      ease: 'power3.in'
    }, 0.7)
    
    // Group rotation with dramatic multi-stage movement
    tl.to(grp.rotation, { 
      x: GROUP_MID1.rx, y: GROUP_MID1.ry, z: GROUP_MID1.rz,
      ease: 'power3.out',
      onUpdate: () => {
        baseRotationRef.current.group.x = grp.rotation.x
        baseRotationRef.current.group.y = grp.rotation.y
        baseRotationRef.current.group.z = grp.rotation.z
      }
    }, 0)
    .to(grp.rotation, { 
      x: GROUP_MID2.rx, y: GROUP_MID2.ry, z: GROUP_MID2.rz,
      ease: 'elastic.out(1, 0.3)' // Elastic effect for extra dynamism
    }, 0.3)
    .to(grp.rotation, { 
      x: GROUP_END.rx, y: GROUP_END.ry, z: GROUP_END.rz,
      ease: 'back.out(1.7)' // Back easing for bouncy finish
    }, 0.6)

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

    // Enhanced smooth lerp with faster response
    mouseLerpRef.current.x = THREE.MathUtils.lerp(mouseLerpRef.current.x, mouseTargetRef.current.x, delta * 4)
    mouseLerpRef.current.y = THREE.MathUtils.lerp(mouseLerpRef.current.y, mouseTargetRef.current.y, delta * 4)

    // Enhanced mouse influence for more dramatic parallax
    const mouseInfluence = {
      x: mouseLerpRef.current.x * parallaxIntensity * 0.2, // Increased multiplier for more effect
      y: mouseLerpRef.current.y * parallaxIntensity * 0.2
    }
    
    // Add subtle oscillation for organic feel
    const time = state.clock.elapsedTime
    const oscillation = {
      x: Math.sin(time * 0.5) * 0.01,
      y: Math.cos(time * 0.3) * 0.008
    }

    // Set camera rotation with enhanced effects
    camera.rotation.x = baseRotationRef.current.camera.x + mouseInfluence.y + oscillation.y
    camera.rotation.y = baseRotationRef.current.camera.y + mouseInfluence.x + oscillation.x
    
    // Apply enhanced influence to the group with counter-rotation for dynamic feel
    if (groupRef.current) {
      groupRef.current.rotation.x = baseRotationRef.current.group.x + mouseInfluence.y * 0.4 - oscillation.y * 0.5
      groupRef.current.rotation.y = baseRotationRef.current.group.y + mouseInfluence.x * 0.4 - oscillation.x * 0.5
      groupRef.current.rotation.z = baseRotationRef.current.group.z + mouseInfluence.x * 0.1 // Add Z-axis tilt
    }
  })

  return <group ref={groupRef}>{children}</group>
}

// Re-export THREE for convenience
export * as THREE from 'three'
