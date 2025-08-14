'use client'

import { useEffect, useState } from 'react'

export default function ScrollIndicator() {
  const [visible, setVisible] = useState(true)
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY || 0
      const viewportHeight = window.innerHeight || 1
      const totalHeight = document.documentElement.scrollHeight - viewportHeight
      
      // Prevent division by zero and NaN
      const progress = totalHeight > 0 ? Math.min(scrolled / totalHeight, 1) : 0
      
      setScrollProgress(isNaN(progress) ? 0 : progress)
      
      // Hide indicator only when giant steve is fully visible (around 85% scroll)
      if (progress > 0.85) {
        setVisible(false)
      } else {
        setVisible(true)
      }
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll() // Check initial state

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  if (!visible) return null

  return (
    <div 
      className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40 pointer-events-none"
      style={{
        // Start fading only after 75% scroll, fully fade by 85%
        opacity: isNaN(scrollProgress) || scrollProgress < 0.75 ? 1 : Math.max(0, 1 - ((scrollProgress - 0.75) * 10)),
        transform: `translateX(-50%)` // Keep centered
      }}
    >
      <div className="flex flex-col items-center gap-2">
        <span 
          className="text-white text-sm font-medium"
          style={{
            fontFamily: 'var(--font-space-grotesk)',
            textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
            letterSpacing: '0.1em'
          }}
        >
          SCROLL
        </span>
        
        {/* Animated chevron arrows */}
        <div className="relative h-8 w-6">
          <svg
            className="absolute inset-0 animate-bounce"
            width="24"
            height="32"
            viewBox="0 0 24 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{
              animation: 'scrollBounce 2s infinite',
            }}
          >
            <path
              d="M12 4L12 28M12 28L5 21M12 28L19 21"
              stroke="#FF9A1F"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{
                filter: 'drop-shadow(0 0 8px rgba(255, 154, 31, 0.5))'
              }}
            />
          </svg>
          
          {/* Second arrow for layered effect */}
          <svg
            className="absolute inset-0"
            width="24"
            height="32"
            viewBox="0 0 24 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{
              animation: 'scrollBounce 2s infinite',
              animationDelay: '0.3s',
              opacity: 0.5
            }}
          >
            <path
              d="M12 4L12 28M12 28L5 21M12 28L19 21"
              stroke="#FFE66D"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        {/* Mouse scroll icon alternative (hidden by default, uncomment to use) */}
        {/* <div 
          className="w-6 h-10 border-2 border-orange-400 rounded-full relative"
          style={{
            borderColor: '#FF9A1F',
            boxShadow: '0 0 10px rgba(255, 154, 31, 0.3)'
          }}
        >
          <div 
            className="absolute left-1/2 -translate-x-1/2 w-1 h-2 bg-orange-400 rounded-full"
            style={{
              top: '8px',
              backgroundColor: '#FF9A1F',
              animation: 'scrollWheel 2s infinite'
            }}
          />
        </div> */}
      </div>

      <style jsx>{`
        @keyframes scrollBounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(8px);
          }
        }

        @keyframes scrollWheel {
          0% {
            top: 8px;
            opacity: 1;
          }
          50% {
            top: 20px;
            opacity: 0.5;
          }
          100% {
            top: 8px;
            opacity: 1;
          }
        }
      `}</style>
    </div>
  )
}