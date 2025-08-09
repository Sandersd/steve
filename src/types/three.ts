import * as THREE from 'three'

// Three.js related types
export interface SceneProps {
  position?: [number, number, number]
  rotation?: [number, number, number]
  scale?: number | [number, number, number]
}

export interface MaterialProps {
  transparent?: boolean
  opacity?: number
  color?: THREE.ColorRepresentation
}

export interface ShaderMaterialUniforms {
  [key: string]: {
    value: unknown
  }
}

// Animation and interaction types
export interface ScrollAnimation {
  target: THREE.Object3D | THREE.Camera
  property: string
  from: number | [number, number, number]
  to: number | [number, number, number]
  duration?: number
  ease?: string
}

export interface CameraSettings {
  position: [number, number, number]
  rotation?: [number, number, number]
  target?: [number, number, number]
  fov?: number
  near?: number
  far?: number
}

// Performance and optimization types
export interface PerformanceSettings {
  enableShadows?: boolean
  shadowMapSize?: number
  antialias?: boolean
  pixelRatio?: [number, number]
  powerPreference?: 'default' | 'high-performance' | 'low-power'
}