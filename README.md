# 3D Studio - Professional Three.js Development Platform

A production-ready **React Three Fiber** platform with custom GLSL shaders, GSAP scroll animations, and optimized performance for creating premium 3D web experiences.

![Three.js Platform](https://img.shields.io/badge/Three.js-Platform-blue) ![Next.js](https://img.shields.io/badge/Next.js-15-black) ![TypeScript](https://img.shields.io/badge/TypeScript-Ready-3178c6)

## ✨ Features

- 🎨 **Custom GLSL Shaders** - Pearlescent material with organic color animations
- 🔄 **GSAP ScrollTrigger** - Smooth scroll-driven camera animations  
- ✨ **Post-Processing Pipeline** - Bloom effects, tone mapping for cinematic visuals
- 🌟 **Floating Particle System** - Optimized instanced geometry
- 📱 **Mobile Optimized** - Fixes for Safari URL bar, responsive performance
- 🎭 **Professional Lighting** - Studio setup with dynamic shadows
- 🛠️ **TypeScript Ready** - Fully typed components and utilities
- 🏗️ **Production Ready** - SEO, performance monitoring, deployment ready

## 🚀 Quick Start

```bash
# Clone the repository
git clone [repository-url]
cd 3d-studio-starter

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:3000` to see your 3D experience!

---

## 🎯 CLIENT CUSTOMIZATION GUIDE

This section covers everything you need to customize for client projects.

### 1️⃣ **Branding & Metadata**

#### **Update Site Title & Description**
```typescript
// src/app/layout.tsx
export const metadata: Metadata = {
  title: "Your Client Name - Custom Title",
  description: "Your client's business description",
  keywords: "your, client, keywords",
  authors: [{ name: "Your Company" }],
  openGraph: {
    title: "Your Client OG Title",
    description: "Your client OG description",
    images: ['/og-image.png'], // Add your OG image to public/
  },
}
```

#### **Update Package Information**
```json
// package.json
{
  "name": "client-project-name",
  "version": "1.0.0",
  "description": "Client project description",
  "author": "Your Company"
}
```

### 2️⃣ **Hero Section Content**

#### **Update Main Headlines & Text**
```typescript
// src/app/page.tsx - Lines 23-36

// Update the main headline (line 23-25)
<h1 className="...">
  Your Client Headline
</h1>

// Update the description (line 26-29)
<p className="...">
  Your client's value proposition and main description
</p>

// Update CTA buttons (line 31-36)
<button>Get Started</button>  // Primary CTA
<button>Learn More</button>   // Secondary CTA
```

#### **Update Badge/Announcement**
```typescript
// src/app/page.tsx - Line 19-22
<div className="inline-flex items-center...">
  <span className="w-2 h-2 bg-green-500..."></span>
  New Feature Launch  // Your announcement text
</div>
```

### 3️⃣ **3D Model & Scene**

#### **Replace the 3D Model**
```typescript
// Option 1: Use your own GLB model
// 1. Add model to public/models/client-model.glb
// 2. Create new component in src/components/three/models/ClientModel.tsx

import { useGLTF } from '@react-three/drei'

export default function ClientModel(props) {
  const { scene } = useGLTF('/models/client-model.glb')
  return <primitive object={scene} {...props} />
}

// 3. Update src/components/three/Scene.tsx
import ClientModel from './models/ClientModel'

// Replace HandPlaceholder with:
<ClientModel 
  material={pearlescentMaterial}
  position={[0, -0.2, 0]}
  scale={0.9}
/>
```

#### **Customize Shader Colors**
```typescript
// src/components/three/Scene.tsx - Lines 31-37
const pearlescentMaterial = useMemo(() => new PearlescentMaterial({
  colorPrimary: new THREE.Color('#FF6B6B'),   // Your primary color
  colorSecondary: new THREE.Color('#4ECDC4'), // Your secondary color
  colorAccent: new THREE.Color('#FFE66D'),    // Your accent color
  fresnelPower: 2.0,
  rimIntensity: 1.2,
  fresnelBias: 0.05
}), [])
```

#### **Adjust Lighting**
```typescript
// src/components/three/Scene.tsx - Lines 54-72
<ambientLight intensity={0.8} />  // Adjust overall brightness
<directionalLight 
  position={[5, 5, 5]} 
  intensity={1.5}  // Main light strength
/>
// Rim lights - adjust colors to match brand
<pointLight position={[-3, 2, -3]} intensity={0.8} color="#81d4fa" />
<pointLight position={[3, -2, 3]} intensity={0.6} color="#ffb3ba" />
```

### 4️⃣ **Content Sections**

#### **Features Section**
```typescript
// src/app/page.tsx - Lines 80-187

// Update section title (line 83-85)
<h2>Your Features Headline</h2>

// Update feature cards (lines 93-136)
// Each card structure:
<div className="group p-8...">
  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600...">
    <svg>...</svg>  // Your icon
  </div>
  <h3>Feature Title</h3>
  <p>Feature description</p>
</div>
```

#### **Showcase Section**
```typescript
// src/app/page.tsx - Lines 190-255

// Update showcase content
<h2>Your Showcase Title</h2>
<p>Your showcase description</p>

// Update code example or demo content
```

#### **Footer**
```typescript
// src/app/page.tsx - Lines 386-459

// Update footer CTA (lines 389-395)
<h3>Your Call to Action</h3>
<button>Your CTA Button</button>

// Update footer links (lines 398-435)
// Update company info (lines 455-456)
© 2024 Your Company Name
```

### 5️⃣ **Animations & Interactions**

#### **Scroll Animation Timing**
```typescript
// src/components/three/CameraRig.tsx - Lines 16-20

// Adjust camera positions for scroll
const CAM_START = { x: 0.2, y: 0.4, z: 1.8, rx: 0, ry: 0, rz: 0 }
const CAM_END = { x: 0.6, y: 0.3, z: 1.6, rx: -0.1, ry: 0.2, rz: 0 }

// Adjust model rotation during scroll
const GROUP_START = { rx: -0.1, ry: Math.PI * 0.45, rz: 0 }
const GROUP_END = { rx: -0.2, ry: Math.PI * 0.6, rz: 0 }
```

#### **Content Fade-In Delays**
```typescript
// Adjust stagger delays for content animations
// src/app/page.tsx

<ScrollAnimated delay={100}>  // First item
<ScrollAnimated delay={200}>  // Second item
<ScrollAnimated delay={300}>  // Third item
```

#### **Mouse Parallax Intensity**
```typescript
// src/app/page.tsx - Line 36
<ThreeCanvas
  enableScrollAnimation={true}
  scrollTrigger="body"
  parallaxIntensity={0.3}  // Adjust intensity (0-1)
/>
```

### 6️⃣ **Performance Settings**

#### **Adjust for Target Devices**
```typescript
// src/hooks/useThreePerformance.ts

// Modify quality presets for your needs
const QUALITY_PRESETS = {
  low: {
    shadows: false,
    antialias: false,
    pixelRatio: 1,
    shadowMapSize: 512,
  },
  medium: {
    shadows: true,
    antialias: false,
    pixelRatio: Math.min(window.devicePixelRatio, 1.5),
    shadowMapSize: 1024,
  },
  high: {
    shadows: true,
    antialias: true,
    pixelRatio: Math.min(window.devicePixelRatio, 2),
    shadowMapSize: 2048,
  }
}
```

#### **Post-Processing Effects**
```typescript
// src/components/three/PostProcessing.tsx - Lines 20-28

// Adjust effect intensities
bloomIntensity = 2.0,      // Glow strength
bloomThreshold = 0.4,      // What glows
vignetteOpacity = 0.5,     // Edge darkening
vignetteOffset = 0.1       // Vignette size
```

### 7️⃣ **Colors & Styling**

#### **Update Color Scheme**
```typescript
// src/app/globals.css

:root {
  --background: #ffffff;      // Your background color
  --foreground: #171717;      // Your text color
  
  // Add your brand colors
  --brand-primary: #FF6B6B;
  --brand-secondary: #4ECDC4;
  --brand-accent: #FFE66D;
}
```

#### **Update Tailwind Classes**
Throughout `src/app/page.tsx`, update color classes:
- `bg-slate-800` → `bg-your-color`
- `text-slate-600` → `text-your-color`
- `from-slate-800 to-slate-600` → gradient colors

### 8️⃣ **Deployment Configuration**

#### **Environment Variables**
Create `.env.local`:
```bash
# Analytics (optional)
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX

# API endpoints (if needed)
NEXT_PUBLIC_API_URL=https://api.yourclient.com

# Feature flags
NEXT_PUBLIC_ENABLE_ANIMATIONS=true
NEXT_PUBLIC_ENABLE_PARTICLES=true
```

#### **Vercel Deployment**
```json
// vercel.json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "SAMEORIGIN"
        }
      ]
    }
  ]
}
```

### 9️⃣ **SEO & Social Media**

#### **Add Favicon**
Place your favicon files in `public/`:
- favicon.ico
- apple-touch-icon.png
- favicon-32x32.png
- favicon-16x16.png

#### **Add Open Graph Image**
Create and add to `public/og-image.png` (1200x630px recommended)

#### **Update Robots.txt**
```txt
// public/robots.txt
User-agent: *
Allow: /
Sitemap: https://yourclient.com/sitemap.xml
```

### 🔟 **Quick Customization Checklist**

- [ ] Update site title and metadata in `layout.tsx`
- [ ] Update package.json with client info
- [ ] Replace hero headline and description
- [ ] Update CTA button text and links
- [ ] Replace 3D model or adjust existing one
- [ ] Customize shader colors to match brand
- [ ] Update all content sections
- [ ] Adjust animation timings
- [ ] Update footer with client info
- [ ] Add favicon and OG image
- [ ] Configure environment variables
- [ ] Test on target devices
- [ ] Deploy to production

---

## 📁 Project Structure

```
src/
├── app/
│   ├── page.tsx                    # Main landing page
│   ├── layout.tsx                  # App layout & metadata
│   └── globals.css                 # Global styles
├── components/
│   ├── three/                      
│   │   ├── Canvas.tsx              # Three.js canvas wrapper
│   │   ├── Scene.tsx               # 3D scene composition
│   │   ├── CameraRig.tsx           # Scroll animations
│   │   ├── PostProcessing.tsx      # Visual effects
│   │   ├── FloatingParticles.tsx   # Particle system
│   │   ├── models/
│   │   │   └── HandPlaceholder.tsx # Default 3D model
│   │   └── shaders/
│   │       └── PearlescentMaterial.ts # Custom shader
│   └── ui/
│       ├── Header.tsx              # Navigation header
│       └── ScrollAnimated.tsx      # Scroll animations
├── hooks/
│   ├── useThreePerformance.ts      # Performance optimization
│   └── useScrollAnimation.ts       # Scroll triggers
└── types/
    └── three.ts                    # TypeScript definitions
```

## 🛠️ Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Create production build
npm run start        # Run production server
npm run lint         # Check code quality
```

## 📦 Tech Stack

- **Next.js 15** - React framework with App Router
- **React Three Fiber** - React renderer for Three.js
- **@react-three/drei** - Useful 3D helpers
- **@react-three/postprocessing** - Visual effects
- **GSAP** - Professional animations with ScrollTrigger
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first styling

## 🚀 Deployment

### Vercel (Recommended)
```bash
npx vercel
```

### Docker
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 📄 License

MIT License - feel free to use for commercial projects

---

**Built with ❤️ by 3D Studio**

*Ready to create stunning 3D web experiences? Start customizing! 🚀*