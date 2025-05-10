"use client"

import { useEffect } from "react"
import type React from "react"
import { useRef } from "react"
import { useScroll, useSpring, useTransform, motion, useMotionValue } from "framer-motion"

interface ParallaxProps {
  children: React.ReactNode
  baseVelocity?: number
  direction?: "left" | "right"
  className?: string
}

export function ParallaxText({ children, baseVelocity = 100, direction = "left", className = "" }: ParallaxProps) {
  const baseX = useMotionValue(0)
  const scrollRef = useRef(null)

  const { scrollYProgress } = useScroll({
    target: scrollRef,
    offset: ["start end", "end start"],
  })

  const scrollVelocity = useVelocity(scrollYProgress)
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 50,
    stiffness: 400,
  })

  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 5], {
    clamp: false,
  })

  /**
   * This is a workaround to simulate the text repeating effect
   * since we can't use the wrap utility from framer-motion examples
   */
  const x = useTransform(baseX, (v) => `${v}px`)

  const directionFactor = useRef<number>(direction === "left" ? 1 : -1)
  useAnimationFrame((t, delta) => {
    const moveBy = directionFactor.current * baseVelocity * (delta / 1000)

    /**
     * This is a workaround to simulate the text repeating effect
     * We reset the position once it moves out of view
     */
    if (direction === "left" && baseX.get() < -2000) {
      baseX.set(0)
    } else if (direction === "right" && baseX.get() > 0) {
      baseX.set(-2000)
    }

    baseX.set(baseX.get() + moveBy)
  })

  return (
    <div ref={scrollRef} className={`overflow-hidden m-0 whitespace-nowrap flex flex-nowrap ${className}`}>
      <motion.div
        className="text-5xl md:text-7xl font-bold tracking-tight flex whitespace-nowrap text-white/10"
        style={{ x }}
      >
        {[...Array(4)].map((_, i) => (
          <motion.span
            key={i}
            className="block mr-4"
            initial={{ opacity: 0.5 }}
            animate={{
              opacity: [0.5, 1, 0.5],
              textShadow: [
                "0 0 5px rgba(255,255,255,0)",
                "0 0 10px rgba(255,255,255,0.3)",
                "0 0 5px rgba(255,255,255,0)",
              ],
            }}
            transition={{
              duration: 3,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
              delay: i * 0.5,
            }}
          >
            {children}
          </motion.span>
        ))}
      </motion.div>
    </div>
  )
}

function useVelocity(value: any) {
  const velocityMotionValue = useMotionValue(0)
  const previousValue = useRef(value.get())

  useAnimationFrame((_t, delta) => {
    if (delta === 0) return

    const currentValue = value.get()
    const velocity = (currentValue - previousValue.current) / delta

    velocityMotionValue.set(velocity * 1000) // Convert to per second

    previousValue.current = currentValue
  })

  return velocityMotionValue
}

function useAnimationFrame(callback: (time: number, delta: number) => void) {
  const initialTimestamp = useRef<number | null>(null)
  const previousTimestamp = useRef<number | null>(null)

  useEffect(() => {
    const frame = (timestamp: number) => {
      if (initialTimestamp.current === null) {
        initialTimestamp.current = timestamp
      }

      const delta = previousTimestamp.current ? timestamp - previousTimestamp.current : 0
      callback(timestamp - (initialTimestamp.current || 0), delta)

      previousTimestamp.current = timestamp
      frameRef.current = requestAnimationFrame(frame)
    }

    const frameRef = { current: requestAnimationFrame(frame) }

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current)
      }
    }
  }, [callback])
}
