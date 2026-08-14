'use client'

import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// ── Chapter data ──
const CHAPTERS = [
  {
    title: 'EMBARC',
    line1:  'Where the new era begins.',
    line2:  'AI · SaaS · Web Engineering · Automation',
  },
  {
    title: 'BUILD',
    line1:  'Precision-crafted at every layer,',
    line2:  'from architecture to the last pixel.',
  },
  {
    title: 'BEYOND',
    line1:  'In the space between thought and creation,',
    line2:  'we find the essence of true innovation.',
  },
]

export default function Hero() {
  const containerRef  = useRef<HTMLDivElement>(null)
  const titleRef      = useRef<HTMLHeadingElement>(null)
  const subtitleRef   = useRef<HTMLDivElement>(null)
  const scrollProgRef = useRef<HTMLDivElement>(null)
  const menuRef       = useRef<HTMLDivElement>(null)

  const [scrollProgress, setScrollProgress] = useState(0)
  const [currentSection, setCurrentSection] = useState(0)
  const [isReady, setIsReady] = useState(false)

  // ── isReady — fires after short timeout since Three.js is now in SceneBackground ──
  useEffect(() => {
    const t = setTimeout(() => setIsReady(true), 100)
    return () => clearTimeout(t)
  }, [])

  // ── Scroll handler — controls chapter display within hero's 300vh space ──
  useEffect(() => {
    const onScroll = () => {
      const heroEl = containerRef.current
      if (!heroEl) return
      const heroH    = heroEl.offsetHeight - window.innerHeight
      const progress = Math.min(window.scrollY / Math.max(1, heroH), 1)
      setScrollProgress(progress)
      setCurrentSection(Math.round(progress * (CHAPTERS.length - 1)))
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // ── GSAP entrance ──
  useEffect(() => {
    if (!isReady) return
    const ctx = gsap.context(() => {
      gsap.set(
        [menuRef.current, titleRef.current, subtitleRef.current, scrollProgRef.current],
        { autoAlpha: 0 }
      )

      const tl = gsap.timeline()
      tl.to(menuRef.current, { autoAlpha: 1, x: 0, duration: 1, ease: 'power3.out' }, 0.6)

      if (titleRef.current) {
        const chars = titleRef.current.querySelectorAll('.h-char')
        tl.to(chars, { y: 0, autoAlpha: 1, duration: 1.4, stagger: 0.04, ease: 'power4.out' }, 0.9)
      }
      if (subtitleRef.current) {
        const lines = subtitleRef.current.querySelectorAll('.s-line')
        tl.to(lines, { y: 0, autoAlpha: 1, duration: 1, stagger: 0.18, ease: 'power3.out' }, 1.6)
      }
      tl.to(scrollProgRef.current, { autoAlpha: 1, y: 0, duration: 1, ease: 'power2.out' }, 2.0)
    }, containerRef)
    return () => ctx.revert()
  }, [isReady])

  const chapter = CHAPTERS[currentSection] || CHAPTERS[0]

  return (
    <div ref={containerRef} className="relative" style={{ height: '300vh', zIndex: 1 }}>
      {/* Sticky viewport */}
      <div className="sticky top-0 h-screen overflow-hidden">

        {/* Subtle overlay for text legibility (no solid bg — SceneBackground shows through) */}
        <div className="absolute inset-0" style={{ background: 'rgba(13,6,24,0.15)' }} />

        {/* Dot grid overlay */}
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: 'radial-gradient(circle, rgba(201,168,76,0.07) 1px, transparent 1px)',
          backgroundSize: '42px 42px',
        }} />

        {/* Side menu */}
        <div
          ref={menuRef}
          className="absolute left-8 top-1/2 -translate-y-1/2 z-20 flex flex-col items-center gap-5"
          style={{ visibility: 'hidden' }}
        >
          <div className="flex flex-col gap-[5px]">
            <span className="block w-5 h-px bg-tyrian-parchment/40" />
            <span className="block w-3 h-px bg-tyrian-parchment/25" />
            <span className="block w-5 h-px bg-tyrian-parchment/40" />
          </div>
          <div
            className="font-satoshi text-[8px] tracking-[0.45em] text-tyrian-parchment/22 uppercase mt-2"
            style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}
          >
            EMBARC
          </div>
        </div>

        {/* Main content — EMBARC chapter (always present, visible when section=0) */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center z-10 px-6 transition-opacity duration-700"
          style={{ opacity: currentSection === 0 ? 1 : 0, pointerEvents: currentSection === 0 ? 'auto' : 'none' }}
        >
          <h1
            ref={titleRef}
            className="font-cormorant font-light leading-none text-tyrian-parchment select-none"
            style={{ fontSize: 'clamp(5.5rem, 14vw, 16rem)', letterSpacing: '0.22em' }}
          >
            {CHAPTERS[0].title.split('').map((ch, i) => (
              <span
                key={i}
                className="h-char inline-block"
                style={{ transform: 'translateY(120px)', opacity: 0 }}
              >
                {ch}
              </span>
            ))}
          </h1>

          <div ref={subtitleRef} className="mt-8 flex flex-col items-center gap-1.5">
            <p
              className="s-line font-cormorant italic text-tyrian-parchment/65"
              style={{ fontSize: 'clamp(1rem, 1.7vw, 1.35rem)', transform: 'translateY(30px)', opacity: 0 }}
            >
              {CHAPTERS[0].line1}
            </p>
            <p
              className="s-line font-satoshi text-[9px] tracking-[0.35em] uppercase text-tyrian-parchment/45"
              style={{ transform: 'translateY(30px)', opacity: 0 }}
            >
              {CHAPTERS[0].line2}
            </p>
          </div>
        </div>

        {/* Chapter overlays — BUILD and BEYOND */}
        {CHAPTERS.slice(1).map((ch, i) => {
          const idx     = i + 1
          const visible = currentSection === idx
          return (
            <div
              key={ch.title}
              className="absolute inset-0 z-10 flex flex-col items-center justify-center px-6 transition-opacity duration-700"
              style={{ opacity: visible ? 1 : 0, pointerEvents: 'none' }}
            >
              <h1
                className="font-cormorant font-light leading-none text-tyrian-parchment select-none"
                style={{ fontSize: 'clamp(5.5rem, 14vw, 16rem)', letterSpacing: '0.22em' }}
              >
                {ch.title}
              </h1>
              <div className="mt-8 flex flex-col items-center gap-1.5">
                <p
                  className="font-cormorant italic text-tyrian-parchment/65"
                  style={{ fontSize: 'clamp(1rem, 1.7vw, 1.35rem)' }}
                >
                  {ch.line1}
                </p>
                <p className="font-satoshi text-[9px] tracking-[0.35em] uppercase text-tyrian-parchment/45">
                  {ch.line2}
                </p>
              </div>
            </div>
          )
        })}

        {/* Scroll progress bar */}
        <div
          ref={scrollProgRef}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-4"
          style={{ visibility: 'hidden' }}
        >
          <span className="font-satoshi text-[8px] tracking-[0.4em] uppercase text-tyrian-parchment/45">
            Scroll
          </span>
          <div className="relative w-32 h-px bg-tyrian-parchment/12 overflow-hidden">
            <div
              className="absolute left-0 top-0 h-full bg-tyrian-gold transition-all duration-100"
              style={{ width: `${scrollProgress * 100}%` }}
            />
          </div>
          <span className="font-satoshi text-[8px] tracking-[0.3em] text-tyrian-parchment/45">
            {String(currentSection).padStart(2,'0')} / {String(CHAPTERS.length - 1).padStart(2,'0')}
          </span>
        </div>

        {/* Corner meta — left */}
        <div className="absolute bottom-8 left-9 z-20 flex flex-col gap-1">
          <span className="font-satoshi text-[8px] tracking-[0.3em] uppercase text-tyrian-parchment/20">Est. MMXXV</span>
          <span className="font-satoshi text-[8px] tracking-[0.25em] text-tyrian-parchment/20">23°01′N · 72°35′E</span>
        </div>

        {/* Corner meta — right */}
        <div className="absolute bottom-8 right-9 z-20 flex flex-col items-end gap-1">
          <span className="font-satoshi text-[8px] tracking-[0.3em] uppercase text-tyrian-parchment/20">AI · Design · Build</span>
          <span className="font-satoshi text-[8px] tracking-[0.25em] text-tyrian-parchment/20">Ahmedabad · Global</span>
        </div>
      </div>
    </div>
  )
}