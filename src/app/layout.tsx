import type { Metadata } from 'next'
import { Cormorant_Garamond } from 'next/font/google'
import SceneBackground from '@/components/layout/SceneBackground'
import LenisProvider   from '@/components/providers/LenisProvider'
import CustomCursor    from '@/components/layout/CustomCursor'
import './globals.css'

const cormorant = Cormorant_Garamond({
  subsets:  ['latin'],
  weight:   ['300', '400', '500', '600', '700'],
  style:    ['normal', 'italic'],
  variable: '--font-cormorant-garamond',
  display:  'swap',
})

export const metadata: Metadata = {
  title:       'EMBARC — Where the new era begins.',
  description: 'AI-driven SaaS, automation, and web engineering. Built for those who demand the rare.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={cormorant.variable}>
      <head>
        <link
          href="https://api.fontshare.com/v2/css?f[]=satoshi@300,400,500,700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-tyrian-void text-tyrian-parchment font-satoshi antialiased">
        <SceneBackground />
        <CustomCursor />
        <LenisProvider>
          {children}
        </LenisProvider>
      </body>
    </html>
  )
}