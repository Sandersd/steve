'use client'

import { useEffect, useRef } from 'react'

interface ScrollAnimationOptions {
  threshold?: number
  rootMargin?: string
  once?: boolean
}

export function useScrollAnimation(
  options: ScrollAnimationOptions = {}
) {
  const ref = useRef<HTMLElement>(null)
  const {
    threshold = 0.1,
    rootMargin = '0px 0px -50px 0px',
    once = true
  } = options

  useEffect(() => {
    const element = ref.current
    if (!element) return

    // Set initial state
    element.style.opacity = '0'
    element.style.transform = 'translateY(30px)'
    element.style.transition = 'opacity 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94), transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)'

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const target = entry.target as HTMLElement
          if (entry.isIntersecting) {
            target.style.opacity = '1'
            target.style.transform = 'translateY(0px)'
            
            if (once) {
              observer.unobserve(entry.target)
            }
          } else if (!once) {
            target.style.opacity = '0'
            target.style.transform = 'translateY(30px)'
          }
        })
      },
      {
        threshold,
        rootMargin,
      }
    )

    observer.observe(element)

    return () => {
      observer.disconnect()
    }
  }, [threshold, rootMargin, once])

  return ref
}