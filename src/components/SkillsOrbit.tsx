import React, { useState, useEffect } from 'react'

const SKILLS = [
  "HTML", "CSS", "JavaScript", "React", "Node.js", 
  "Express", "MongoDB", "Tailwind", "Python", "Git", 
  "GitHub", "Postman", "VS Code", "MySQL", "Vite"
]

// Slug mapping dictionary for skillicons.dev CDN
const ICON_SLUGS: Record<string, string> = {
  "HTML": "html",
  "CSS": "css",
  "JavaScript": "js",
  "React": "react",
  "Node.js": "nodejs",
  "Express": "express",
  "MongoDB": "mongodb",
  "Tailwind": "tailwind",
  "Python": "python",
  "Git": "git",
  "GitHub": "github",
  "Postman": "postman",
  "VS Code": "vscode",
  "MySQL": "mysql",
  "Vite": "vite"
}

export default function SkillsOrbit() {
  const [isPaused, setIsPaused] = useState(false)
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null)

  return (
    <section className="w-full min-h-[100vh] bg-white text-primary py-24 flex flex-col items-center justify-center select-none overflow-hidden relative">
      
      {/* Smooth hardware-accelerated styles for orbital physics */}
      <style>{`
        @keyframes orbit-spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes orbit-spin-reverse {
          0% { transform: translate(-50%, -50%) rotate(360deg); }
          100% { transform: translate(-50%, -50%) rotate(0deg); }
        }
        @keyframes orbit-spin-reverse-center {
          0% { transform: rotate(360deg); }
          100% { transform: rotate(0deg); }
        }
        .animate-orbit {
          animation: orbit-spin 22s linear infinite;
          will-change: transform;
        }
        .animate-orbit-reverse {
          animation: orbit-spin-reverse 22s linear infinite;
          will-change: transform;
        }
        .animate-orbit-reverse-center {
          animation: orbit-spin-reverse-center 22s linear infinite;
          will-change: transform;
        }
        .orbit-paused, 
        .orbit-paused .animate-orbit-reverse, 
        .orbit-paused .animate-orbit-reverse-center {
          animation-play-state: paused !important;
        }
      `}</style>

      {/* Refined Header: Skills & Tools title. Removed tech stack and helper texts */}
      <div className="text-center mb-16 space-y-3 z-10 px-8">
        <h2 className="font-serif-editorial text-5xl sm:text-7xl italic font-normal tracking-wide text-primary">
          Skills & Tools
        </h2>
      </div>

      {/* Orbit System Container */}
      <div 
        className={`relative w-[300px] h-[300px] sm:w-[600px] sm:h-[600px] flex items-center justify-center border border-secondary/35 rounded-full animate-orbit ${
          isPaused ? 'orbit-paused' : ''
        }`}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => {
          setIsPaused(false)
          setActiveTooltip(null)
        }}
      >
        {/* Outer Orbit Helper lines */}
        <div className="absolute w-[80%] h-[80%] border border-secondary/30 rounded-full pointer-events-none" />
        <div className="absolute w-[50%] h-[50%] border border-secondary/20 rounded-full pointer-events-none" />

        {/* Center: SKILLS (Counter-rotated to remain upright, without translation offset) */}
        <div className="z-10 bg-white border border-accent/40 shadow-[0_0_30px_rgba(200,165,90,0.15)] w-20 h-20 sm:w-32 sm:h-32 rounded-full flex flex-col items-center justify-center relative animate-orbit-reverse-center">
          <span className="font-serif-editorial text-sm sm:text-2xl italic tracking-wider text-accent font-semibold">
            SKILLS
          </span>
        </div>

        {/* Orbiting technology nodes with local tooltips */}
        {SKILLS.map((skill, index) => {
          const total = SKILLS.length
          const ring = index % 3
          let radiusPercent = 0.92 // outer ring
          if (ring === 0) radiusPercent = 0.48 // inner ring
          if (ring === 1) radiusPercent = 0.70 // mid ring

          const baseAngle = (index / total) * Math.PI * 2

          // Radial coordinates
          const leftOffset = 50 + Math.cos(baseAngle) * (radiusPercent * 50)
          const topOffset = 50 + Math.sin(baseAngle) * (radiusPercent * 50)

          const slug = ICON_SLUGS[skill] || 'html'

          return (
            <div
              key={skill}
              onMouseEnter={() => setActiveTooltip(skill)}
              onMouseLeave={() => setActiveTooltip(null)}
              className="absolute -translate-x-1/2 -translate-y-1/2 bg-white hover:bg-secondary text-primary/70 transition-all duration-300 w-9 h-9 sm:w-12 sm:h-12 rounded-full flex items-center justify-center border border-secondary/80 hover:scale-110 shadow-sm cursor-pointer p-1 z-20 animate-orbit-reverse"
              style={{
                left: `${leftOffset}%`,
                top: `${topOffset}%`,
              }}
            >
              <img 
                src={`https://skillicons.dev/icons?i=${slug}`} 
                alt={skill} 
                className="w-5 h-5 sm:w-8 sm:h-8 object-contain pointer-events-none select-none"
              />

              {/* Tooltip positioned directly above the hovered icon */}
              {activeTooltip === skill && (
                <span className="absolute bottom-[115%] left-1/2 -translate-x-1/2 font-sans text-[10px] tracking-widest text-accent uppercase font-bold whitespace-nowrap bg-white/95 px-2.5 py-1.5 rounded-md border border-secondary/40 shadow-md z-30">
                  {skill}
                </span>
              )}
            </div>
          )
        })}

      </div>
    </section>
  )
}
