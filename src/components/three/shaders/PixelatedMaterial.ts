'use client'

import * as THREE from 'three'

const vertexShader = `
  varying vec2 vUv;
  varying vec3 vPosition;
  varying vec3 vNormal;
  uniform float time;
  uniform float pixelSize;
  uniform float animationSpeed;
  
  void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);
    
    // Add some vertex animation for cartoony effect
    vec3 pos = position;
    pos.y += sin(time * animationSpeed + position.x * 3.0) * 0.02;
    pos.x += cos(time * animationSpeed * 0.7 + position.z * 2.0) * 0.01;
    
    vPosition = pos;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`

const fragmentShader = `
  uniform float time;
  uniform float pixelSize;
  uniform vec3 colorPrimary;
  uniform vec3 colorSecondary;
  uniform vec3 colorAccent;
  uniform float animationSpeed;
  uniform float contrast;
  
  varying vec2 vUv;
  varying vec3 vPosition;
  varying vec3 vNormal;
  
  // Pixelation function
  vec2 pixelate(vec2 uv, float size) {
    return floor(uv * size) / size;
  }
  
  // Simple noise function for texture
  float noise(vec2 p) {
    return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
  }
  
  // Cartoon-style color quantization
  vec3 quantizeColor(vec3 color, float levels) {
    return floor(color * levels) / levels;
  }
  
  void main() {
    // Pixelate UV coordinates
    vec2 pixelUv = pixelate(vUv, 1.0 / pixelSize);
    
    // Create animated patterns
    float timeOffset = time * animationSpeed;
    float pattern1 = sin(pixelUv.x * 20.0 + timeOffset) * 0.5 + 0.5;
    float pattern2 = cos(pixelUv.y * 15.0 + timeOffset * 0.7) * 0.5 + 0.5;
    float pattern3 = sin((pixelUv.x + pixelUv.y) * 10.0 + timeOffset * 1.3) * 0.5 + 0.5;
    
    // Add some noise for texture
    float noiseValue = noise(pixelUv * 8.0 + timeOffset * 0.1);
    
    // Mix colors based on patterns
    vec3 color = mix(colorPrimary, colorSecondary, pattern1);
    color = mix(color, colorAccent, pattern2 * 0.6);
    
    // Add highlights and lowlights for cartoon effect
    float fresnel = 1.0 - dot(vNormal, vec3(0.0, 0.0, 1.0));
    color = mix(color, colorAccent, fresnel * 0.3);
    
    // Apply subtle noise texture (reduced to prevent flickers)
    color = mix(color, vec3(1.0), noiseValue * 0.05);
    
    // Quantize colors for cartoon effect (smoother transitions)
    color = quantizeColor(color, 6.0);
    
    // Enhance contrast (clamped to prevent dark flickers)
    color = pow(clamp(color, 0.1, 1.0), vec3(1.0 / contrast));
    
    // Add stable glow effect (prevent dark flickers)
    float glow = sin(timeOffset * 2.0) * 0.05 + 0.95; // Reduced flicker range
    color *= glow;
    
    // Ensure minimum brightness to prevent dark flickers
    color = max(color, vec3(0.1));
    
    gl_FragColor = vec4(color, 1.0);
  }
`

export interface PixelatedMaterialProps {
  colorPrimary?: THREE.Color
  colorSecondary?: THREE.Color
  colorAccent?: THREE.Color
  pixelSize?: number
  animationSpeed?: number
  contrast?: number
}

export default class PixelatedMaterial extends THREE.ShaderMaterial {
  constructor({
    colorPrimary = new THREE.Color('#FF6B35'), // Meme orange
    colorSecondary = new THREE.Color('#F7931E'), // Bright orange
    colorAccent = new THREE.Color('#FFE66D'), // Yellow accent
    pixelSize = 0.02,
    animationSpeed = 1.0,
    contrast = 1.2
  }: PixelatedMaterialProps = {}) {
    super({
      vertexShader,
      fragmentShader,
      uniforms: {
        time: { value: 0 },
        pixelSize: { value: pixelSize },
        colorPrimary: { value: colorPrimary },
        colorSecondary: { value: colorSecondary },
        colorAccent: { value: colorAccent },
        animationSpeed: { value: animationSpeed },
        contrast: { value: contrast }
      },
      side: THREE.DoubleSide
    })
  }

  get time() {
    return this.uniforms.time.value
  }

  set time(value: number) {
    this.uniforms.time.value = value
  }

  get pixelSize() {
    return this.uniforms.pixelSize.value
  }

  set pixelSize(value: number) {
    this.uniforms.pixelSize.value = value
  }

  get animationSpeed() {
    return this.uniforms.animationSpeed.value
  }

  set animationSpeed(value: number) {
    this.uniforms.animationSpeed.value = value
  }
}