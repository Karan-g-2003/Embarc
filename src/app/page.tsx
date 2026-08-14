import Navbar       from '@/components/layout/Navbar'
import Hero         from '@/components/sections/Hero'
import Stats        from '@/components/sections/Stats'
import Services     from '@/components/sections/Services'
import Work         from '@/components/sections/Work'
import About        from '@/components/sections/About'
import Testimonials from '@/components/sections/Testimonials'
import Contact      from '@/components/sections/Contact'
import Footer       from '@/components/sections/Footer'

export default function Home() {
  return (
    <main style={{ position: 'relative', zIndex: 1 }}>
      <Navbar />
      <Hero />
      <Stats />
      <Services />
      <Work />
      <About />
      <Testimonials />
      <Contact />
      <Footer />
    </main>
  )
}