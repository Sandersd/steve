'use client'

import { Canvas } from '@react-three/fiber'
import { Suspense } from 'react'
import * as THREE from 'three'

import type { CameraSettings, PerformanceSettings } from '@/types/three'
import PostProcessing from './PostProcessing'
import SteveExperienceCameraRig from './SteveExperienceCameraRig'
import SteveExperienceScene from './SteveExperienceScene'

interface SteveExperienceCanvasProps {
  className?: string
  performance?: PerformanceSettings
  camera?: CameraSettings
  enablePostProcessing?: boolean
  audioData?: {
    volume: number
    bass: number
    mid: number
    treble: number
    beat: boolean
    beatStrength: number
  }
  isAudioPlaying?: boolean
}

/**
 * Steve's Experience Canvas following exact experience page choreography
 */
export default function SteveExperienceCanvas({
  className = '',
  performance = {
    enableShadows: true,
    shadowMapSize: 2048,
    antialias: false,
    pixelRatio: [1, 2],
    powerPreference: 'high-performance'
  },
  camera = {
    position: [0, 0.45, 2.0],
    fov: 50,
    near: 0.1,
    far: 100
  },
  enablePostProcessing = true,
  audioData,
  isAudioPlaying = false
}: SteveExperienceCanvasProps) {

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
          console.log('🐟 Steve Experience Canvas: Ready!')
          
          // Optimize WebGL settings
          gl.toneMapping = THREE.ACESFilmicToneMapping
          gl.toneMappingExposure = 1.0
          gl.outputColorSpace = THREE.SRGBColorSpace
          
          // Configure shadow map
          if (performance.enableShadows && gl.shadowMap) {
            gl.shadowMap.enabled = true
            gl.shadowMap.type = THREE.PCFSoftShadowMap
          }

          // Set transparent background for proper HTML background visibility
          scene.background = null
          // Remove fog for instant model visibility
          scene.fog = null
        }}
      >
        <Suspense fallback={null}>
          {/* Steve's Camera Rig with Experience Choreography */}
          <SteveExperienceCameraRig>
            <SteveExperienceScene audioData={audioData} isAudioPlaying={isAudioPlaying} />
          </SteveExperienceCameraRig>

          {enablePostProcessing && <PostProcessing />}
        </Suspense>
      </Canvas>
    </div>
  )
}