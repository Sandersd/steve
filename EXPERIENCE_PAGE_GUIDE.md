# Experience Page Documentation

## Overview

The `/experience` route showcases an advanced 3D scroll-driven animation experience featuring:
- Complex choreographed animations tied to scroll position
- Dynamic camera movements with smooth interpolation
- Multiple 3D model groups with synchronized animations
- UI elements that fade in/out at specific scroll percentages
- Pinned scrolling with GSAP ScrollTrigger

## Architecture

### Core Components

#### 1. **ExperiencePage** (`src/app/experience/page.tsx`)
- Main page component that orchestrates the experience
- Manages performance settings via `useResponsiveThree` hook
- Contains all UI elements (hero copy, side panel, content sections)

#### 2. **ExperienceCanvas** (`src/components/three/ExperienceCanvas.tsx`)
- WebGL canvas wrapper configured for the experience
- Sets up lighting, shadows, and post-processing effects
- Black background for dramatic effect

#### 3. **ExperienceCameraRig** (`src/components/three/ExperienceCameraRig.tsx`)
- Controls camera movement based on scroll position
- Manages UI element visibility (heroCopy, sidePanel)
- Implements smooth camera interpolation with lerp

#### 4. **ExperienceScene** (`src/components/three/ExperienceScene.tsx`)
- Manages all 3D models and their animations
- Controls groupA (Steve model), groupB (cube/sphere/claws), and background particles
- Implements scan line effect for biometric scanning

### 3D Models

#### GroupA - Steve Model
- Main character model with pearlescent shader
- Scales up during "scanning" phase
- Rotates and moves throughout the experience

#### GroupB - Geometric Cluster
- Cube, sphere, and orange claw elements
- Enters from off-screen at 40% scroll
- Rotates and dances with GroupA

#### BgBits - Background Particles
- Floating geometric shapes
- Provides depth and atmosphere
- Scales up during final phase

## Scroll Choreography Timeline

### 0-10%: Initial Scene
- Hero copy fully visible
- Camera at starting position (0, 0.45, 2.0)
- Steve model visible with subtle rotation

### 10-25%: Introduction
- Hero copy fades out
- Camera moves closer
- Steve model begins rotating

### 25-40%: Biometric Scanning
- Camera focuses on Steve model
- Model scales up 1.3x
- Scan line appears and animates
- Side panel slides in with verification UI

### 40-55%: Second Group Entrance
- GroupB slides in from right
- Steve model scales back to normal
- Camera pulls back to show both groups
- Scan line disappears

### 55-70%: Dance Sequence
- Both models rotate in choreographed motion
- Camera performs gentle orbit
- Background particles scale up

### 70-85%: Overview Position
- Camera moves to overview angle
- Both groups move to final positions
- Side panel fades out

### 85-100%: Content Transition
- Models scale down slightly (0.9x)
- Background particles scale up (1.3x)
- Camera at final position
- Content sections become visible

## Animation System

### GSAP Timeline Structure

```javascript
const timeline = gsap.timeline({ 
  paused: true,
  defaults: { ease: 'power2.inOut' }
})

// Animations are added with specific timing
timeline.to(target, {
  property: value,
  duration: 0.15  // Duration relative to total timeline
}, 0.25)  // Start position (0-1 range)
```

### ScrollTrigger Configuration

```javascript
ScrollTrigger.create({
  trigger: '.experience-container',
  start: 'top top',
  end: '+=300%',  // Creates 3x viewport height of scroll
  pin: '.experience-container',
  pinSpacing: true,
  scrub: 1,  // Smooth scrubbing
  animation: timeline
})
```

### Camera Movement System

The camera uses a two-stage smoothing system:
1. **Target calculation** based on scroll progress with eased interpolation
2. **Lerp smoothing** (factor: 0.1) for frame-to-frame smoothness

```javascript
// Calculate target based on progress
const t = easeInOutCubic((progress - startProgress) / duration)
targetX = startX * (1 - t) + endX * t

// Apply lerp for smoothness
camera.position.x += (targetX - camera.position.x) * lerpFactor
```

## Key Technologies

- **React Three Fiber (R3F)**: React renderer for Three.js
- **GSAP + ScrollTrigger**: Animation and scroll-based triggers
- **Three.js**: 3D graphics library
- **Custom GLSL Shaders**: PearlescentMaterial for iridescent effects

## Performance Optimizations

1. **Conditional shadows** based on device tier
2. **Adjustable pixel ratio** for different devices
3. **Optimized material instancing**
4. **Lazy loading with Suspense**
5. **Hardware acceleration via CSS transforms**

## File Structure

```
src/
├── app/
│   └── experience/
│       └── page.tsx          # Main experience page
├── components/
│   ├── three/
│   │   ├── ExperienceCanvas.tsx
│   │   ├── ExperienceCameraRig.tsx
│   │   ├── ExperienceScene.tsx
│   │   ├── models/
│   │   │   ├── GroupB.tsx   # Geometric cluster
│   │   │   └── BgBits.tsx   # Background particles
│   │   └── shaders/
│   │       └── PearlescentMaterial.ts
│   └── ui/
│       └── ExperienceHeader.tsx
```

## Debugging Tips

1. **Camera snapping**: Check lerp factor and easing functions
2. **Animation timing**: Verify timeline positions (0-1 range)
3. **Model visibility**: Check initial positions and scales
4. **Scroll distance**: Adjust `end: '+=300%'` for scroll length
5. **Performance**: Monitor with Chrome DevTools Performance tab