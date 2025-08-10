'use client'

import { Suspense } from 'react'
import ThreeCanvas from '@/components/three/Canvas'
import Header from '@/components/ui/Header'
import ScrollAnimated from '@/components/ui/ScrollAnimated'
import { useResponsiveThree } from '@/hooks/useThreePerformance'

export default function Home() {
  const { deviceTier, settings } = useResponsiveThree()

  return (
    <>
      <Header />
      
      {/* Three.js Canvas - Fixed background for entire page */}
      <div className="canvas-container">
        <Suspense 
          fallback={
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-slate-100">
              <div className="flex flex-col items-center space-y-4">
                <div className="w-8 h-8 border-4 border-slate-300 border-t-slate-600 rounded-full animate-spin"></div>
                <div className="text-slate-500 text-sm">Loading 3D scene...</div>
              </div>
            </div>
          }
        >
          <ThreeCanvas
            performance={{
              enableShadows: settings.shadows,
              antialias: settings.antialias,
              pixelRatio: settings.pixelRatio,
              shadowMapSize: settings.shadowMapSize
            }}
            enableScrollAnimation={true}
            scrollTrigger="body"
          />
        </Suspense>
      </div>

      <main className="relative z-10">
        {/* Hero Section - Scroll trigger target */}
        <section id="hero" className="min-h-screen">
          <div className="relative min-h-screen flex items-center justify-center pt-16">
            <ScrollAnimated className="text-center z-10 relative px-6" threshold={0.2} rootMargin="0px">
              <div className="inline-flex items-center px-4 py-2 bg-white/80 backdrop-blur-sm border border-slate-200 rounded-full text-sm text-slate-600 mb-8">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                Now with mouse parallax
              </div>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-6 leading-tight">
                3D Studio
              </h1>
              <p className="text-lg md:text-xl text-slate-600 mb-8 max-w-3xl mx-auto leading-relaxed">
                Professional Three.js development platform with custom GLSL shaders, 
                GSAP scroll animations, and optimized performance for stunning web experiences.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                <button className="px-8 py-4 bg-gradient-to-r from-slate-800 to-slate-600 text-white rounded-lg hover:from-slate-700 hover:to-slate-500 transition-all transform hover:scale-105 font-semibold shadow-lg">
                  Start Building
                </button>
                <button className="px-8 py-4 bg-white/80 backdrop-blur-sm text-slate-700 rounded-lg hover:bg-white/90 transition-all border border-slate-200 font-semibold">
                  View Showcase
                </button>
              </div>
              <div className="flex items-center justify-center space-x-8 text-sm text-slate-500">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-slate-400 rounded-full mr-2"></div>
                  Device: <span className="font-mono font-medium capitalize ml-1">{deviceTier}</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-slate-400 rounded-full mr-2"></div>
                  WebGL Ready
                </div>
              </div>
            </ScrollAnimated>
          </div>
        </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white/95 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6">
          <ScrollAnimated className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-slate-800 mb-6">
              Everything you need to build stunning 3D experiences
            </h2>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto">
              Our comprehensive Three.js platform provides all the tools and optimizations 
              needed for professional web development.
            </p>
          </ScrollAnimated>
          
          <div className="grid lg:grid-cols-3 gap-8 mb-16">
            <ScrollAnimated className="group p-8 bg-gradient-to-br from-slate-50 to-white border border-slate-200 rounded-2xl hover:shadow-lg transition-all hover:border-slate-300" delay={100}>
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-4">
                Custom GLSL Shaders
              </h3>
              <p className="text-slate-600 leading-relaxed">
                Pearlescent materials with Fresnel effects, procedural noise, and dynamic color gradients 
                for stunning visual effects.
              </p>
            </ScrollAnimated>

            <ScrollAnimated className="group p-8 bg-gradient-to-br from-slate-50 to-white border border-slate-200 rounded-2xl hover:shadow-lg transition-all hover:border-slate-300" delay={200}>
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-4">
                GSAP ScrollTrigger
              </h3>
              <p className="text-slate-600 leading-relaxed">
                Smooth scroll-driven animations with camera movements, object rotations, 
                and seamless parallax effects.
              </p>
            </ScrollAnimated>

            <ScrollAnimated className="group p-8 bg-gradient-to-br from-slate-50 to-white border border-slate-200 rounded-2xl hover:shadow-lg transition-all hover:border-slate-300" delay={300}>
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-4">
                Performance Optimized
              </h3>
              <p className="text-slate-600 leading-relaxed">
                Intelligent device detection, adaptive quality settings, and automatic 
                optimization for smooth 60fps experiences.
              </p>
            </ScrollAnimated>
          </div>

          <ScrollAnimated className="grid lg:grid-cols-3 gap-8" delay={400}>
            <div className="group p-8 bg-gradient-to-br from-slate-50 to-white border border-slate-200 rounded-2xl hover:shadow-lg transition-all hover:border-slate-300">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-4">
                Post-Processing Effects
              </h3>
              <p className="text-slate-600 leading-relaxed">
                Bloom effects, tone mapping, vignette, and advanced color grading 
                for cinematic visual quality.
              </p>
            </div>

            <div className="group p-8 bg-gradient-to-br from-slate-50 to-white border border-slate-200 rounded-2xl hover:shadow-lg transition-all hover:border-slate-300">
              <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-4">
                TypeScript Ready
              </h3>
              <p className="text-slate-600 leading-relaxed">
                Fully typed components, hooks, and utilities with IntelliSense support 
                for professional development workflows.
              </p>
            </div>

            <div className="group p-8 bg-gradient-to-br from-slate-50 to-white border border-slate-200 rounded-2xl hover:shadow-lg transition-all hover:border-slate-300">
              <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14-7H3a2 2 0 00-2 2v12a2 2 0 002 2h16a2 2 0 002-2V6a2 2 0 00-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-4">
                Modular Architecture
              </h3>
              <p className="text-slate-600 leading-relaxed">
                Clean, organized code structure with reusable components 
                ready for scaling to enterprise projects.
              </p>
            </div>
          </ScrollAnimated>
        </div>
      </section>

      {/* Showcase Section */}
      <section id="showcase" className="py-20 bg-slate-50/95 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6">
          <ScrollAnimated className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-slate-800 mb-6">
              See it in action
            </h2>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto">
              Experience the power of our platform through interactive demos and real-world examples.
            </p>
          </ScrollAnimated>

          <ScrollAnimated className="grid lg:grid-cols-2 gap-12 items-center" delay={100}>
            <ScrollAnimated delay={200}>
              <div className="bg-white p-8 rounded-2xl shadow-lg">
                <div className="flex items-center mb-6">
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                </div>
                <div className="bg-slate-900 rounded-lg p-4 font-mono text-sm">
                  <div className="text-green-400">$ npm create 3d-studio@latest</div>
                  <div className="text-slate-400 mt-2">✓ Project scaffolded successfully</div>
                  <div className="text-slate-400">✓ Dependencies installed</div>
                  <div className="text-slate-400">✓ 3D scene configured</div>
                  <div className="text-green-400 mt-2">$ npm run dev</div>
                  <div className="text-slate-400">🚀 Server running at http://localhost:3001</div>
                </div>
              </div>
            </ScrollAnimated>

            <ScrollAnimated className="space-y-8" delay={300}>
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                  1
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-800 mb-2">Quick Setup</h3>
                  <p className="text-slate-600">Get up and running in seconds with our CLI tool. No complex configuration needed.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-semibold">
                  2
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-800 mb-2">Customize Everything</h3>
                  <p className="text-slate-600">Replace models, modify shaders, and adjust animations to match your vision.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                  3
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-800 mb-2">Ship to Production</h3>
                  <p className="text-slate-600">Deploy with confidence using our optimized builds and performance monitoring.</p>
                </div>
              </div>
            </ScrollAnimated>
          </ScrollAnimated>
        </div>
      </section>

      {/* Getting Started Section */}
      <section id="getting-started" className="py-20 bg-white/95 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6">
          <ScrollAnimated className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-slate-800 mb-6">
              Start building today
            </h2>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto">
              Follow our step-by-step guide to create your first 3D experience in minutes.
            </p>
          </ScrollAnimated>

          <ScrollAnimated className="grid lg:grid-cols-3 gap-8" delay={100}>
            <ScrollAnimated className="bg-slate-50 p-8 rounded-2xl" delay={200}>
              <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center mb-6">
                <span className="text-white font-bold text-lg">1</span>
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-4">Replace the Model</h3>
              <p className="text-slate-600 mb-4">Add your GLB model to the public/models/ directory</p>
              <div className="bg-slate-900 rounded-lg p-4 font-mono text-sm overflow-x-auto">
                <div className="text-slate-300">{`import { useGLTF } from '@react-three/drei'

function YourModel() {
  const { scene } = useGLTF('/models/your-model.glb')
  return <primitive object={scene} />
}`}</div>
              </div>
            </ScrollAnimated>

            <ScrollAnimated className="bg-slate-50 p-8 rounded-2xl" delay={300}>
              <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center mb-6">
                <span className="text-white font-bold text-lg">2</span>
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-4">Customize Shaders</h3>
              <p className="text-slate-600 mb-4">Modify colors and properties in PearlescentMaterial</p>
              <div className="bg-slate-900 rounded-lg p-4 font-mono text-sm overflow-x-auto">
                <div className="text-slate-300">{`const material = new PearlescentMaterial({
  colorPrimary: new THREE.Color('#ff6b6b'),
  colorSecondary: new THREE.Color('#4ecdc4'),
  fresnelPower: 2.5
})`}</div>
              </div>
            </ScrollAnimated>

            <ScrollAnimated className="bg-slate-50 p-8 rounded-2xl" delay={400}>
              <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center mb-6">
                <span className="text-white font-bold text-lg">3</span>
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-4">Configure Animations</h3>
              <p className="text-slate-600 mb-4">Adjust scroll triggers and camera movements</p>
              <div className="bg-slate-900 rounded-lg p-4 font-mono text-sm overflow-x-auto">
                <div className="text-slate-300">{`<CameraRig
  cameraEnd={{ position: [1, 0, 2] }}
  groupRotationEnd={[0, Math.PI, 0]}
  enableMouseParallax={true}
/>`}</div>
              </div>
            </ScrollAnimated>
          </ScrollAnimated>

          <ScrollAnimated className="text-center mt-12" delay={500}>
            <button className="px-8 py-4 bg-gradient-to-r from-slate-800 to-slate-600 text-white rounded-lg hover:from-slate-700 hover:to-slate-500 transition-all transform hover:scale-105 font-semibold shadow-lg">
              Get Started Now
            </button>
          </ScrollAnimated>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-slate-900/95 backdrop-blur-md text-white">
        <div className="max-w-7xl mx-auto px-6">
          <ScrollAnimated className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Built for creators, by creators
            </h2>
            <p className="text-lg text-slate-400 max-w-3xl mx-auto">
              We&apos;re passionate about pushing the boundaries of web technology and making 
              3D experiences accessible to everyone.
            </p>
          </ScrollAnimated>

          <ScrollAnimated className="grid lg:grid-cols-2 gap-16 items-center" delay={100}>
            <ScrollAnimated delay={200}>
              <div className="bg-slate-800 p-8 rounded-2xl">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mr-4">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">Performance First</h3>
                    <p className="text-slate-400">60fps on any device</p>
                  </div>
                </div>
                <p className="text-slate-300">
                  Our optimizations ensure smooth experiences across desktop, mobile, and tablet devices.
                </p>
              </div>
            </ScrollAnimated>

            <ScrollAnimated className="space-y-6" delay={300}>
              <div className="flex items-start space-x-4">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div>
                  <h4 className="font-semibold text-white mb-2">Open Source</h4>
                  <p className="text-slate-400">Built on open-source technologies with full transparency.</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <div>
                  <h4 className="font-semibold text-white mb-2">Production Ready</h4>
                  <p className="text-slate-400">Used by thousands of developers worldwide in production apps.</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                <div>
                  <h4 className="font-semibold text-white mb-2">Community Driven</h4>
                  <p className="text-slate-400">Active community contributing features, fixes, and examples.</p>
                </div>
              </div>
            </ScrollAnimated>
          </ScrollAnimated>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black/95 backdrop-blur-md text-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <ScrollAnimated className="text-center mb-12">
            <h3 className="text-3xl font-bold mb-4">Ready to create something amazing?</h3>
            <p className="text-slate-400 mb-8 text-lg">
              Join thousands of developers building the future of web experiences.
            </p>
            <button className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-500 hover:to-purple-500 transition-all transform hover:scale-105 font-semibold shadow-lg">
              Start Your Project
            </button>
          </ScrollAnimated>

          <ScrollAnimated className="grid md:grid-cols-4 gap-8 mb-12" delay={100}>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <div className="space-y-2 text-slate-400">
                <a href="#" className="block hover:text-white transition-colors">Features</a>
                <a href="#" className="block hover:text-white transition-colors">Pricing</a>
                <a href="#" className="block hover:text-white transition-colors">Documentation</a>
                <a href="#" className="block hover:text-white transition-colors">API Reference</a>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <div className="space-y-2 text-slate-400">
                <a href="#" className="block hover:text-white transition-colors">Examples</a>
                <a href="#" className="block hover:text-white transition-colors">Tutorials</a>
                <a href="#" className="block hover:text-white transition-colors">Blog</a>
                <a href="#" className="block hover:text-white transition-colors">Newsletter</a>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Community</h4>
              <div className="space-y-2 text-slate-400">
                <a href="#" className="block hover:text-white transition-colors">Discord</a>
                <a href="#" className="block hover:text-white transition-colors">GitHub</a>
                <a href="#" className="block hover:text-white transition-colors">Twitter</a>
                <a href="#" className="block hover:text-white transition-colors">Reddit</a>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <div className="space-y-2 text-slate-400">
                <a href="#" className="block hover:text-white transition-colors">About</a>
                <a href="#" className="block hover:text-white transition-colors">Careers</a>
                <a href="#" className="block hover:text-white transition-colors">Contact</a>
                <a href="#" className="block hover:text-white transition-colors">Privacy</a>
              </div>
            </div>
          </ScrollAnimated>

          <ScrollAnimated className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-slate-800" delay={200}>
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-br from-slate-600 to-slate-400 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">3D</span>
              </div>
              <span className="text-xl font-bold">Studio</span>
            </div>
            
            <div className="flex items-center space-x-8">
              <div className="flex space-x-4 text-sm">
                <span className="bg-slate-800 px-3 py-1 rounded">Next.js 15</span>
                <span className="bg-slate-800 px-3 py-1 rounded">React Three Fiber</span>
                <span className="bg-slate-800 px-3 py-1 rounded">GSAP</span>
                <span className="bg-slate-800 px-3 py-1 rounded">TypeScript</span>
              </div>
            </div>
          </ScrollAnimated>

          <ScrollAnimated className="text-center text-slate-500 text-sm mt-8" delay={300}>
            © 2024 3D Studio. Built with love for the web development community.
          </ScrollAnimated>
        </div>
      </footer>
    </main>
    </>
  )
}