import React, { useState, useEffect } from 'react'
import Lenis from '@studio-freight/lenis'
import LoadingScreen from './components/LoadingScreen'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Projects from './components/Projects'
import SkillsOrbit from './components/SkillsOrbit'
import Footer from './components/Footer'

export default function App() {
  const [loading, setLoading] = useState(true)
  const [unmountLoader, setUnmountLoader] = useState(false)
  const [mousePos, setMousePos] = useState({ x: -100, y: -100 })
  const [supportsHover, setSupportsHover] = useState(false)
  const [isHoveredInteractive, setIsHoveredInteractive] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [hideProgressBar, setHideProgressBar] = useState(false)

  // Track page scroll progress percentage
  useEffect(() => {
    const handleScrollProgress = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight
      if (totalScroll <= 0) {
        setScrollProgress(0)
        setHideProgressBar(false)
        return
      }
      const scrollPos = window.scrollY
      const progress = (scrollPos / totalScroll) * 100
      setScrollProgress(progress)

      // Hide progress bar when entering the footer section (the last viewport height of the page)
      const footerThreshold = totalScroll - window.innerHeight * 0.9
      setHideProgressBar(scrollPos >= footerThreshold)
    }

    window.addEventListener('scroll', handleScrollProgress, { passive: true })
    window.addEventListener('resize', handleScrollProgress, { passive: true })
    handleScrollProgress()

    return () => {
      window.removeEventListener('scroll', handleScrollProgress)
      window.removeEventListener('resize', handleScrollProgress)
    }
  }, [])

  // Force scroll to top on mount and prevent browser scroll restoration
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual'
    }
    window.scrollTo(0, 0)
  }, [])

  // Initialize Lenis Smooth Scroll with Snapping when loaded
  useEffect(() => {
    if (loading) return

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      wheelMultiplier: 1.1,
      infinite: false,
    })

    // Instantly snap to the top hero section on load completion
    lenis.scrollTo(0, { immediate: true })

    function raf(time: number) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)

    // Scroll snapping tracking states
    let snapTimeout: number | undefined
    let isProgrammaticScroll = false

    const handleScroll = (e: any) => {
      if (snapTimeout) {
        clearTimeout(snapTimeout)
      }

      // If we are scrolling programmatically due to active snapping, skip triggering
      if (isProgrammaticScroll) {
        if (Math.abs(e.velocity) < 0.05) {
          isProgrammaticScroll = false
        }
        return
      }

      // Settle wait time (350ms ensures natural scroll inertia is completed before snapping starts)
      snapTimeout = window.setTimeout(() => {
        snapToNearestSection()
      }, 350)
    }

    const snapToNearestSection = () => {
      const scrollPos = window.scrollY
      const targets = document.querySelectorAll('.scroll-snap-target')
      if (targets.length === 0) return

      let closestTarget: HTMLElement | null = null
      let minDistance = Infinity
      let targetScrollPosition = 0

      const viewHeight = window.innerHeight

      targets.forEach(node => {
        const el = node as HTMLElement
        const top = el.getBoundingClientRect().top + window.scrollY
        const elHeight = el.offsetHeight

        let targetScroll = top
        if (elHeight < viewHeight * 0.85) {
          // Center shorter sections/elements vertically in the viewport
          targetScroll = top - (viewHeight - elHeight) / 2
        }
        targetScroll = Math.max(0, targetScroll)

        const distance = Math.abs(targetScroll - scrollPos)
        if (distance < minDistance) {
          minDistance = distance
          closestTarget = el
          targetScrollPosition = targetScroll
        }
      })

      if (closestTarget && Math.abs(scrollPos - targetScrollPosition) > 10) {
        isProgrammaticScroll = true
        lenis.scrollTo(targetScrollPosition, {
          duration: 1.0,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // align with scroll physics
          onComplete: () => {
            setTimeout(() => {
              isProgrammaticScroll = false
            }, 100)
          }
        })
      }
    }

    // Reset snap status immediately upon any manual user interaction to prevent scroll lock fights
    const resetProgrammatic = () => {
      isProgrammaticScroll = false
      if (snapTimeout) {
        clearTimeout(snapTimeout)
      }
    }

    lenis.on('scroll', handleScroll)

    window.addEventListener('wheel', resetProgrammatic, { passive: true })
    window.addEventListener('touchmove', resetProgrammatic, { passive: true })
    window.addEventListener('keydown', resetProgrammatic, { passive: true })

    return () => {
      lenis.destroy()
      if (snapTimeout) clearTimeout(snapTimeout)
      window.removeEventListener('wheel', resetProgrammatic)
      window.removeEventListener('touchmove', resetProgrammatic)
      window.removeEventListener('keydown', resetProgrammatic)
    }
  }, [loading])

  // Track hover capability
  useEffect(() => {
    const hoverMediaQuery = window.matchMedia('(hover: hover)')
    setSupportsHover(hoverMediaQuery.matches)
    const handleChange = (e: MediaQueryListEvent) => {
      setSupportsHover(e.matches)
    }
    hoverMediaQuery.addEventListener('change', handleChange)
    return () => hoverMediaQuery.removeEventListener('change', handleChange)
  }, [])

  // Track global mouse position and hover states
  useEffect(() => {
    if (!supportsHover) return

    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY })
    }

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (
        target.tagName === 'A' ||
        target.tagName === 'BUTTON' ||
        target.closest('a') ||
        target.closest('button') ||
        target.closest('.cursor-pointer') ||
        target.closest('input') ||
        target.closest('textarea')
      ) {
        setIsHoveredInteractive(true)
      } else {
        setIsHoveredInteractive(false)
      }
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseover', handleMouseOver)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseover', handleMouseOver)
    }
  }, [supportsHover])

  return (
    <div className={`relative w-full min-h-screen bg-white ${supportsHover ? 'cursor-none' : ''}`}>
      {/* Floating Navbar */}
      <Navbar />

      {/* Custom Scroll Progress Bar */}
      {unmountLoader && (
        <div className={`fixed right-3 sm:right-5 top-[10vh] h-[80vh] w-1 sm:w-1.5 bg-neutral-500/10 backdrop-blur-[2px] rounded-full border border-neutral-500/10 z-50 pointer-events-none transition-all duration-500 ${
          hideProgressBar ? 'opacity-0 scale-95 translate-x-4' : 'opacity-100 scale-100'
        }`}>
          <div 
            className="w-full bg-accent rounded-full shadow-[0_0_12px_rgba(200,165,90,0.8)] transition-all duration-75 ease-out"
            style={{ 
              height: `${scrollProgress}%`,
              willChange: 'height'
            }}
          />
        </div>
      )}

      {/* Hero Section */}
      <div className="scroll-snap-target w-full">
        <Hero />
      </div>

      {/* About Section */}
      <div className="scroll-snap-target w-full">
        <About />
      </div>

      {/* Projects Section */}
      <div className="scroll-snap-target w-full">
        <Projects />
      </div>

      {/* Skills Orbit Section */}
      <div className="scroll-snap-target w-full">
        <SkillsOrbit />
      </div>

      {/* Full-screen Footer */}
      <div className="scroll-snap-target w-full">
        <Footer />
      </div>

      {/* Global custom gold cursor dot (only rendered on hoverable desktop platforms) */}
      {supportsHover && (
        <div 
          className="fixed w-3.5 h-3.5 bg-accent rounded-full pointer-events-none z-[9999] shadow-sm transition-transform duration-100 ease-out"
          style={{
            left: mousePos.x,
            top: mousePos.y,
            transform: `translate(-50%, -50%) scale(${isHoveredInteractive ? 1.6 : 1})`,
          }}
        />
      )}

      {/* Loading Screen Overlay - rendered on top, slides up and unmounts */}
      {!unmountLoader && (
        <LoadingScreen 
          onComplete={() => {
            setLoading(false)
            setUnmountLoader(true)
          }} 
        />
      )}
    </div>
  )
}
