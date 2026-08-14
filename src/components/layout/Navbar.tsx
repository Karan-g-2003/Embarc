'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'

const LINKS = ['Services', 'Work', 'About', 'Contact']

export default function Navbar() {
  const navRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(navRef.current, { opacity: 0, y: -20 })
      gsap.to(navRef.current, {
        opacity: 1, y: 0, duration: 0.9, delay: 2.4, ease: 'power3.out',
      })
    }, navRef)
    return () => ctx.revert()
  }, [])

  return (
    <nav ref={navRef} className="fixed top-5 left-1/2 -translate-x-1/2 z-50 whitespace-nowrap">
      <div
        className="flex items-center gap-7 px-7 py-3 rounded-full border border-tyrian-parchment/10"
        style={{ backdropFilter: 'blur(24px)', background: 'rgba(13,6,24,0.55)' }}
      >
        {/* Single letter logomark */}
        <span className="font-cormorant text-sm tracking-[0.3em] text-tyrian-parchment/80">E</span>

        <div className="w-px h-3 bg-tyrian-parchment/15" />

        {LINKS.map(link => (
          <a
            key={link}
            href={`#${link.toLowerCase()}`}
            className="font-satoshi text-[10px] tracking-[0.2em] uppercase text-tyrian-parchment/40 hover:text-tyrian-parchment/80 transition-colors duration-300"
          >
            {link}
          </a>
        ))}

        <div className="w-px h-3 bg-tyrian-parchment/15" />

        <a
          href="#contact"
          className="font-satoshi text-[10px] tracking-[0.18em] uppercase text-tyrian-gold/80 hover:text-tyrian-gold transition-colors duration-300 flex items-center gap-1.5"
        >
          Start <span className="opacity-60">→</span>
        </a>
      </div>
    </nav>
  )
}