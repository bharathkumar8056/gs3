"use client"

import { useEffect, useRef, useState } from "react"
import { motion, useScroll } from "framer-motion"

// Helper function to interpolate values
function interpolate(value: number, inputRange: number[], outputRange: number[]): number {
  // Ensure value is within bounds
  const clampedValue = Math.max(inputRange[0], Math.min(value, inputRange[inputRange.length - 1]))

  // Find the segment that contains the value
  let i = 1
  for (; i < inputRange.length; i++) {
    if (inputRange[i] >= clampedValue) break
  }

  const j = i - 1

  // Calculate the relative position of the value in the segment
  const segmentLength = inputRange[i] - inputRange[j]
  const segmentProgress = segmentLength === 0 ? 0 : (clampedValue - inputRange[j]) / segmentLength

  // Interpolate the output
  return outputRange[j] + segmentProgress * (outputRange[i] - outputRange[j])
}

export function ScrollDotAnimation() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(true)
  const [dotSize, setDotSize] = useState(5)
  const [dotOpacity, setDotOpacity] = useState(1)
  const [rotateZ, setRotateZ] = useState(0)
  const [blurAmount, setBlurAmount] = useState(0)
  const [lineHeightOpacity, setLineHeightOpacity] = useState(0)
  const [textOpacity, setTextOpacity] = useState(0)
  const [textScale, setTextScale] = useState(0.5)
  const [fontSize, setFontSize] = useState(0.75)
  const [hasScrolled, setHasScrolled] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  })

  useEffect(() => {
    if (!isMounted) return

    const unsubscribe = scrollYProgress.onChange((value) => {
      // Only start animation if user has scrolled
      if (value > 0.01) {
        setHasScrolled(true)
      }

      if (hasScrolled) {
        setDotSize(interpolate(value, [0, 0.5, 1], [5, 100, 300]))
        setDotOpacity(interpolate(value, [0, 0.5, 0.8, 1], [1, 1, 0.5, 0]))
        setRotateZ(interpolate(value, [0, 1], [0, 720]))
        setBlurAmount(interpolate(value, [0, 0.5, 1], [0, 5, 20]))
        setLineHeightOpacity(interpolate(value, [0, 0.3, 0.6], [0, 0.7, 0]))
        setTextOpacity(interpolate(value, [0, 0.3, 0.5, 0.8], [0, 0, 1, 0]))
        setTextScale(interpolate(value, [0, 0.3, 0.5, 0.8], [0.5, 0.8, 1, 1.5]))

        // Calculate font size based on dot size
        const calculatedDotSize = interpolate(value, [0, 0.5, 1], [5, 100, 300])
        setFontSize(calculatedDotSize * 0.15)
      }
    })

    return unsubscribe
  }, [scrollYProgress, hasScrolled, isMounted])

  // Hide the dot animation after it's complete
  useEffect(() => {
    if (!isMounted) return

    const handleScroll = () => {
      if (window.scrollY > window.innerHeight * 1.5) {
        setIsVisible(false)
      } else {
        setIsVisible(true)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [isMounted])

  // Enhanced dot animation with pulsing effect when not scrolled
  const initialDotAnimation = !hasScrolled
    ? {
        scale: [1, 1.2, 1],
        opacity: [0.7, 1, 0.7],
        boxShadow: ["0 0 5px rgba(255,255,255,0.3)", "0 0 15px rgba(255,255,255,0.7)", "0 0 5px rgba(255,255,255,0.3)"],
      }
    : {}

  // Don't render on server or before mounting
  if (!isMounted) {
    return null
  }

  // Always render the component, but conditionally apply visibility
  return (
    <div
      ref={containerRef}
      className="fixed inset-0 flex items-center justify-center pointer-events-none z-50"
      style={{ display: isVisible ? "flex" : "none" }}
    >
      <motion.div
        className="relative"
        style={{
          opacity: hasScrolled ? dotOpacity : 1,
          rotate: hasScrolled ? rotateZ : 0,
        }}
      >
        {/* Main dot */}
        <motion.div
          className="bg-gradient-to-r from-red-500 to-blue-500 rounded-full"
          style={{
            width: hasScrolled ? dotSize : 20,
            height: hasScrolled ? dotSize : 20,
            filter: `blur(${hasScrolled ? blurAmount : 0}px)`,
          }}
          animate={initialDotAnimation}
          transition={{
            duration: 2,
            repeat: !hasScrolled ? Number.POSITIVE_INFINITY : 0,
            repeatType: "reverse",
          }}
        />

        {/* Text prompt to scroll when not scrolled */}
        {!hasScrolled && (
          <motion.div
            className="absolute top-[calc(100%+20px)] left-1/2 transform -translate-x-1/2 text-white text-sm whitespace-nowrap"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
          >
            Scroll to begin
          </motion.div>
        )}

        {/* Whirling lines */}
        {hasScrolled &&
          [...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute top-1/2 left-1/2 bg-white/80"
              style={{
                height: 2,
                width: dotSize * 0.6,
                rotate: 30 * i,
                x: "-50%",
                y: "-50%",
                transformOrigin: "0% 50%",
                opacity: lineHeightOpacity,
              }}
            />
          ))}

        {/* Text reveal */}
        <motion.div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white font-bold text-center whitespace-nowrap"
          style={{
            opacity: textOpacity,
            scale: textScale,
            fontSize,
          }}
        >
          GOLI SODA
        </motion.div>
      </motion.div>
    </div>
  )
}
