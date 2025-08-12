'use client'

import { useGLTF } from '@react-three/drei'
import { useEffect } from 'react'
import * as THREE from 'three'

interface SteveProps {
  position?: [number, number, number]
  rotation?: [number, number, number]
  scale?: number | [number, number, number]
  material?: THREE.Material
  castShadow?: boolean
  receiveShadow?: boolean
}

export default function Steve(props: SteveProps) {
  const startTime = Date.now()
  console.log('🤖 Steve: Component rendering/mounting at', startTime, 'ms')
  
  useEffect(() => {
    const mountTime = Date.now()
    console.log('🤖 Steve: Component MOUNTED at', mountTime, 'ms')
    return () => {
      console.log('🤖 Steve: Component UNMOUNTING') 
    }
  }, [])
  
  console.log('🤖 Steve: About to call useGLTF at', Date.now(), 'ms')
  const { scene } = useGLTF('/models/Stev3.glb')
  const afterGLTF = Date.now()
  console.log('🤖 Steve: useGLTF returned at', afterGLTF, 'ms, scene ready:', !!scene, 'took:', (afterGLTF - startTime), 'ms')
  
  useEffect(() => {
    const effectTime = Date.now()
    console.log('🤖 Steve: Scene object ready in useEffect at', effectTime, 'ms, scene ready:', !!scene)
    console.log('🤖 Steve: About to return <primitive> element to renderer')
  }, [scene])
  
  console.log('🤖 Steve: Returning <primitive object> at', Date.now(), 'ms')
  
  // Apply material directly if provided
  if (props.material && scene) {
    scene.traverse((child: THREE.Object3D) => {
      if ('isMesh' in child && child.isMesh && props.material) {
        (child as THREE.Mesh).material = props.material
      }
    })
  }
  
  return <primitive object={scene} position={props.position} rotation={props.rotation} scale={props.scale} castShadow={props.castShadow} receiveShadow={props.receiveShadow} />
}