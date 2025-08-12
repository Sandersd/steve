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
    
    // Apply beat-based scaling (reduced from 0.3 to 0.1 for less explosion)
    float beatScale = 1.0 + (uBeat * uBeatStrength * 0.1);
    vec3 scaledPosition = position * beatScale;
    
    // Add volume-based displacement (reduced to 0.02 for minimal movement)
    float volumeDisplacement = sin(position.x * 10.0 + uTime * 2.0) * uVolume * 0.02;
    scaledPosition.y += volumeDisplacement;
    
    // Add bass-reactive pulsing (reduced to 0.03 for minimal explosion)
    float bassDisplacement = sin(uTime * 5.0) * uBass * 0.03;
    scaledPosition += normal * bassDisplacement;
    
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
    
    // Base color mixing based on frequency analysis
    vec3 frequencyColor = mix(
      mix(uBaseColor, uBassColor, uBass),
      mix(uMidColor, uTrebleColor, uTreble),
      uMid
    );
    
    // Beat flash effect
    vec3 beatFlash = uBeatColor * vBeatPulse;
    vec3 finalColor = frequencyColor + beatFlash;
    
    // Volume-based brightness
    float volumeBrightness = 0.5 + (uVolume * 0.5);
    finalColor *= volumeBrightness;
    
    // Add noise texture based on audio
    vec2 noiseCoord = vWorldPosition.xy * 3.0 + uTime * 0.5;
    float noiseValue = noise(noiseCoord);
    float audioNoise = noiseValue * (uBass + uMid + uTreble) * 0.1;
    finalColor += vec3(audioNoise);
    
    // Fresnel effect for rim lighting
    float fresnel = 1.0 - max(dot(normal, viewDir), 0.0);
    fresnel = pow(fresnel, 2.0);
    
    // Enhanced audio-reactive rim lighting for more shimmer
    float rimIntensity = 0.5 + (uVolume * 1.2) + (vBeatPulse * 0.8);
    vec3 rimColor = mix(frequencyColor, uBeatColor, vBeatPulse) * fresnel * rimIntensity;
    finalColor += rimColor * 1.3; // Extra bright rim
    
    // Enhanced emissive glow based on audio energy (much more glow-y)
    float emissiveStrength = uVolume * 1.5 + (uBass * 0.8) + (vBeatPulse * 1.2);
    finalColor += finalColor * emissiveStrength * 0.6;
    
    // Ensure minimum glow for orange blocks
    finalColor = max(finalColor, vec3(0.3)); // Higher minimum brightness for glow
    
    // Add subtle sparkle on beats
    if (vBeatPulse > 0.5) {
      float sparkle = hash(vWorldPosition.xy + uTime) * vBeatPulse;
      finalColor += vec3(sparkle * 0.5);
    }
    
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