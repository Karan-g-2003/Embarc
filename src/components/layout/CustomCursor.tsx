'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'

export default function CustomCursor() {
  const dotRef  = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const dot  = dotRef.current
    const ring = ringRef.current
    if (!dot || !ring) return

    const onMove = (e: MouseEvent) => {
      // Dot: instant
      gsap.to(dot, { x: e.clientX, y: e.clientY, duration: 0 })
      // Ring: lags behind
      gsap.to(ring, { x: e.clientX, y: e.clientY, duration: 0.45, ease: 'power2.out' })
    }

    // Expand ring on hover
    const onEnter = () => {
      gsap.to(ring, { scale: 2.8, borderColor: 'rgba(201,168,76,0.4)', duration: 0.3 })
      gsap.to(dot, { scale: 0, duration: 0.2 })
    }
    const onLeave = () => {
      gsap.to(ring, { scale: 1, borderColor: 'rgba(245,240,232,0.25)', duration: 0.3 })
      gsap.to(dot, { scale: 1, duration: 0.2 })
    }

    window.addEventListener('mousemove', onMove)

    const targets = document.querySelectorAll('a, button')
    targets.forEach(el => {
      el.addEventListener('mouseenter', onEnter)
      el.addEventListener('mouseleave', onLeave)
    })

    return () => {
      window.removeEventListener('mousemove', onMove)
      targets.forEach(el => {
        el.removeEventListener('mouseenter', onEnter)
        el.removeEventListener('mouseleave', onLeave)
      })
    }
  }, [])

  return (
    <>
      <div ref={dotRef}  className="cursor-dot"  />
      <div ref={ringRef} className="cursor-ring" />
    </>
  )
}