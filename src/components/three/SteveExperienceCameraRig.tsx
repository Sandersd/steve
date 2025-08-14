'use client'

import React, { useRef, useEffect, useCallback, memo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'
import * as THREE from 'three'
import type { CornerSettings } from '@/components/admin/CornerAdminPanel'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

interface SteveExperienceCameraRigProps {
  children: React.ReactNode
  adminSettings?: CornerSettings | null
}

const SteveExperienceCameraRig = memo(function SteveExperienceCameraRig({ children, adminSettings }: SteveExperienceCameraRigProps) {
  const { camera } = useThree()
  const rigRef = useRef<THREE.Group>(null!)
  const groupARef = useRef<THREE.Group>(null!)
  const groupBRef = useRef<THREE.Group>(null!)
  const groupCRef = useRef<THREE.Group>(null!)
  const groupDRef = useRef<THREE.Group>(null!)
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

    // Set initial visibility for UI elements (only ones that exist on main page)
    gsap.set('#heroCopy', { opacity: 1 })
    // Remove non-existent panels - those are from /experience page
    
    // Set initial camera position - MUST MATCH 85-100% end values exactly
    camera.position.set(0, 0.45, 2.0) // Match the 85-100% scroll target exactly
    camera.rotation.set(-0.1, 0, 0) // Match the 85-100% rotation exactly

    // Set initial positions for 3D groups - make them visible immediately
    if (groupARef.current) {
      // groupA (Steve) - large on the right initially, lower on screen
      groupARef.current.position.set(0.4, -0.2, 0) // Lower initial position
      groupARef.current.rotation.set(0, 0, 0) // No initial tilt, will be applied to model
      groupARef.current.scale.set(1, 1, 1)
      groupARef.current.visible = true
    }

    if (groupBRef.current) {
      // groupB (steve arms) - starts below screen
      groupBRef.current.position.set(0, -3, 0)
      groupBRef.current.rotation.set(0, 0, 0)
      groupBRef.current.scale.set(1, 1, 1)
      groupBRef.current.visible = false // Will become visible at 30% scroll
    }

    if (groupCRef.current) {
      // groupC (cartoon legs) - starts hidden above screen
      groupCRef.current.position.set(0, 4, 0) // Start above screen
      groupCRef.current.rotation.set(0, 0, 0)
      groupCRef.current.scale.set(1, 1, 1)
      groupCRef.current.visible = false // Will become visible at 60% scroll
    }

    if (groupDRef.current) {
      // groupD (Steve3) - model starts hidden below screen, facing left
      groupDRef.current.position.set(0, -3, -2) // Start lower and even further back
      groupDRef.current.rotation.set(0, 0, 0)
      groupDRef.current.scale.set(1, 1, 1)
      groupDRef.current.visible = false // Will become visible at 90% scroll
    }

    if (bgBitsRef.current) {
      // bgBits (music particles) - fully visible from start
      bgBitsRef.current.visible = true
      bgBitsRef.current.children.forEach((child) => {
        if ('material' in child && child.material) {
          const material = child.material as any
          material.opacity = 1
          material.transparent = false
        }
      })
    }

    // Create single ScrollTrigger for both UI and 3D choreography
    ScrollTrigger.create({
      trigger: '.experience-container',
      start: 'top top',
      end: '+=800%',
      pin: '.experience-container',
      pinSpacing: true,
      scrub: 0.1, // Consistent scrub for both UI and 3D
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
        
        // 10–25%: "HE IS ORAAAANGE" text fades in
        if (progress < 0.1) {
          // Before 10%: hide completely
          gsap.set('#orangeText', { opacity: 0, scale: 0.8, rotation: 1, visibility: 'hidden' })
        } else if (progress >= 0.1 && progress < 0.25) {
          const textProgress = (progress - 0.1) / 0.15
          gsap.set('#orangeText', { 
            opacity: textProgress,
            scale: 0.8 + (0.2 * textProgress), // 0.8 → 1.0
            rotation: 1 + (Math.sin(Date.now() * 0.0015) * 1), // gentle rotation
            visibility: 'visible'
          })
        } else if (progress >= 0.25 && progress < 0.35) {
          // Text stays visible briefly with animation
          gsap.set('#orangeText', { 
            opacity: 1, 
            scale: 1,
            rotation: 1 + (Math.sin(Date.now() * 0.0015) * 1),
            visibility: 'visible' 
          })
        } else if (progress >= 0.35 && progress < 0.4) {
          // Text fades out as next text comes in
          const fadeProgress = (progress - 0.35) / 0.05
          const opacity = Math.max(0, 1 - fadeProgress)
          gsap.set('#orangeText', { 
            opacity: opacity,
            scale: 1 - (0.1 * fadeProgress), // shrink out
            rotation: 1 + (fadeProgress * 5), // spin out
            visibility: opacity > 0 ? 'visible' : 'hidden'
          })
        } else if (progress >= 0.4) {
          gsap.set('#orangeText', { opacity: 0, visibility: 'hidden' })
        }

        // 35–50%: "HE HAS ARMS" text fades in (moved down)
        if (progress < 0.35) {
          // Before 35%: hide completely
          gsap.set('#armsText', { opacity: 0, scale: 0.8, rotation: 3, visibility: 'hidden' })
        } else if (progress >= 0.35 && progress < 0.5) {
          const textProgress = (progress - 0.35) / 0.15
          gsap.set('#armsText', { 
            opacity: textProgress,
            scale: 0.8 + (0.2 * textProgress), // 0.8 → 1.0
            rotation: 3 + (Math.sin(Date.now() * 0.001) * 2), // subtle wobble
            visibility: 'visible'
          })
        } else if (progress >= 0.5 && progress < 0.6) {
          // Text stays visible briefly with animation
          gsap.set('#armsText', { 
            opacity: 1, 
            scale: 1,
            rotation: 3 + (Math.sin(Date.now() * 0.001) * 2),
            visibility: 'visible' 
          })
        } else if (progress >= 0.6) {
          // Text fades out as next text comes in
          const fadeProgress = (progress - 0.6) / 0.1
          const opacity = Math.max(0, 1 - fadeProgress)
          gsap.set('#armsText', { 
            opacity: opacity,
            scale: 1 - (0.2 * fadeProgress), // shrink out
            rotation: 3 + (fadeProgress * 10), // spin out
            visibility: opacity > 0 ? 'visible' : 'hidden'
          })
        }

        // 65–80%: "AND LEGS" text fades in (moved down)
        if (progress < 0.65) {
          // Before 65%: hide completely
          gsap.set('#legsText', { opacity: 0, scale: 0.8, rotation: -2, visibility: 'hidden' })
        } else if (progress >= 0.65 && progress < 0.8) {
          const textProgress = (progress - 0.65) / 0.15
          gsap.set('#legsText', { 
            opacity: textProgress,
            scale: 0.8 + (0.2 * textProgress), // 0.8 → 1.0
            rotation: -2 + (Math.sin(Date.now() * 0.0008) * 3), // subtle wiggle
            visibility: 'visible'
          })
        } else if (progress >= 0.8 && progress < 0.85) {
          // Text stays visible briefly with animation
          gsap.set('#legsText', { 
            opacity: 1, 
            scale: 1,
            rotation: -2 + (Math.sin(Date.now() * 0.0008) * 3),
            visibility: 'visible' 
          })
        } else if (progress >= 0.85) {
          // Text fades out as next text comes in
          const fadeProgress = (progress - 0.85) / 0.1
          const opacity = Math.max(0, 1 - fadeProgress)
          gsap.set('#legsText', { 
            opacity: opacity,
            scale: 1 - (0.2 * fadeProgress), // shrink out
            rotation: -2 + (fadeProgress * -15), // spin out opposite direction
            visibility: opacity > 0 ? 'visible' : 'hidden'
          })
        }

        // 90–100%: "PA-LA-LA" text fades in with grand finale (moved down)
        if (progress < 0.9) {
          // Before 90%: hide completely
          gsap.set('#palalalaText', { opacity: 0, scale: 0.5, rotation: 1, visibility: 'hidden' })
        } else if (progress >= 0.9 && progress < 0.95) {
          const textProgress = (progress - 0.9) / 0.05
          gsap.set('#palalalaText', { 
            opacity: textProgress,
            scale: 0.5 + (0.5 * textProgress), // 0.5 → 1.0 (dramatic entrance)
            rotation: 1 + (Math.sin(Date.now() * 0.002) * 1), // gentle pulse rotation
            visibility: 'visible'
          })
        } else if (progress >= 0.95) {
          // Text stays visible with continuous animation (grand finale)
          const time = Date.now() * 0.001
          gsap.set('#palalalaText', { 
            opacity: 1, 
            scale: 1 + (Math.sin(time * 2) * 0.05), // gentle pulsing
            rotation: 1 + (Math.sin(time * 1.5) * 2), // gentle swaying
            visibility: 'visible'
          })
        }
        
        // === CAMERA CHOREOGRAPHY ===
        let targetX = 0, targetY = 0.45, targetZ = 2.0
        let targetRotX = 0, targetRotY = 0
        // const targetRotZ = 0 // Unused variable removed
        
        const easeInOutCubic = (t: number) => {
          return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
        }
        
        if (progress <= 0.1) {
          // 0-10%: Hold exact initial position (no movement at all)
          targetX = 0; targetY = 0.45; targetZ = 2.0
          targetRotX = -0.1; targetRotY = 0
        } else if (progress <= 0.25) {
          // 10-25%: Simplified movement - no Y changes
          const t = easeInOutCubic((progress - 0.1) / 0.15)
          targetX = 0 + (0.08 * t) // Gentle X movement: 0 → 0.08
          targetY = 0.45 // No Y movement - keep stable
          targetZ = 2.0 - (0.1 * t) // Gentle Z movement: 2.0 → 1.9
          targetRotX = -0.1 // Keep initial tilt throughout
          targetRotY = 0 + (0.08 * t) // Gentle rotation
        } else if (progress <= 0.4) {
          // 25-40%: Hold position (match 25% endpoint)
          targetX = 0.08; targetY = 0.45; targetZ = 1.9
          targetRotX = -0.1 // Keep initial tilt
          targetRotY = 0.08
        } else if (progress <= 0.55) {
          // 40-55%: Gradual transition from hold position
          const t = easeInOutCubic((progress - 0.4) / 0.15)
          targetX = 0.08 + (0.12 * t) // 0.08 → 0.20
          targetY = 0.45 - (0.1 * t) // 0.45 → 0.35
          targetZ = 1.9 - (0.2 * t) // 1.9 → 1.7
          targetRotX = -0.1 + (0.1 * t) // -0.1 → 0 (start transitioning)
          targetRotY = 0.08 + (0.12 * t) // 0.08 → 0.20
        } else if (progress <= 0.7) {
          // 55-70%: Focus on groupB, pan right (continue from previous end state)
          const t = easeInOutCubic((progress - 0.55) / 0.15)
          targetX = 0.20 + (0.15 * t) // pan right: 0.20 → 0.35 (fixed start value)
          targetY = 0.35 // continue from previous
          targetZ = 1.7 // continue from previous
          targetRotY = 0.20 + (0.15 * t) // 0.20 → 0.35 (fixed start value)
          targetRotX = 0 - (0.06 * t) // subtle pitch down
        } else if (progress <= 0.85) {
          // 70-85%: Ease back to initial position (continue from previous end state)
          const t = easeInOutCubic((progress - 0.7) / 0.15)
          targetX = 0.35 - (0.35 * t) // back to center: 0.35 → 0
          targetY = 0.35 + (0.1 * t) // rise back to initial: 0.35 → 0.45
          targetZ = 1.7 + (0.3 * t) // pull back to initial: 1.7 → 2.0
          targetRotY = 0.35 - (0.35 * t) // straighten to initial: 0.35 → 0
          targetRotX = -0.06 + (-0.04 * t) // return to initial tilt: -0.06 → -0.1
        } else {
          // 85-100%: Hold at exact initial position
          targetX = 0 // exact initial position
          targetY = 0.45 // exact initial position
          targetZ = 2.0 // exact initial position
          targetRotY = 0 // exact initial rotation
          targetRotX = -0.1 // exact initial tilt
        }
        
        
        // Apply camera movement with faster lerp for smoother following
        const lerpFactor = 0.15
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
            steveX = 0.4; steveY = -0.2; steveZ = 0 // Lower Y position
            steveRotY = 0 + Math.sin(time) * 0.05 // subtle idle rotation
            steveRotX = Math.sin(time * 0.7) * 0.02 // slight head nod
            steveScale = 1 + Math.sin(time * 1.2) * 0.02 // subtle breathing scale
          } else if (progress <= 0.25) {
            // 10-25%: Dynamic slide left with spin and bounce
            const t = easeInOutCubic((progress - 0.1) / 0.15)
            steveX = 0.4 + (-0.6 * t) // 0.4 → -0.2 (further left)
            steveY = -0.2 + (0.1 * t) + Math.sin(t * Math.PI * 2) * 0.05 // -0.2 → -0.1 with bounce
            steveRotY = 0 + (0.5 * t) + Math.sin(time) * 0.03 // spin with wobble
            steveRotX = Math.sin(t * Math.PI) * 0.1 // dramatic nod during movement
            steveScale = 1 + (0.1 * t) + Math.sin(time * 2) * 0.02
          } else if (progress <= 0.45) {
            // 25-45%: Center stage with dance-like movement (continue from previous end state)
            // const localT = (progress - 0.25) / 0.2 // Unused variable removed
            const baseX = -0.2 // end position from previous section
            const baseY = 0.1 // end position from previous section
            const baseRotY = 0.5 // end rotation from previous section
            const baseScale = 1.1 // end scale from previous section
            
            steveX = baseX + Math.sin(time * 2) * 0.05 // gentle side-to-side
            steveY = baseY + Math.sin(time * 3) * 0.03 // up and down bob
            steveZ = Math.sin(time * 1.5) * 0.02 // forward/back sway
            steveRotY = baseRotY + Math.sin(time * 1.8) * 0.1 // continuous rotation
            steveRotX = Math.sin(time * 2.2) * 0.05 // head movement
            steveScale = baseScale + Math.sin(time * 2.5) * 0.03 // pulsing scale
          } else if (progress <= 0.65) {
            // 45-65%: Dramatic retreat with spin (continue from previous end state)
            const t = easeInOutCubic((progress - 0.45) / 0.2)
            const baseX = -0.2 // continue from previous section
            const baseY = 0.1 // continue from previous section
            const baseRotY = 0.5 // continue from previous section
            const baseScale = 1.1 // continue from previous section
            
            steveX = baseX + (0.3 * t) // move back right: -0.2 → 0.1
            steveY = baseY + (0.3 * t) + Math.sin(t * Math.PI * 3) * 0.08 // spiraling up: 0.1 → 0.4
            steveZ = 0 + (-0.3 * t) // move back: 0 → -0.3
            steveRotY = baseRotY + (Math.PI * 2 * t) // full spin during retreat
            steveRotX = Math.sin(t * Math.PI * 4) * 0.15 // dramatic head movement
            steveScale = baseScale - (0.3 * t) // shrinking: 1.1 → 0.8
          } else {
            // 65%+: Floating in background with gentle movement (continue from previous end state)
            const baseX = 0.1 // end position from previous section
            const baseY = 0.4 // end position from previous section
            const baseZ = -0.3 // end position from previous section
            const baseRotY = 0.5 + Math.PI * 2 // end rotation from previous section
            const baseScale = 0.8 // end scale from previous section
            
            steveX = baseX + Math.sin(time * 0.5) * 0.03
            steveY = baseY + Math.sin(time * 0.7) * 0.02
            steveZ = baseZ + Math.sin(time * 0.3) * 0.01
            steveRotY = baseRotY + Math.sin(time * 0.8) * 0.05
            steveRotX = Math.sin(time * 0.6) * 0.02
            steveScale = baseScale + Math.sin(time * 1.1) * 0.01
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
        
        // === CARTOON ARMS (groupB) CHOREOGRAPHY ===
        if (groupBRef.current) {
          let groupBX = 0, groupBY = -3, groupBZ = 0
          let groupBRotX = 0, groupBRotY = 0, groupBRotZ = 0, groupBOpacity = 0, groupBScale = 1
          
          if (progress < 0.3) {
            // Before 30%: Arms are hidden below screen
            groupBX = 0
            groupBY = -3 // Start below screen
            groupBZ = 0
            groupBOpacity = 0
            groupBScale = 1
            groupBRef.current.visible = false
          } else if (progress >= 0.3 && progress <= 0.4) {
            // 30-40%: Arms rise up to halfway point
            const t = easeInOutCubic((progress - 0.3) / 0.1)
            groupBX = 0
            groupBY = -3 + (2.5 * t) // -3 → -0.5 (only come up halfway)
            groupBZ = 0 + (0.5 * t) // move slightly forward
            groupBRotX = 0
            groupBRotY = 0
            groupBRotZ = 0
            groupBOpacity = t // 0 → 1
            groupBScale = 1 + (0.5 * t) // 1 → 1.5
            groupBRef.current.visible = true
          } else if (progress > 0.4 && progress <= 0.55) {
            // 40-55%: Arms stay at halfway position (pause)
            groupBX = 0
            groupBY = -0.5 // Stay at halfway point
            groupBZ = 0.5
            groupBRotX = 0
            groupBRotY = 0
            groupBRotZ = 0
            groupBOpacity = 1 // Fully visible
            groupBScale = 1.5
            groupBRef.current.visible = true
          } else if (progress > 0.55 && progress <= 0.7) {
            // 55-70%: Arms go back down
            const t = easeInOutCubic((progress - 0.55) / 0.15)
            groupBX = 0
            groupBY = -0.5 - (2.5 * t) // -0.5 → -3 (go back down)
            groupBZ = 0.5 - (0.5 * t) // move back
            groupBRotX = 0
            groupBRotY = 0
            groupBRotZ = 0
            groupBOpacity = 1 - t // 1 → 0 (fade out as they go down)
            groupBScale = 1.5 - (0.5 * t) // 1.5 → 1 (shrink as they go down)
            groupBRef.current.visible = groupBOpacity > 0
          } else if (progress > 0.7) {
            // 70%+: Arms hidden completely
            groupBX = 0
            groupBY = -3 // Hidden below screen
            groupBZ = 0
            groupBOpacity = 0
            groupBScale = 1
            groupBRef.current.visible = false
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
        
        // === CARTOON LEGS (groupC) CHOREOGRAPHY ===
        if (groupCRef.current) {
          let groupCX = 0, groupCY = 4, groupCZ = 0
          let groupCRotX = 0, groupCRotY = 0, groupCRotZ = 0, groupCOpacity = 0, groupCScale = 1
          
          if (progress < 0.6) {
            // Before 60%: Legs are hidden above screen (wait for arms to go down)
            groupCX = 0
            groupCY = 4 // Start above screen
            groupCZ = 0
            groupCOpacity = 0
            groupCScale = 1
            groupCRef.current.visible = false
          } else if (progress >= 0.6 && progress <= 0.75) {
            // 60-75%: Steve legs drop straight down from top
            const t = easeInOutCubic((progress - 0.6) / 0.15)
            groupCX = 0
            groupCY = 4 - (2 * t) // 4 → 2 (not as low, straight down)
            groupCZ = 0 // no forward movement, straight down
            groupCRotX = 0
            groupCRotY = 0
            groupCRotZ = 0
            groupCOpacity = t // 0 → 1
            groupCScale = 0.8 + (0.1 * t) // 0.8 → 0.9 (much smaller legs)
            groupCRef.current.visible = true
          } else if (progress > 0.75 && progress <= 0.9) {
            // 75-90%: Steve legs hanging straight
            const time = Date.now() * 0.001
            groupCX = 0
            groupCY = 2 + Math.sin(time * 0.6) * 0.1 // stay at drop position with gentle bounce
            groupCZ = 0 // keep straight
            groupCRotX = 0
            groupCRotY = 0 // no rotation, straight down
            groupCRotZ = 0
            groupCOpacity = 1 // fully visible
            groupCScale = 0.9 + Math.sin(time * 1.5) * 0.05 // smaller with gentle pulsing
          } else if (progress > 0.9) {
            // 90%+: Steve legs retract straight back up
            const t = Math.min((progress - 0.9) / 0.1, 1)
            groupCX = 0
            groupCY = 2 + (3 * t) // 2 → 5 (straight back up)
            groupCZ = 0 // keep straight
            groupCRotX = 0
            groupCRotY = 0
            groupCRotZ = 0
            groupCOpacity = Math.max(0, 1 - t) // fade out
            groupCScale = 0.8 + (0.1 * t) // 0.8 → 0.9 (much smaller legs)
            if (groupCOpacity <= 0) {
              groupCRef.current.visible = false
            }
          }
          
          if (groupCRef.current.visible) {
            // Apply all transformations
            groupCRef.current.position.x += (groupCX - groupCRef.current.position.x) * lerpFactor
            groupCRef.current.position.y += (groupCY - groupCRef.current.position.y) * lerpFactor
            groupCRef.current.position.z += (groupCZ - groupCRef.current.position.z) * lerpFactor
            
            groupCRef.current.rotation.x += (groupCRotX - groupCRef.current.rotation.x) * lerpFactor
            groupCRef.current.rotation.y += (groupCRotY - groupCRef.current.rotation.y) * lerpFactor
            groupCRef.current.rotation.z += (groupCRotZ - groupCRef.current.rotation.z) * lerpFactor
            
            groupCRef.current.scale.setScalar(groupCScale)
            
            groupCRef.current.traverse((child) => {
              if (child.material) {
                child.material.transparent = true
                child.material.opacity = groupCOpacity
              }
            })
          }
        }
        
        // === STEVE3 (groupD) CHOREOGRAPHY ===
        if (groupDRef.current) {
          let groupDX = 0, groupDY = -5, groupDZ = 0
          let groupDRotX = 0, groupDRotY = 0, groupDRotZ = 0, groupDOpacity = 0, groupDScale = 1
          
          if (progress < 0.9) {
            // Before 90%: Steve3 hidden below screen
            groupDX = 0
            groupDY = -3 // Start lower
            groupDZ = -2 // Start much further back
            groupDOpacity = 0
            groupDScale = 1.2
            groupDRef.current.visible = false
          } else if (progress >= 0.9) {
            // 90-100%: Steve3 rises up, facing left, further back
            const t = easeInOutCubic((progress - 0.9) / 0.1)
            const time = Date.now() * 0.001
            groupDX = 0
            groupDY = -3 + (2.5 * t) // -3 → -0.5 (rise up to be visible)
            groupDZ = -2 + (0.5 * t) // -2 → -1.5 (stay further back)
            groupDRotX = 0
            groupDRotY = Math.PI + Math.sin(time * 1.5) * 0.05 // Face backwards with subtle movement
            groupDRotZ = 0
            groupDOpacity = t // 0 → 1
            groupDScale = 1.2 + Math.sin(time * 2) * 0.05 // 1.2 base with subtle pulsing
            groupDRef.current.visible = true
          }
          
          if (groupDRef.current.visible) {
            // Apply all transformations with faster lerp for dramatic entrance
            groupDRef.current.position.x += (groupDX - groupDRef.current.position.x) * lerpFactor
            groupDRef.current.position.y += (groupDY - groupDRef.current.position.y) * lerpFactor
            groupDRef.current.position.z += (groupDZ - groupDRef.current.position.z) * lerpFactor
            
            groupDRef.current.rotation.x += (groupDRotX - groupDRef.current.rotation.x) * lerpFactor
            groupDRef.current.rotation.y += (groupDRotY - groupDRef.current.rotation.y) * lerpFactor
            groupDRef.current.rotation.z += (groupDRotZ - groupDRef.current.rotation.z) * lerpFactor
            
            groupDRef.current.scale.setScalar(groupDScale)
            
            groupDRef.current.traverse((child) => {
              if (child.material) {
                child.material.transparent = true
                child.material.opacity = groupDOpacity
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
        groupCRef,
        groupDRef,
        bgBitsRef,
        adminSettings
      })}
    </group>
  )
})

export default SteveExperienceCameraRig