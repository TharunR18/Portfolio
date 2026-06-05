import React, { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function About() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const sectionRef = useRef<HTMLDivElement>(null)
  const block1Ref = useRef<HTMLDivElement>(null)
  const block2Ref = useRef<HTMLDivElement>(null)
  const block3Ref = useRef<HTMLDivElement>(null)

  // Floating background particles
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrameId: number

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const particles: Array<{
      x: number
      y: number
      radius: number
      speedY: number
      speedX: number
      opacity: number
    }> = []

    const particleCount = 40

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 1.5 + 0.5,
        speedY: -(Math.random() * 0.2 + 0.05),
        speedX: (Math.random() * 0.1 - 0.05),
        opacity: Math.random() * 0.2 + 0.05
      })
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      particles.forEach(p => {
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(200, 165, 90, ${p.opacity})` // Warm gold embers
        ctx.fill()

        p.y += p.speedY
        p.x += p.speedX

        if (p.y < 0) {
          p.y = canvas.height
          p.x = Math.random() * canvas.width
        }
        if (p.x < 0 || p.x > canvas.width) {
          p.x = Math.random() * canvas.width
        }
      })

      animationFrameId = requestAnimationFrame(animate)
    }

    animate()

    const handleResize = () => {
      if (!canvas) return
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    window.addEventListener('resize', handleResize)

    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  // Terminal Typing & Scroll Reveal Timeline
  useEffect(() => {
    const section = sectionRef.current
    const b1 = block1Ref.current
    const b2 = block2Ref.current
    const b3 = block3Ref.current

    if (!section || !b1 || !b2 || !b3) return

    // Scrubbed scroll reveal timeline
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top 75%',
        end: 'bottom 92%',
        scrub: 1
      }
    })

    // Block 1 (whoami) reveal
    tl.to(b1, { opacity: 1, y: 0, duration: 0.4 })
      .to(b1.querySelectorAll('.char'), {
        opacity: 1,
        stagger: 0.04,
        duration: 0.2
      }, '+=0.05')
      .to(b1.querySelectorAll('.word'), {
        opacity: 1,
        filter: 'blur(0px)',
        stagger: 0.035,
        duration: 0.6
      }, '+=0.1')

    // Block 2 (mindset) reveal
    tl.to(b2, { opacity: 1, y: 0, duration: 0.4 }, '+=0.3')
      .to(b2.querySelectorAll('.char'), {
        opacity: 1,
        stagger: 0.04,
        duration: 0.2
      }, '+=0.05')
      .to(b2.querySelectorAll('.word'), {
        opacity: 1,
        filter: 'blur(0px)',
        stagger: 0.035,
        duration: 0.6
      }, '+=0.1')

    // Block 3 (future) reveal
    tl.to(b3, { opacity: 1, y: 0, duration: 0.4 }, '+=0.3')
      .to(b3.querySelectorAll('.char'), {
        opacity: 1,
        stagger: 0.04,
        duration: 0.2
      }, '+=0.05')
      .to(b3.querySelectorAll('.word'), {
        opacity: 1,
        filter: 'blur(0px)',
        stagger: 0.035,
        duration: 0.6
      }, '+=0.1')

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill())
    }
  }, [])

  return (
    <section 
      ref={sectionRef}
      className="relative w-full min-h-[135vh] bg-black text-white py-48 flex flex-col justify-center items-center select-none overflow-visible"
    >


      {/* Background canvas for subtle space particles */}
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 w-full h-full pointer-events-none z-0 opacity-60"
      />

      {/* Radial warm gold glow in the center */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(200,165,90,0.05)_0%,transparent_65%)] pointer-events-none z-0" />

      {/* Left Aligned content wrapper */}
      <div className="max-w-3xl w-full px-8 sm:px-12 flex flex-col justify-start items-start text-left z-10 space-y-16">
        
        {/* Section Label */}
        <div className="w-full flex flex-col items-center justify-center text-center select-none mb-6">
          <h2 className="font-serif-editorial text-5xl sm:text-7xl italic font-normal tracking-wide text-accent">
            ABOUT ME
          </h2>
          <div className="h-[1px] w-24 bg-accent/20 mt-6" />
        </div>

        {/* Story Blocks Container */}
        <div className="w-full space-y-24">

          {/* Block 1 (whoami) */}
          <div ref={block1Ref} className="w-full space-y-5 opacity-0 transform translate-y-6">
          
          {/* Prompt */}
          <div className="flex items-center space-x-3 text-xs sm:text-sm font-semibold select-none">
            <span className="font-satoshi text-accent/70 tracking-[0.05em]">
              about@tharun:~$
            </span>
            <span className="font-clash text-white tracking-widest text-sm uppercase">
              {"whoami".split("").map((char, i) => (
                <span key={i} className="inline-block opacity-0 char">
                  {char}
                </span>
              ))}
            </span>
          </div>

          {/* Response text */}
          <p className="font-clash text-3xl sm:text-4xl lg:text-[42px] font-medium text-[#F5F5F5] leading-tight">
            {"I'm a Computer Science student with a strong interest in tech, problem-solving, and building meaningful digital experiences.".split(" ").map((word, i) => (
              <span key={i} className="inline-block opacity-10 mr-3.5 word blur-[8px] transition-all duration-300">
                {word}
              </span>
            ))}
          </p>

        </div>

        {/* Block 2 (mindset) */}
        <div ref={block2Ref} className="scroll-snap-target w-full space-y-5 opacity-0 transform translate-y-6">
          
          {/* Prompt */}
          <div className="flex items-center space-x-3 text-xs sm:text-sm font-semibold select-none">
            <span className="font-satoshi text-accent/70 tracking-[0.05em]">
              about@tharun:~$
            </span>
            <span className="font-clash text-white tracking-widest text-sm uppercase">
              {"mindset".split("").map((char, i) => (
                <span key={i} className="inline-block opacity-0 char">
                  {char}
                </span>
              ))}
            </span>
          </div>

          {/* Response text */}
          <p className="font-clash text-3xl sm:text-4xl lg:text-[42px] font-medium text-[#F5F5F5] leading-tight">
            {"I'm a person who enjoys learning new things and improving every day.".split(" ").map((word, i) => (
              <span key={i} className="inline-block opacity-10 mr-3.5 word blur-[8px] transition-all duration-300">
                {word}
              </span>
            ))}
          </p>

        </div>

        {/* Block 3 (future) */}
        <div ref={block3Ref} className="scroll-snap-target w-full space-y-5 opacity-0 transform translate-y-6">
          
          {/* Prompt */}
          <div className="flex items-center space-x-3 text-xs sm:text-sm font-semibold select-none">
            <span className="font-satoshi text-accent/70 tracking-[0.05em]">
              about@tharun:~$
            </span>
            <span className="font-clash text-white tracking-widest text-sm uppercase">
              {"future".split("").map((char, i) => (
                <span key={i} className="inline-block opacity-0 char">
                  {char}
                </span>
              ))}
            </span>
          </div>

          {/* Response text */}
          <p className="font-clash text-3xl sm:text-4xl lg:text-[42px] font-medium text-[#F5F5F5] leading-tight">
            {"I'm always open to exploring new tools and technologies to contribute better and continue growing.".split(" ").map((word, i) => (
              <span key={i} className="inline-block opacity-10 mr-3.5 word blur-[8px] transition-all duration-300">
                {word}
              </span>
            ))}
          </p>

        </div>

        </div>
      </div>

    </section>
  )
}
