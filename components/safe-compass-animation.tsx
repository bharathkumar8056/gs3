"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { ErrorBoundary } from "./error-boundary"
import { isWebGLSupported } from "@/lib/client-utils"
import Image from "next/image"

// Create a simple fallback component instead of dynamically importing the problematic component
function CompassFallback() {
  const [activeBox, setActiveBox] = useState(0)

  // Box content data
  const boxContents = [
    { title: "Coming Soon", subtitle: "The next chapter in the Goli Soda universe" },
    { title: "Gods & Soldiers", subtitle: "A new era begins" },
    { title: "GS3", subtitle: "The legacy continues" },
  ]

  // Rotate through boxes every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveBox((prev) => (prev + 1) % boxContents.length)
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-black via-black/95 to-black" />
      <div className="container relative z-10">
        {/* <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <motion.h2
            className="text-4xl md:text-6xl font-bold mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-gradient-red-blue">Coming Soon</span>
          </motion.h2>
          <motion.p
            className="text-xl text-gray-300 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            The next chapter in the Goli Soda universe
          </motion.p>
        </motion.div> */}

        {/* 3D Flipping Box Animation */}
        <div className="w-full max-w-2xl mx-auto relative h-[400px] md:h-[500px] perspective-1000">
          {boxContents.map((content, index) => (
            <motion.div
              key={index}
              className="absolute inset-0 preserve-3d rounded-xl overflow-hidden"
              initial={{ rotateY: 0, opacity: 0 }}
              animate={{
                rotateY: activeBox === index ? 0 : 180,
                opacity: activeBox === index ? 1 : 0,
                z: activeBox === index ? 20 : -20,
              }}
              transition={{
                duration: 0.8,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-black/80 to-black/60 border border-white/10 rounded-xl">
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6">
                  <motion.h3
                    className="text-3xl md:text-5xl font-bold mb-4 text-gradient-red-blue"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                  >
                    {content.title}
                  </motion.h3>
                  <motion.p
                    className="text-xl text-gray-300"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                  >
                    {content.subtitle}
                  </motion.p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* GS3 Logo with Circular Animation */}
        <div className="w-full max-w-2xl mx-auto relative mt-12">
          {/* Spinning outer ring with guns */}
          <motion.div
            className="relative aspect-square"
            animate={{ rotate: 360 }}
            transition={{
              duration: 60,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
          >
            {/* Use the provided gun image */}
            <div className="relative w-full h-full">
              <Image
                src="/assets/gs3-side.png"
                alt="Goli Soda 3 - Guns"
                fill
                className="object-contain"
                priority
              />
            </div>
          </motion.div>

          {/* Fixed center logo */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[50%] h-[50%] z-10">
            <Image
              src="/assets/gs3-center.png"
              alt="Goli Soda 3 - Gods & Soldiers"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>

        {/* Final message */}
        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1 }}
        >
          <h3 className="text-2xl md:text-4xl font-bold mb-4 text-white">
            <span className="text-gradient-blue-red">Goli Soda 3</span>
          </h3>
          <p className="text-lg text-gray-300 max-w-lg mx-auto mb-6">
            GODS & SOLDIERS - The journey continues. Stay tuned for more adventures.
          </p>
          <motion.div
            className="flex justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.2 }}
          >
            <a
              href="#section-1"
              className="px-6 py-3 bg-gradient-to-r from-red-600 to-blue-600 rounded-full text-white font-medium hover:shadow-lg hover:shadow-red-500/20 transition-all"
            >
              Explore the Franchise
            </a>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

export function SafeCompassAnimation() {
  const [supported, setSupported] = useState(true)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    setSupported(isWebGLSupported())
  }, [])

  if (!mounted) {
    return (
      <div className="min-h-screen py-20 flex items-center justify-center bg-black">
        <div className="text-white text-lg">Loading...</div>
      </div>
    )
  }

  // Always use the fallback to avoid Three.js errors
  return (
    <ErrorBoundary>
      <CompassFallback />
    </ErrorBoundary>
  )
}
