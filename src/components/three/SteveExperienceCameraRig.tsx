'use client'

import React, { useRef, useEffect, useCallback } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'
import * as THREE from 'three'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

interface SteveExperienceCameraRigProps {
  children: React.ReactNode
}

export default function SteveExperienceCameraRig({ children }: SteveExperienceCameraRigProps) {
  const { camera } = useThree()
  const rigRef = useRef<THREE.Group>(null!)
  const groupARef = useRef<THREE.Group>(null!)
  const groupBRef = useRef<THREE.Group>(null!)
  const bgBitsRef = useRef<THREE.Group>(null!)
  
  // Mouse parallax refs
  const mouseTargetRef = useRef({ x: 0, y: 0 })
  const mouseLerpRef = useRef({ x: 0, y: 0 })
  const baseRotationRef = useRef({ camera: { x: 0, y: 0, z: 0 }, groupA: { x: 0, y: 0, z: 0 } })

  // Mouse tracking for parallax effect
  const handleMouseMove = useCallback((event: MouseEvent) => {
    const x = (event.clientX / window.innerWidth) * 2 - 1
    const y = -(event.clientY / window.innerHeight) * 2 + 1
    mouseTargetRef.current = { x, y }
  }, [])
  
  useEffect(() => {
    if (typeof window === 'undefined') return

    // Add mouse event listener for parallax
    window.addEventListener('mousemove', handleMouseMove)

    // Set initial visibility for UI elements
    gsap.set('#heroCopy', { opacity: 1 })
    gsap.set('#sidePanel', { opacity: 0, x: 20 })
    gsap.set('#leftPanel', { opacity: 0, x: -20 })
    gsap.set('#bottomPanel', { opacity: 0, y: 20 })
    
    // Set initial camera position
    camera.position.set(0, 0.45, 2.0)
    camera.rotation.set(0, 0, 0)

    // Set initial positions for 3D groups - make them visible immediately
    if (groupARef.current) {
      // groupA (Steve) - large on the right initially
      groupARef.current.position.set(0.4, 0, 0)
      groupARef.current.rotation.set(0, 0, 0)
      groupARef.current.scale.set(1, 1, 1)
      groupARef.current.visible = true
    }

    if (groupBRef.current) {
      // groupB (geometric shapes) - starts offscreen right but visible
      groupBRef.current.position.set(0.6, 0, 0)
      groupBRef.current.rotation.set(0, -0.4, 0)
      groupBRef.current.visible = false // Will become visible at 50% scroll
    }

    if (bgBitsRef.current) {
      // bgBits (music particles) - fully visible from start
      bgBitsRef.current.visible = true
      bgBitsRef.current.children.forEach((child, i) => {
        if (child.material) {
          child.material.opacity = 1
          child.material.transparent = false
        }
      })
    }

    // Create separate ScrollTriggers for UI elements
    ScrollTrigger.create({
      trigger: '.experience-container',
      start: 'top top',
      end: '+=800%', // Match the main ScrollTrigger length
      scrub: 0.5,
      onUpdate: (self) => {
        const progress = self.progress
        
        // 0–10%: heroCopy fades out
        if (progress < 0.1) {
          const fadeProgress = progress / 0.1
          gsap.set('#heroCopy', { opacity: 1 - fadeProgress })
          
          // "scroll_to_start" badge also fades
          gsap.set('#scrollBadge', { opacity: 1 - fadeProgress })
        } else {
          gsap.set('#heroCopy', { opacity: 0 })
          gsap.set('#scrollBadge', { opacity: 0 })
        }
        
        // 20–35%: sidePanel slides in
        if (progress < 0.2) {
          // Before 20%: hide completely
          gsap.set('#sidePanel', { opacity: 0, x: 20, pointerEvents: 'none', visibility: 'hidden' })
        } else if (progress >= 0.2 && progress < 0.35) {
          const panelProgress = (progress - 0.2) / 0.15
          gsap.set('#sidePanel', { 
            opacity: panelProgress,
            x: 20 - (20 * panelProgress),
            pointerEvents: panelProgress > 0.5 ? 'auto' : 'none',
            visibility: 'visible'
          })
        } else if (progress >= 0.35 && progress < 0.45) {
          // Panel stays visible briefly
          gsap.set('#sidePanel', { opacity: 1, x: 0, pointerEvents: 'auto', visibility: 'visible' })
        } else if (progress >= 0.45) {
          // Panel fades out as left panel comes in
          const fadeProgress = (progress - 0.45) / 0.1
          const opacity = Math.max(0, 1 - fadeProgress)
          gsap.set('#sidePanel', { 
            opacity: opacity,
            x: 20,
            pointerEvents: opacity > 0.1 ? 'auto' : 'none',
            visibility: opacity > 0 ? 'visible' : 'hidden'
          })
        }

        // 50–65%: leftPanel slides in from left
        if (progress < 0.5) {
          // Before 50%: hide completely
          gsap.set('#leftPanel', { opacity: 0, x: -20, pointerEvents: 'none', visibility: 'hidden' })
        } else if (progress >= 0.5 && progress < 0.65) {
          const leftProgress = (progress - 0.5) / 0.15
          gsap.set('#leftPanel', { 
            opacity: leftProgress,
            x: -20 + (20 * leftProgress),
            pointerEvents: leftProgress > 0.5 ? 'auto' : 'none',
            visibility: 'visible'
          })
        } else if (progress >= 0.65 && progress < 0.75) {
          // Left panel stays visible briefly
          gsap.set('#leftPanel', { opacity: 1, x: 0, pointerEvents: 'auto', visibility: 'visible' })
        } else if (progress >= 0.75) {
          // Left panel fades out as bottom panel comes in
          const fadeProgress = (progress - 0.75) / 0.1
          const opacity = Math.max(0, 1 - fadeProgress)
          gsap.set('#leftPanel', { 
            opacity: opacity,
            x: -20,
            pointerEvents: opacity > 0.1 ? 'auto' : 'none',
            visibility: opacity > 0 ? 'visible' : 'hidden'
          })
        }

        // 80–95%: bottomPanel slides up from bottom
        if (progress < 0.8) {
          // Before 80%: hide completely
          gsap.set('#bottomPanel', { opacity: 0, y: 20, pointerEvents: 'none', visibility: 'hidden' })
        } else if (progress >= 0.8 && progress < 0.95) {
          const bottomProgress = (progress - 0.8) / 0.15
          gsap.set('#bottomPanel', { 
            opacity: bottomProgress,
            y: 20 - (20 * bottomProgress),
            pointerEvents: bottomProgress > 0.5 ? 'auto' : 'none',
            visibility: 'visible'
          })
        } else if (progress >= 0.95) {
          // Bottom panel stays visible
          gsap.set('#bottomPanel', { opacity: 1, y: 0, pointerEvents: 'auto', visibility: 'visible' })
        }
      }
    })

    // Create main ScrollTrigger for pinning and 3D choreography
    ScrollTrigger.create({
      trigger: '.experience-container',
      start: 'top top',
      end: '+=800%', // Increased from 500% to 800% for longer scroll
      pin: '.experience-container',
      pinSpacing: true,
      onUpdate: (self) => {
        const progress = self.progress
        
        // === CAMERA CHOREOGRAPHY ===
        let targetX = 0, targetY = 0.45, targetZ = 2.0
        let targetRotX = 0, targetRotY = 0, targetRotZ = 0
        
        const easeInOutCubic = (t: number) => {
          return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
        }
        
        if (progress <= 0.1) {
          // 0-10%: Initial position
          targetX = 0; targetY = 0.45; targetZ = 2.0
          targetRotY = 0
        } else if (progress <= 0.25) {
          // 10-25%: Gentle dolly-in + yaw left
          const t = easeInOutCubic((progress - 0.1) / 0.15)
          targetX = 0 + (0.2 * t)
          targetY = 0.45 - (0.1 * t) // 0.45 → 0.35
          targetZ = 2.0 - (0.3 * t) // 2.0 → 1.7
          targetRotY = 0 + (0.2 * t) // yaw left slightly
        } else if (progress <= 0.4) {
          // 25-40%: Hold position for scan/side panel
          targetX = 0.2; targetY = 0.35; targetZ = 1.7
          targetRotY = 0.2
        } else if (progress <= 0.55) {
          // 40-55%: Transition prep
          const t = easeInOutCubic((progress - 0.4) / 0.15)
          targetX = 0.2; targetY = 0.35; targetZ = 1.7
          targetRotY = 0.2 + (0.15 * t) // slight adjustment
        } else if (progress <= 0.7) {
          // 55-70%: Focus on groupB, pan right
          const t = easeInOutCubic((progress - 0.55) / 0.15)
          targetX = 0.2 + (0.15 * t) // pan right: 0.2 → 0.35
          targetY = 0.35
          targetZ = 1.7
          targetRotY = 0.35
          targetRotX = 0 - (0.06 * t) // subtle pitch down
        } else if (progress <= 0.85) {
          // 70-85%: Ease back to neutral
          const t = easeInOutCubic((progress - 0.7) / 0.15)
          targetX = 0.35 - (0.35 * t) // back to center
          targetY = 0.35 + (0.1 * t) // rise slightly
          targetZ = 1.7 + (0.3 * t) // pull back
          targetRotY = 0.35 - (0.35 * t) // straighten
          targetRotX = -0.06 + (0.06 * t) // level out
        } else {
          // 85-100%: Final neutral position
          targetX = 0; targetY = 0.45; targetZ = 2.0
          targetRotY = 0; targetRotX = 0
        }
        
        // Apply camera movement with lerp
        const lerpFactor = 0.1
        camera.position.x += (targetX - camera.position.x) * lerpFactor
        camera.position.y += (targetY - camera.position.y) * lerpFactor
        camera.position.z += (targetZ - camera.position.z) * lerpFactor
        
        // Store base rotations for mouse parallax
        baseRotationRef.current.camera.x = targetRotX
        baseRotationRef.current.camera.y = targetRotY
        
        camera.rotation.x += (targetRotX - camera.rotation.x) * lerpFactor
        camera.rotation.y += (targetRotY - camera.rotation.y) * lerpFactor
        
        // === STEVE (groupA) CHOREOGRAPHY ===
        if (groupARef.current) {
          let steveX = 0.4, steveY = 0, steveZ = 0
          let steveRotY = 0, steveRotX = 0, steveScale = 1
          
          const time = Date.now() * 0.001
          
          if (progress <= 0.1) {
            // 0-10%: Large on right, subtle idle movement
            steveX = 0.4; steveY = 0; steveZ = 0
            steveRotY = 0 + Math.sin(time) * 0.05 // subtle idle rotation
            steveRotX = Math.sin(time * 0.7) * 0.02 // slight head nod
            steveScale = 1 + Math.sin(time * 1.2) * 0.02 // subtle breathing scale
          } else if (progress <= 0.25) {
            // 10-25%: Dynamic slide left with spin and bounce
            const t = easeInOutCubic((progress - 0.1) / 0.15)
            steveX = 0.4 + (-0.6 * t) // 0.4 → -0.2 (further left)
            steveY = 0 + (0.1 * t) + Math.sin(t * Math.PI * 2) * 0.05 // bounce effect
            steveRotY = 0 + (0.5 * t) + Math.sin(time) * 0.03 // spin with wobble
            steveRotX = Math.sin(t * Math.PI) * 0.1 // dramatic nod during movement
            steveScale = 1 + (0.1 * t) + Math.sin(time * 2) * 0.02
          } else if (progress <= 0.45) {
            // 25-45%: Center stage with dance-like movement
            const localT = (progress - 0.25) / 0.2
            steveX = -0.2 + Math.sin(time * 2) * 0.05 // gentle side-to-side
            steveY = 0.1 + Math.sin(time * 3) * 0.03 // up and down bob
            steveZ = Math.sin(time * 1.5) * 0.02 // forward/back sway
            steveRotY = 0.5 + Math.sin(time * 1.8) * 0.1 // continuous rotation
            steveRotX = Math.sin(time * 2.2) * 0.05 // head movement
            steveScale = 1.1 + Math.sin(time * 2.5) * 0.03 // pulsing scale
          } else if (progress <= 0.65) {
            // 45-65%: Dramatic retreat with spin
            const t = easeInOutCubic((progress - 0.45) / 0.2)
            steveX = -0.2 + (0.3 * t) // move back right
            steveY = 0.1 + (0.3 * t) + Math.sin(t * Math.PI * 3) * 0.08 // spiraling up
            steveZ = 0 + (-0.3 * t) // move back
            steveRotY = 0.5 + (Math.PI * 2 * t) // full spin during retreat
            steveRotX = Math.sin(t * Math.PI * 4) * 0.15 // dramatic head movement
            steveScale = 1.1 - (0.3 * t) // shrinking
          } else {
            // 65%+: Floating in background with gentle movement
            steveX = 0.1 + Math.sin(time * 0.5) * 0.03
            steveY = 0.4 + Math.sin(time * 0.7) * 0.02
            steveZ = -0.3 + Math.sin(time * 0.3) * 0.01
            steveRotY = 0.5 + Math.PI * 2 + Math.sin(time * 0.8) * 0.05
            steveRotX = Math.sin(time * 0.6) * 0.02
            steveScale = 0.8 + Math.sin(time * 1.1) * 0.01
          }
          
          // Apply Steve transformations
          groupARef.current.position.x += (steveX - groupARef.current.position.x) * lerpFactor
          groupARef.current.position.y += (steveY - groupARef.current.position.y) * lerpFactor
          groupARef.current.position.z += (steveZ - groupARef.current.position.z) * lerpFactor
          
          // Apply scale
          groupARef.current.scale.setScalar(steveScale)
          
          // Store base rotation for mouse parallax
          baseRotationRef.current.groupA.y = steveRotY
          
          groupARef.current.rotation.x += (steveRotX - groupARef.current.rotation.x) * lerpFactor
          groupARef.current.rotation.y += (steveRotY - groupARef.current.rotation.y) * lerpFactor
          
          // No opacity handling - Steve stays fully visible
        }
        
        // === GEOMETRIC SHAPES (groupB) CHOREOGRAPHY ===
        if (groupBRef.current) {
          let groupBX = 0.6, groupBY = 0, groupBZ = 0
          let groupBRotX = 0, groupBRotY = -0.4, groupBRotZ = 0, groupBOpacity = 0, groupBScale = 1
          
          if (progress >= 0.5 && progress <= 0.7) {
            // 50-70%: Energetic entrance with bouncing effect
            const t = easeInOutCubic((progress - 0.5) / 0.2)
            groupBX = 0.6 + (-0.5 * t) // 0.6 → 0.1
            groupBY = 0 + Math.sin(t * Math.PI * 2) * 0.12 // bouncy entrance
            groupBZ = 0 + (0.15 * t) + Math.sin(t * Math.PI) * 0.08 // forward with bounce
            groupBRotX = Math.sin(t * Math.PI * 2) * 0.15 // moderate tumble
            groupBRotY = -0.4 + (0.8 * t) + Math.sin(t * Math.PI) * 0.15 // rotation with wobble
            groupBRotZ = Math.sin(t * Math.PI * 3) * 0.1 // moderate Z tilt
            groupBOpacity = t // 0 → 1
            groupBScale = 0.5 + (0.8 * t) + Math.sin(t * Math.PI * 4) * 0.05 // growing with pulse
            groupBRef.current.visible = true
          } else if (progress > 0.7 && progress <= 0.85) {
            // 70-85%: Lively floating with energetic movement
            const t = (progress - 0.7) / 0.15
            const time = Date.now() * 0.001
            groupBX = 0.1 + Math.sin(time * 1.8) * 0.06 // energetic sway
            groupBY = 0 + Math.sin(time * 2.5) * 0.04 + Math.cos(time * 3) * 0.03 // bouncy hover
            groupBZ = 0.1 + Math.sin(time * 1.2) * 0.03 // depth variation
            groupBRotX = Math.sin(time * 1.5) * 0.08 // moderate tilt animation
            groupBRotY = 0.4 + Math.sin(time * 0.8) * 0.2 // controlled rotation back and forth
            groupBRotZ = Math.sin(time * 1.1) * 0.06 // gentle Z wobble
            groupBOpacity = 1 // fully visible
            groupBScale = 1.2 + Math.sin(time * 3) * 0.08 + Math.cos(time * 2) * 0.04 // energetic pulsing
          } else if (progress > 0.85) {
            // 85%+: Dynamic exit with flourish
            const t = Math.min((progress - 0.85) / 0.1, 1)
            groupBX = 0.1 + (0.5 * t) + Math.sin(t * Math.PI * 3) * 0.08 // exit right with wobble
            groupBY = 0 + (0.3 * t) + Math.sin(t * Math.PI * 2) * 0.06 // rising with bounce
            groupBZ = 0.1 + (-0.3 * t) // moving back
            groupBRotX = Math.sin(t * Math.PI * 2) * 0.1 // gentle farewell tumble
            groupBRotY = 0.4 + (0.5 * t) // moderate rotation as it leaves
            groupBRotZ = Math.sin(t * Math.PI) * 0.08 // slight tilt
            groupBOpacity = Math.max(0, 1 - t) // fade out
            groupBScale = 1.2 - (0.5 * t) + Math.sin(t * Math.PI * 4) * 0.03 // shrinking with pulse
            if (groupBOpacity <= 0) {
              groupBRef.current.visible = false
            }
          }
          
          if (groupBRef.current.visible) {
            // Apply all transformations
            groupBRef.current.position.x += (groupBX - groupBRef.current.position.x) * lerpFactor
            groupBRef.current.position.y += (groupBY - groupBRef.current.position.y) * lerpFactor
            groupBRef.current.position.z += (groupBZ - groupBRef.current.position.z) * lerpFactor
            
            groupBRef.current.rotation.x += (groupBRotX - groupBRef.current.rotation.x) * lerpFactor
            groupBRef.current.rotation.y += (groupBRotY - groupBRef.current.rotation.y) * lerpFactor
            groupBRef.current.rotation.z += (groupBRotZ - groupBRef.current.rotation.z) * lerpFactor
            
            groupBRef.current.scale.setScalar(groupBScale)
            
            groupBRef.current.traverse((child) => {
              if (child.material) {
                child.material.transparent = true
                child.material.opacity = groupBOpacity
              }
            })
          }
        }
        
        // === PARTICLES (bgBits) CHOREOGRAPHY ===
        // Particles stay fully visible - no opacity changes
        if (bgBitsRef.current) {
          // Just ensure they're visible
          bgBitsRef.current.visible = true
        }
      }
    })

    // Cleanup
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      ScrollTrigger.getAll().forEach(trigger => trigger.kill())
    }
  }, [camera, handleMouseMove])

  // Mouse parallax animation frame
  useFrame((state, delta) => {
    // Smooth lerp for mouse movement
    mouseLerpRef.current.x = THREE.MathUtils.lerp(mouseLerpRef.current.x, mouseTargetRef.current.x, delta * 4)
    mouseLerpRef.current.y = THREE.MathUtils.lerp(mouseLerpRef.current.y, mouseTargetRef.current.y, delta * 4)

    // Mouse influence
    const mouseInfluence = {
      x: mouseLerpRef.current.x * 0.05,
      y: mouseLerpRef.current.y * 0.05
    }
    
    // Add subtle oscillation
    const time = state.clock.elapsedTime
    const oscillation = {
      x: Math.sin(time * 0.5) * 0.005,
      y: Math.cos(time * 0.3) * 0.003
    }

    // Apply mouse parallax to camera
    camera.rotation.x = baseRotationRef.current.camera.x + mouseInfluence.y + oscillation.y
    camera.rotation.y = baseRotationRef.current.camera.y + mouseInfluence.x + oscillation.x
    
    // Apply mouse parallax to Steve (groupA)
    if (groupARef.current) {
      groupARef.current.rotation.y = baseRotationRef.current.groupA.y + mouseInfluence.x * 0.3 - oscillation.x * 0.5
      groupARef.current.rotation.x = mouseInfluence.y * 0.2 + oscillation.y * 0.3
    }
  })

  // Pass refs to children
  return (
    <group ref={rigRef}>
      {React.cloneElement(children as React.ReactElement, {
        groupARef,
        groupBRef,
        bgBitsRef
      })}
    </group>
  )
}