'use client'

import React, { ReactNode, forwardRef } from 'react'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'

interface ScrollAnimatedProps {
  children: ReactNode
  className?: string
  delay?: number
  threshold?: number
  rootMargin?: string
  once?: boolean
  as?: React.ElementType
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any // For additional HTML attributes
}

const ScrollAnimated = forwardRef<HTMLElement, ScrollAnimatedProps>(({
  children,
  className = '',
  delay = 0,
  threshold = 0.1,
  rootMargin = '0px 0px -50px 0px',
  once = true,
  as: Component = 'div',
  ...rest
}, forwardedRef) => {
  const ref = useScrollAnimation({
    threshold,
    rootMargin,
    once
  })

  // Apply delay if specified
  const style = delay > 0 ? { 
    transitionDelay: `${delay}ms`,
    ...rest.style
  } : rest.style

  return (
    <Component
      ref={forwardedRef || ref}
      className={className}
      style={style}
      {...rest}
    >
      {children}
    </Component>
  )
})

ScrollAnimated.displayName = 'ScrollAnimated'

export default ScrollAnimated