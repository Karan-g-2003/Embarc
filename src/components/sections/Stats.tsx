'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const STATS = [
  { value: 94,   suffix: '%',       label: 'Avg. reduction in manual overhead' },
  { value: 6,    suffix: ' weeks',  label: 'Average delivery time, start to launch' },
  { value: 3,    suffix: '×',       label: 'Average ROI within first billing cycle' },
  { value: 12,   suffix: '+',       label: 'Products shipped across 4 continents' },
]

export default function Stats() {
  const sectionRef = useRef<HTMLElement>(null)
  const numRefs    = useRef<(HTMLSpanElement | null)[]>([])

  useEffect(() => {
    const ctx = gsap.context(() => {
      STATS.forEach((stat, i) => {
        const el = numRefs.current[i]
        if (!el) return
        const proxy = { val: 0 }
        gsap.to(proxy, {
          val:      stat.value,
          duration: 1.5,
          ease:     'power2.out',
          onUpdate: () => {
            el.textContent = Math.round(proxy.val) + stat.suffix
          },
          scrollTrigger: {
            trigger: sectionRef.current,
            start:   'top 80%',
            once:    true,
          },
        })
      })

      // Entrance for stat blocks
      gsap.fromTo(
        sectionRef.current?.querySelectorAll('.stat-block') ?? [],
        { opacity: 0, y: 40 },
        {
          opacity: 1, y: 0, duration: 0.9, stagger: 0.12, ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 82%' },
        }
      )
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      style={{ background: 'rgba(13,6,24,0.55)', position: 'relative', zIndex: 1 }}
      className="py-16 px-8 md:px-16"
    >
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-0">
          {STATS.map((stat, i) => (
            <div
              key={i}
              className="stat-block flex flex-col items-center md:items-start px-6 md:px-10 py-8"
              style={{
                borderLeft: i > 0 ? '1px solid rgba(245,240,232,0.08)' : undefined,
                borderTop:  i >= 2 ? '1px solid rgba(245,240,232,0.08)' : undefined,
              }}
            >
              <span
                ref={el => { numRefs.current[i] = el }}
                className="font-cormorant font-light text-tyrian-parchment/90"
                style={{ fontSize: 'clamp(3rem, 6vw, 5.5rem)', lineHeight: 1, letterSpacing: '-0.02em' }}
              >
                0{stat.suffix}
              </span>
              <span className="font-satoshi text-[10px] tracking-[0.25em] uppercase text-tyrian-parchment/45 mt-3 leading-relaxed">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
