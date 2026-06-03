import React, { useEffect, useState } from 'react'

interface LoadingScreenProps {
  onComplete: () => void
}

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [progress, setProgress] = useState(1)
  const [isDone, setIsDone] = useState(false)
  const [isSlidingUp, setIsSlidingUp] = useState(false)

  useEffect(() => {
    const duration = 2000 // 2 seconds
    const intervalTime = 20
    const steps = duration / intervalTime
    const increment = 100 / steps
    
    let current = 1
    const timer = setInterval(() => {
      current += increment
      if (current >= 100) {
        current = 100
        clearInterval(timer)
        setIsDone(true)
      }
      setProgress(Math.floor(current))
    }, intervalTime)

    return () => clearInterval(timer)
  }, [])

  const handleEnter = () => {
    const docEl = document.documentElement
    if (docEl.requestFullscreen) {
      docEl.requestFullscreen().catch((err) => {
        console.warn("Fullscreen request rejected:", err)
      })
    } else if ((docEl as any).mozRequestFullScreen) {
      (docEl as any).mozRequestFullScreen()
    } else if ((docEl as any).webkitRequestFullscreen) {
      (docEl as any).webkitRequestFullscreen()
    } else if ((docEl as any).msRequestFullscreen) {
      (docEl as any).msRequestFullscreen()
    }
    setIsSlidingUp(true)
  }

  // Call onComplete after the 1000ms slide-up transition finishes
  useEffect(() => {
    if (isSlidingUp) {
      const finishTimer = setTimeout(() => {
        onComplete()
      }, 1000)
      return () => clearTimeout(finishTimer)
    }
  }, [isSlidingUp, onComplete])

  return (
    <div 
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white text-primary p-12 select-none transform transition-transform duration-1000"
      style={{
        transform: isSlidingUp ? 'translateY(-100%)' : 'translateY(0%)',
        transitionTimingFunction: 'cubic-bezier(0.85, 0, 0.15, 1)'
      }}
    >
      {/* Middle Counter (Centered Vertically) */}
      <div className="flex flex-col items-center justify-center space-y-4">
        <h1 className="font-serif-editorial text-5xl sm:text-7xl italic font-normal tracking-wide text-primary">
          TR
        </h1>
        <div className="h-[1px] w-48 bg-secondary relative overflow-hidden">
          <div 
            className="absolute left-0 top-0 h-full bg-accent transition-all duration-75"
            style={{ width: `${progress}%` }}
          />
        </div>
        {isDone ? (
          <button 
            onClick={handleEnter}
            className="font-serif-editorial text-xl sm:text-2xl italic tracking-widest px-8 py-2.5 bg-primary text-white hover:bg-accent hover:text-primary rounded-full transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer mt-2"
          >
            ENTER PORTFOLIO
          </button>
        ) : (
          <div className="font-sans text-sm tracking-widest text-accent font-semibold transition-all duration-300">
            {progress}%
          </div>
        )}
      </div>
    </div>
  )
}
