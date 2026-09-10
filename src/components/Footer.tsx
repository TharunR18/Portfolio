import React from 'react'

export default function Footer() {
  return (
    <footer className="relative w-full h-[100vh] bg-black text-white overflow-hidden select-none">

      {/* Background Looping 3D Cartoon video (Full Color) */}
      <div className="absolute inset-0 w-full h-full z-0 opacity-90 pointer-events-none">
        <video
          src="/footer video.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover filter brightness-100 contrast-100"
        />
      </div>

      {/* Vertical Social Channels (Left Side) */}
      <div className="absolute left-6 sm:left-12 top-[42%] -translate-y-1/2 z-20 flex flex-col items-center space-y-6">
        <a
          href="https://github.com/TharunR18"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:scale-110 transition-transform duration-300 block"
        >
          <img
            src="https://skillicons.dev/icons?i=github"
            alt="GitHub"
            className="w-9 h-9 object-contain"
          />
        </a>
        <a
          href="mailto:tharunr.dev@gmail.com"
          className="hover:scale-110 transition-transform duration-300 block"
        >
          <img
            src="https://skillicons.dev/icons?i=gmail"
            alt="Gmail"
            className="w-9 h-9 object-contain"
          />
        </a>
        <a
          href="https://linkedin.com/in/tharun2007"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:scale-110 transition-transform duration-300 block"
        >
          <img
            src="https://skillicons.dev/icons?i=linkedin"
            alt="LinkedIn"
            className="w-9 h-9 object-contain"
          />
        </a>
      </div>



      {/* Massive edge-to-edge typography foreground with centered "Crafted by" label directly above it */}
      <div className="absolute bottom-6 sm:bottom-8 left-0 w-full z-10 pointer-events-none px-0 flex flex-col items-center justify-end select-none">
        <span className="font-sans text-[10px] sm:text-xs tracking-[0.3em] uppercase text-white/35 font-semibold mb-2 sm:mb-4">
          Crafted by
        </span>
        <h1 className="font-serif-editorial text-[24vw] sm:text-[18vw] lg:text-[20vw] leading-none tracking-[0.18em] sm:tracking-[0.22em] lg:tracking-[0.25em] mr-[-0.18em] sm:mr-[-0.22em] lg:mr-[-0.25em] font-bold text-white/15 uppercase w-full text-center whitespace-nowrap">
          THARUN
        </h1>
      </div>

    </footer>
  )
}
