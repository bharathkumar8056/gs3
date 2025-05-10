"use client"

import { useEffect, useRef, useState } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { ScrollCue } from "./scroll-cue"

export function CharacterIntroSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isInView, setIsInView] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsInView(true)
        }
      },
      { threshold: 0.3 },
    )

    if (containerRef.current) {
      observer.observe(containerRef.current)
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current)
      }
    }
  }, [])

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  })

  // Enhanced circle expansion animation based on scroll
  const circleScale = useTransform(scrollYProgress, [0, 0.5], [0.2, 2])
  const circleOpacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0])
  const textOpacity = useTransform(scrollYProgress, [0.3, 0.6], [0, 1])
  const textY = useTransform(scrollYProgress, [0.3, 0.6], [50, 0])

  if (!isMounted) return null

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden py-20"
      id="character-intro"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-black/90 to-black/80 z-0"></div>

      {/* Animated expanding circle */}
      <motion.div
        className="absolute"
        style={{
          scale: circleScale,
          opacity: circleOpacity,
        }}
      >
        <div className="relative">
          {/* Main circle */}
          <motion.div
            className="w-32 h-32 md:w-48 md:h-48 rounded-full bg-gradient-to-br from-red-500/20 to-blue-500/20 backdrop-blur-md"
            animate={{
              boxShadow: [
                "0 0 20px rgba(239, 68, 68, 0.3)",
                "0 0 40px rgba(59, 130, 246, 0.3)",
                "0 0 20px rgba(239, 68, 68, 0.3)",
              ],
              rotate: 360,
            }}
            transition={{
              duration: 10,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
          />

          {/* Character silhouettes */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-16 h-16 md:w-24 md:h-24 rounded-full bg-black/50 backdrop-blur-sm border border-white/10"
              style={{
                top: `${50 + 45 * Math.sin((i * (Math.PI * 2)) / 6)}%`,
                left: `${50 + 45 * Math.cos((i * (Math.PI * 2)) / 6)}%`,
                transform: "translate(-50%, -50%)",
              }}
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.7, 1, 0.7],
              }}
              transition={{
                duration: 3,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "reverse",
                delay: i * 0.5,
              }}
            >
              <div className="w-full h-full flex items-center justify-center">
                <motion.div
                  className="w-10 h-10 md:w-16 md:h-16 bg-gradient-to-br from-red-500/30 to-blue-500/30 rounded-full"
                  animate={{
                    scale: [0.8, 1, 0.8],
                    opacity: [0.5, 0.8, 0.5],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Number.POSITIVE_INFINITY,
                    repeatType: "reverse",
                    delay: i * 0.3,
                  }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Text content */}
      <motion.div
        className="relative z-10 text-center px-4"
        style={{
          opacity: textOpacity,
          y: textY,
        }}
      >
        <motion.h2
          className="text-4xl md:text-6xl font-bold mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <span className="text-gradient-red-blue">Meet The Characters</span>
        </motion.h2>

        <motion.p
          className="text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          The souls that bring the Goli Soda universe to life
        </motion.p>

        <motion.div
          className="flex flex-wrap gap-4 justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.7 }}
        >
          {["Intensity", "Passion", "Resilience", "Authenticity", "Raw Talent"].map((tag, i) => (
            <span key={tag} className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm">
              {tag}
            </span>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll cue */}
      <div className="absolute bottom-10 left-0 right-0">
        <ScrollCue text="Scroll to Meet the Cast" position="bottom" />
      </div>
    </section>
  )
}
