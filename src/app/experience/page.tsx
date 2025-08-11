'use client'

import { Suspense } from 'react'
import ExperienceCanvas from '@/components/three/ExperienceCanvas'
import ExperienceHeader from '@/components/ui/ExperienceHeader'
import { useResponsiveThree } from '@/hooks/useThreePerformance'

export default function ExperiencePage() {
  const { settings } = useResponsiveThree()

  return (
    <div data-page="experience">
      {/* Fixed Header */}
      <ExperienceHeader />
      
      {/* Main WebGL Experience - Pinned Section */}
      <div className="experience-container">
        <Suspense 
          fallback={
            <div className="absolute inset-0 flex items-center justify-center bg-black">
              <div className="flex flex-col items-center space-y-4">
                <div className="w-8 h-8 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                <div className="text-white/60 text-sm">Loading Experience...</div>
              </div>
            </div>
          }
        >
          <ExperienceCanvas
            performance={{
              enableShadows: settings.shadows,
              antialias: settings.antialias,
              pixelRatio: settings.pixelRatio,
              shadowMapSize: settings.shadowMapSize
            }}
          />
        </Suspense>

        {/* Hero Copy - Fades out early */}
        <div id="heroCopy" className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
          <div className="text-center text-white">
            <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-sm mb-8">
              <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
              scroll_to_start
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Neural Interface
            </h1>
            <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
              Advanced biometric authentication through 3D hand mapping
            </p>
            <button className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:from-cyan-400 hover:to-blue-500 transition-all transform hover:scale-105 font-semibold shadow-2xl pointer-events-auto">
              Begin Verification
            </button>
          </div>
        </div>

        {/* Side Panel - Slides in later */}
        <div id="sidePanel" className="absolute right-8 top-1/2 -translate-y-1/2 w-80 bg-black/80 backdrop-blur-md border border-cyan-500/30 rounded-xl p-6 z-30 opacity-0">
          <div className="flex items-center mb-4">
            <div className="w-3 h-3 bg-cyan-400 rounded-full mr-3 animate-pulse"></div>
            {/* eslint-disable-next-line react/jsx-no-comment-textnodes */}
            <span className="text-cyan-400 font-mono text-sm">// verifying_identity</span>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-white/60 text-sm">Hand Geometry</span>
              <span className="text-cyan-400 text-sm">97.3%</span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-1">
              <div className="bg-gradient-to-r from-cyan-500 to-blue-500 h-1 rounded-full w-[97%]"></div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-white/60 text-sm">Palm Prints</span>
              <span className="text-cyan-400 text-sm">94.8%</span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-1">
              <div className="bg-gradient-to-r from-cyan-500 to-blue-500 h-1 rounded-full w-[95%]"></div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-white/60 text-sm">Vein Pattern</span>
              <span className="text-green-400 text-sm">99.1%</span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-1">
              <div className="bg-gradient-to-r from-green-500 to-emerald-500 h-1 rounded-full w-[99%]"></div>
            </div>
          </div>
          <div className="mt-6 p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
              <span className="text-green-400 text-sm font-medium">Identity Verified</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content Sections - Appear after 3D sequence */}
      <div className="content-sections relative z-10 bg-black">
        {/* First Content Cards */}
        <section className="py-20 px-8">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="content-card bg-gradient-to-br from-gray-900 to-black border border-cyan-500/20 rounded-xl p-8">
                <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center mb-6">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white mb-4">Biometric Security</h3>
                <p className="text-gray-400">Advanced 3D hand scanning for unbreachable authentication</p>
              </div>
              <div className="content-card bg-gradient-to-br from-gray-900 to-black border border-purple-500/20 rounded-xl p-8">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center mb-6">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white mb-4">Neural Processing</h3>
                <p className="text-gray-400">AI-powered pattern recognition in real-time</p>
              </div>
              <div className="content-card bg-gradient-to-br from-gray-900 to-black border border-green-500/20 rounded-xl p-8">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mb-6">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white mb-4">Quantum Encryption</h3>
                <p className="text-gray-400">Unbreakable security protocols for data protection</p>
              </div>
            </div>
          </div>
        </section>

        {/* Callout Section */}
        <section className="py-20 px-8">
          <div className="max-w-4xl mx-auto">
            <div className="callout-card bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/30 rounded-2xl p-12">
              <h2 className="text-4xl font-bold text-white mb-6">
                Next-Generation Authentication
              </h2>
              <p className="text-xl text-gray-300 mb-8">
                Experience the future of secure access with our revolutionary 3D biometric scanning technology.
              </p>
              <button className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:from-cyan-400 hover:to-blue-500 transition-all font-semibold">
                Learn More
              </button>
            </div>
          </div>
        </section>

        {/* Final Section */}
        <section className="py-20 px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-5xl font-bold text-white mb-8">
              Ready to Secure Your Future?
            </h2>
            <p className="text-xl text-gray-400 mb-12">
              Join thousands of organizations already using our advanced biometric solutions.
            </p>
            <div className="space-y-4">
              <button className="w-full max-w-md px-12 py-6 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:from-green-400 hover:to-emerald-500 transition-all font-semibold text-lg">
                Start Free Trial
              </button>
              <p className="text-gray-500 text-sm">No credit card required • 30-day trial</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}