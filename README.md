# Professional Three.js Boilerplate

A production-ready **React Three Fiber** boilerplate with custom GLSL shaders, GSAP scroll animations, and performance optimizations. Perfect for creating premium 3D web experiences.

![Three.js Boilerplate](https://img.shields.io/badge/Three.js-Boilerplate-blue) ![Next.js](https://img.shields.io/badge/Next.js-14-black) ![TypeScript](https://img.shields.io/badge/TypeScript-Ready-3178c6)

## ✨ Features

- 🎨 **Custom GLSL Shaders** - Pearlescent material with Fresnel effects, noise dithering, and dynamic gradients
- 🔄 **GSAP ScrollTrigger** - Smooth scroll-driven camera animations and object rotations  
- ✨ **Post-Processing Pipeline** - Bloom effects, tone mapping, and vignette for cinematic visuals
- 🤚 **3D Model Support** - Easy GLB model integration with placeholder system
- 🌟 **Floating Particle System** - Instanced geometry with performance optimizations
- 📱 **Responsive Performance** - Device-specific settings and automatic optimization
- 🎭 **Professional Lighting** - Studio setup with dynamic shadows
- 🛠️ **TypeScript Ready** - Fully typed components and utilities
- 🏗️ **Modular Architecture** - Clean, organized code structure

## 🚀 Quick Start

```bash
# Clone the repository
git clone [repository-url]
cd r3f-professional-starter

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:3000` to see the magic! ✨

## 📁 Project Structure

```
src/
├── app/
│   ├── page.tsx                    # Main page with scroll sections
│   ├── layout.tsx                  # App layout
│   └── globals.css                 # Global styles
├── components/
│   └── three/                      # Three.js components
│       ├── Canvas.tsx              # Main Canvas wrapper
│       ├── Scene.tsx               # 3D scene composition
│       ├── CameraRig.tsx           # GSAP scroll animations
│       ├── PostProcessing.tsx      # Effects pipeline
│       ├── FloatingParticles.tsx   # Particle system
│       ├── models/
│       │   └── HandPlaceholder.tsx # Procedural hand model
│       └── shaders/
│           └── PearlescentMaterial.ts # Custom GLSL shader
├── hooks/
│   └── useThreePerformance.ts      # Performance monitoring
├── types/
│   └── three.ts                    # TypeScript definitions
└── utils/                          # Utility functions
```

## 🎨 Custom Shaders

### Pearlescent Material

The star of the show - a custom GLSL shader that creates beautiful pearlescent effects:

```typescript
import PearlescentMaterial from '@/components/three/shaders/PearlescentMaterial'

const material = new PearlescentMaterial({
  colorPrimary: new THREE.Color('#a8e6cf'),    // Mint
  colorSecondary: new THREE.Color('#81d4fa'),  // Light blue  
  colorAccent: new THREE.Color('#ffb3ba'),     // Soft pink
  fresnelPower: 2.2,
  rimIntensity: 0.8
})

// Animate over time
useFrame((state) => {
  material.time = state.clock.elapsedTime
})
```

**Shader Features:**
- Fresnel-based rim lighting
- Smooth color gradients (mint → cyan → peach)
- Procedural noise for organic feel
- Fake subsurface scattering
- Time-based animations

## 🔄 Scroll Animations

GSAP ScrollTrigger integration for smooth, performant animations:

```typescript
<CameraRig
  trigger="#hero"
  cameraStart={{ position: [0, 0.5, 2] }}
  cameraEnd={{ position: [0.6, 0.3, 1.6] }}
  groupRotationEnd={[-0.2, Math.PI * 0.6, 0]}
  scrollStart="top top"
  scrollEnd="bottom bottom"
  scrub={1}
  pin={true}
>
  <Scene />
</CameraRig>
```

## 🤚 3D Models

### Replacing the Placeholder

The boilerplate includes a procedural hand placeholder. Replace it with your own GLB model:

1. **Add your model** to `public/models/your-model.glb`
2. **Create a model component:**

```typescript
import { useGLTF } from '@react-three/drei'

function YourModel(props) {
  const { scene } = useGLTF('/models/your-model.glb')
  return <primitive object={scene} {...props} />
}

// Use it in Scene.tsx
<YourModel 
  material={pearlescentMaterial}
  position={[0, -0.2, 0]}
  scale={0.9}
/>
```

3. **Optimize your models:**
   - Use Draco compression
   - Apply meshopt for geometry
   - Convert textures to KTX2 format

## ⚡ Performance Optimization

### Automatic Device Detection

The boilerplate automatically detects device capabilities and adjusts settings:

```typescript
const { deviceTier, settings } = useResponsiveThree()

// Returns optimized settings based on device:
// - Low: Basic mobile devices
// - Medium: Standard desktop/laptop  
// - High: Gaming rigs and workstations
```

### Manual Performance Tuning

```typescript
<ThreeCanvas
  performance={{
    enableShadows: true,
    shadowMapSize: 2048,
    antialias: false,  // Let post-processing handle AA
    pixelRatio: [1, 2],
    powerPreference: 'high-performance'
  }}
/>
```

### Performance Monitoring

```typescript
import { useThreePerformance } from '@/hooks/useThreePerformance'

const { performance, isLowPerformance } = useThreePerformance({
  targetFPS: 60,
  enableMonitoring: true,
  autoOptimize: true
})

console.log(`FPS: ${performance.fps}, Draw Calls: ${performance.drawCalls}`)
```

## ✨ Post-Processing

Customizable effects pipeline for cinematic visuals:

```typescript
<PostProcessing
  enableBloom={true}
  enableVignette={true}
  enableToneMapping={true}
  bloomIntensity={1.2}
  bloomThreshold={0.6}
  vignetteOpacity={0.5}
/>
```

**Available Effects:**
- **Bloom** - Luminance-based glow effects
- **Tone Mapping** - ACES Filmic for realistic lighting
- **Vignette** - Cinematic edge darkening

## 🛠️ Customization

### Shader Colors

Modify the pearlescent material colors:

```typescript
material.setPrimaryColor('#ff6b6b')    // Coral
material.setSecondaryColor('#4ecdc4')  // Turquoise  
material.setAccentColor('#ffe66d')     // Yellow

// Or update multiple properties at once
material.updateUniforms({
  colorPrimary: new THREE.Color('#ff6b6b'),
  fresnelPower: 3.0,
  rimIntensity: 1.0
})
```

### Animation Timing

Adjust scroll trigger settings:

```typescript
<CameraRig
  scrollStart="top center"     // Animation start point
  scrollEnd="bottom center"    // Animation end point
  scrub={2}                   // Animation smoothness (0-3)
  pin={false}                 // Disable section pinning
/>
```

### Particle System

Configure floating particles:

```typescript
<FloatingParticles
  count={100}              // Number of particles
  spread={5}              // Distribution area
  speed={1.2}             // Float animation speed
  rotationIntensity={0.5} // Rotation amount
/>
```

## 🎯 Production Deployment

### Build Optimization

```bash
# Production build
npm run build

# Preview production build
npm run start
```

### Performance Checklist

- ✅ Models use Draco compression
- ✅ Textures are in KTX2 format  
- ✅ Shadow map size optimized for target devices
- ✅ Pixel ratio capped at 2x for performance
- ✅ Instanced geometry for repeated objects
- ✅ Post-processing replaces expensive anti-aliasing

### Environment Variables

Create `.env.local` for custom settings:

```bash
# Performance settings
NEXT_PUBLIC_ENABLE_PERFORMANCE_MONITOR=true
NEXT_PUBLIC_TARGET_FPS=60

# Feature flags  
NEXT_PUBLIC_ENABLE_SHADOWS=true
NEXT_PUBLIC_ENABLE_POST_PROCESSING=true
```

## 📦 Dependencies

### Core Dependencies
- **Next.js 14** - React framework with App Router
- **React Three Fiber** - React renderer for Three.js
- **@react-three/drei** - Useful helpers and abstractions
- **@react-three/postprocessing** - Post-processing effects
- **Three.js** - 3D graphics library
- **GSAP** - Animation library with ScrollTrigger
- **TypeScript** - Type safety and better DX

### Development Dependencies
- **@types/three** - Three.js type definitions
- **Tailwind CSS** - Utility-first CSS framework
- **ESLint** - Code linting and formatting

## 🔧 Available Scripts

```bash
npm run dev          # Development server
npm run build        # Production build  
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # TypeScript validation
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Three.js](https://threejs.org/) - Amazing 3D graphics library
- [React Three Fiber](https://github.com/pmndrs/react-three-fiber) - React integration
- [GSAP](https://greensock.com/gsap/) - Professional animation library
- [Next.js](https://nextjs.org/) - The React framework for production

---

**Built with ❤️ for the Three.js community**

*Ready to create stunning 3D web experiences? Start building! 🚀*