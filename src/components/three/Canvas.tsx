'use client'

import { Canvas } from '@react-three/fiber'
import { Suspense } from 'react'
import * as THREE from 'three'

import type { CameraSettings, PerformanceSettings } from '@/types/three'
import CameraRig from './CameraRig'
import PostProcessing from './PostProcessing'
import Scene from './Scene'

interface ThreeCanvasProps {
  className?: string
  performance?: PerformanceSettings
  camera?: CameraSettings
  enablePostProcessing?: boolean
  enableScrollAnimation?: boolean
  scrollTrigger?: string
}


/**
 * Main Three.js Canvas component with optimized settings
 */
export default function ThreeCanvas({
  className = '',
  performance = {
    enableShadows: true,
    shadowMapSize: 2048,
    antialias: false, // Disabled for performance, post-processing handles it
    pixelRatio: [1, 2],
    powerPreference: 'high-performance'
  },
  camera = {
    position: [0, 0.5, 2],
    fov: 50,
    near: 0.1,
    far: 100
  },
  enablePostProcessing = true,
  enableScrollAnimation = true,
  scrollTrigger = '#hero'
}: ThreeCanvasProps) {

  return (
    <div className={`w-full h-full ${className}`}>
      <Canvas
        dpr={performance.pixelRatio}
        camera={{
          position: camera.position,
          fov: camera.fov,
          near: camera.near,
          far: camera.far
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

          // Set scene background to transparent for overlay effects
          scene.background = null
        }}
      >
        <Suspense fallback={null}>
          {enableScrollAnimation ? (
            <CameraRig
              trigger={scrollTrigger}
              enableMouseParallax={true}
              parallaxIntensity={0.5}
            >
              <Scene />
            </CameraRig>
          ) : (
            <Scene />
          )}

          {enablePostProcessing && <PostProcessing />}
        </Suspense>
      </Canvas>
    </div>
  )
}