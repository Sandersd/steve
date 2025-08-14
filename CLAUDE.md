# CLAUDE.md - Steve Site Project Documentation

## Project Overview
This is a Next.js 15.4.6 + React 19.1.0 project featuring an interactive 3D dancing fish (Steve) with audio-reactive animations, scroll-based choreography, and an admin panel for real-time adjustments.

## Tech Stack
- **Framework**: Next.js 15.4.6 with React 19.1.0
- **3D Graphics**: Three.js with react-three-fiber
- **Animations**: GSAP with ScrollTrigger for scroll-based choreography
- **Audio**: Web Audio API with real-time frequency analysis
- **Styling**: Tailwind CSS with custom CSS variables
- **TypeScript**: Fully typed components and interfaces

## Key Features
1. **3D Dancing Steve**: GLB model with multiple animations that sync to music beats
2. **Audio-Reactive Particles**: Real-time visualization responding to audio frequency data
3. **Scroll Choreography**: Complex GSAP timeline with multiple model movements
4. **Admin Panel**: Real-time 3D model adjustment interface (development only)
5. **Performance Optimized**: Memoized components, throttled updates, optimized rendering

## Architecture

### Core Components

#### `/src/app/page.tsx`
- Main entry point and state management
- Controls experience start/stop and audio playback
- Manages admin panel visibility via `NEXT_PUBLIC_ENABLE_ADMIN` env var
- Handles responsive performance settings

#### `/src/components/three/SteveExperienceCanvas.tsx`
- Main Three.js Canvas wrapper
- WebGL optimization and tone mapping setup
- Memoized to prevent unnecessary re-renders

#### `/src/components/three/SteveExperienceCameraRig.tsx`
- Complex scroll-based camera and model choreography
- GSAP ScrollTrigger integration
- Mouse parallax effects
- **Key scroll sections**:
  - 0-10%: Initial Steve reveal
  - 10-30%: Steve dance with scaling
  - 30-45%: Arms animation from sides
  - 45-65%: Legs animation from top
  - 65%+: Giant Steve with "PA-LA-LA" text

#### `/src/components/three/SteveExperienceScene.tsx`
- Scene setup with lighting and environment
- Model positioning and material application
- Audio data propagation to models

#### `/src/components/three/models/`
- **Steve.tsx**: Main dancing Steve with beat-synced animation cycling
- **SteveArms.tsx**: Arm models for scroll choreography
- **SteveLegs.tsx**: Leg models for scroll choreography  
- **Steve3.tsx**: Giant Steve for final section

#### `/src/components/admin/ModelAdminPanel.tsx`
- Real-time 3D model adjustment interface
- Tabbed interface for different model groups
- Cross-tab synchronization via BroadcastChannel
- localStorage persistence
- Optimized slider controls with drag state management

## Audio System

### Audio Analysis (`/src/hooks/useAudioAnalyzer.ts`)
- Real-time FFT analysis of audio
- Beat detection algorithm
- Frequency band separation (bass, mid, treble)
- Performance optimized with throttling

### Audio Integration
- Models receive audio data props
- Beat detection triggers animation changes
- Particle systems react to frequency data
- Volume-based scaling and effects

## Performance Optimizations

### Component Optimization
- React.memo on expensive 3D components
- Memoized settings objects to prevent re-renders
- Throttled admin panel updates (50ms for 3D, 16ms for UI)
- Debounced localStorage saves

### Rendering Optimization
- WebGL settings optimization in Canvas setup
- Shadow map configuration
- Tone mapping for better visuals
- Efficient particle system updates

### Memory Management
- Proper cleanup of timeouts and event listeners
- Three.js object disposal patterns
- Audio context management

## GLB Model Files
Located in `/public/models/`:
- `good-steve-dance.glb` - Main dancing Steve with 7 animations
- `good-steve.glb` - Giant Steve for final section
- `good-steve-arms.glb` - Arm models
- `good-steve-legs.glb` - Leg models

### Model Requirements
- Models should be optimized for web (< 5MB each)
- Animations baked into GLB files
- Materials should support metalness/roughness workflow
- Proper model scaling and pivot points

## Development Workflow

### Adding New Models
1. Place GLB files in `/public/models/`
2. Update model loading in appropriate component
3. Adjust position/scale/rotation in admin panel (dev mode)
4. Copy final settings to default values in code
5. Test across different devices and browsers

### Modifying Animations
1. Enable admin panel: `NEXT_PUBLIC_ENABLE_ADMIN=true`
2. Use real-time sliders to adjust model properties
3. Copy JSON settings from admin panel when satisfied
4. Update default settings in component files
5. Test scroll choreography after changes

### Performance Testing
- Use browser dev tools Performance tab
- Monitor console for excessive re-renders
- Check for memory leaks during long sessions
- Test on mobile devices (especially Safari iOS)

## Admin Panel System

### Environment Control
The admin panel is controlled by `NEXT_PUBLIC_ENABLE_ADMIN` environment variable:
- `true`: Admin panel available in development
- `false` or unset: Admin panel completely disabled (production)

### Admin Panel Features
- **Tabbed Interface**: Separate tabs for each model group
- **Real-time Updates**: Changes applied immediately to 3D scene
- **Cross-tab Sync**: Settings synchronized across browser tabs
- **Persistence**: Settings saved to localStorage
- **Export/Import**: Copy settings as JSON or import from file
- **Reset Functions**: Reset individual sections or all settings

### Settings Structure
```typescript
interface AllSettings {
  steve: SteveSettings      // Main dancing Steve
  steve3: SteveSettings     // Giant Steve
  arms: ArmsSettings        // Arm models
  legs: LegsSettings        // Leg models
  camera: CameraSettings    // Camera positioning
}
```

### Using Admin Panel
1. Set `NEXT_PUBLIC_ENABLE_ADMIN=true` in `.env.local`
2. Start experience and click "Admin" button (top-right)
3. Use sliders to adjust model properties in real-time
4. Copy JSON settings when satisfied with adjustments
5. Update default settings in component code
6. Set `NEXT_PUBLIC_ENABLE_ADMIN=false` for production

## Scroll Choreography System

### GSAP ScrollTrigger Setup
The choreography is percentage-based with smooth transitions:

```javascript
// Example choreography section
if (progress >= 0.1 && progress < 0.3) {
  // 10-30%: Steve dance scaling
  const t = easeInOutCubic((progress - 0.1) / 0.2)
  steveScale = 0.4 + (0.7 * t) // Scale from 0.4 to 1.1
  steveRotY = t * Math.PI * 0.5 // Gentle Y rotation
}
```

### Key Principles
- **Continuity**: Each section starts where previous ended
- **Easing**: Use easeInOutCubic for smooth transitions
- **Performance**: Throttled updates via useFrame
- **Predictability**: Percentage-based triggers for consistency

### Modifying Choreography
1. Identify target scroll percentage range
2. Use admin panel to find desired end positions
3. Add new choreography section with proper continuity
4. Test scroll behavior thoroughly
5. Ensure smooth transitions between sections

## Common Issues & Solutions

### Camera Jarring
- **Problem**: Sudden jumps during scroll transitions
- **Solution**: Ensure Y position continuity between scroll sections
- **Location**: `SteveExperienceCameraRig.tsx` camera position logic

### Model Visibility Issues
- **Problem**: Models not appearing or positioned incorrectly
- **Solution**: Use admin panel to adjust position/scale values
- **Check**: Model file paths, scaling factors, and Z-depth ordering

### Performance Problems
- **Problem**: Laggy scroll or poor frame rates
- **Solution**: Remove console.log statements, optimize re-renders
- **Monitor**: Browser performance tools, component re-render counts

### Audio Sync Issues
- **Problem**: Models not responding to audio
- **Solution**: Check audio context permissions, audio file loading
- **Debug**: Audio analyzer hook, beat detection thresholds

### Slider Issues (Admin Panel)
- **Problem**: Sliders not dragging or values snapping back
- **Solution**: Already fixed with drag state management
- **Avoid**: Creating new controlled input patterns without proper state handling

## File Structure
```
src/
├── app/
│   ├── page.tsx                 # Main application entry
│   └── globals.css              # Global styles and CSS variables
├── components/
│   ├── admin/
│   │   └── ModelAdminPanel.tsx  # Real-time 3D adjustment interface
│   ├── three/
│   │   ├── models/              # 3D model components
│   │   ├── shaders/             # Custom materials and shaders
│   │   ├── SteveExperienceCanvas.tsx
│   │   ├── SteveExperienceCameraRig.tsx
│   │   └── SteveExperienceScene.tsx
│   └── ui/
│       ├── AudioPlayer.tsx      # Audio controls and credit
│       └── ExperienceLoader.tsx # Loading screen
├── hooks/
│   ├── useAudioAnalyzer.ts      # Real-time audio analysis
│   ├── useModelLoader.ts        # GLB model loading
│   └── useThreePerformance.ts   # Responsive performance settings
└── types/
    └── three.ts                 # TypeScript interfaces
```

## Environment Variables

### Admin Panel Control
The project uses `NEXT_PUBLIC_ENABLE_ADMIN` to control admin panel availability:

### Development
```bash
# .env.local
NEXT_PUBLIC_ENABLE_ADMIN=true
```

### Production
```bash
# .env.production or deployment settings
NEXT_PUBLIC_ENABLE_ADMIN=false
# or simply omit the variable entirely
```

### Bundle Optimization
When `NEXT_PUBLIC_ENABLE_ADMIN=false`:
- Admin panel components are not bundled in production
- No admin-related JavaScript is included
- Admin panel state management is disabled
- Admin toggle button is hidden
- No admin settings are passed to 3D components

## Deployment Checklist

### Pre-deployment
- [ ] Set `NEXT_PUBLIC_ENABLE_ADMIN=false` or remove entirely
- [ ] Verify all console.log statements removed
- [ ] Test performance on target devices
- [ ] Check model file sizes and loading times
- [ ] Verify audio file optimization

### Build Process
- [ ] Run `npm run build` successfully
- [ ] Check bundle size analysis
- [ ] Test production build locally
- [ ] Verify admin panel completely disabled

### Post-deployment
- [ ] Test scroll choreography on live site
- [ ] Verify audio playback across browsers
- [ ] Check mobile device compatibility
- [ ] Monitor performance metrics
- [ ] **Verify admin panel is completely disabled** (no admin button visible)
- [ ] Check bundle size - admin components should be excluded

## Music Credits
Music by @tomomp3 - https://www.instagram.com/tomomp3

## Development Commands
```bash
# Development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Type checking
npm run typecheck

# Linting (if configured)
npm run lint
```

## Browser Compatibility
- **Chrome/Edge**: Full support
- **Firefox**: Full support
- **Safari**: Full support (iOS Safari tested)
- **Mobile**: Optimized for touch devices

## Performance Targets
- **60 FPS**: Smooth scroll and animations
- **< 3s Load**: Initial model loading
- **< 100MB**: Total memory usage
- **Mobile**: Responsive design and performance

---

## Recent Major Updates

### Admin Panel Redesign & Fixes (Latest)
- **Fixed Slider Issues**: Resolved React conditional rendering problem that prevented sliders from working
- **Solution**: Replaced `{activeTab === 'tab' && <Component />}` with `style={{ display: condition ? 'block' : 'none' }}`
- **Working Admin Panel**: All sliders now respond to dragging with real-time 3D model updates
- **Complete Model Controls**: Position, rotation, and scale controls for all models (Main Steve, Giant Steve, Arms, Legs)
- **Enhanced Copy Feature**: Properly formatted JSON export with labeled sections
- **Removed Debug Components**: Cleaned up MinimalAdminPanel and TestSlider test components

### Particle System Enhancements
- **Organic Animation When Paused**: Particles now blend between orange theme colors with fractal-based brightness
- **Audio-Reactive vs Ambient**: Dynamic shader that switches between music visualization and organic animation
- **Improved Brightness Balance**: Toned down when music plays, beautiful ambient glow when paused

### Scroll Choreography Improvements  
- **Arms Animation Fix**: Arms now come up halfway, pause, then go down (improved timing)
- **Smart Scroll Indicator**: Animated scroll guide that stays visible until Giant Steve appears (85% scroll)
- **Updated Model Positions**: Final positioning for arms and legs based on user feedback

### Animation Enhancements
- **Model Wiggle Animations**: Added organic wiggle animations to arms and legs using useFrame
- **Giant Steve Bobble**: Gentle bobbing animation with breathing-like scale effect
- **Different Phases**: Arms and legs wiggle at different frequencies for natural movement

**Last Updated**: Based on complete admin panel functionality, particle system enhancements, and scroll choreography improvements
**Next Steps**: When adding new features, always test with admin panel first, then disable for production