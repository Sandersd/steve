import type { ShaderMaterialUniforms } from '@/types/three'
import * as THREE from 'three'

const vertexShader = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vWorldPosition;
  varying vec3 vViewDirection;
  varying vec2 vUv;
  varying float vBeatPulse;

  uniform float uTime;
  uniform float uVolume;
  uniform float uBass;
  uniform float uMid;
  uniform float uTreble;
  uniform float uBeat;
  uniform float uBeatStrength;

  void main() {
    vUv = uv;
    
    // Toned down beat-based scaling for less extreme size changes
    float beatScale = 1.0 + (uBeat * uBeatStrength * 0.08);
    vec3 scaledPosition = position * beatScale;
    
    // Toned down volume-based displacement with wave patterns
    float wave1 = sin(position.x * 15.0 + uTime * 3.0) * uVolume * 0.03;
    float wave2 = cos(position.z * 12.0 + uTime * 2.5) * uVolume * 0.025;
    scaledPosition.y += wave1;
    scaledPosition.x += wave2 * 0.5;
    
    // Toned down bass-reactive pulsing with multiple frequencies
    float bassWave1 = sin(uTime * 6.0) * uBass * 0.04;
    float bassWave2 = cos(uTime * 4.0 + position.y * 20.0) * uBass * 0.03;
    scaledPosition += normal * (bassWave1 + bassWave2);
    
    // Toned down treble-reactive sparkle displacement
    float trebleJitter = sin(uTime * 15.0 + position.x * 30.0) * uTreble * 0.015;
    scaledPosition += vec3(trebleJitter, trebleJitter * 0.5, trebleJitter * 0.3);
    
    // Toned down mid-frequency orbital motion
    float midOrbit = uMid * 0.03;
    scaledPosition.x += sin(uTime * 3.0 + position.y * 8.0) * midOrbit;
    scaledPosition.z += cos(uTime * 3.0 + position.x * 8.0) * midOrbit;
    
    // Transform position to world space
    vec4 worldPosition = modelMatrix * vec4(scaledPosition, 1.0);
    vWorldPosition = worldPosition.xyz;
    
    // Calculate world space normal
    vNormal = normalize(mat3(modelMatrix) * normal);
    
    // Calculate view direction from world position
    vec4 viewPosition = viewMatrix * worldPosition;
    vViewDirection = normalize(-viewPosition.xyz);
    
    // Pass beat pulse to fragment shader
    vBeatPulse = uBeat * uBeatStrength;
    
    gl_Position = projectionMatrix * viewPosition;
  }
`

const fragmentShader = /* glsl */ `
  uniform float uTime;
  uniform float uVolume;
  uniform float uBass;
  uniform float uMid;
  uniform float uTreble;
  uniform float uBeat;
  uniform float uBeatStrength;
  uniform vec3 uBaseColor;
  uniform vec3 uBassColor;
  uniform vec3 uMidColor;
  uniform vec3 uTrebleColor;
  uniform vec3 uBeatColor;

  varying vec3 vNormal;
  varying vec3 vWorldPosition;
  varying vec3 vViewDirection;
  varying vec2 vUv;
  varying float vBeatPulse;

  // Hash function for noise
  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }

  // Smooth noise
  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    
    vec2 u = f * f * (3.0 - 2.0 * f);
    
    return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
  }

  void main() {
    // Normalize vectors
    vec3 normal = normalize(vNormal);
    vec3 viewDir = normalize(vViewDirection);
    
    // Check if audio is playing (volume > 0)
    float audioActive = step(0.01, uVolume);
    
    // === ORGANIC COLOR ANIMATION WHEN PAUSED/MUTED ===
    vec3 pausedColor = vec3(0.0);
    if (audioActive < 0.5) {
      // Organic color blending between orange theme colors
      float t1 = sin(uTime * 0.5 + vWorldPosition.x * 0.3) * 0.5 + 0.5;
      float t2 = cos(uTime * 0.3 + vWorldPosition.y * 0.4) * 0.5 + 0.5;
      float t3 = sin(uTime * 0.4 + vWorldPosition.z * 0.2) * 0.5 + 0.5;
      
      // Brighter orange theme colors
      vec3 darkOrange = vec3(1.0, 0.72, 0.29); // Brighter version of #D98616
      vec3 lightOrange = vec3(1.0, 0.86, 0.49); // Brighter version of #E5A94A
      vec3 brightOrange = vec3(1.0, 0.75, 0.32); // Brighter version of #FF9A1F
      vec3 cream = vec3(1.0, 0.98, 0.94); // #F5F4F0
      
      // Blend between colors organically
      vec3 blend1 = mix(darkOrange, lightOrange, t1);
      vec3 blend2 = mix(brightOrange, cream, t2);
      pausedColor = mix(blend1, blend2, t3);
      
      // Organic brightness animation using layered noise
      float noise1 = noise(vWorldPosition.xy * 2.0 + uTime * 0.3);
      float noise2 = noise(vWorldPosition.yz * 3.0 - uTime * 0.2);
      float noise3 = noise(vWorldPosition.xz * 1.5 + uTime * 0.25);
      
      // Combine noises for fractal-like effect
      float fractalNoise = (noise1 * 0.5 + noise2 * 0.3 + noise3 * 0.2);
      
      // Organic brightness oscillation
      float brightnessPulse = 0.7 + sin(uTime * 0.8 + fractalNoise * 3.0) * 0.3;
      brightnessPulse += cos(uTime * 0.5 + vWorldPosition.x) * 0.2;
      
      // Apply shimmer and organic brightness
      float shimmer = fractalNoise * 0.2;
      pausedColor += vec3(shimmer);
      pausedColor *= brightnessPulse * 1.5; // Apply organic brightness animation
    } else {
      pausedColor = uBaseColor; // Default to base color when playing
    }
    
    // === NORMAL AUDIO-REACTIVE COLOR ===
    // Advanced frequency-based color mixing with more dynamic blending
    vec3 bassLayer = mix(uBaseColor, uBassColor, smoothstep(0.0, 1.0, uBass));
    vec3 midLayer = mix(bassLayer, uMidColor, smoothstep(0.0, 1.0, uMid * 1.2));
    vec3 trebleLayer = mix(midLayer, uTrebleColor, smoothstep(0.0, 1.0, uTreble * 1.5));
    
    // Multi-layered beat flash with pulsing intensity
    float beatPulse = vBeatPulse * (1.0 + sin(uTime * 20.0) * 0.3);
    vec3 beatFlash = uBeatColor * beatPulse * 1.5;
    
    // Dynamic color oscillation based on audio energy
    float audioEnergy = (uBass + uMid + uTreble) / 3.0;
    vec3 energyShift = vec3(
      sin(uTime * 5.0 + audioEnergy * 10.0) * 0.2,
      cos(uTime * 4.0 + audioEnergy * 8.0) * 0.15,
      sin(uTime * 6.0 + audioEnergy * 12.0) * 0.25
    ) * audioEnergy;
    
    vec3 audioColor = trebleLayer + beatFlash + energyShift;
    
    // Mix between paused and audio-reactive colors
    vec3 finalColor = mix(pausedColor, audioColor, audioActive);
    
    // Toned down volume-based brightness when playing
    float volumeBrightness = audioActive > 0.5 ? 0.4 + (pow(uVolume, 0.7) * 0.4) : 1.0;
    finalColor *= volumeBrightness;
    
    // Add noise texture based on audio
    vec2 noiseCoord = vWorldPosition.xy * 3.0 + uTime * 0.5;
    float noiseValue = noise(noiseCoord);
    float audioNoise = noiseValue * (uBass + uMid + uTreble) * 0.1;
    finalColor += vec3(audioNoise);
    
    // Fresnel effect for rim lighting
    float fresnel = 1.0 - max(dot(normal, viewDir), 0.0);
    fresnel = pow(fresnel, 2.0);
    
    // Spectacular audio-reactive rim lighting with multiple layers
    float rimIntensity = 0.6 + (uVolume * 2.0) + (vBeatPulse * 1.5);
    float rimPulse = 1.0 + sin(uTime * 8.0 + audioEnergy * 15.0) * 0.4;
    vec3 rimColor = mix(trebleLayer, uBeatColor, vBeatPulse) * fresnel * rimIntensity * rimPulse;
    finalColor += rimColor * 2.0; // Much brighter rim effect
    
    // Toned down layered emissive glow with frequency separation
    float bassGlow = uBass * 1.5;
    float midGlow = uMid * 1.2;
    float trebleGlow = uTreble * 1.5;
    float beatGlow = vBeatPulse * 1.8;
    
    float totalGlow = bassGlow + midGlow + trebleGlow + beatGlow;
    finalColor += finalColor * totalGlow * 0.6;
    
    // Higher minimum brightness that pulses with the beat
    float minGlow = 0.4 + (vBeatPulse * 0.2) + (sin(uTime * 3.0) * 0.1);
    finalColor = max(finalColor, vec3(minGlow));
    
    // Enhanced sparkle effects with multiple patterns
    float sparkleThreshold = 0.3;
    if (vBeatPulse > sparkleThreshold) {
      float sparkle1 = hash(vWorldPosition.xy + uTime) * vBeatPulse;
      float sparkle2 = hash(vWorldPosition.yz + uTime * 1.5) * vBeatPulse * 0.7;
      float sparkle3 = hash(vWorldPosition.xz + uTime * 0.8) * vBeatPulse * 0.9;
      finalColor += vec3(sparkle1 + sparkle2 + sparkle3) * 0.8;
    }
    
    // Audio-reactive corona effect
    float corona = pow(fresnel, 1.5) * audioEnergy * 2.0;
    finalColor += vec3(corona * 0.6, corona * 0.4, corona * 0.8);
    
    gl_FragColor = vec4(finalColor, 1.0);
  }
`

export interface MusicReactiveMaterialProps {
  time?: number
  volume?: number
  bass?: number
  mid?: number
  treble?: number
  beat?: number
  beatStrength?: number
  baseColor?: THREE.Color
  bassColor?: THREE.Color
  midColor?: THREE.Color
  trebleColor?: THREE.Color
  beatColor?: THREE.Color
}

export default class MusicReactiveMaterial extends THREE.ShaderMaterial {
  private _time = 0

  constructor(props: MusicReactiveMaterialProps = {}) {
    const uniforms: ShaderMaterialUniforms = {
      uTime: { value: props.time || 0 },
      uVolume: { value: props.volume || 0 },
      uBass: { value: props.bass || 0 },
      uMid: { value: props.mid || 0 },
      uTreble: { value: props.treble || 0 },
      uBeat: { value: props.beat || 0 },
      uBeatStrength: { value: props.beatStrength || 0 },
      uBaseColor: { value: props.baseColor || new THREE.Color('#4a90e2') }, // Blue base
      uBassColor: { value: props.bassColor || new THREE.Color('#e74c3c') }, // Red for bass
      uMidColor: { value: props.midColor || new THREE.Color('#f39c12') },  // Orange for mid
      uTrebleColor: { value: props.trebleColor || new THREE.Color('#9b59b6') }, // Purple for treble
      uBeatColor: { value: props.beatColor || new THREE.Color('#ffffff') } // White for beats
    }

    super({
      vertexShader,
      fragmentShader,
      uniforms,
      transparent: false,
      side: THREE.FrontSide,
      depthWrite: true,
      depthTest: true
    })
  }

  // Update audio data
  updateAudioData(audioData: {
    volume: number
    bass: number
    mid: number
    treble: number
    beat: boolean
    beatStrength: number
  }) {
    this.uniforms.uVolume.value = audioData.volume
    this.uniforms.uBass.value = audioData.bass
    this.uniforms.uMid.value = audioData.mid
    this.uniforms.uTreble.value = audioData.treble
    this.uniforms.uBeat.value = audioData.beat ? 1.0 : 0.0
    this.uniforms.uBeatStrength.value = audioData.beatStrength
    
    // Debug: Log uniform updates occasionally (disabled for performance)
    // if (audioData.volume > 0.01 && Math.random() < 0.001) {
    //   console.log('🎨 MusicReactiveMaterial: Updated uniforms', {
    //     uVolume: this.uniforms.uVolume.value.toFixed(3),
    //     uBeat: this.uniforms.uBeat.value
    //   })
    // }
  }

  // Time setter for animation
  set time(value: number) {
    this._time = value
    this.uniforms.uTime.value = value
  }

  get time(): number {
    return this._time
  }

  // Color setters
  setBaseColor(color: THREE.ColorRepresentation) {
    this.uniforms.uBaseColor.value.set(color)
  }

  setBassColor(color: THREE.ColorRepresentation) {
    this.uniforms.uBassColor.value.set(color)
  }

  setMidColor(color: THREE.ColorRepresentation) {
    this.uniforms.uMidColor.value.set(color)
  }

  setTrebleColor(color: THREE.ColorRepresentation) {
    this.uniforms.uTrebleColor.value.set(color)
  }

  setBeatColor(color: THREE.ColorRepresentation) {
    this.uniforms.uBeatColor.value.set(color)
  }
}