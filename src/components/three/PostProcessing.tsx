'use client'

import { ReactElement } from 'react'
import { EffectComposer, Bloom, Vignette, ToneMapping } from '@react-three/postprocessing'
import { ToneMappingMode, BlendFunction } from 'postprocessing'

interface PostProcessingProps {
  enableBloom?: boolean
  enableVignette?: boolean
  enableToneMapping?: boolean
  bloomIntensity?: number
  bloomThreshold?: number
  vignetteOpacity?: number
  vignetteOffset?: number
}

/**
 * Post-processing effects pipeline for enhanced visuals
 */
export default function PostProcessing({
  enableBloom = true,
  enableVignette = true,
  enableToneMapping = true,
  bloomIntensity = 1.2,
  bloomThreshold = 0.6,
  vignetteOpacity = 0.5,
  vignetteOffset = 0.1
}: PostProcessingProps) {
  const effects: ReactElement[] = []

  if (enableToneMapping) {
    effects.push(
      <ToneMapping 
        key="tone-mapping"
        mode={ToneMappingMode.ACES_FILMIC}
        resolution={256}
        whitePoint={4.0}
        middleGrey={0.6}
        minLuminance={0.01}
        averageLuminance={1.0}
        adaptationRate={1.0}
      />
    )
  }

  if (enableBloom) {
    effects.push(
      <Bloom
        key="bloom"
        intensity={bloomIntensity}
        luminanceThreshold={bloomThreshold}
        luminanceSmoothing={0.9}
        mipmapBlur={true}
        blendFunction={BlendFunction.ADD}
        kernelSize={3}
      />
    )
  }

  if (enableVignette) {
    effects.push(
      <Vignette
        key="vignette"
        offset={vignetteOffset}
        darkness={vignetteOpacity}
        blendFunction={BlendFunction.MULTIPLY}
      />
    )
  }

  return (
    <EffectComposer enableNormalPass>
      {effects}
    </EffectComposer>
  )
}