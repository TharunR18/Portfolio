import React, { useRef, useState, useEffect } from 'react'
import { gsap } from 'gsap'

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null)
  const portraitRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const [hoverProgress, setHoverProgress] = useState(0) // 0 to 1
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [globalMousePos, setGlobalMousePos] = useState({ x: 0, y: 0 })
  const [scrollY, setScrollY] = useState(0)
  const [supportsHover, setSupportsHover] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  // Detect mobile view based on window width
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Auto reveal mask state & animation reference for inactive periods (such as on initial mobile visits)
  const [autoReveal, setAutoReveal] = useState({ x: 0, y: 0, radius: 0 })
  const autoRevealTlRef = useRef<gsap.core.Timeline | null>(null)

  useEffect(() => {
    // Only run auto-reveal on mobile view
    if (!isMobile) {
      killAutoReveal()
      return
    }

    const triggerAutoReveal = () => {
      // Do not auto-reveal if the user is already interacting/hovering
      if (hoverProgress > 0) return

      const portrait = portraitRef.current
      if (!portrait) return

      const width = portrait.clientWidth
      const height = portrait.clientHeight

      // Face center coordinates (roughly 50% width and 38% height of container)
      const faceX = width * 0.5
      const faceY = height * 0.38

      setAutoReveal({ x: faceX, y: faceY, radius: 0 })

      if (autoRevealTlRef.current) {
        autoRevealTlRef.current.kill()
      }

      const animObj = { radius: 0 }
      const tl = gsap.timeline()
      autoRevealTlRef.current = tl

      tl.to(animObj, {
        radius: 300, // Expand radius (increased to 300)
        duration: 1.2,
        ease: 'power2.out',
        onUpdate: () => {
          setAutoReveal({ x: faceX, y: faceY, radius: animObj.radius })
        }
      })
        .to(animObj, {
          radius: 0, // Contract back to 0
          duration: 1.2,
          ease: 'power2.in',
          delay: 0.8, // Hold open
          onUpdate: () => {
            setAutoReveal({ x: faceX, y: faceY, radius: animObj.radius })
          },
          onComplete: () => {
            autoRevealTlRef.current = null
          }
        })
    }

    // Trigger initially after 3 seconds on mount
    const initialTimeout = setTimeout(triggerAutoReveal, 3000)

    // Repeat every 7 seconds
    const interval = setInterval(triggerAutoReveal, 7000)

    return () => {
      clearTimeout(initialTimeout)
      clearInterval(interval)
      if (autoRevealTlRef.current) {
        autoRevealTlRef.current.kill()
      }
    }
  }, [hoverProgress, isMobile])

  // Track hover capability of device
  useEffect(() => {
    const hoverMediaQuery = window.matchMedia('(hover: hover)')
    setSupportsHover(hoverMediaQuery.matches)

    const handleChange = (e: MediaQueryListEvent) => {
      setSupportsHover(e.matches)
    }
    hoverMediaQuery.addEventListener('change', handleChange)
    return () => hoverMediaQuery.removeEventListener('change', handleChange)
  }, [])

  // Track scroll for parallax
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Topographic background contour canvas
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrameId: number
    let offset = 0

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const drawContours = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.strokeStyle = 'rgba(200, 165, 90, 0.16)' // Softened gold lines (opacity 0.16)
      ctx.lineWidth = 1.2

      const numLines = 8
      const center = { x: canvas.width / 2, y: canvas.height * 0.45 }

      for (let i = 0; i < numLines; i++) {
        ctx.beginPath()
        const radius = (canvas.width * 0.08) + i * 110 + Math.sin(offset + i * 0.4) * 15

        for (let angle = 0; angle <= Math.PI * 2; angle += 0.04) {
          const noise = Math.sin(angle * 5 + offset + i) * 25 + Math.cos(angle * 2.5 - offset) * 12
          const x = center.x + Math.cos(angle) * (radius + noise)
          const y = center.y + Math.sin(angle) * (radius + noise)

          if (angle === 0) {
            ctx.moveTo(x, y)
          } else {
            ctx.lineTo(x, y)
          }
        }
        ctx.closePath()
        ctx.stroke()
      }

      offset += 0.002
      animationFrameId = requestAnimationFrame(drawContours)
    }

    drawContours()

    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    window.addEventListener('resize', handleResize)

    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  const killAutoReveal = () => {
    if (autoRevealTlRef.current) {
      autoRevealTlRef.current.kill()
      autoRevealTlRef.current = null
    }
    setAutoReveal({ x: 0, y: 0, radius: 0 })
  }

  // Calculate coordinates relative to the portrait container for perfect accuracy
  const updatePos = (clientX: number, clientY: number) => {
    if (isMobile) return // Disable interactions in mobile view
    killAutoReveal()
    if (containerRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect()
      setGlobalMousePos({
        x: clientX - containerRect.left,
        y: clientY - containerRect.top
      })
    }

    if (!portraitRef.current) return
    const rect = portraitRef.current.getBoundingClientRect()
    const x = clientX - rect.left
    const y = clientY - rect.top
    setMousePos({ x, y })
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isMobile) return // Disable hover in mobile view
    updatePos(e.clientX, e.clientY)
    setHoverProgress(1)
  }

  const handleMouseLeave = () => {
    if (isMobile) return // Disable hover in mobile view
    setHoverProgress(0)
  }

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (isMobile) return // Disable touch drag in mobile view
    if (e.touches.length === 0) return
    updatePos(e.touches[0].clientX, e.touches[0].clientY)
    setHoverProgress(1)
  }

  const handleTouchEnd = () => {
    if (isMobile) return // Disable touch drag in mobile view
    setHoverProgress(0)
  }

  // Circular clip-path mask - 65px radius for desktop hover
  const circleRadius = 65
  const maskStyle: React.CSSProperties = hoverProgress > 0 ? {
    maskImage: `radial-gradient(circle ${circleRadius}px at ${mousePos.x}px ${mousePos.y}px, black 65%, transparent 100%)`,
    WebkitMaskImage: `radial-gradient(circle ${circleRadius}px at ${mousePos.x}px ${mousePos.y}px, black 65%, transparent 100%)`
  } : autoReveal.radius > 0 ? {
    maskImage: `radial-gradient(circle ${autoReveal.radius}px at ${autoReveal.x}px ${autoReveal.y}px, black 65%, transparent 100%)`,
    WebkitMaskImage: `radial-gradient(circle ${autoReveal.radius}px at ${autoReveal.x}px ${autoReveal.y}px, black 65%, transparent 100%)`
  } : {
    maskImage: `radial-gradient(circle 0px at 50% 50%, black 0%, transparent 0%)`,
    WebkitMaskImage: `radial-gradient(circle 0px at 50% 50%, black 0%, transparent 0%)`
  }

  // Parallax offsets
  const portraitTranslateY = scrollY * 0.12

  return (
    <section
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchMove}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className="relative w-full h-[100vh] bg-white flex flex-col justify-start items-center overflow-hidden select-none"
    >
      {/* Background Canvas with forced GPU composite layer to prevent subpixel line shearing */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-0 transform-gpu"
        style={{ transform: 'translate3d(0,0,0)' }}
      />

      {/* 
        Silhouette Portrait relative container:
        - Added transform-gpu and translate3d layer separation to prevent Chromium rendering bugs.
        - Fades smoothly at the bottom boundaries.
      */}
      <div
        ref={portraitRef}
        className="absolute bottom-0 w-[100vw] sm:w-[92vw] md:w-[80vw] lg:w-[62vw] xl:w-[50vw] h-[85vh] sm:h-[95vh] max-h-[960px] pointer-events-none z-20 transition-transform duration-75 ease-out transform-gpu"
        style={{
          transform: `translateY(${portraitTranslateY}px) translate3d(0,0,0)`,
          maskImage: 'linear-gradient(to bottom, black 70%, transparent 98%)',
          WebkitMaskImage: 'linear-gradient(to bottom, black 70%, transparent 98%)'
        }}
      >
        {/* Human Base Image */}
        <img
          src="/hero_section_img/human.png"
          alt="Tharun.R Human Cutout"
          className="absolute inset-0 w-full h-full object-cover object-[center_12%] select-none"
        />

        {/* AI Overlay Image with Hover Mask */}
        <img
          src="/hero_section_img/robot.png"
          alt="Tharun.R Premium Corporate AI Cutout"
          className="absolute inset-0 w-full h-full object-cover object-[center_12%] select-none"
          style={maskStyle}
        />
      </div>
    </section>
  )
}
