# Music Visualization Features

## Overview

The application now includes advanced real-time audio analysis and music-reactive 3D visualizations, featuring animated particle systems that respond to music in real-time.

## Features

### 🎵 Real-Time Audio Analysis
- **Web Audio API Integration**: Uses AudioContext with AnalyserNode for frequency analysis
- **FFT Size**: 512 for high-resolution frequency data
- **Responsive Beat Detection**: Dynamic threshold algorithm with 0.08 sensitivity
- **Frequency Band Analysis**: 
  - Bass (0-15%): Amplified by 2.5x for enhanced response
  - Mid (15-60%): Amplified by 2.0x 
  - Treble (60-100%): Amplified by 2.5x for crisp high-end response

### ✨ Music-Reactive Particle System
- **60 Individual Particles**: Each with its own music-reactive shader material
- **Orange Color Palette**: 
  - Base: Bright orange (#ff8c42)
  - Bass: Deep orange (#ff6b35)
  - Mid: Medium orange (#ffa726)
  - Treble: Light orange (#ffcc80)
  - Beat Flash: Very light orange (#fff3e0)

### 🎨 Steve Model Enhancement
- **Pearlescent Shader**: Maintains original green → sky blue → pink gradient
- **Asynchronous Material Loading**: Non-blocking initialization for fast load times
- **Progressive Enhancement**: Fallback material until pearlescent shader loads

## Technical Implementation

### Audio Analysis (`useAudioAnalyzer`)
```typescript
const { audioData, isPlaying } = useAudioAnalyzer({ 
  audioElement,
  fftSize: 512,
  beatThreshold: 0.08 // Highly sensitive
})
```

#### Performance Optimizations
- **Reduced Smoothing**: 0.8 → 0.3 for responsive frequency changes
- **Faster Beat Detection**: 200ms → 100ms minimum interval between beats
- **Shorter Energy History**: 43 frames → 20 frames (1 second → 0.33 seconds)

### Music-Reactive Materials (`MusicReactiveMaterial`)
Custom GLSL shader that responds to audio frequencies:

#### Vertex Shader Features
- **Beat-based scaling**: Subtle 0.1x expansion on beats (reduced from 0.3x)
- **Volume displacement**: Minimal 0.02x Y-axis movement (reduced from 0.1x)
- **Bass pulsing**: 0.03x normal displacement (reduced from 0.15x)

#### Fragment Shader Features
- **Frequency color mixing**: Dynamic blending based on bass/mid/treble
- **Enhanced glow**: 0.6x emissive multiplier with audio-reactive intensity
- **Rim lighting**: Fresnel-based edge glow with 1.3x brightness
- **Minimum glow**: 0.3 base brightness for constant visibility
- **Beat sparkles**: Dynamic sparkle effects on strong beats

### Pause/Play Behavior
- **Instant Stop**: When paused, particles freeze immediately (no smooth transitions)
- **Time Freeze**: Shader time animation stops on pause
- **Audio-Only Animation**: Particles only animate when `isPlaying === true AND volume > 0.01`

### Spatial Distribution
- **Wide Spread**: 8-unit horizontal distribution
- **Vertical Range**: 5-unit height coverage  
- **Depth Coverage**: 4-unit depth for immersive 3D space
- **Controlled Movement**: Reduced explosion distance for contained animations

## Performance Considerations

### Memory Management
- **Material Reuse**: Each particle has persistent material (no recreation)
- **Async Initialization**: PearlescentMaterial loads without blocking render
- **Optimized Uniforms**: Direct uniform updates without object recreation

### Frame Rate Optimization
- **Selective Updates**: Only update materials when audio is playing
- **Throttled Logging**: Debug logs throttled to 0.1% frequency
- **Minimal Displacement**: Reduced shader calculations for better GPU performance

## Usage

### Basic Setup
```jsx
import { useAudioAnalyzer } from '@/hooks/useAudioAnalyzer'

const { audioData, isPlaying } = useAudioAnalyzer({
  audioElement: audioRef.current,
  fftSize: 512,
  beatThreshold: 0.08
})

<FloatingParticles 
  audioData={audioData}
  isAudioPlaying={isPlaying}
  count={60}
  spread={8}
/>
```

### Customization Options
- **Particle Count**: Adjust `count` prop (default: 60)
- **Color Palette**: Modify MusicReactiveMaterial constructor colors
- **Sensitivity**: Adjust `beatThreshold` in useAudioAnalyzer
- **Spatial Distribution**: Modify `spread`, `height`, `depth` props
- **Animation Intensity**: Adjust shader displacement multipliers

## Browser Compatibility
- **Modern Browsers**: Chrome 66+, Firefox 60+, Safari 14+
- **Web Audio API**: Required for audio analysis
- **WebGL 2**: Required for advanced shader features
- **User Interaction**: AudioContext requires user gesture to start

## Troubleshooting

### Audio Not Working
1. Ensure user has clicked "Enter" button (required for AudioContext)
2. Check browser audio permissions
3. Verify audio file format compatibility

### Performance Issues
1. Reduce particle count if frame rate drops
2. Lower FFT size from 512 to 256 for weaker devices
3. Disable particles on mobile if needed

### Visual Issues
1. Check WebGL support in browser
2. Ensure proper shader compilation
3. Verify Three.js compatibility