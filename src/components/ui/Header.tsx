'use client'

import { useState } from 'react'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200/50">
      <nav className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-slate-800 to-slate-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">3D</span>
            </div>
            <span className="text-xl font-bold text-slate-800">Studio</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-slate-600 hover:text-slate-800 transition-colors">
              Features
            </a>
            <a href="#showcase" className="text-slate-600 hover:text-slate-800 transition-colors">
              Showcase
            </a>
            <a href="#getting-started" className="text-slate-600 hover:text-slate-800 transition-colors">
              Getting Started
            </a>
            <a href="#about" className="text-slate-600 hover:text-slate-800 transition-colors">
              About
            </a>
          </div>

          {/* CTA Button */}
          <div className="hidden md:flex items-center space-x-4">
            <button className="px-4 py-2 text-slate-600 hover:text-slate-800 transition-colors">
              Sign In
            </button>
            <button className="px-6 py-2 bg-gradient-to-r from-slate-800 to-slate-600 text-white rounded-lg hover:from-slate-700 hover:to-slate-500 transition-all transform hover:scale-105">
              Get Started
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-slate-600 hover:text-slate-800"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 py-4 border-t border-slate-200">
            <div className="flex flex-col space-y-4">
              <a href="#features" className="text-slate-600 hover:text-slate-800 transition-colors">
                Features
              </a>
              <a href="#showcase" className="text-slate-600 hover:text-slate-800 transition-colors">
                Showcase
              </a>
              <a href="#getting-started" className="text-slate-600 hover:text-slate-800 transition-colors">
                Getting Started
              </a>
              <a href="#about" className="text-slate-600 hover:text-slate-800 transition-colors">
                About
              </a>
              <div className="pt-4 border-t border-slate-200">
                <button className="w-full mb-3 px-4 py-2 text-slate-600 hover:text-slate-800 transition-colors border border-slate-300 rounded-lg">
                  Sign In
                </button>
                <button className="w-full px-6 py-2 bg-gradient-to-r from-slate-800 to-slate-600 text-white rounded-lg hover:from-slate-700 hover:to-slate-500 transition-all">
                  Get Started
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}