'use client'

import React, { useRef, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'
import * as THREE from 'three'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

interface ExperienceCameraRigProps {
  children: React.ReactNode
}

export default function ExperienceCameraRig({ children }: ExperienceCameraRigProps) {
  const { camera } = useThree()
  const rigRef = useRef<THREE.Group>(null!)
  
  useEffect(() => {
    if (typeof window === 'undefined') return

    // Set initial visibility for heroCopy
    gsap.set('#heroCopy', { opacity: 1 })
    gsap.set('#sidePanel', { opacity: 0 })
    
    // Set initial camera position
    camera.position.set(0, 0.45, 2.0)

    // Create separate ScrollTriggers for UI elements
    ScrollTrigger.create({
      trigger: '.experience-container',
      start: 'top top',
      end: '+=500%', // Changed from 300% to 500% - matches camera scroll distance
      scrub: 0.5,
      onUpdate: (self) => {
        const progress = self.progress
        
        // Control heroCopy opacity based on scroll
        if (progress < 0.1) {
          gsap.set('#heroCopy', { opacity: 1 })
        } else if (progress < 0.25) {
          const fadeProgress = (progress - 0.1) / 0.15
          gsap.set('#heroCopy', { opacity: 1 - fadeProgress })
        } else {
          gsap.set('#heroCopy', { opacity: 0 })
        }
        
        // Control sidePanel visibility
        if (progress > 0.3 && progress < 0.75) {
          const panelProgress = (progress - 0.3) / 0.45
          gsap.set('#sidePanel', { 
            opacity: Math.min(1, panelProgress * 2),
            x: -20 + (20 * Math.min(1, panelProgress * 2))
          })
        } else if (progress >= 0.75) {
          const fadeOutProgress = (progress - 0.75) / 0.1
          gsap.set('#sidePanel', { 
            opacity: Math.max(0, 1 - fadeOutProgress),
            x: 0
          })
        }
      }
    })

    // Create ScrollTrigger for pinning and camera control
    ScrollTrigger.create({
      trigger: '.experience-container',
      start: 'top top',
      end: '+=500%', // Changed from 300% to 500% - makes scroll 66% longer
      pin: '.experience-container',
      pinSpacing: true,
      onUpdate: (self) => {
        const progress = self.progress
        
        // Smooth camera path using eased interpolation
        let targetX = 0, targetY = 0.45, targetZ = 2.0
        
        // Helper function for smooth easing
        const easeInOutCubic = (t: number) => {
          return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
        }
        
        if (progress <= 0.1) {
          // 0-10%: Initial position
          targetX = 0
          targetY = 0.45
          targetZ = 2.0
        } else if (progress <= 0.25) {
          // 10-25%: Move slightly closer
          const t = easeInOutCubic((progress - 0.1) / 0.15)
          targetX = 0 * (1 - t) + 0.2 * t
          targetY = 0.45 * (1 - t) + 0.55 * t
          targetZ = 2.0 * (1 - t) + 1.7 * t
        } else if (progress <= 0.4) {
          // 25-40%: Focus on hand
          const t = easeInOutCubic((progress - 0.25) / 0.15)
          targetX = 0.2 * (1 - t) + (-0.3) * t
          targetY = 0.55 * (1 - t) + 0.7 * t
          targetZ = 1.7 * (1 - t) + 1.5 * t
        } else if (progress <= 0.55) {
          // 40-55%: Pull back to show both
          const t = easeInOutCubic((progress - 0.4) / 0.15)
          targetX = -0.3 * (1 - t) + 0.2 * t
          targetY = 0.7 * (1 - t) + 0.8 * t
          targetZ = 1.5 * (1 - t) + 2.2 * t
        } else if (progress <= 0.7) {
          // 55-70%: Gentle orbit
          const t = easeInOutCubic((progress - 0.55) / 0.15)
          const angle = t * Math.PI * 0.3 // Reduced orbit angle
          targetX = 0.2 * (1 - t) + (0.3 * Math.cos(angle)) * t
          targetY = 0.8
          targetZ = 2.2 * (1 - t) + (2.3 + 0.2 * Math.sin(angle)) * t
        } else if (progress <= 0.85) {
          // 70-85%: Move to overview
          const t = easeInOutCubic((progress - 0.7) / 0.15)
          const prevX = 0.3 * Math.cos(Math.PI * 0.3)
          const prevZ = 2.3 + 0.2 * Math.sin(Math.PI * 0.3)
          targetX = prevX * (1 - t) + 0 * t
          targetY = 0.8 * (1 - t) + 1.0 * t
          targetZ = prevZ * (1 - t) + 3.0 * t
        } else {
          // 85-100%: Final position
          const t = easeInOutCubic(Math.min((progress - 0.85) / 0.15, 1))
          targetX = 0
          targetY = 1.0 * (1 - t) + 0.8 * t
          targetZ = 3.0 * (1 - t) + 3.2 * t
        }
        
        // Smooth camera movement with lerp
        const lerpFactor = 0.1
        camera.position.x += (targetX - camera.position.x) * lerpFactor
        camera.position.y += (targetY - camera.position.y) * lerpFactor
        camera.position.z += (targetZ - camera.position.z) * lerpFactor
        
        // Update camera look-at based on scroll progress
        const lookAtTarget = new THREE.Vector3()
        
        if (progress < 0.25) {
          // Look at center initially
          lookAtTarget.set(0, 0, 0)
        } else if (progress < 0.55) {
          // Focus on hand position (groupA)
          const t = (progress - 0.25) / 0.3
          lookAtTarget.set(-0.5 * t, 0.2 * t, 0)
        } else if (progress < 0.85) {
          // Look between both groups
          const t = (progress - 0.55) / 0.3
          lookAtTarget.set(-0.5 + (0.7 * t), 0.2, 0)
        } else {
          // Final overview look
          lookAtTarget.set(0, 0.2, 0)
        }
        
        camera.lookAt(lookAtTarget)
        camera.updateMatrixWorld()
      }
    })

    // Cleanup
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill())
    }
  }, [camera])

  // Smooth camera updates
  useFrame(() => {
    if (rigRef.current) {
      // Add subtle floating motion
      rigRef.current.rotation.y += Math.sin(Date.now() * 0.001) * 0.0005
    }
  })

  return (
    <group ref={rigRef}>
      {children}
    </group>
  )
}