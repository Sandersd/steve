'use client'

import { useFrame, useLoader } from '@react-three/fiber'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'
import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

import BgBits from './models/BgBits'
import GroupB from './models/GroupB'
import PearlescentMaterial from './shaders/PearlescentMaterial'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

export default function ExperienceScene() {
  const groupARef = useRef<THREE.Group>(null!)
  const groupBRef = useRef<THREE.Group>(null!)
  const bgBitsRef = useRef<THREE.Group>(null!)
  const scanLineRef = useRef<THREE.Mesh>(null!)

  // Load hand model for groupA
  const gltf = useLoader(GLTFLoader, '/models/Stev3.glb')
  
  // Create pearlescent material for hand
  const pearlescentMaterial = useMemo(() => new PearlescentMaterial({
    colorPrimary: new THREE.Color('#98ff98'), // Soft mint green
    colorSecondary: new THREE.Color('#87ceeb'), // Sky blue
    colorAccent: new THREE.Color('#ffb6c1'), // Baby pink
    fresnelPower: 2.0,
    rimIntensity: 1.2,
    fresnelBias: 0.05
  }), [])

  // Scan line material for palm scanning effect
  const scanLineMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: '#00ffff',
      transparent: true,
      opacity: 0,
      emissive: '#00ffff',
      emissiveIntensity: 0.5,
    })
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return

    // Set initial positions WITHOUT gsap
    if (groupARef.current) {
      groupARef.current.position.set(-0.5, 0.2, 0)
      groupARef.current.rotation.set(0, 0.3, 0)
      groupARef.current.scale.set(1, 1, 1)
    }
    
    if (groupBRef.current) {
      groupBRef.current.position.set(2, 0.3, -0.5) // Start off-screen
      groupBRef.current.scale.set(0.5, 0.5, 0.5) // Start smaller
    }
    
    if (bgBitsRef.current) {
      bgBitsRef.current.scale.set(1, 1, 1)
    }

    const timeline = gsap.timeline({ 
      paused: true,
      defaults: { ease: 'power2.inOut' }
    })

    // Complex choreographed animations
    
    // 0-10%: Initial subtle movement
    timeline.fromTo(groupARef.current.rotation, 
      { x: 0, y: 0.3, z: 0 },
      { x: 0, y: 0.5, z: 0, duration: 0.1 },
      0
    )
    
    // 10-25%: GroupA starts rotating as hero fades
    timeline.to(groupARef.current.rotation, {
      x: -0.2,
      y: 0.8,
      z: 0.1,
      duration: 0.15
    }, 0.1)
    
    // 25-40%: Focus on hand - scale up and position
    timeline.to(groupARef.current.scale, {
      x: 1.3,
      y: 1.3,
      z: 1.3,
      duration: 0.15
    }, 0.25)
    
    timeline.to(groupARef.current.position, {
      x: -0.3,
      y: 0.3,
      z: 0.2,
      duration: 0.15
    }, 0.25)
    
    // Scan line effect appears
    timeline.fromTo(scanLineMaterial, 
      { opacity: 0 },
      { opacity: 0.8, duration: 0.05 },
      0.3
    )
    
    // Scan line moves up and down
    timeline.fromTo(scanLineRef.current.position,
      { y: -0.3 },
      { y: 0.3, duration: 0.1, ease: 'none' },
      0.3
    )
    
    // 40-55%: GroupB enters, GroupA scales back
    timeline.to(groupARef.current.scale, {
      x: 1,
      y: 1,
      z: 1,
      duration: 0.15
    }, 0.4)
    
    timeline.to(groupARef.current.position, {
      x: -0.8,
      y: 0.2,
      z: 0,
      duration: 0.15
    }, 0.4)
    
    timeline.fromTo(groupBRef.current.position,
      { x: 2, y: 0.3, z: -0.5 },
      { x: 0.8, y: 0.3, z: -0.5, duration: 0.15 },
      0.4
    )
    
    timeline.fromTo(groupBRef.current.scale,
      { x: 0.5, y: 0.5, z: 0.5 },
      { x: 0.8, y: 0.8, z: 0.8, duration: 0.15 },
      0.4
    )
    
    // Hide scan line
    timeline.to(scanLineMaterial, {
      opacity: 0,
      duration: 0.05
    }, 0.45)
    
    // 55-70%: Both groups dance together
    timeline.to(groupARef.current.rotation, {
      x: 0.1,
      y: 1.2,
      z: -0.1,
      duration: 0.15
    }, 0.55)
    
    timeline.to(groupBRef.current.rotation, {
      x: 0,
      y: Math.PI * 0.5,
      z: 0.1,
      duration: 0.15
    }, 0.55)
    
    timeline.to(groupBRef.current.position, {
      x: 1.0,
      y: 0.4,
      z: -0.3,
      duration: 0.15
    }, 0.55)
    
    // Background particles grow
    timeline.fromTo(bgBitsRef.current.scale,
      { x: 1, y: 1, z: 1 },
      { x: 1.2, y: 1.2, z: 1.2, duration: 0.15 },
      0.6
    )
    
    // 70-85%: Final positioning
    timeline.to(groupARef.current.position, {
      x: -0.6,
      y: 0,
      z: -0.2,
      duration: 0.15
    }, 0.7)
    
    timeline.to(groupBRef.current.position, {
      x: 0.6,
      y: 0.2,
      z: -0.5,
      duration: 0.15
    }, 0.7)
    
    // 85-100%: Subtle scaling for content transition
    timeline.to([groupARef.current.scale, groupBRef.current.scale], {
      x: 0.9,
      y: 0.9,
      z: 0.9,
      duration: 0.15
    }, 0.85)
    
    timeline.to(bgBitsRef.current.scale, {
      x: 1.3,
      y: 1.3,
      z: 1.3,
      duration: 0.15
    }, 0.85)

    // Create ScrollTrigger
    ScrollTrigger.create({
      trigger: '.experience-container',
      start: 'top top',
      end: '+=500%', // Changed from 300% to 500% - matches camera scroll distance
      scrub: 1,
      animation: timeline,
      immediateRender: false,
    })

    // Apply pearlescent material to hand model
    if (gltf) {
      gltf.scene.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.material = pearlescentMaterial.clone()
          child.castShadow = true
          child.receiveShadow = true
        }
      })
    }

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill())
    }
  }, [gltf, pearlescentMaterial, scanLineMaterial])

  // Ambient animations
  useFrame((state) => {
    const time = state.clock.elapsedTime
    
    // Subtle floating for groupA
    if (groupARef.current) {
      groupARef.current.position.y += Math.sin(time * 0.5) * 0.002
    }
    
    // Different floating pattern for groupB
    if (groupBRef.current) {
      groupBRef.current.position.y += Math.cos(time * 0.7) * 0.001
      groupBRef.current.rotation.y += 0.003
    }
  })

  return (
    <>
      {/* Lighting setup */}
      <ambientLight intensity={0.4} />
      <directionalLight
        position={[5, 5, 5]}
        intensity={1.2}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <directionalLight
        position={[-3, 3, -2]}
        intensity={0.8}
        color="#64b5f6"
      />
      <pointLight
        position={[0, 2, 1]}
        intensity={0.6}
        color="#81c784"
        distance={5}
        decay={2}
      />

      {/* Background particles */}
      <group ref={bgBitsRef}>
        <BgBits count={25} opacity={0.6} speed={0.3} />
      </group>

      {/* GroupA - Hand model */}
      <group ref={groupARef}>
        {gltf && (
          <primitive object={gltf.scene} />
        )}
        
        {/* Scan line for palm scanning effect */}
        <mesh ref={scanLineRef} position={[0, -0.2, 0.1]}>
          <planeGeometry args={[0.8, 0.02]} />
          <primitive object={scanLineMaterial} />
        </mesh>
      </group>

      {/* GroupB - Cube/Sphere/Claws */}
      <group ref={groupBRef}>
        <GroupB material={pearlescentMaterial} />
      </group>
    </>
  )
}