"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import { motion, useInView } from "framer-motion"
import { Play, Pause, Volume2, VolumeX } from "lucide-react"

interface VideoPlayerProps {
  videoSrc: string
  posterSrc?: string
  title: string
  className?: string
  autoplay?: boolean
  onError?: () => void
}

export function VideoPlayer({
  videoSrc,
  posterSrc,
  title,
  className = "",
  autoplay = false,
  onError,
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(true)
  const [progress, setProgress] = useState(0)
  const isInView = useInView(containerRef, { once: false, amount: 0.5 })

  // Handle autoplay when in view
  useEffect(() => {
    if (!videoRef.current) return

    if (isInView && autoplay && !isPlaying) {
      videoRef.current.play().catch(() => {
        // Autoplay might be blocked, do nothing
      })
      setIsPlaying(true)
    }

    if (!isInView && isPlaying) {
      videoRef.current.pause()
      setIsPlaying(false)
    }
  }, [isInView, autoplay, isPlaying])

  // Update progress bar
  useEffect(() => {
    if (!videoRef.current) return

    const updateProgress = () => {
      if (videoRef.current) {
        const { currentTime, duration } = videoRef.current
        setProgress((currentTime / duration) * 100 || 0)
      }
    }

    const video = videoRef.current
    video.addEventListener("timeupdate", updateProgress)

    // Add event listeners to sync state with video
    video.addEventListener("play", () => setIsPlaying(true))
    video.addEventListener("pause", () => setIsPlaying(false))
    video.addEventListener("ended", () => setIsPlaying(false))

    return () => {
      video.removeEventListener("timeupdate", updateProgress)
      video.removeEventListener("play", () => setIsPlaying(true))
      video.removeEventListener("pause", () => setIsPlaying(false))
      video.removeEventListener("ended", () => setIsPlaying(false))
    }
  }, [])

  const togglePlay = () => {
    if (!videoRef.current) return

    if (isPlaying) {
      videoRef.current.pause()
    } else {
      videoRef.current.play().catch((e) => {
        console.error("Error playing video:", e)
      })
    }
    // State will be updated by event listeners
  }

  const toggleMute = () => {
    if (!videoRef.current) return

    videoRef.current.muted = !isMuted
    setIsMuted(!isMuted)
  }

  // Handle progress bar click to seek
  const handleProgressBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!videoRef.current) return

    const progressBar = e.currentTarget
    const rect = progressBar.getBoundingClientRect()
    const clickPosition = (e.clientX - rect.left) / rect.width

    // Set video time based on click position
    videoRef.current.currentTime = clickPosition * videoRef.current.duration
  }

  return (
    <motion.div
      ref={containerRef}
      className={`relative overflow-hidden rounded-xl ${className}`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true, margin: "-100px" }}
    >
      {/* Video overlay with gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30 z-10 pointer-events-none" />

      {/* Title */}
      <motion.div
        className="absolute top-4 left-4 z-20 text-white font-bold text-lg md:text-xl"
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        viewport={{ once: true }}
      >
        {title}
      </motion.div>

      {/* Video element */}
      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        poster={posterSrc}
        muted
        loop
        playsInline
        onClick={togglePlay} // Allow clicking on video to toggle play/pause
        onError={() => {
          console.error("Video error:", videoSrc)
          onError?.()
        }}
      >
        <source src={videoSrc} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Play/Pause overlay button (larger hit area) */}
      <div className="absolute inset-0 z-15 flex items-center justify-center cursor-pointer" onClick={togglePlay}>
        {isPlaying ? (
          <div className="bg-black/30 rounded-full p-4 opacity-0 hover:opacity-100 transition-opacity">
            <Pause className="h-8 w-8 text-white" />
          </div>
        ) : (
          <div className="bg-black/30 rounded-full p-4">
            <Play className="h-8 w-8 text-white" />
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="absolute bottom-0 left-0 right-0 p-4 flex items-center justify-between z-20 bg-gradient-to-t from-black/50 to-transparent">
        {/* Play/Pause button */}
        <button
          className="bg-white/20 backdrop-blur-sm rounded-full p-2 hover:bg-white/30 transition-colors"
          onClick={togglePlay}
        >
          {isPlaying ? <Pause className="h-5 w-5 text-white" /> : <Play className="h-5 w-5 text-white" />}
        </button>

        {/* Progress bar */}
        <div
          className="flex-1 mx-4 h-2 bg-white/30 rounded-full overflow-hidden cursor-pointer"
          onClick={handleProgressBarClick}
        >
          <div className="h-full bg-gradient-to-r from-red-500 to-blue-500" style={{ width: `${progress}%` }} />
        </div>

        {/* Mute button */}
        <button
          className="bg-white/20 backdrop-blur-sm rounded-full p-2 hover:bg-white/30 transition-colors"
          onClick={toggleMute}
        >
          {isMuted ? <VolumeX className="h-5 w-5 text-white" /> : <Volume2 className="h-5 w-5 text-white" />}
        </button>
      </div>
    </motion.div>
  )
}
