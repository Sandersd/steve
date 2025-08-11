'use client'

import { useEffect, useState } from 'react'

export default function ExperienceHeader() {
  const [isPinned, setIsPinned] = useState(true)

  useEffect(() => {
    // Listen for scroll events to determine when to unpin header
    const handleScroll = () => {
      const scrollPercent = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)
      
      // Header stays pinned until 85% scroll progress
      if (scrollPercent >= 0.85) {
        setIsPinned(false)
      } else {
        setIsPinned(true)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header className={`${isPinned ? 'fixed' : 'relative'} top-0 left-0 right-0 z-50 transition-all duration-300`}>
      <nav className="bg-black/80 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">NI</span>
              </div>
              <span className="text-xl font-bold text-white">Neural Interface</span>
            </div>

            {/* Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#" className="text-gray-300 hover:text-cyan-400 transition-colors text-sm font-medium">
                Technology
              </a>
              <a href="#" className="text-gray-300 hover:text-cyan-400 transition-colors text-sm font-medium">
                Security
              </a>
              <a href="#" className="text-gray-300 hover:text-cyan-400 transition-colors text-sm font-medium">
                Enterprise
              </a>
              <a href="#" className="text-gray-300 hover:text-cyan-400 transition-colors text-sm font-medium">
                Docs
              </a>
            </div>

            {/* CTA */}
            <div className="flex items-center space-x-4">
              <button className="text-gray-300 hover:text-white transition-colors text-sm font-medium">
                Login
              </button>
              <button className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:from-cyan-400 hover:to-blue-500 transition-all text-sm font-medium">
                Get Started
              </button>
            </div>

            {/* Mobile menu button */}
            <button className="md:hidden text-white">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </nav>
    </header>
  )
}