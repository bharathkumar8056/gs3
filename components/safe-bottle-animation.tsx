"use client"

import { Suspense, useEffect, useState } from "react"
import { motion } from "framer-motion"
import { ErrorBoundary } from "./error-boundary"
import { isWebGLSupported } from "@/lib/client-utils"
import dynamic from "next/dynamic"

// Dynamically import the EnhancedBottleAnimation component
const BottleAnimationComponent = dynamic(
  () => import("./enhanced-bottle-animation").then((mod) => mod.EnhancedBottleAnimation),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[400px] md:h-[500px] flex items-center justify-center bg-black/50 rounded-lg">
        <div className="text-white text-lg">Loading Bottle Animation...</div>
      </div>
    ),
  },
)

export function SafeBottleAnimation() {
  const [supported, setSupported] = useState(true)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    setSupported(isWebGLSupported())
  }, [])

  if (!mounted) {
    return (
      <div className="w-full h-[400px] md:h-[500px] flex items-center justify-center bg-black/50 rounded-lg">
        <div className="text-white text-lg">Loading...</div>
      </div>
    )
  }

  if (!supported) {
    return (
      <div className="w-full h-[400px] md:h-[500px] relative flex items-center justify-center">
        <motion.div
          className="absolute inset-0 bg-gradient-radial from-blue-900/30 to-black z-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        />

        <div className="text-center z-10">
          <motion.h2
            className="text-4xl md:text-6xl font-bold text-gradient-red-blue mb-2"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            GOLI SODA
          </motion.h2>
          <motion.p
            className="text-xl md:text-2xl text-white/80"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            RISING
          </motion.p>
        </div>
      </div>
    )
  }

  return (
    <ErrorBoundary>
      <Suspense
        fallback={
          <div className="w-full h-[400px] md:h-[500px] flex items-center justify-center bg-black/50 rounded-lg">
            <div className="text-white text-lg">Loading Bottle Animation...</div>
          </div>
        }
      >
        <BottleAnimationComponent />
      </Suspense>
    </ErrorBoundary>
  )
}
