"use client"

import type React from "react"
import { useMemo } from "react"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { Play, Pause, Volume2, VolumeX, SkipBack, SkipForward } from "lucide-react"

interface SafeVideoPlayerProps {
  videoSources?: string[] // Make it optional
  posterSrc?: string
  title: string
  className?: string
  autoplay?: boolean
}

export function SafeVideoPlayer({
  videoSources = ["https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"], // Default fallback
  posterSrc,
  title,
  className = "",
  autoplay = false,
}: SafeVideoPlayerProps) {
  const [error, setError] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false) // Changed from true to false
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [currentSourceIndex, setCurrentSourceIndex] = useState(0)
  const [isBuffering, setIsBuffering] = useState(false)
  const [showControls, setShowControls] = useState(true)
  const [volume, setVolume] = useState(1)
  const [userInteracted, setUserInteracted] = useState(false)
  const [autoplayAttempted, setAutoplayAttempted] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const playPromiseRef = useRef<Promise<void> | null>(null)

  // Process video sources to handle local files
  const processedVideoSources = useMemo(() => {
    return videoSources
      .filter(src => src && src.length > 0)
      .map((src) => {
        // If it's a relative path starting with / and not a URL, it's a local file
        if (src.startsWith("/") && !src.startsWith("//") && !src.match(/^https?:\/\//)) {
          return src // Keep local paths as they are
        }
        return src
      });
  }, [videoSources]);

  useEffect(() => {
    setMounted(true)

    // Auto-hide controls after 3 seconds of inactivity
    const hideControlsTimeout = () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current)
      }

      if (isPlaying) {
        controlsTimeoutRef.current = setTimeout(() => {
          setShowControls(false)
        }, 3000)
      }
    }

    hideControlsTimeout()

    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current)
      }
    }
  }, [isPlaying])

  // Handle video source error and try next source
  const handleVideoError = () => {
    console.error("Video error with source:", processedVideoSources[currentSourceIndex])

    if (!processedVideoSources || currentSourceIndex >= processedVideoSources.length - 1) {
      setError(true)
      console.error("All video sources failed")
    } else {
      console.log("Trying next video source...")
      setCurrentSourceIndex(currentSourceIndex + 1)
    }
  }

  useEffect(() => {
    if (!videoRef.current || !mounted) return

    const video = videoRef.current

    const handleLoadedMetadata = () => {
      setDuration(video.duration)
      setError(false) // Reset error state if video loads successfully
      console.log("Video metadata loaded, duration:", video.duration)
    }

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime)
      setProgress((video.currentTime / video.duration) * 100 || 0)
    }

    const handlePlay = () => {
      setIsPlaying(true)
      console.log("Video playing")
    }

    const handlePause = () => {
      setIsPlaying(false)
      console.log("Video paused")
    }

    const handleEnded = () => {
      setIsPlaying(false)
      console.log("Video ended")
    }

    const handleWaiting = () => {
      setIsBuffering(true)
      console.log("Video buffering")
    }

    const handlePlaying = () => {
      setIsBuffering(false)
      console.log("Video playing after buffer")
    }

    video.addEventListener("loadedmetadata", handleLoadedMetadata)
    video.addEventListener("timeupdate", handleTimeUpdate)
    video.addEventListener("play", handlePlay)
    video.addEventListener("pause", handlePause)
    video.addEventListener("ended", handleEnded)
    video.addEventListener("waiting", handleWaiting)
    video.addEventListener("playing", handlePlaying)
    video.addEventListener("error", handleVideoError)

    return () => {
      video.removeEventListener("loadedmetadata", handleLoadedMetadata)
      video.removeEventListener("timeupdate", handleTimeUpdate)
      video.removeEventListener("play", handlePlay)
      video.removeEventListener("pause", handlePause)
      video.removeEventListener("ended", handleEnded)
      video.removeEventListener("waiting", handleWaiting)
      video.removeEventListener("playing", handlePlaying)
      video.removeEventListener("error", handleVideoError)
    }
  }, [mounted, currentSourceIndex, processedVideoSources])

  // Handle autoplay when in view
  useEffect(() => {
    if (!videoRef.current || !mounted || error || autoplayAttempted) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && autoplay && !isPlaying && !userInteracted) {
          console.log("Attempting autoplay...")
          setAutoplayAttempted(true)

          // Always mute before attempting autoplay to avoid browser restrictions
          if (videoRef.current) {
            videoRef.current.muted = true
            setIsMuted(true)

            // Store the play promise to avoid interrupting it
            playPromiseRef.current = videoRef.current.play()

            // Handle potential play() rejection
            if (playPromiseRef.current) {
              playPromiseRef.current
                .then(() => {
                  console.log("Autoplay successful")
                  setIsPlaying(true)
                  playPromiseRef.current = null
                })
                .catch((e) => {
                  console.error("Autoplay prevented:", e)
                  setIsPlaying(false)
                  playPromiseRef.current = null
                })
            }
          }
        } else if (!entries[0].isIntersecting && isPlaying) {
          console.log("Video out of view, pausing")
          // Only pause if there's no pending play promise
          if (!playPromiseRef.current && videoRef.current) {
            videoRef.current.pause()
          }
        }
      },
      { threshold: 0.5 },
    )

    if (containerRef.current) {
      observer.observe(containerRef.current)
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current)
      }
    }
  }, [autoplay, isPlaying, mounted, error, userInteracted, autoplayAttempted])

  const togglePlay = () => {
    if (!videoRef.current || error) return

    setUserInteracted(true)

    // If there's a pending play promise, don't interrupt it
    if (playPromiseRef.current) {
      console.log("Play operation in progress, waiting...")
      return
    }

    if (isPlaying) {
      videoRef.current.pause()
      setIsPlaying(false)
    } else {
      // Store the play promise
      playPromiseRef.current = videoRef.current.play()

      if (playPromiseRef.current) {
        playPromiseRef.current
          .then(() => {
            console.log("Play successful")
            setIsPlaying(true)
            playPromiseRef.current = null
          })
          .catch((e) => {
            console.error("Play prevented:", e)
            setIsPlaying(false)
            playPromiseRef.current = null
            handleVideoError()
          })
      }
    }

    // Show controls when play state changes
    setShowControls(true)

    // Reset the auto-hide timeout
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current)
    }

    if (!isPlaying) {
      // Will be playing soon
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false)
      }, 3000)
    }
  }

  const toggleMute = () => {
    if (!videoRef.current || error) return

    setUserInteracted(true)
    const newMutedState = !isMuted
    videoRef.current.muted = newMutedState
    setIsMuted(newMutedState)

    // If unmuting, restore previous volume
    if (!newMutedState && volume === 0) {
      setVolume(0.5)
      videoRef.current.volume = 0.5
    }
  }

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!videoRef.current) return

    setUserInteracted(true)
    const newVolume = Number.parseFloat(e.target.value)
    videoRef.current.volume = newVolume
    setVolume(newVolume)

    // Update muted state based on volume
    if (newVolume === 0) {
      videoRef.current.muted = true
      setIsMuted(true)
    } else if (isMuted) {
      videoRef.current.muted = false
      setIsMuted(false)
    }
  }

  // Handle progress bar click to seek
  const handleProgressBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!videoRef.current || error || duration === 0) return

    setUserInteracted(true)
    const progressBar = e.currentTarget
    const rect = progressBar.getBoundingClientRect()
    const clickPosition = (e.clientX - rect.left) / rect.width

    videoRef.current.currentTime = clickPosition * duration
    setCurrentTime(clickPosition * duration)
  }

  // Skip forward/backward
  const skipTime = (seconds: number) => {
    if (!videoRef.current || error) return

    setUserInteracted(true)
    const newTime = Math.max(0, Math.min(duration, currentTime + seconds))
    videoRef.current.currentTime = newTime
    setCurrentTime(newTime)
  }

  // Show controls on mouse move
  const handleMouseMove = () => {
    setShowControls(true)

    // Reset the auto-hide timeout
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current)
    }

    if (isPlaying) {
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false)
      }, 3000)
    }
  }

  // Format time in MM:SS format
  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60)
    const seconds = Math.floor(timeInSeconds % 60)
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`
  }

  if (!mounted) {
    return (
      <div className={`${className} bg-black/50 rounded-xl flex items-center justify-center min-h-[200px]`}>
        <div className="text-white text-lg">Loading video...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={`${className} bg-black/50 rounded-xl flex flex-col items-center justify-center min-h-[200px]`}>
        <div className="text-white text-center p-4">
          <h3 className="text-xl font-bold mb-2">{title}</h3>
          <p className="text-sm text-gray-300 mb-4">Video could not be loaded</p>
          <div className="bg-white/10 px-4 py-2 rounded-md">
            <code className="text-xs text-red-300">Error loading video</code>
          </div>
        </div>
      </div>
    )
  }

  return (
    <motion.div
      ref={containerRef}
      className={`relative overflow-hidden rounded-xl ${className}`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true, margin: "-100px" }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setShowControls(true)}
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
        poster={posterSrc || "/placeholder.svg?height=720&width=1280"}
        playsInline
        key={processedVideoSources[currentSourceIndex]} // Add key to force remount when source changes
      >
        {processedVideoSources && processedVideoSources[currentSourceIndex] && (
          <source src={processedVideoSources[currentSourceIndex]} type="video/mp4" />
        )}
        Your browser does not support the video tag.
      </video>

      {/* Buffering indicator */}
      {isBuffering && (
        <div className="absolute inset-0 flex items-center justify-center z-30 bg-black/30">
          <div className="w-16 h-16 border-4 border-t-transparent border-white rounded-full animate-spin"></div>
        </div>
      )}

      {/* Play/Pause overlay button (larger hit area) */}
      <div className="absolute inset-0 z-15 flex items-center justify-center cursor-pointer" onClick={togglePlay}>
        {isPlaying ? (
          <motion.div
            className="bg-black/30 rounded-full p-4 opacity-0 hover:opacity-100 transition-opacity"
            initial={{ opacity: 0 }}
            animate={{ opacity: showControls ? 0.7 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <Pause className="h-8 w-8 text-white" />
          </motion.div>
        ) : (
          <motion.div
            className="bg-black/30 rounded-full p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            transition={{ duration: 0.3 }}
          >
            <Play className="h-8 w-8 text-white" />
          </motion.div>
        )}
      </div>

      {/* Controls */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 p-4 flex flex-col gap-2 z-20 bg-gradient-to-t from-black/50 to-transparent"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: showControls ? 1 : 0, y: showControls ? 0 : 10 }}
        transition={{ duration: 0.3 }}
      >
        {/* Progress bar */}
        <div
          className="w-full h-2 bg-white/30 rounded-full overflow-hidden cursor-pointer"
          onClick={handleProgressBarClick}
        >
          <div className="h-full bg-gradient-to-r from-red-500 to-blue-500" style={{ width: `${progress}%` }} />
        </div>

        {/* Time and controls */}
        <div className="flex items-center justify-between">
          {/* Time display */}
          <div className="text-white text-xs">
            {formatTime(currentTime)} / {formatTime(duration)}
          </div>

          <div className="flex items-center gap-4">
            {/* Skip backward button */}
            <button
              className="bg-white/20 backdrop-blur-sm rounded-full p-2 hover:bg-white/30 transition-colors"
              onClick={() => skipTime(-10)}
            >
              <SkipBack className="h-5 w-5 text-white" />
            </button>

            {/* Play/Pause button */}
            <button
              className="bg-white/20 backdrop-blur-sm rounded-full p-2 hover:bg-white/30 transition-colors"
              onClick={togglePlay}
            >
              {isPlaying ? <Pause className="h-5 w-5 text-white" /> : <Play className="h-5 w-5 text-white" />}
            </button>

            {/* Skip forward button */}
            <button
              className="bg-white/20 backdrop-blur-sm rounded-full p-2 hover:bg-white/30 transition-colors"
              onClick={() => skipTime(10)}
            >
              <SkipForward className="h-5 w-5 text-white" />
            </button>

            {/* Volume control */}
            <div className="flex items-center gap-2">
              <button
                className="bg-white/20 backdrop-blur-sm rounded-full p-2 hover:bg-white/30 transition-colors"
                onClick={toggleMute}
              >
                {isMuted ? <VolumeX className="h-5 w-5 text-white" /> : <Volume2 className="h-5 w-5 text-white" />}
              </button>

              <div className="hidden md:block w-20 h-2 bg-white/30 rounded-full overflow-hidden">
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={volume}
                  onChange={handleVolumeChange}
                  className="w-full h-full opacity-0 cursor-pointer absolute"
                />
                <div className="h-full bg-white/70 rounded-full" style={{ width: `${volume * 100}%` }} />
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}


