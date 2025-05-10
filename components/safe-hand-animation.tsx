"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { ErrorBoundary } from "./error-boundary"
import { isWebGLSupported } from "@/lib/client-utils"

// Create a simple fallback component instead of dynamically importing the problematic component
function HandAnimationFallback() {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden py-20">
      <motion.div
        className="absolute inset-0 bg-gradient-radial from-blue-900/30 to-black z-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      />

      <div className="container relative z-10">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl md:text-6xl font-bold mb-4 text-gradient-red-blue">The Legacy Continues</h2>
          <div className="h-1 w-32 bg-gradient-to-r from-red-500 to-blue-500 rounded-full mx-auto" />
        </motion.div>

        {/* Stylized Bottle Graphic */}
        <motion.div
          className="w-full max-w-md mx-auto mb-16"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <div className="relative h-64 w-32 mx-auto">
            {/* Bottle */}
            <motion.div
              className="absolute inset-0 bg-blue-500/20 rounded-3xl backdrop-blur-md border border-white/20"
              animate={{
                y: [0, -10, 0],
                rotate: [0, 2, 0, -2, 0],
              }}
              transition={{
                duration: 4,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "loop",
              }}
            >
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-4 bg-gray-800 rounded-full"></div>
            </motion.div>

            {/* Marble */}
            <motion.div
              className="absolute top-1/3 left-1/2 transform -translate-x-1/2 w-6 h-6 rounded-full bg-blue-600 shadow-lg"
              animate={{
                y: [0, -5, 0, -3, 0],
                x: [0, 3, -3, 2, 0],
              }}
              transition={{
                duration: 3,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "loop",
              }}
            >
              <div className="absolute top-1 left-1 w-2 h-2 rounded-full bg-white/70"></div>
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            The Goli Soda franchise continues to evolve, bringing new stories and characters to audiences worldwide.
            With each installment, the universe expands, introducing fresh perspectives while maintaining the raw energy
            that defines the series.
          </p>
        </motion.div>
      </div>
    </div>
  )
}

export function SafeHandAnimation() {
  const [supported, setSupported] = useState(true)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    setSupported(isWebGLSupported())
  }, [])

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-white text-lg">Loading...</div>
      </div>
    )
  }

  // Always use the fallback to avoid Three.js errors
  return (
    <ErrorBoundary>
      <HandAnimationFallback />
    </ErrorBoundary>
  )
}
