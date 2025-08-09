'use client'

import { useEffect, useState, useCallback } from 'react'
import { useThree } from '@react-three/fiber'
import * as THREE from 'three'

interface PerformanceMonitor {
  fps: number
  memory: number
  drawCalls: number
  geometries: number
  textures: number
}

interface PerformanceOptions {
  targetFPS?: number
  enableMonitoring?: boolean
  autoOptimize?: boolean
}

/**
 * Custom hook for monitoring and optimizing Three.js performance
 */
export function useThreePerformance(options: PerformanceOptions = {}) {
  const {
    targetFPS = 60,
    enableMonitoring = false,
    autoOptimize = true
  } = options

  const { gl, scene } = useThree()
  const [performance, setPerformance] = useState<PerformanceMonitor>({
    fps: 60,
    memory: 0,
    drawCalls: 0,
    geometries: 0,
    textures: 0
  })

  const [isLowPerformance, setIsLowPerformance] = useState(false)

  const optimizePerformance = useCallback(() => {
    // Reduce pixel ratio on low-end devices
    if (gl.getPixelRatio() > 1.5) {
      gl.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
    }

    // Traverse scene and optimize materials
    scene.traverse((child: THREE.Object3D) => {
      const mesh = child as THREE.Mesh
      if (mesh.material) {
        const material = mesh.material as THREE.MeshStandardMaterial
        // Disable expensive material features on low performance
        if (material.envMap) {
          material.envMapIntensity *= 0.5
        }
      }
    })

    console.log('Performance optimizations applied')
  }, [gl, scene])

  useEffect(() => {
    if (!enableMonitoring) return

    let frameCount = 0
    let lastTime = window.performance.now()
    let animationId: number

    const monitor = () => {
      frameCount++
      const currentTime = window.performance.now()
      
      if (currentTime >= lastTime + 1000) {
        const fps = Math.round((frameCount * 1000) / (currentTime - lastTime))
        
        setPerformance(prev => {
          const memoryInfo = (window.performance as unknown as { memory?: { usedJSHeapSize: number } })?.memory
          return {
            ...prev,
            fps,
            memory: memoryInfo ? memoryInfo.usedJSHeapSize / 1048576 : 0,
            drawCalls: gl.info.render.calls,
            geometries: gl.info.memory.geometries,
            textures: gl.info.memory.textures
          }
        })

        // Auto-optimize if performance is poor
        if (autoOptimize && fps < targetFPS * 0.8) {
          setIsLowPerformance(true)
          optimizePerformance()
        } else {
          setIsLowPerformance(false)
        }

        frameCount = 0
        lastTime = currentTime
      }

      animationId = requestAnimationFrame(monitor)
    }

    monitor()

    return () => {
      cancelAnimationFrame(animationId)
    }
  }, [enableMonitoring, targetFPS, autoOptimize, gl, optimizePerformance])

  const forceOptimization = useCallback(() => {
    optimizePerformance()
  }, [optimizePerformance])

  const resetOptimizations = useCallback(() => {
    // Reset to default settings
    gl.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    setIsLowPerformance(false)
  }, [gl])

  return {
    performance,
    isLowPerformance,
    forceOptimization,
    resetOptimizations
  }
}

/**
 * Hook for responsive Three.js settings based on device capabilities
 */
export function useResponsiveThree() {
  const [deviceTier, setDeviceTier] = useState<'low' | 'medium' | 'high'>('medium')
  
  useEffect(() => {
    // Detect device capabilities
    const canvas = document.createElement('canvas')
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl')
    
    if (!gl) {
      setDeviceTier('low')
      return
    }

    const debugInfo = gl.getExtension('WEBGL_debug_renderer_info')
    const renderer = debugInfo ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) : ''
    
    // Simple device detection based on common patterns
    const isMobile = /Mobi|Android/i.test(navigator.userAgent)
    const isLowEndGPU = /Adreno [0-9][0-9][0-9]|Mali|PowerVR|Tegra/i.test(renderer)
    const isHighEndGPU = /RTX|GTX|Radeon|Apple/i.test(renderer)
    
    if (isMobile || isLowEndGPU) {
      setDeviceTier('low')
    } else if (isHighEndGPU) {
      setDeviceTier('high')
    } else {
      setDeviceTier('medium')
    }

    // Cleanup
    canvas.remove()
  }, [])

  const getOptimalSettings = useCallback(() => {
    switch (deviceTier) {
      case 'low':
        return {
          shadows: false,
          antialias: false,
          pixelRatio: [1, 1.5] as [number, number],
          particles: 30,
          shadowMapSize: 512
        }
      case 'high':
        return {
          shadows: true,
          antialias: true,
          pixelRatio: [1, 3] as [number, number],
          particles: 100,
          shadowMapSize: 4096
        }
      default:
        return {
          shadows: true,
          antialias: false,
          pixelRatio: [1, 2] as [number, number],
          particles: 60,
          shadowMapSize: 2048
        }
    }
  }, [deviceTier])

  return {
    deviceTier,
    settings: getOptimalSettings()
  }
}