'use client'

import React from 'react'
import { useGLTF } from '@react-three/drei'
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
  const { scene } = useGLTF('/models/Steve1.glb')
  return <primitive object={scene} {...props} />
}