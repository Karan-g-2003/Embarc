'use client'

import React, { useState, useEffect, useRef } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const SQRT_5000 = Math.sqrt(5000)

const TESTIMONIALS = [
  {
    tempId: 0,
    quote: 'EMBARC delivered our AI platform in 6 weeks, not 6 months. The quality was unlike anything I\'d seen from an agency.',
    by: 'Arjun S., CTO at Velora AI',
    imgSrc: 'https://i.pravatar.cc/150?img=11',
  },
  {
    tempId: 1,
    quote: 'They rewrote our entire frontend in Next.js with animations that made our investors\' jaws drop. Revenue up 210%.',
    by: 'Priya M., CEO at Stackwave',
    imgSrc: 'https://i.pravatar.cc/150?img=5',
  },
  {
    tempId: 2,
    quote: 'I\'ve worked with 12 agencies. EMBARC is the only one that actually understood our technical constraints from day one.',
    by: 'Leo K., Head of Product at Lunaris',
    imgSrc: 'https://i.pravatar.cc/150?img=3',
  },
  {
    tempId: 3,
    quote: 'Our automation workflows now save the team 400 hours a month. The ROI was obvious within the first billing cycle.',
    by: 'Meera V., COO at Flowbase',
    imgSrc: 'https://i.pravatar.cc/150?img=16',
  },
  {
    tempId: 4,
    quote: 'The design language they established for our SaaS product is still the thing people comment on most in demos.',
    by: 'Danny R., Founder at Orbitcore',
    imgSrc: 'https://i.pravatar.cc/150?img=8',
  },
  {
    tempId: 5,
    quote: 'Our Awwwards submission would not exist without EMBARC. Site of the day, twice.',
    by: 'Simone L., Creative Director at Neon Studio',
    imgSrc: 'https://i.pravatar.cc/150?img=20',
  },
  {
    tempId: 6,
    quote: 'Took one call to know these people get it. No over-promising, just extraordinary execution.',
    by: 'Rayan T., VP Eng at Pulsedata',
    imgSrc: 'https://i.pravatar.cc/150?img=12',
  },
  {
    tempId: 7,
    quote: 'Our enterprise clients specifically comment on the web app\'s polish. That\'s entirely EMBARC\'s doing.',
    by: 'Cassandra W., Sales Director at Meridian SaaS',
    imgSrc: 'https://i.pravatar.cc/150?img=17',
  },
]

interface CardProps {
  position: number
  testimonial: typeof TESTIMONIALS[0]
  handleMove: (steps: number) => void
  cardSize: number
}

function TestimonialCard({ position, testimonial, handleMove, cardSize }: CardProps) {
  const isCenter = position === 0

  return (
    <div
      onClick={() => handleMove(position)}
      className="absolute left-1/2 top-1/2 transition-all duration-500 ease-in-out"
      style={{
        width:      cardSize,
        height:     cardSize,
        cursor:     'pointer',
        clipPath:   `polygon(40px 0%, calc(100% - 40px) 0%, 100% 40px, 100% 100%, calc(100% - 40px) 100%, 40px 100%, 0 100%, 0 0)`,
        background: isCenter
          ? 'linear-gradient(135deg, #3D0F6B 0%, #1A0A2E 100%)'
          : 'rgba(26,10,46,0.7)',
        border:     isCenter ? '1px solid rgba(201,168,76,0.35)' : '1px solid rgba(245,240,232,0.07)',
        boxShadow:  isCenter ? '0px 8px 0px 4px rgba(201,168,76,0.12)' : 'none',
        transform: `
          translate(-50%, -50%)
          translateX(${(cardSize / 1.5) * position}px)
          translateY(${isCenter ? -65 : position % 2 ? 15 : -15}px)
          rotate(${isCenter ? 0 : position % 2 ? 2.5 : -2.5}deg)
        `,
        zIndex: isCenter ? 10 : 0,
        padding: '2rem',
        backdropFilter: 'blur(12px)',
      }}
    >
      {/* Corner cut line */}
      <span
        className="absolute block origin-top-right rotate-45"
        style={{
          right:            -2,
          top:              40,
          width:            SQRT_5000,
          height:           1,
          background:       isCenter ? 'rgba(201,168,76,0.4)' : 'rgba(245,240,232,0.08)',
        }}
      />

      {/* Avatar */}
      <img
        src={testimonial.imgSrc}
        alt={testimonial.by.split(',')[0]}
        className="mb-5 object-cover object-top"
        style={{
          width:     48,
          height:    56,
          boxShadow: '3px 3px 0px rgba(13,6,24,0.8)',
        }}
      />

      {/* Quote */}
      <p
        className="font-cormorant leading-snug"
        style={{
          fontSize:   'clamp(1rem, 1.4vw, 1.2rem)',
          color:      isCenter ? 'rgba(245,240,232,0.88)' : 'rgba(245,240,232,0.45)',
          fontStyle:  'italic',
        }}
      >
        &ldquo;{testimonial.quote}&rdquo;
      </p>

      {/* Attribution */}
      <p
        className="font-satoshi text-[9px] tracking-[0.25em] uppercase absolute bottom-8 left-8 right-8 mt-2"
        style={{ color: isCenter ? 'rgba(201,168,76,0.7)' : 'rgba(245,240,232,0.2)' }}
      >
        — {testimonial.by}
      </p>
    </div>
  )
}

export default function Testimonials() {
  const [cardSize,    setCardSize]    = useState(360)
  const [list,        setList]        = useState(TESTIMONIALS)
  const sectionRef  = useRef<HTMLElement>(null)
  const headingRef  = useRef<HTMLDivElement>(null)

  const handleMove = (steps: number) => {
    const newList = [...list]
    if (steps > 0) {
      for (let i = steps; i > 0; i--) {
        const item = newList.shift()
        if (!item) return
        newList.push({ ...item, tempId: Math.random() })
      }
    } else {
      for (let i = steps; i < 0; i++) {
        const item = newList.pop()
        if (!item) return
        newList.unshift({ ...item, tempId: Math.random() })
      }
    }
    setList(newList)
  }

  useEffect(() => {
    const update = () => {
      setCardSize(window.matchMedia('(min-width: 640px)').matches ? 360 : 285)
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  // GSAP section entrance
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(headingRef.current,
        { opacity: 0, y: 60 },
        {
          opacity: 1, y: 0, duration: 1.1, ease: 'power3.out',
          scrollTrigger: { trigger: headingRef.current, start: 'top 82%' },
        }
      )
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} id="testimonials" className="relative bg-tyrian-void py-24 md:py-32 overflow-hidden">
      {/* Top gradient */}
      <div className="absolute top-0 left-0 right-0 h-24 pointer-events-none"
        style={{ background: 'linear-gradient(to bottom, #1A0A2E, transparent)' }} />

      {/* Background noise texture */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.02]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: '180px',
        }}
      />

      <div className="max-w-6xl mx-auto px-8 md:px-16">
        {/* Section label */}
        <div ref={headingRef} className="mb-12 md:mb-16">
          <div className="flex items-center gap-4 mb-6">
            <div className="h-px w-8 bg-tyrian-gold/40" />
            <span className="font-satoshi text-[9px] tracking-[0.5em] uppercase text-tyrian-gold/55">
              Client Voices
            </span>
          </div>
          <h2
            className="font-cormorant font-light text-tyrian-parchment/80"
            style={{ fontSize: 'clamp(2.5rem, 5vw, 5.5rem)', letterSpacing: '0.08em', lineHeight: 1.05 }}
          >
            What they say
          </h2>
        </div>
      </div>

      {/* Card carousel */}
      <div className="relative overflow-hidden" style={{ height: 580 }}>
        {list.map((t, index) => {
          const total    = list.length
          const position = total % 2
            ? index - (total + 1) / 2
            : index - total / 2
          return (
            <TestimonialCard
              key={t.tempId}
              testimonial={t}
              handleMove={handleMove}
              position={position}
              cardSize={cardSize}
            />
          )
        })}

        {/* Nav buttons */}
        <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 gap-2 z-20">
          <button
            onClick={() => handleMove(-1)}
            className="flex h-11 w-11 items-center justify-center border border-tyrian-parchment/15 text-tyrian-parchment/40 hover:border-tyrian-gold hover:text-tyrian-gold transition-all duration-300 bg-tyrian-void/80"
            aria-label="Previous testimonial"
            style={{ backdropFilter: 'blur(8px)' }}
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={() => handleMove(1)}
            className="flex h-11 w-11 items-center justify-center border border-tyrian-parchment/15 text-tyrian-parchment/40 hover:border-tyrian-gold hover:text-tyrian-gold transition-all duration-300 bg-tyrian-void/80"
            aria-label="Next testimonial"
            style={{ backdropFilter: 'blur(8px)' }}
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </section>
  )
}
