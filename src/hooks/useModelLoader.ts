'use client'

import { useState, useEffect } from 'react'
import { useGLTF } from '@react-three/drei'

interface ModelLoadingState {
  isLoading: boolean
  isLoaded: boolean
  error: string | null
  progress: number
}

export function useModelLoader(modelPaths: string[]): ModelLoadingState {
  const [loadingState, setLoadingState] = useState<ModelLoadingState>({
    isLoading: true,
    isLoaded: false,
    error: null,
    progress: 0
  })

  useEffect(() => {
    let loadedCount = 0
    const totalModels = modelPaths.length

    setLoadingState({
      isLoading: true,
      isLoaded: false,
      error: null,
      progress: 0
    })

    // Preload all models
    const loadPromises = modelPaths.map(async (path, index) => {
      try {
        useGLTF.preload(path)
        loadedCount++
        setLoadingState(prev => ({
          ...prev,
          progress: (loadedCount / totalModels) * 100
        }))
      } catch (error) {
        console.error(`Failed to load model: ${path}`, error)
        setLoadingState(prev => ({
          ...prev,
          error: `Failed to load ${path}`
        }))
      }
    })

    Promise.all(loadPromises)
      .then(() => {
        setLoadingState({
          isLoading: false,
          isLoaded: true,
          error: null,
          progress: 100
        })
      })
      .catch((error) => {
        setLoadingState(prev => ({
          ...prev,
          isLoading: false,
          error: error.message || 'Failed to load models'
        }))
      })

  }, [modelPaths])

  return loadingState
}

// Simple version that just tracks if models are ready
export function useModelsReady(modelPaths: string[]): boolean {
  const [allLoaded, setAllLoaded] = useState(false)
  const [hasStarted, setHasStarted] = useState(false)

  useEffect(() => {
    // Only run once
    if (hasStarted) return
    
    console.log('useModelsReady: Starting to preload models:', modelPaths)
    setHasStarted(true)
    
    // Preload all models using the simple useGLTF.preload API
    const preloadAll = async () => {
      try {
        const promises = modelPaths.map(path => {
          console.log(`Preloading model: ${path}`)
          return useGLTF.preload(path)
        })
        
        await Promise.all(promises)
        console.log('All models preloaded successfully')
        setAllLoaded(true)
      } catch (error) {
        console.error('Failed to preload some models:', error)
        // Still set as loaded to allow experience to start
        setAllLoaded(true)
      }
    }

    preloadAll()
  }, [modelPaths, hasStarted])

  return allLoaded
}