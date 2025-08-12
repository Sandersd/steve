import * as THREE from 'three'
import type { ShaderMaterialUniforms } from '@/types/three'

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
    
    // Enhanced beat-based scaling for more dramatic effect
    float beatScale = 1.0 + (uBeat * uBeatStrength * 0.25);
    vec3 scaledPosition = position * beatScale;
    
    // Multi-layered volume-based displacement with wave patterns
    float wave1 = sin(position.x * 15.0 + uTime * 3.0) * uVolume * 0.08;
    float wave2 = cos(position.z * 12.0 + uTime * 2.5) * uVolume * 0.06;
    scaledPosition.y += wave1;
    scaledPosition.x += wave2 * 0.5;
    
    // Enhanced bass-reactive pulsing with multiple frequencies
    float bassWave1 = sin(uTime * 6.0) * uBass * 0.12;
    float bassWave2 = cos(uTime * 4.0 + position.y * 20.0) * uBass * 0.08;
    scaledPosition += normal * (bassWave1 + bassWave2);
    
    // Treble-reactive sparkle displacement
    float trebleJitter = sin(uTime * 15.0 + position.x * 30.0) * uTreble * 0.04;
    scaledPosition += vec3(trebleJitter, trebleJitter * 0.5, trebleJitter * 0.3);
    
    // Mid-frequency orbital motion
    float midOrbit = uMid * 0.1;
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
    
    vec3 finalColor = trebleLayer + beatFlash + energyShift;
    
    // Enhanced volume-based brightness with non-linear scaling
    float volumeBrightness = 0.4 + (pow(uVolume, 0.7) * 1.2);
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
    
    // Layered emissive glow with frequency separation
    float bassGlow = uBass * 2.0;
    float midGlow = uMid * 1.5;
    float trebleGlow = uTreble * 1.8;
    float beatGlow = vBeatPulse * 2.5;
    
    float totalGlow = bassGlow + midGlow + trebleGlow + beatGlow;
    finalColor += finalColor * totalGlow * 0.8;
    
    // Dynamic minimum brightness that pulses with the beat
    float minGlow = 0.4 + (vBeatPulse * 0.3) + (sin(uTime * 3.0) * 0.1);
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