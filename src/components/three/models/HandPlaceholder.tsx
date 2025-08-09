'use client'

import { useMemo, forwardRef } from 'react'
import { Group } from 'three'
import * as THREE from 'three'

interface HandPlaceholderProps {
  material?: THREE.Material
  position?: [number, number, number]
  rotation?: [number, number, number]
  scale?: number | [number, number, number]
  castShadow?: boolean
  receiveShadow?: boolean
}

/**
 * A procedural hand placeholder made from basic Three.js geometries
 * Replace this with a real GLB model by using useGLTF from @react-three/drei
 */
const HandPlaceholder = forwardRef<Group, HandPlaceholderProps>(
  ({ material, position, rotation, scale, castShadow, receiveShadow }, ref) => {
    // Create geometries once and reuse them
    const palmGeometry = useMemo(() => new THREE.SphereGeometry(0.22, 32, 32), [])
    const fingerGeometry = useMemo(() => new THREE.CapsuleGeometry(0.04, 0.25, 8, 16), [])

    // Finger positions and rotations
    const fingers = useMemo(() => [
      { position: [-0.18, 0.28, 0.05] as const, rotation: [-0.25, 0, 0] as const },
      { position: [-0.06, 0.28, 0.05] as const, rotation: [-0.15, 0, 0] as const },
      { position: [0.06, 0.28, 0.05] as const, rotation: [-0.1, 0, 0] as const },
      { position: [0.18, 0.28, 0.05] as const, rotation: [0.0, 0, 0] as const }
    ], [])

    // Default material if none provided
    const defaultMaterial = useMemo(() => new THREE.MeshStandardMaterial({ 
      color: '#f0f0f0',
      metalness: 0.1,
      roughness: 0.7
    }), [])

    return (
      <group 
        ref={ref}
        position={position}
        rotation={rotation || [-0.3, -0.2, 0.1]}
        scale={scale}
        castShadow={castShadow}
        receiveShadow={receiveShadow}
      >
        {/* Palm */}
        <mesh geometry={palmGeometry} position={[0, 0, 0]}>
          {material ? (
            <primitive object={material} attach="material" />
          ) : (
            <primitive object={defaultMaterial} attach="material" />
          )}
        </mesh>

        {/* Fingers */}
        {fingers.map((finger, index) => (
          <mesh
            key={`finger-${index}`}
            geometry={fingerGeometry}
            position={finger.position}
            rotation={finger.rotation}
          >
            {material ? (
              <primitive object={material} attach="material" />
            ) : (
              <primitive object={defaultMaterial} attach="material" />
            )}
          </mesh>
        ))}

        {/* Thumb */}
        <mesh 
          geometry={fingerGeometry} 
          position={[-0.3, 0.08, -0.02]} 
          rotation={[0.0, 0.6, -1.2]}
        >
          {material ? (
            <primitive object={material} attach="material" />
          ) : (
            <primitive object={defaultMaterial} attach="material" />
          )}
        </mesh>
      </group>
    )
  }
)

HandPlaceholder.displayName = 'HandPlaceholder'

export default HandPlaceholder