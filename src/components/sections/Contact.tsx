'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function Contact() {
  const sectionRef  = useRef<HTMLElement>(null)
  const eyebrowRef  = useRef<HTMLDivElement>(null)
  const headingRef  = useRef<HTMLHeadingElement>(null)
  const emailRef    = useRef<HTMLAnchorElement>(null)
  const ctaRef      = useRef<HTMLAnchorElement>(null)

  // ── GSAP scroll entrance ──
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set([eyebrowRef.current, emailRef.current, ctaRef.current], { opacity: 0, y: 20 })

      // Heading lines stagger
      if (headingRef.current) {
        const lines = headingRef.current.querySelectorAll('.h-line')
        gsap.set(lines, { opacity: 0, y: 40 })
        gsap.to(lines, {
          opacity: 1, y: 0, duration: 1.1, stagger: 0.15, ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 70%' },
        })
      }

      gsap.to(eyebrowRef.current, {
        opacity: 1, y: 0, duration: 0.8, ease: 'power2.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 70%' },
      })
      gsap.to(emailRef.current, {
        opacity: 1, y: 0, duration: 0.8, ease: 'power2.out', delay: 0.6,
        scrollTrigger: { trigger: sectionRef.current, start: 'top 70%' },
      })
      gsap.to(ctaRef.current, {
        opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', delay: 0.8,
        scrollTrigger: { trigger: sectionRef.current, start: 'top 70%' },
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  // ── Magnetic CTA ──
  const onCtaMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const r = e.currentTarget.getBoundingClientRect()
    gsap.to(ctaRef.current, {
      x: (e.clientX - r.left - r.width  / 2) * 0.45,
      y: (e.clientY - r.top  - r.height / 2) * 0.45,
      duration: 0.3, ease: 'power2.out',
    })
  }
  const onCtaLeave = () => {
    gsap.to(ctaRef.current, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1,0.4)' })
  }

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="relative flex flex-col items-center justify-center px-8"
      style={{
        minHeight:  '100vh',
        background: 'rgba(13,6,24,0.75)',
        zIndex:     1,
      }}
    >
      {/* Top fade */}
      <div
        className="absolute top-0 left-0 right-0 h-32 pointer-events-none"
        style={{ background: 'linear-gradient(to bottom, rgba(26,10,46,0), rgba(13,6,24,0.75))' }}
      />

      {/* Dot grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(201,168,76,0.05) 1px, transparent 1px)',
          backgroundSize:  '42px 42px',
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-4xl">
        {/* Eyebrow */}
        <div ref={eyebrowRef} className="flex items-center gap-4 mb-10">
          <div className="h-px w-6 bg-tyrian-gold/40" />
          <span className="font-satoshi text-[9px] tracking-[0.5em] uppercase text-tyrian-gold/55">
            Start a project
          </span>
          <div className="h-px w-6 bg-tyrian-gold/40" />
        </div>

        {/* Heading */}
        <h2
          ref={headingRef}
          className="font-cormorant font-light text-tyrian-parchment/85 leading-[1.0] mb-10"
          style={{ fontSize: 'clamp(3.5rem, 8vw, 9rem)', letterSpacing: '0.05em' }}
        >
          <span className="h-line block">Let&rsquo;s build</span>
          <span className="h-line block">something</span>
          <span className="h-line block italic">rare.</span>
        </h2>

        {/* Gold rule */}
        <div className="h-px w-16 bg-tyrian-gold/30 mb-10" />

        {/* Email */}
        <a
          ref={emailRef}
          href="mailto:hello@embarc.studio"
          className="font-satoshi text-sm tracking-widest text-tyrian-parchment/55 hover:text-tyrian-gold/70 transition-colors duration-300 mb-12"
        >
          hello@embarc.studio
        </a>

        {/* Magnetic CTA */}
        <a
          ref={ctaRef}
          href="mailto:hello@embarc.studio"
          onMouseMove={onCtaMove}
          onMouseLeave={onCtaLeave}
          className="font-satoshi text-[11px] tracking-[0.25em] uppercase border border-tyrian-gold/40 text-tyrian-gold/70 hover:border-tyrian-gold hover:text-tyrian-gold transition-colors duration-400 inline-flex items-center gap-3 px-10 py-5"
        >
          Begin the conversation
          <span className="text-tyrian-gold/60">→</span>
        </a>
      </div>

      {/* Corner meta */}
      <div className="absolute bottom-8 left-9 z-10">
        <span className="font-satoshi text-[8px] tracking-[0.3em] uppercase text-tyrian-parchment/25">
          Response within 24h
        </span>
      </div>
      <div className="absolute bottom-8 right-9 z-10">
        <span className="font-satoshi text-[8px] tracking-[0.3em] uppercase text-tyrian-parchment/25">
          Ahmedabad · Remote-first · Global clients
        </span>
      </div>
    </section>
  )
}
