"use client"

import { useEffect, useRef, useState } from "react"
import { motion, useAnimation, useInView } from "framer-motion"
import dynamic from "next/dynamic"

// Dynamically import Three.js scene
const CompassScene = dynamic(() => import("./compass-scene").then((mod) => mod.CompassScene), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[700px] flex items-center justify-center bg-black/50 rounded-xl">
      <div className="text-white text-lg">Loading 3D Scene...</div>
    </div>
  ),
})

export function CompassAnimation() {
  const controls = useAnimation()
  const containerRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(containerRef, { once: false, amount: 0.3 })
  const [animationComplete, setAnimationComplete] = useState(false)

  useEffect(() => {
    if (isInView) {
      controls.start("visible")

      // Start the compass animation sequence
      const timer = setTimeout(() => {
        setAnimationComplete(true)
      }, 3000) // Longer delay to allow guns to animate in

      return () => clearTimeout(timer)
    } else {
      controls.start("hidden")
      setAnimationComplete(false)
    }
  }, [isInView, controls])

  return (
    <div ref={containerRef} className="min-h-screen py-20 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-black/95 to-black" />

      <div className="container relative z-10">
        <motion.div
          initial="hidden"
          animate={controls}
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { duration: 0.8 } },
          }}
          className="text-center mb-12"
        >
          <motion.h2
            className="text-4xl md:text-6xl font-bold mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <span className="text-gradient-red-blue">Coming Soon</span>
          </motion.h2>

          <motion.p
            className="text-xl text-gray-300 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            The next chapter in the Goli Soda universe
          </motion.p>
        </motion.div>

        {/* 3D Compass Animation - increased height for better visibility */}
        <div className="h-[700px] w-full">
          <CompassScene animationComplete={animationComplete} />
        </div>

        {/* Final message */}
        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0 }}
          animate={animationComplete ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 1 }}
        >
          <h3 className="text-2xl md:text-4xl font-bold mb-4 text-white">
            <span className="text-gradient-blue-red">Goli Soda 3</span>
          </h3>
          <p className="text-lg text-gray-300 max-w-lg mx-auto">
            The journey continues. Stay tuned for more adventures.
          </p>
        </motion.div>
      </div>
    </div>
  )
}
