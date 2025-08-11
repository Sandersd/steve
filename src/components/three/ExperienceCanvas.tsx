'use client'

import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import * as THREE from 'three'

import ExperienceScene from './ExperienceScene'
import ExperienceCameraRig from './ExperienceCameraRig'
import PostProcessing from './PostProcessing'
import type { PerformanceSettings } from '@/types/three'

interface ExperienceCanvasProps {
  className?: string
  performance?: PerformanceSettings
}

export default function ExperienceCanvas({
  className = '',
  performance = {
    enableShadows: true,
    shadowMapSize: 2048,
    antialias: false,
    pixelRatio: [1, 2],
    powerPreference: 'high-performance'
  }
}: ExperienceCanvasProps) {

  return (
    <div className={`canvas-container ${className}`}>
      <Canvas
        dpr={performance.pixelRatio}
        camera={{
          position: [0, 0.45, 2.0],
          fov: 50,
          near: 0.1,
          far: 100
        }}
        gl={{
          antialias: performance.antialias,
          powerPreference: performance.powerPreference
        }}
        shadows={performance.enableShadows}
        onCreated={({ gl, scene }) => {
          // Optimize WebGL settings
          gl.toneMapping = THREE.ACESFilmicToneMapping
          gl.toneMappingExposure = 1.0
          gl.outputColorSpace = THREE.SRGBColorSpace
          
          // Configure shadow map
          if (performance.enableShadows && gl.shadowMap) {
            gl.shadowMap.enabled = true
            gl.shadowMap.type = THREE.PCFSoftShadowMap
          }

          // Set scene background to black for this experience
          scene.background = new THREE.Color(0x000000)
        }}
      >
        <Suspense fallback={null}>
          <ExperienceCameraRig>
            <ExperienceScene />
          </ExperienceCameraRig>
          <PostProcessing 
            enableBloom={true}
            enableVignette={false}
            enableToneMapping={true}
            bloomIntensity={1.5}
            bloomThreshold={0.3}
          />
        </Suspense>
      </Canvas>
    </div>
  )
}