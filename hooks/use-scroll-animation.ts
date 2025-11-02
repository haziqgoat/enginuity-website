"use client"

import { useEffect, useRef, useState } from "react"

interface ScrollAnimationOptions {
  threshold?: number
  rootMargin?: string
  triggerOnce?: boolean
  animationType?: 'fade-up' | 'fade-down' | 'fade-left' | 'fade-right' | 'scale' | 'slide-up' | 'slide-down'
  delay?: number
  duration?: number
}

export function useScrollAnimation(options: ScrollAnimationOptions = {}) {
  const {
    threshold = 0.1,
    rootMargin = '0px 0px -100px 0px',
    triggerOnce = true,
    animationType = 'fade-up',
    delay = 0,
    duration = 600
  } = options

  const [isVisible, setIsVisible] = useState(false)
  const [hasTriggered, setHasTriggered] = useState(false)
  const elementRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const element = elementRef.current
    if (!element) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (!hasTriggered || !triggerOnce) {
              setTimeout(() => {
                setIsVisible(true)
                if (triggerOnce) setHasTriggered(true)
              }, delay)
            }
          } else if (!triggerOnce) {
            setIsVisible(false)
          }
        })
      },
      { threshold, rootMargin }
    )

    observer.observe(element)

    return () => observer.disconnect()
  }, [threshold, rootMargin, triggerOnce, delay, hasTriggered])

  // Animation styles based on type
  const getAnimationStyles = () => {
    const baseStyles = {
      transition: `all ${duration}ms cubic-bezier(0.16, 1, 0.3, 1)`,
      willChange: 'transform, opacity'
    }

    if (!isVisible) {
      switch (animationType) {
        case 'fade-up':
          return {
            ...baseStyles,
            opacity: 0,
            transform: 'translateY(60px) scale(0.95)'
          }
        case 'fade-down':
          return {
            ...baseStyles,
            opacity: 0,
            transform: 'translateY(-60px) scale(0.95)'
          }
        case 'fade-left':
          return {
            ...baseStyles,
            opacity: 0,
            transform: 'translateX(-60px) scale(0.95)'
          }
        case 'fade-right':
          return {
            ...baseStyles,
            opacity: 0,
            transform: 'translateX(60px) scale(0.95)'
          }
        case 'scale':
          return {
            ...baseStyles,
            opacity: 0,
            transform: 'scale(0.8)'
          }
        case 'slide-up':
          return {
            ...baseStyles,
            transform: 'translateY(100px)'
          }
        case 'slide-down':
          return {
            ...baseStyles,
            transform: 'translateY(-100px)'
          }
        default:
          return {
            ...baseStyles,
            opacity: 0,
            transform: 'translateY(60px) scale(0.95)'
          }
      }
    }

    return {
      ...baseStyles,
      opacity: 1,
      transform: 'translateY(0) translateX(0) scale(1)'
    }
  }

  return {
    ref: elementRef,
    style: getAnimationStyles(),
    isVisible
  }
}