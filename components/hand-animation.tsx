"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import dynamic from "next/dynamic"

// Dynamically import the 3D scene component
const HandBottleScene = dynamic(() => import("./hand-bottle-scene").then((mod) => mod.HandBottleScene), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[700px] flex items-center justify-center bg-black/50">
      <div className="text-white text-lg">Loading 3D Scene...</div>
    </div>
  ),
})

export function HandAnimation() {
  const containerRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  })

  // Transform values for text animation
  const titleOpacity = useTransform(scrollYProgress, [0, 0.2, 0.8], [0, 1, 1])
  const titleY = useTransform(scrollYProgress, [0, 0.2, 0.8], [50, 0, 0])

  return (
    <div
      ref={containerRef}
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden py-20"
      id="legacy-section"
    >
      <motion.div
        className="absolute inset-0 bg-gradient-radial from-blue-900/30 to-black z-0"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
      />

      <div className="container relative z-10">
        {/* Title */}
        <motion.div
          className="text-center mb-8"
          style={{
            opacity: titleOpacity,
            y: titleY,
          }}
        >
          <h2 className="text-4xl md:text-6xl font-bold mb-4 text-gradient-red-blue">The Legacy Continues</h2>
          <div className="h-1 w-32 bg-gradient-to-r from-red-500 to-blue-500 rounded-full mx-auto" />
        </motion.div>

        {/* 3D Hand and Bottle Scene - increased height for better visibility */}
        <div className="w-full h-[700px] md:h-[800px] flex items-center justify-center">
          <div className="w-full max-w-4xl h-full">
            <HandBottleScene scrollProgress={scrollYProgress} />
          </div>
        </div>
      </div>
    </div>
  )
}
