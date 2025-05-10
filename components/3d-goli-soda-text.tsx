"use client"

import { useEffect, useRef } from "react"
import { motion, useAnimation, useInView } from "framer-motion"
import dynamic from "next/dynamic"

// Dynamically import Three.js components to ensure they only load on the client
const ThreeScene = dynamic(() => import("./three-scene").then((mod) => mod.ThreeScene), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[300px] md:h-[400px] flex items-center justify-center bg-black/50 rounded-lg">
      <div className="text-white text-lg">Loading 3D Scene...</div>
    </div>
  ),
})

export function GoliSoda3DText() {
  const containerRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(containerRef, { once: false, amount: 0.3 })
  const controls = useAnimation()

  useEffect(() => {
    if (isInView) {
      controls.start("visible")
    } else {
      controls.start("hidden")
    }
  }, [isInView, controls])

  return (
    <motion.div
      ref={containerRef}
      className="w-full h-[300px] md:h-[400px] relative"
      initial="hidden"
      animate={controls}
      variants={{
        hidden: { opacity: 0, scale: 0.9 },
        visible: {
          opacity: 1,
          scale: 1,
          transition: { duration: 0.8, ease: "easeOut" },
        },
      }}
    >
      <ThreeScene />

      {/* Overlay text for mobile accessibility */}
      <div className="absolute bottom-4 left-0 right-0 text-center md:hidden">
        <motion.p
          className="text-sm text-white/70"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
        >
          Tap and drag to interact
        </motion.p>
      </div>
    </motion.div>
  )
}
