'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const PROJECTS = [
  {
    number: '01',
    title: 'Project Zero',
    category: 'AI Platform',
    tags: ['Machine Learning', 'Python', 'React'],
    desc: 'End-to-end AI pipeline that reduced manual processing overhead by 94% for a logistics enterprise.',
    color: '#3D0F6B',
  },
  {
    number: '02',
    title: 'Meridian',
    category: 'SaaS Dashboard',
    tags: ['Next.js', 'TypeScript', 'Supabase'],
    desc: 'Real-time analytics platform processing 2M+ events/day with sub-100ms query response.',
    color: '#1A0A2E',
  },
  {
    number: '03',
    title: 'Nova',
    category: 'Web App',
    tags: ['Three.js', 'GSAP', 'WebGL'],
    desc: 'Cinematic web experience that won Awwwards Site of the Day and drove 340% increase in lead quality.',
    color: '#0D1628',
  },
]

export default function Work() {
  const sectionRef  = useRef<HTMLElement>(null)
  const trackRef    = useRef<HTMLDivElement>(null)
  const headingRef  = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const track  = trackRef.current
      const section = sectionRef.current
      if (!track || !section) return

      // Heading entrance
      gsap.fromTo(headingRef.current,
        { opacity: 0, y: 50 },
        {
          opacity: 1, y: 0, duration: 1.1, ease: 'power3.out',
          scrollTrigger: { trigger: headingRef.current, start: 'top 82%' },
        }
      )

      // Horizontal scroll pin
      const cards = track.querySelectorAll('.work-card')
      const totalWidth = (cards.length - 1) * (track.scrollWidth / cards.length)

      gsap.to(track, {
        x: () => -(track.scrollWidth - window.innerWidth + 80),
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          pin: true,
          scrub: 1.2,
          start: 'top top',
          end: () => `+=${track.scrollWidth - window.innerWidth + 80}`,
          invalidateOnRefresh: true,
        },
      })

      // Card entrance stagger as they enter viewport horizontally
      cards.forEach((card, i) => {
        gsap.fromTo(card,
          { opacity: 0, y: 40 },
          {
            opacity: 1, y: 0, duration: 0.9, ease: 'power3.out', delay: i * 0.1,
            scrollTrigger: { trigger: section, start: 'top 60%' },
          }
        )
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} id="work" className="relative overflow-hidden bg-tyrian-night">
      {/* Top gradient */}
      <div className="absolute top-0 left-0 right-0 h-24 pointer-events-none z-10"
        style={{ background: 'linear-gradient(to bottom, #0D0618, transparent)' }} />

      {/* Section label (pinned, above track) */}
      <div ref={headingRef} className="relative z-10 px-12 md:px-20 pt-24 pb-10 flex items-end justify-between">
        <div>
          <div className="flex items-center gap-4 mb-5">
            <div className="h-px w-8 bg-tyrian-gold/40" />
            <span className="font-satoshi text-[9px] tracking-[0.5em] uppercase text-tyrian-gold/55">
              Selected Work
            </span>
          </div>
          <h2
            className="font-cormorant font-light text-tyrian-parchment/80"
            style={{ fontSize: 'clamp(2.5rem, 5vw, 5.5rem)', letterSpacing: '0.08em', lineHeight: 1.05 }}
          >
            Work
          </h2>
        </div>
        <a
          href="#contact"
          className="hidden md:flex font-satoshi text-[9px] tracking-[0.3em] uppercase text-tyrian-parchment/30 hover:text-tyrian-gold/60 transition-colors duration-300 items-center gap-2 mb-2"
        >
          All Projects <span>→</span>
        </a>
      </div>

      {/* Horizontal track */}
      <div
        ref={trackRef}
        className="flex gap-6 px-12 md:px-20 pb-20"
        style={{ width: 'max-content' }}
      >
        {PROJECTS.map((project) => (
          <div
            key={project.number}
            className="work-card group relative flex-shrink-0 flex flex-col justify-between"
            style={{
              width: 'clamp(320px, 38vw, 520px)',
              height: 'clamp(380px, 52vh, 560px)',
              background: `linear-gradient(135deg, ${project.color}cc 0%, #0D0618 100%)`,
              border: '1px solid rgba(245,240,232,0.06)',
            }}
          >
            {/* Large number watermark */}
            <span
              className="absolute top-4 right-6 font-cormorant text-tyrian-parchment pointer-events-none select-none"
              style={{ fontSize: 'clamp(6rem, 12vw, 10rem)', opacity: 0.04, lineHeight: 1, letterSpacing: '-0.04em' }}
            >
              {project.number}
            </span>

            {/* Top area */}
            <div className="p-9">
              <span className="font-satoshi text-[8px] tracking-[0.5em] uppercase text-tyrian-gold/50 block mb-4">
                {project.category}
              </span>
              <h3
                className="font-cormorant font-light text-tyrian-parchment/85 leading-tight"
                style={{ fontSize: 'clamp(2.2rem, 4vw, 3.5rem)', letterSpacing: '0.08em' }}
              >
                {project.title}
              </h3>
            </div>

            {/* Bottom area */}
            <div className="p-9 pt-0 flex flex-col gap-6">
              <p className="font-satoshi text-sm text-tyrian-parchment/35 leading-relaxed tracking-wide">
                {project.desc}
              </p>

              <div className="flex flex-wrap gap-2">
                {project.tags.map(tag => (
                  <span
                    key={tag}
                    className="font-satoshi text-[8px] tracking-[0.3em] uppercase px-3 py-1.5 text-tyrian-parchment/35 border border-tyrian-parchment/10"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <a
                href="#contact"
                className="self-start font-satoshi text-[9px] tracking-[0.3em] uppercase text-tyrian-parchment/30 hover:text-tyrian-gold transition-colors duration-300 flex items-center gap-2 mt-1 group-hover:text-tyrian-parchment/60"
              >
                View Case Study
                <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
              </a>
            </div>

            {/* Hover border glow */}
            <div className="absolute inset-0 pointer-events-none border border-tyrian-gold/0 group-hover:border-tyrian-gold/12 transition-colors duration-500" />
          </div>
        ))}

        {/* CTA card */}
        <div
          className="work-card group flex-shrink-0 flex flex-col items-center justify-center gap-6 border border-tyrian-parchment/6 hover:border-tyrian-gold/20 transition-colors duration-500"
          style={{ width: 'clamp(260px, 30vw, 380px)', height: 'clamp(380px, 52vh, 560px)' }}
        >
          <div className="h-px w-12 bg-tyrian-gold/30" />
          <p className="font-cormorant italic text-tyrian-parchment/30 text-2xl text-center px-8 leading-relaxed">
            Ready to be next?
          </p>
          <a
            href="#contact"
            className="font-satoshi text-[9px] tracking-[0.25em] uppercase border border-tyrian-parchment/15 text-tyrian-parchment/40 hover:border-tyrian-gold hover:text-tyrian-gold transition-all duration-400 px-8 py-3.5 flex items-center gap-2"
          >
            Start a Project <span className="text-tyrian-gold/60">→</span>
          </a>
        </div>
      </div>
    </section>
  )
}
