"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import dynamic from "next/dynamic"

// Dynamically import Three.js components
const BottleCanvas = dynamic(() => import("./bottle-canvas").then((mod) => mod.BottleCanvas), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[400px] md:h-[500px] flex items-center justify-center bg-black/50 rounded-lg">
      <div className="text-white text-lg">Loading 3D Scene...</div>
    </div>
  ),
})

export function EnhancedBottleAnimation() {
  const [animationComplete, setAnimationComplete] = useState(false)

  return (
    <div className="w-full h-[400px] md:h-[500px] relative">
      <BottleCanvas animationComplete={animationComplete} setAnimationComplete={setAnimationComplete} />

      {/* Text overlay that appears after animation */}
      <motion.div
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center z-10 pointer-events-none"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={animationComplete ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <motion.h2
          className="text-4xl md:text-6xl font-bold text-gradient-red-blue mb-2"
          initial={{ y: 20, opacity: 0 }}
          animate={animationComplete ? { y: 0, opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          GOLI SODA
        </motion.h2>
        <motion.p
          className="text-xl md:text-2xl text-white/80"
          initial={{ y: 20, opacity: 0 }}
          animate={animationComplete ? { y: 0, opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          RISING
        </motion.p>
      </motion.div>
    </div>
  )
}
