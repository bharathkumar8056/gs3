"use client"

import { useEffect, useRef, useState } from "react"
import { motion, useAnimation } from "framer-motion"
import Image from "next/image"

export function BottleAnimation3D() {
  const controls = useAnimation()
  const bottleRef = useRef<HTMLDivElement>(null)
  const [animationComplete, setAnimationComplete] = useState(false)
  const [animationStarted, setAnimationStarted] = useState(false)

  // Start animation when component is in view
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !animationStarted) {
          setAnimationStarted(true)
          startAnimation()
        }
      },
      { threshold: 0.5 },
    )

    if (bottleRef.current) {
      observer.observe(bottleRef.current)
    }

    return () => {
      if (bottleRef.current) {
        observer.unobserve(bottleRef.current)
      }
    }
  }, [animationStarted])

  const startAnimation = async () => {
    // Initial position
    await controls.start({
      rotateZ: 0,
      y: 0,
      transition: { duration: 0.5 },
    })

    // Shake bottle
    await controls.start({
      rotateZ: [0, -2, 3, -3, 2, -2, 3, -3, 0],
      y: [0, -2, 1, -1, 2, -2, 1, -1, 0],
      transition: { duration: 1.5, ease: "easeInOut" },
    })

    // Tilt bottle
    await controls.start({
      rotateZ: 45,
      y: 20,
      transition: { duration: 0.5, ease: "easeOut" },
    })

    // Hold for a moment
    await new Promise((resolve) => setTimeout(resolve, 300))

    setAnimationComplete(true)
  }

  return (
    <div ref={bottleRef} className="relative w-full h-[400px] md:h-[500px] mx-auto perspective-1000">
      <div className="absolute inset-0 flex items-center justify-center">
        {/* 3D scene container */}
        <div className="relative w-full h-full max-w-md preserve-3d">
          {/* Bottle */}
          <motion.div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-64 md:w-40 md:h-80"
            animate={controls}
            style={{ originX: 0.5, originY: 0.8 }}
          >
            {/* Bottle container with 3D effects */}
            <div className="relative w-full h-full preserve-3d">
              {/* Bottle image */}
              <div className="absolute inset-0 w-full h-full">
                <div className="relative w-full h-full">
                  <Image
                    src="/images/goli-soda-bottle.jpg"
                    alt="Goli Soda Bottle"
                    fill
                    className="object-contain"
                    style={{
                      filter: "drop-shadow(0 10px 15px rgba(0,0,0,0.4))",
                      transformStyle: "preserve-3d",
                    }}
                  />
                </div>
              </div>

              {/* Bottle shine effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 100, opacity: [0, 0.5, 0] }}
                transition={{
                  duration: 1.5,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "loop",
                  repeatDelay: 2,
                }}
              />

              {/* Marble */}
              <motion.div
                className="absolute top-[25%] left-1/2 transform -translate-x-1/2 w-6 h-6 md:w-8 md:h-8 rounded-full"
                initial={{ y: 0 }}
                animate={
                  animationComplete
                    ? {
                        y: [-5, -150, -250],
                        x: [0, 30, 100],
                        scale: [1, 1.2, 1],
                        opacity: [1, 1, 0],
                      }
                    : {}
                }
                transition={
                  animationComplete
                    ? {
                        duration: 0.8,
                        ease: "easeOut",
                      }
                    : {}
                }
              >
                <div className="w-full h-full rounded-full bg-gradient-to-br from-blue-400 to-blue-600 shadow-lg">
                  {/* Marble shine */}
                  <div className="absolute top-1 left-1 w-2 h-2 rounded-full bg-white/70"></div>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Explosion effect */}
          <motion.div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
            initial={{ opacity: 0, scale: 0 }}
            animate={
              animationComplete
                ? {
                    opacity: [0, 0.8, 0],
                    scale: [0, 1.5, 3],
                  }
                : {}
            }
            transition={
              animationComplete
                ? {
                    duration: 0.8,
                    ease: "easeOut",
                  }
                : {}
            }
          >
            <div className="w-40 h-40 bg-gradient-radial from-blue-500/50 via-blue-300/30 to-transparent rounded-full blur-xl"></div>
          </motion.div>

          {/* Water splash particles */}
          {animationComplete && (
            <>
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute top-1/3 left-1/2 w-1 h-3 md:w-2 md:h-4 rounded-full bg-blue-400/80"
                  initial={{
                    x: 0,
                    y: 0,
                    opacity: 0,
                    scale: 0,
                  }}
                  animate={{
                    x: (Math.random() - 0.5) * 200,
                    y: (Math.random() - 0.5) * 200 - 50,
                    opacity: [0, 0.8, 0],
                    scale: [0, 1, 0.5],
                    rotate: Math.random() * 360,
                  }}
                  transition={{
                    duration: 0.8 + Math.random() * 0.5,
                    ease: "easeOut",
                    delay: 0.1 + Math.random() * 0.2,
                  }}
                />
              ))}

              {/* Larger water droplets */}
              {[...Array(10)].map((_, i) => (
                <motion.div
                  key={`drop-${i}`}
                  className="absolute top-1/3 left-1/2 rounded-full bg-blue-300/90"
                  style={{
                    width: 4 + Math.random() * 6,
                    height: 4 + Math.random() * 6,
                  }}
                  initial={{
                    x: 0,
                    y: 0,
                    opacity: 0,
                  }}
                  animate={{
                    x: (Math.random() - 0.5) * 150,
                    y: (Math.random() - 0.5) * 150 - 50,
                    opacity: [0, 1, 0],
                  }}
                  transition={{
                    duration: 1 + Math.random() * 0.5,
                    ease: "easeOut",
                    delay: 0.2 + Math.random() * 0.3,
                  }}
                />
              ))}
            </>
          )}

          {/* Fizz bubbles */}
          {animationComplete && (
            <>
              {[...Array(30)].map((_, i) => (
                <motion.div
                  key={`bubble-${i}`}
                  className="absolute top-1/3 left-1/2 rounded-full bg-white/80"
                  style={{
                    width: 2 + Math.random() * 4,
                    height: 2 + Math.random() * 4,
                  }}
                  initial={{
                    x: 0,
                    y: 0,
                    opacity: 0,
                  }}
                  animate={{
                    x: (Math.random() - 0.5) * 100,
                    y: -100 - Math.random() * 100,
                    opacity: [0, 0.8, 0],
                  }}
                  transition={{
                    duration: 1.5 + Math.random(),
                    ease: "easeOut",
                    delay: 0.3 + Math.random() * 0.5,
                  }}
                />
              ))}
            </>
          )}

          {/* Text reveal */}
          <motion.div
            className="absolute top-[60%] left-1/2 transform -translate-x-1/2 w-full text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={animationComplete ? { opacity: 1, y: 0 } : {}}
            transition={
              animationComplete
                ? {
                    duration: 0.5,
                    delay: 0.5,
                    ease: "easeOut",
                  }
                : {}
            }
          >
            <h2 className="text-4xl md:text-6xl font-bold text-gradient-red-blue">GOLI SODA</h2>
            <motion.div
              className="mt-2 text-xl md:text-2xl text-white/80"
              initial={{ opacity: 0 }}
              animate={animationComplete ? { opacity: 1 } : {}}
              transition={{ delay: 0.8, duration: 0.5 }}
            >
              RISING
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
