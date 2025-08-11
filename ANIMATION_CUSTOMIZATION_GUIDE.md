# Animation Customization Guide

## Quick Start: Common Adjustments

### 1. Scroll Speed & Distance

**Make scrolling longer/shorter:**
```javascript
// In ExperienceCameraRig.tsx and ExperienceScene.tsx
ScrollTrigger.create({
  end: '+=300%',  // Change to +=200% for shorter, +=400% for longer
  scrub: 1,       // Lower = more responsive (0.5), Higher = smoother (2)
})
```

### 2. Camera Movement Speed

**Adjust camera smoothness:**
```javascript
// In ExperienceCameraRig.tsx, line ~132
const lerpFactor = 0.1  // Lower = smoother (0.05), Higher = snappier (0.2)
```

### 3. Model Animation Speed

**Change animation durations:**
```javascript
// In ExperienceScene.tsx
timeline.to(groupARef.current.rotation, {
  y: 0.8,
  duration: 0.15  // Increase for slower animations
}, 0.1)  // Start position (0-1 of timeline)
```

## Detailed Customization

### Camera Path Customization

The camera movement is divided into sections. Each section corresponds to a scroll percentage:

```javascript
// ExperienceCameraRig.tsx - Modify camera positions

if (progress <= 0.25) {
  // 10-25%: Move slightly closer
  const t = easeInOutCubic((progress - 0.1) / 0.15)
  targetX = 0 * (1 - t) + 0.2 * t      // End X position
  targetY = 0.45 * (1 - t) + 0.55 * t  // End Y position  
  targetZ = 2.0 * (1 - t) + 1.7 * t    // End Z position
}
```

**Camera Position Guide:**
- **X**: Left (-) / Right (+)
- **Y**: Down (-) / Up (+)
- **Z**: Closer (lower) / Further (higher)

### Model Animation Customization

#### Changing Model Positions

```javascript
// ExperienceScene.tsx - Adjust model movements

// Example: Make GroupA move more dramatically
timeline.to(groupARef.current.position, {
  x: -1.0,  // Further left (was -0.8)
  y: 0.5,   // Higher (was 0.2)
  z: 0.3,   // Forward (was 0)
  duration: 0.15
}, 0.4)  // Starts at 40% scroll
```

#### Changing Model Rotations

```javascript
// Add more dramatic rotations
timeline.to(groupARef.current.rotation, {
  x: 0.3,           // Tilt forward/back
  y: Math.PI * 2,   // Full 360° rotation
  z: 0.1,           // Tilt left/right
  duration: 0.2
}, 0.55)
```

#### Changing Model Scale

```javascript
// Make models grow/shrink more
timeline.to(groupARef.current.scale, {
  x: 1.5,  // 150% size
  y: 1.5,
  z: 1.5,
  duration: 0.1
}, 0.25)
```

### UI Element Timing

#### Hero Copy Fade Timing

```javascript
// ExperienceCameraRig.tsx - Control when hero fades

// Control heroCopy opacity based on scroll
if (progress < 0.1) {  // Visible until 10%
  gsap.set('#heroCopy', { opacity: 1 })
} else if (progress < 0.25) {  // Fade from 10-25%
  const fadeProgress = (progress - 0.1) / 0.15
  gsap.set('#heroCopy', { opacity: 1 - fadeProgress })
}
```

#### Side Panel Appearance

```javascript
// Control sidePanel visibility
if (progress > 0.3 && progress < 0.75) {  // Visible 30-75%
  const panelProgress = (progress - 0.3) / 0.45
  gsap.set('#sidePanel', { 
    opacity: Math.min(1, panelProgress * 2),
    x: -20 + (20 * Math.min(1, panelProgress * 2))
  })
}
```

### Adding New Animations

#### Add a New Model Group

```javascript
// 1. Create a ref in ExperienceScene.tsx
const groupCRef = useRef<THREE.Group>(null!)

// 2. Set initial position
if (groupCRef.current) {
  groupCRef.current.position.set(0, -1, 0)
}

// 3. Add to timeline
timeline.fromTo(groupCRef.current.position,
  { x: 0, y: -1, z: 0 },
  { x: 0, y: 0.5, z: 0, duration: 0.2 },
  0.6  // Start at 60% scroll
)

// 4. Add to JSX
<group ref={groupCRef}>
  <mesh>
    <boxGeometry args={[1, 1, 1]} />
    <meshStandardMaterial color="#ff0000" />
  </mesh>
</group>
```

#### Add a Color Change Animation

```javascript
// Animate material color
const material = groupARef.current.children[0].material

timeline.to(material.color, {
  r: 1,  // Red channel (0-1)
  g: 0,  // Green channel
  b: 0,  // Blue channel
  duration: 0.1
}, 0.5)
```

### Scroll Percentage Reference

| Scroll % | What Happens | Code Location |
|----------|-------------|---------------|
| 0-10% | Initial state | Camera stays still |
| 10-25% | Hero fades, camera approaches | `progress <= 0.25` |
| 25-40% | Scanning sequence | `progress <= 0.4` |
| 40-55% | GroupB enters | `progress <= 0.55` |
| 55-70% | Dance sequence | `progress <= 0.7` |
| 70-85% | Overview position | `progress <= 0.85` |
| 85-100% | Final state | `else` block |

### Performance Tips

1. **Reduce Animation Complexity**
   ```javascript
   // Use fewer timeline animations
   // Combine position and rotation in one .to() call
   timeline.to(groupARef.current, {
     'position.x': -0.8,
     'rotation.y': 1.2,
     duration: 0.2
   }, 0.5)
   ```

2. **Optimize Lerp Factor**
   ```javascript
   // For lower-end devices
   const lerpFactor = 0.15  // Less smooth but more performant
   ```

3. **Reduce Particle Count**
   ```javascript
   // In BgBits component
   <BgBits count={15} />  // Reduce from 25
   ```

### Common Patterns

#### Bounce Effect
```javascript
timeline.to(groupARef.current.position, {
  y: 0.5,
  duration: 0.1,
  ease: "bounce.out"
}, 0.3)
```

#### Spin Animation
```javascript
timeline.to(groupBRef.current.rotation, {
  y: "+=6.28",  // One full rotation
  duration: 0.3,
  ease: "none"  // Linear rotation
}, 0.4)
```

#### Pulse Effect
```javascript
// Scale up and down
timeline.to(groupARef.current.scale, {
  x: 1.2, y: 1.2, z: 1.2,
  duration: 0.05,
  yoyo: true,
  repeat: 2
}, 0.5)
```

### Testing Your Changes

1. **Use scroll markers for debugging:**
   ```javascript
   ScrollTrigger.create({
     markers: true,  // Shows start/end markers
     // ... rest of config
   })
   ```

2. **Log progress values:**
   ```javascript
   onUpdate: (self) => {
     console.log('Scroll progress:', self.progress)
     // ... rest of code
   }
   ```

3. **Slow down animations for testing:**
   ```javascript
   gsap.globalTimeline.timeScale(0.5)  // Half speed
   ```

## Quick Reference: Animation Properties

| Property | What it does | Example Values |
|----------|-------------|----------------|
| x, y, z | Position in 3D space | -2 to 2 |
| rotation.x/y/z | Rotation around axis | 0 to Math.PI*2 |
| scale | Size multiplier | 0.5 to 2 |
| opacity | Transparency | 0 to 1 |
| duration | Animation length | 0.1 to 1 |

## Troubleshooting

**Animation not playing?**
- Check timeline position (0-1 range)
- Verify ScrollTrigger is created
- Ensure refs are properly attached

**Jerky animations?**
- Adjust lerp factor
- Use easing functions
- Reduce scrub value

**Performance issues?**
- Reduce particle count
- Simplify animations
- Use will-change CSS property