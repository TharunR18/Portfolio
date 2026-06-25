import React, { useRef, useEffect } from 'react'

interface Project {
  id: string
  title: string
  subtitle: string
  description: string
  videoUrl: string
  siteUrl: string
  techStack: string
}

const PROJECTS_DATA: Project[] = [
  {
    id: "01",
    title: "FileMerch",
    subtitle: "Digital Products Marketplace",
    description: "A full-stack digital marketplace where users can upload, sell, purchase, and instantly download digital products. Built with secure authentication, seller dashboards, payment integration, and a seamless shopping experience.",
    videoUrl: "/projects_Section_video/filemerch.mp4",
    siteUrl: "https://filemerch-r18.vercel.app/",
    techStack: "React • Node.js • MongoDB • Razorpay"
  },
  {
    id: "02",
    title: "Auth-R18",
    subtitle: "Secure Authentication System",
    description: "Secure MERN authentication system featuring JWT-based auth, email verification, password recovery and protected user sessions.",
    videoUrl: "/projects_Section_video/AuthR18.mp4",
    siteUrl: "https://authr18.vercel.app/",
    techStack: "React • Node.js • JWT • MongoDB"
  },
  {
    id: "03",
    title: "Pomodoro",
    subtitle: "Clean Productivity App",
    description: "Minimal productivity timer built with HTML, CSS and JavaScript, focused on clean design and user experience.",
    videoUrl: "/projects_Section_video/pomodoro.mp4",
    siteUrl: "https://pomodoro-r18.vercel.app/",
    techStack: "HTML • CSS • JavaScript"
  },
  {
    id: "04",
    title: "Task Tracker",
    subtitle: "Full-Stack Task Management",
    description: "Full-stack task management application built with MERN, featuring seamless CRUD operations and real-time data flow across the stack.",
    videoUrl: "/projects_Section_video/Task-Tracker.mp4",
    siteUrl: "https://mern-crud-web.vercel.app/",
    techStack: "React • Node.js • MongoDB • Express"
  }
]

export default function Projects() {
  return (
    <section className="relative w-full bg-white text-primary py-24 sm:py-32 border-t border-secondary/40 overflow-visible">

      {/* Editorial Header */}
      <div className="px-8 sm:px-24 mb-20 sm:mb-24 max-w-7xl mx-auto relative z-20 text-center flex flex-col items-center justify-center">
        <span className="font-sans text-xs tracking-[0.25em] uppercase text-accent font-semibold block mb-2">SELECTED WORKS</span>
        <h2 className="font-serif-editorial text-5xl sm:text-7xl italic font-normal tracking-wide text-primary">
          PROJECTS
        </h2>
      </div>

      {/* Cinematic Project Reveal Flow */}
      <div className="space-y-36 sm:space-y-48 relative z-20">
        {PROJECTS_DATA.map((project, index) => (
          <ProjectItem key={project.id} project={project} index={index} />
        ))}
      </div>
    </section>
  )
}

function ProjectItem({ project, index }: { project: Project; index: number }) {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    // Ensure the video is explicitly muted and configured to loop
    video.muted = true
    video.loop = true

    const playVideo = () => {
      video.play().catch(err => {
        console.warn("Autoplay failed or was blocked:", err)
      })
    }

    // Force play immediately, on metadata load, and resume if suspended
    playVideo()
    video.addEventListener('loadedmetadata', playVideo)
    video.addEventListener('suspend', playVideo)

    return () => {
      video.removeEventListener('loadedmetadata', playVideo)
      video.removeEventListener('suspend', playVideo)
    }
  }, [])

  return (
    <div
      className="scroll-snap-target w-full px-8 sm:px-24 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center"
    >
      {/* Project Specs - Left */}
      <div className="lg:col-span-4 space-y-6 order-2 lg:order-1">
        <div className="flex items-baseline space-x-3">
          <span className="font-serif-editorial text-3xl sm:text-4xl italic text-accent font-medium">
            {project.id}
          </span>
          <h3 className="font-serif-editorial text-4xl sm:text-5xl italic font-normal tracking-wide text-primary">
            {project.title}
          </h3>
        </div>

        <p className="font-sans text-primary/70 text-base leading-relaxed font-light">
          {project.description}
        </p>

        <div className="h-[1px] w-24 bg-accent/40" />
      </div>

      {/* Landscape Video Preview inside Space Gray iPad Mockup - Right */}
      <div className="lg:col-span-8 order-1 lg:order-2 space-y-4">
        <div className="relative w-full aspect-[16/10.5] rounded-[36px] bg-gradient-to-tr from-[#4a4a4c] via-[#7c7c80] to-[#5c5c5f] border-[3.5px] border-[#3a3a3c] p-3 sm:p-4 md:p-5 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.16)] flex items-center justify-center group transition-all duration-500 hover:scale-[1.01]">

          {/* Front Camera Lens Dot */}
          <div className="absolute left-[6px] sm:left-[8px] top-1/2 -translate-y-1/2 w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#0a0f1d] border border-blue-950/20 z-20" />

          {/* Main Clickable Screen Link */}
          <a
            href={project.siteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="relative w-full h-full block rounded-[18px] overflow-hidden bg-black"
          >
            <video
              ref={videoRef}
              src={project.videoUrl}
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover transition-all duration-700 filter saturate-[0.8] group-hover:saturate-[1.15] scale-100 group-hover:scale-[1.03]"
            />

            {/* Desktop Hover overlay with redirect indicator */}
            <div className="absolute inset-0 bg-black/45 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden lg:flex items-center justify-center z-30">
              <div className="w-14 h-14 rounded-full bg-white/95 text-primary flex items-center justify-center shadow-lg transform scale-75 group-hover:scale-100 transition-transform duration-300">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2.5}
                  stroke="currentColor"
                  className="w-6 h-6 text-primary"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                </svg>
              </div>
            </div>

            {/* Desktop Hover Tech Stack overlay */}
            <div className="absolute bottom-4 right-4 font-sans text-[10px] tracking-widest text-white/90 bg-black/75 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-30 font-semibold uppercase hidden lg:block">
              {project.techStack}
            </div>
          </a>
        </div>

        {/* Mobile Info Card - rendered below the video on viewports < lg */}
        <div className="flex lg:hidden items-center justify-between p-4 bg-[#F5F5F7] rounded-2xl border border-secondary/30 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
          <div className="flex flex-col space-y-1">
            <span className="font-sans text-[9px] tracking-widest uppercase text-accent font-bold">Tech Stack</span>
            <span className="font-sans text-xs text-primary/80 font-medium">
              {project.techStack}
            </span>
          </div>

          <a
            href={project.siteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center w-10 h-10 rounded-full bg-accent text-white shadow-md active:scale-95 transition-all"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2.5}
              stroke="currentColor"
              className="w-4 h-4"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  )
}
