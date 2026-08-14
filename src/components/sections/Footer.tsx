'use client'

import { useEffect, useRef, useState, useId } from 'react'

// EMBARC brand gradient: void → purple → gold → parchment → transparent
const STOPS = [
  { offset: 0,    color: '#0D0618' },
  { offset: 0.18, color: '#1A0A2E' },
  { offset: 0.38, color: '#3D0F6B' },
  { offset: 0.58, color: '#6B21A8' },
  { offset: 0.75, color: '#C9A84C' },
  { offset: 0.90, color: '#F5F0E8' },
  { offset: 1,    color: '#F5F0E800' },
]

const VBW = 1271
const VBH = 599
const GRADIENT_HEIGHT = '55vh'
const MIN_REVEAL = 0.04

function bellHeights(n: number, peak: number, valley: number) {
  const mid = (n - 1) / 2
  return Array.from({ length: n }, (_, i) => {
    const t = mid === 0 ? 0 : Math.abs(i - mid) / mid
    return peak * VBH * (valley + (1 - valley) * (1 - Math.pow(t, 1.24)))
  })
}

const COLS = [
  { title: 'Services', links: ['AI Integration', 'SaaS Development', 'Web Engineering', 'Automation', 'UI/UX Design'] },
  { title: 'Company',  links: ['About', 'Work', 'Process', 'Careers', 'Contact'] },
  { title: 'Legal',    links: ['Privacy', 'Terms', 'Cookies'] },
]

export default function Footer() {
  const uid     = useId().replace(/:/g, '')
  const bandRef = useRef<HTMLDivElement>(null)
  const [progress, setProgress] = useState(MIN_REVEAL)

  useEffect(() => {
    const el = bandRef.current
    if (!el) return
    const measure = () => {
      const h    = el.offsetHeight || 1
      const left = document.documentElement.scrollHeight - window.innerHeight - window.scrollY
      const t    = Math.max(0, Math.min(1, (h - left) / h))
      setProgress(MIN_REVEAL + (1 - MIN_REVEAL) * t)
    }
    measure()
    window.addEventListener('scroll', measure, { passive: true })
    window.addEventListener('resize', measure, { passive: true })
    return () => {
      window.removeEventListener('scroll', measure)
      window.removeEventListener('resize', measure)
    }
  }, [])

  const colW    = VBW / 9
  const heights = bellHeights(9, 0.95, 0.5)

  return (
    <footer style={{ paddingBottom: GRADIENT_HEIGHT }} className="bg-tyrian-void">
      {/* Content */}
      <div className="max-w-6xl mx-auto px-10 pt-24 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 pb-14 border-b border-tyrian-parchment/8">
          <div>
            <span className="font-cormorant text-3xl tracking-[0.3em] text-tyrian-parchment/80">EMBARC</span>
            <p className="font-satoshi text-xs text-tyrian-parchment/30 mt-5 leading-relaxed tracking-wide max-w-[200px]">
              AI-driven digital engineering for those who refuse the ordinary.
            </p>
            <div className="h-px w-10 bg-tyrian-gold/40 mt-6" />
          </div>
          {COLS.map(col => (
            <div key={col.title}>
              <h4 className="font-satoshi text-[9px] tracking-[0.35em] uppercase text-tyrian-gold/50 mb-5">
                {col.title}
              </h4>
              <ul className="flex flex-col gap-3">
                {col.links.map(link => (
                  <li key={link}>
                    <a href="#" className="font-satoshi text-xs text-tyrian-parchment/30 hover:text-tyrian-parchment/65 transition-colors duration-300 tracking-wide">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between pt-8">
          <span className="font-satoshi text-[10px] tracking-[0.25em] text-tyrian-parchment/18">
            © MMXXV EMBARC · All rights reserved
          </span>
          <span className="font-satoshi text-[10px] tracking-[0.25em] text-tyrian-parchment/18">
            Ahmedabad · Global
          </span>
        </div>
      </div>

      {/* Ruixen gradient reveal — pinned to viewport bottom */}
      <div ref={bandRef} aria-hidden style={{
        position: 'fixed', left: 0, right: 0, bottom: 0,
        height: GRADIENT_HEIGHT, pointerEvents: 'none',
        transformOrigin: 'bottom',
        transform: `scaleY(${progress})`,
        willChange: 'transform',
      }}>
        <svg style={{ height: '100%', width: '100%', display: 'block' }}
          viewBox={`0 0 ${VBW} ${VBH}`} preserveAspectRatio="none" fill="none">
          <defs>
            <linearGradient id={`g-${uid}`} x1="0" y1="1" x2="0" y2="0">
              {STOPS.map((s, i) => <stop key={i} offset={s.offset} stopColor={s.color} />)}
            </linearGradient>
            <filter id={`b-${uid}`} x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation={18} />
            </filter>
          </defs>
          {heights.map((h, i) => (
            <g key={i} filter={`url(#b-${uid})`}>
              <rect x={i * colW} y={VBH - h} width={colW * 1.23} height={h}
                fill={`url(#g-${uid})`} />
            </g>
          ))}
        </svg>
      </div>
    </footer>
  )
}