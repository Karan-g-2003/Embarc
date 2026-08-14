'use client'

import { useRef } from 'react'
import { useMotionValue, motion, useSpring, useTransform } from 'motion/react'
import { ArrowRight } from 'lucide-react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useEffect } from 'react'

gsap.registerPlugin(ScrollTrigger)

const SERVICES = [
  {
    heading: 'AI Integration',
    subheading: 'LLMs, agents & intelligent automation pipelines',
    imgSrc: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80',
    href: '#services',
  },
  {
    heading: 'SaaS Development',
    subheading: 'Full-stack products built to scale from day one',
    imgSrc: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
    href: '#services',
  },
  {
    heading: 'Web Engineering',
    subheading: 'Blazing-fast, accessible, production-grade web apps',
    imgSrc: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&q=80',
    href: '#services',
  },
  {
    heading: 'Automation',
    subheading: 'Workflows that eliminate the mundane at scale',
    imgSrc: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80',
    href: '#services',
  },
  {
    heading: 'UI/UX Design',
    subheading: 'Interfaces that feel inevitable, not designed',
    imgSrc: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&q=80',
    href: '#services',
  },
]

interface ServiceLinkProps {
  heading: string
  imgSrc: string
  subheading: string
  href: string
}

function ServiceLink({ heading, imgSrc, subheading, href }: ServiceLinkProps) {
  const ref = useRef<HTMLAnchorElement>(null)

  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const mouseXSpring = useSpring(x)
  const mouseYSpring = useSpring(y)

  const top  = useTransform(mouseYSpring, [0.5, -0.5], ['40%', '60%'])
  const left = useTransform(mouseXSpring, [0.5, -0.5], ['60%', '40%'])

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const rect   = ref.current!.getBoundingClientRect()
    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top
    x.set(mouseX / rect.width  - 0.5)
    y.set(mouseY / rect.height - 0.5)
  }

  return (
    <motion.a
      href={href}
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => { x.set(0); y.set(0) }}
      initial="initial"
      whileHover="whileHover"
      className="group relative flex items-center justify-between py-6 md:py-8 overflow-hidden"
      style={{ borderBottom: '1px solid rgba(245,240,232,0.08)' }}
    >
      {/* Hover line */}
      <motion.div
        className="absolute bottom-0 left-0 h-px bg-tyrian-gold"
        variants={{ initial: { scaleX: 0 }, whileHover: { scaleX: 1 } }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        style={{ transformOrigin: 'left', width: '100%' }}
      />

      <div className="relative z-10">
        <motion.span
          variants={{
            initial: { x: 0 },
            whileHover: { x: -14 },
          }}
          transition={{ type: 'spring', staggerChildren: 0.055, delayChildren: 0.15 }}
          className="block font-cormorant font-light text-tyrian-parchment/50 group-hover:text-tyrian-parchment transition-colors duration-500"
          style={{ fontSize: 'clamp(2.4rem, 5vw, 5rem)', letterSpacing: '0.06em', lineHeight: 1 }}
        >
          {heading.split('').map((l, i) => (
            <motion.span
              key={i}
              variants={{ initial: { x: 0 }, whileHover: { x: 12 } }}
              transition={{ type: 'spring' }}
              className="inline-block"
            >
              {l === ' ' ? '\u00a0' : l}
            </motion.span>
          ))}
        </motion.span>
        <span className="block font-satoshi text-[9px] tracking-[0.3em] uppercase text-tyrian-parchment/22 group-hover:text-tyrian-gold/50 transition-colors duration-500 mt-1.5">
          {subheading}
        </span>
      </div>

      {/* Floating image */}
      <motion.img
        style={{
          top,
          left,
          translateX: '-10%',
          translateY: '-50%',
          position:   'absolute',
          zIndex:     0,
          height:     'clamp(5rem, 11vw, 11rem)',
          width:      'clamp(7rem, 15vw, 15rem)',
          objectFit:  'cover',
          boxShadow:  '0 25px 50px rgba(0,0,0,0.5)',
        }}
        variants={{
          initial: { scale: 0, rotate: '-10deg' },
          whileHover: { scale: 1, rotate: '8deg' },
        }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        src={imgSrc}
        alt={heading}
      />

      <div className="overflow-hidden relative z-10">
        <motion.div
          variants={{
            initial: { x: '100%', opacity: 0 },
            whileHover: { x: '0%', opacity: 1 },
          }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          className="p-3"
        >
          <ArrowRight className="size-6 md:size-9 text-tyrian-gold" />
        </motion.div>
      </div>
    </motion.a>
  )
}

export default function Services() {
  const sectionRef = useRef<HTMLElement>(null)
  const headingRef = useRef<HTMLDivElement>(null)
  const listRef    = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Heading entrance
      gsap.fromTo(headingRef.current,
        { opacity: 0, y: 60 },
        {
          opacity: 1, y: 0, duration: 1.1, ease: 'power3.out',
          scrollTrigger: { trigger: headingRef.current, start: 'top 82%' },
        }
      )

      // Stagger list items entrance
      if (listRef.current) {
        const rows = listRef.current.querySelectorAll('.service-row')
        gsap.fromTo(rows,
          { opacity: 0, y: 50 },
          {
            opacity: 1, y: 0, duration: 0.9, stagger: 0.12, ease: 'power3.out',
            scrollTrigger: { trigger: listRef.current, start: 'top 80%' },
          }
        )
      }
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} id="services" className="relative bg-tyrian-void py-28 md:py-36 px-8 md:px-16">
      {/* Subtle top gradient fade from hero */}
      <div className="absolute top-0 left-0 right-0 h-32 pointer-events-none"
        style={{ background: 'linear-gradient(to bottom, #0D0618, transparent)' }} />

      <div className="max-w-6xl mx-auto">
        {/* Section label */}
        <div ref={headingRef} className="mb-16 md:mb-20">
          <div className="flex items-center gap-4 mb-6">
            <div className="h-px w-8 bg-tyrian-gold/40" />
            <span className="font-satoshi text-[9px] tracking-[0.5em] uppercase text-tyrian-gold/55">
              What We Build
            </span>
          </div>
          <h2
            className="font-cormorant font-light text-tyrian-parchment/80"
            style={{ fontSize: 'clamp(2.5rem, 5vw, 5.5rem)', letterSpacing: '0.08em', lineHeight: 1.05 }}
          >
            Services
          </h2>
          <p className="font-satoshi text-sm text-tyrian-parchment/30 mt-4 max-w-md tracking-wide leading-relaxed">
            We operate at the intersection of engineering precision and design intention — every capability is intentional.
          </p>
        </div>

        {/* Service links */}
        <div ref={listRef}>
          {SERVICES.map((svc) => (
            <div key={svc.heading} className="service-row">
              <ServiceLink {...svc} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
