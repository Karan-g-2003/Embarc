'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const CREDENTIALS = [
  'Next.js · Three.js · Python · LangChain · Supabase',
  'Open to retainer and project-based engagements',
  'Currently accepting 2 new clients per quarter',
]

export default function About() {
  const sectionRef = useRef<HTMLElement>(null)
  const leftRef    = useRef<HTMLDivElement>(null)
  const rightRef   = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(leftRef.current,
        { opacity: 0, x: -40 },
        {
          opacity: 1, x: 0, duration: 1.2, ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' },
        }
      )
      gsap.fromTo(rightRef.current,
        { opacity: 0, x: 40 },
        {
          opacity: 1, x: 0, duration: 1.2, ease: 'power3.out', delay: 0.1,
          scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' },
        }
      )
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="about"
      className="py-28 md:py-36 px-8 md:px-16"
      style={{ background: 'rgba(26,10,46,0.68)', position: 'relative', zIndex: 1 }}
    >
      {/* Top fade */}
      <div
        className="absolute top-0 left-0 right-0 h-24 pointer-events-none"
        style={{ background: 'linear-gradient(to bottom, rgba(13,6,24,0), rgba(26,10,46,0.68))' }}
      />

      {/* Dot grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(201,168,76,0.04) 1px, transparent 1px)',
          backgroundSize:  '42px 42px',
        }}
      />

      <div className="max-w-6xl mx-auto relative">
        {/* Section label */}
        <div className="flex items-center gap-4 mb-16 md:mb-20">
          <div className="h-px w-6 bg-tyrian-gold/40" />
          <span className="font-satoshi text-[9px] tracking-[0.5em] uppercase text-tyrian-gold/55">
            Who We Are
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24">
          {/* Left — pull quote */}
          <div ref={leftRef}>
            <blockquote
              className="font-cormorant italic text-tyrian-parchment/80 leading-[1.35]"
              style={{ fontSize: 'clamp(2rem, 3.5vw, 3.2rem)' }}
            >
              &ldquo;We started EMBARC because the gap between what AI can do and what most
              businesses are actually doing with it is embarrassing. We&rsquo;re here to close it.&rdquo;
            </blockquote>
            <div className="h-px w-12 bg-tyrian-gold/35 mt-10" />
          </div>

          {/* Right — body copy */}
          <div ref={rightRef} className="flex flex-col justify-center gap-8">
            <div className="flex flex-col gap-6">
              <p className="font-satoshi text-sm leading-relaxed text-tyrian-parchment/65 tracking-wide">
                EMBARC is a small, deliberate team of engineers and designers who care about
                the craft. We don&rsquo;t take on more than we can execute with precision. Every client
                we work with gets our full attention — not a junior team following a template.
              </p>
              <p className="font-satoshi text-sm leading-relaxed text-tyrian-parchment/65 tracking-wide">
                We work at the intersection of AI engineering, product design, and systems
                thinking. The result is work that doesn&rsquo;t just look exceptional — it performs,
                scales, and justifies itself in the first quarter.
              </p>
            </div>

            {/* Credentials */}
            <div className="flex flex-col gap-3 pt-2">
              {CREDENTIALS.map((cred, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span
                    className="inline-block mt-[3px] flex-shrink-0 bg-tyrian-gold/50"
                    style={{ width: 4, height: 4 }}
                    aria-hidden
                  />
                  <span className="font-satoshi text-[9px] tracking-[0.3em] uppercase text-tyrian-parchment/45 leading-relaxed">
                    {cred}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
