import * as THREE from 'three'
import type { ShaderMaterialUniforms } from '@/types/three'

const vertexShader = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vWorldPosition;
  varying vec3 vViewDirection;
  varying vec2 vUv;

  void main() {
    vUv = uv;
    
    // Transform position to world space
    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
    vWorldPosition = worldPosition.xyz;
    
    // Calculate world space normal
    vNormal = normalize(mat3(modelMatrix) * normal);
    
    // Calculate view direction from world position
    vec4 viewPosition = viewMatrix * worldPosition;
    vViewDirection = normalize(-viewPosition.xyz);
    
    gl_Position = projectionMatrix * viewPosition;
  }
`

const fragmentShader = /* glsl */ `
  uniform float uTime;
  uniform vec3 uColorPrimary;
  uniform vec3 uColorSecondary;
  uniform vec3 uColorAccent;
  uniform float uFresnelPower;
  uniform float uFresnelBias;
  uniform float uRimIntensity;
  uniform float uNoiseScale;
  uniform float uNoiseStrength;

  varying vec3 vNormal;
  varying vec3 vWorldPosition;
  varying vec3 vViewDirection;
  varying vec2 vUv;

  // Hash function for pseudo-random noise
  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }

  // Smooth noise function
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
    
    // Calculate Fresnel effect
    float fresnelFactor = uFresnelBias + (1.0 - uFresnelBias) * pow(1.0 - max(dot(normal, viewDir), 0.0), uFresnelPower);
    
    // Create pearlescent color gradient based on Fresnel
    vec3 baseColor = mix(uColorPrimary, uColorSecondary, fresnelFactor);
    vec3 pearlescentColor = mix(baseColor, uColorAccent, smoothstep(0.4, 1.0, fresnelFactor));
    
    // Add subtle noise for organic feel
    vec2 noiseCoord = vWorldPosition.xy * uNoiseScale + uTime * 0.1;
    float noiseValue = noise(noiseCoord) * 2.0 - 1.0;
    pearlescentColor += vec3(noiseValue * uNoiseStrength);
    
    // Rim lighting effect
    float rimLight = pow(fresnelFactor, 2.0) * uRimIntensity;
    vec3 rimColor = vec3(rimLight);
    
    // Fake subsurface scattering (wrap around lighting)
    vec3 lightDirection = normalize(vec3(0.5, 1.0, 0.3));
    float wrap = max(0.0, (dot(normal, lightDirection) + 1.0) * 0.5);
    float subsurface = pow(wrap, 1.5) * 0.3;
    
    // Combine all effects with minimum brightness to prevent dark flash
    vec3 finalColor = pearlescentColor * (0.8 + subsurface) + rimColor;
    
    // Ensure minimum brightness to prevent dark flash during shader compilation
    finalColor = max(finalColor, vec3(0.1));
    
    gl_FragColor = vec4(finalColor, 1.0);
  }
`

export interface PearlescentMaterialProps {
  time?: number
  colorPrimary?: THREE.Color
  colorSecondary?: THREE.Color  
  colorAccent?: THREE.Color
  fresnelPower?: number
  fresnelBias?: number
  rimIntensity?: number
  noiseScale?: number
  noiseStrength?: number
}

export default class PearlescentMaterial extends THREE.ShaderMaterial {
  private _time = 0

  constructor(props: PearlescentMaterialProps = {}) {
    const uniforms: ShaderMaterialUniforms = {
      uTime: { value: props.time || 0 },
      uColorPrimary: { value: props.colorPrimary || new THREE.Color('#98ff98') }, // True mint green
      uColorSecondary: { value: props.colorSecondary || new THREE.Color('#00ffff') }, // Pure cyan  
      uColorAccent: { value: props.colorAccent || new THREE.Color('#ffcba4') }, // Soft peach
      uFresnelPower: { value: props.fresnelPower || 2.0 },
      uFresnelBias: { value: props.fresnelBias || 0.1 },
      uRimIntensity: { value: props.rimIntensity || 0.6 },
      uNoiseScale: { value: props.noiseScale || 2.0 },
      uNoiseStrength: { value: props.noiseStrength || 0.05 }
    }

    super({
      vertexShader,
      fragmentShader,
      uniforms,
      transparent: false,
      side: THREE.FrontSide,
      // Ensure material compiles immediately to prevent dark flash
      depthWrite: true,
      depthTest: true
    })
  }

  // Time setter/getter for animation
  set time(value: number) {
    this._time = value
    this.uniforms.uTime.value = value
  }

  get time(): number {
    return this._time
  }

  // Color setters for easy customization
  setPrimaryColor(color: THREE.ColorRepresentation) {
    this.uniforms.uColorPrimary.value.set(color)
  }

  setSecondaryColor(color: THREE.ColorRepresentation) {
    this.uniforms.uColorSecondary.value.set(color)
  }

  setAccentColor(color: THREE.ColorRepresentation) {
    this.uniforms.uColorAccent.value.set(color)
  }

  // Update all uniforms at once
  updateUniforms(props: Partial<PearlescentMaterialProps>) {
    Object.keys(props).forEach(key => {
      const uniformKey = `u${key.charAt(0).toUpperCase() + key.slice(1)}`
      if (this.uniforms[uniformKey]) {
        if (key.includes('color') && props[key as keyof PearlescentMaterialProps] instanceof THREE.Color) {
          this.uniforms[uniformKey].value.copy(props[key as keyof PearlescentMaterialProps] as THREE.Color)
        } else {
          this.uniforms[uniformKey].value = props[key as keyof PearlescentMaterialProps]
        }
      }
    })
  }
}