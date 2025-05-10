"use client"

import { motion, useAnimation } from "framer-motion"
import { useEffect, useState } from "react"
import Image from "next/image"

export function BottleAnimation() {
  const controls = useAnimation()
  const [animationComplete, setAnimationComplete] = useState(false)

  useEffect(() => {
    const sequence = async () => {
      // Initial animation
      await controls.start({
        rotateY: [0, 10, 0, -10, 0],
        rotateX: [0, 5, 0, -5, 0],
        transition: {
          duration: 3,
          ease: "easeInOut",
        },
      })

      // Shake animation
      await controls.start({
        rotateZ: [0, 2, -2, 3, -3, 2, -2, 1, -1, 0],
        y: [0, -2, 2, -3, 3, -2, 2, -1, 1, 0],
        transition: {
          duration: 1.2,
          ease: "easeInOut",
        },
      })

      // Explosion animation
      await controls.start({
        scale: [1, 1.05, 1.1, 1.15],
        transition: {
          duration: 0.5,
          ease: "easeOut",
        },
      })

      setAnimationComplete(true)
    }

    sequence()
  }, [controls])

  return (
    <div className="relative w-40 h-40 md:w-60 md:h-60 mx-auto perspective-1000">
      {/* 3D container */}
      <motion.div className="relative w-full h-full preserve-3d" animate={controls}>
        {/* Bottle */}
        <motion.div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-32 md:w-32 md:h-40"
          initial={{ rotate: -5, y: 0 }}
          animate={
            animationComplete
              ? {
                  rotate: [0, 5, 0, 5, 0, 10, -5, 15, -10, 0],
                  y: [0, -2, 0, -3, 0, -5, 0, -10, 0],
                  scale: [1, 1.01, 1, 1.02, 1, 1.05, 1, 1.1, 0.9, 1],
                }
              : {}
          }
          transition={
            animationComplete
              ? {
                  duration: 1.5,
                  times: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 1],
                  ease: "easeInOut",
                }
              : {}
          }
        >
          <div className="w-full h-full relative">
            <div className="absolute inset-0 rounded-full bg-blue-500/10 blur-xl animate-pulse"></div>
            <Image src="/placeholder.svg?height=160&width=80" alt="Goli Soda Bottle" fill className="object-contain" />

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

            {/* Bottle cap */}
            <motion.div
              className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-4 bg-gray-800 rounded-full"
              animate={
                animationComplete
                  ? {
                      y: [0, -2, 0, -3, 0, -20, -40, -60],
                      x: [0, 2, -2, 3, -3, 20, 40, 60],
                      rotate: [0, 45, 90, 180, 270, 360, 720],
                      opacity: [1, 1, 1, 1, 1, 0.8, 0.5, 0],
                    }
                  : {}
              }
              transition={
                animationComplete
                  ? {
                      duration: 1.5,
                      times: [0, 0.1, 0.2, 0.3, 0.4, 0.6, 0.8, 1],
                      ease: "easeOut",
                    }
                  : {}
              }
            />
          </div>
        </motion.div>

        {/* Liquid splash effect */}
        <motion.div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
          initial={{ opacity: 0, scale: 0 }}
          animate={
            animationComplete
              ? {
                  opacity: [0, 0.2, 0.5, 0.8, 0.5, 0],
                  scale: [0, 0.5, 1, 1.5, 2, 2.5],
                }
              : {}
          }
          transition={
            animationComplete
              ? {
                  duration: 1.5,
                  times: [0, 0.2, 0.4, 0.6, 0.8, 1],
                  ease: "easeOut",
                }
              : {}
          }
        >
          <div className="w-full h-full relative">
            {/* Splash droplets */}
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 rounded-full bg-blue-500/80"
                initial={{
                  x: 0,
                  y: 0,
                  opacity: 0,
                  scale: 0,
                }}
                animate={
                  animationComplete
                    ? {
                        x: (Math.random() - 0.5) * 100,
                        y: (Math.random() - 0.5) * 100,
                        opacity: [0, 0.8, 0],
                        scale: [0, 1, 0.5],
                      }
                    : {}
                }
                transition={
                  animationComplete
                    ? {
                        duration: 1 + Math.random(),
                        times: [0, 0.4, 1],
                        ease: "easeOut",
                      }
                    : {}
                }
                style={{
                  top: `${50 + (Math.random() - 0.5) * 20}%`,
                  left: `${50 + (Math.random() - 0.5) * 20}%`,
                }}
              />
            ))}
          </div>
        </motion.div>

        {/* Cannonball/Bullet */}
        <motion.div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 shadow-lg z-20"
          initial={{
            x: 0,
            y: 0,
            scale: 0,
            opacity: 0,
          }}
          animate={
            animationComplete
              ? {
                  x: [0, 0, 0, 0, 0, 0, 20, 60, 120, 200],
                  y: [0, 0, 0, 0, 0, 0, -10, -20, -10, 30],
                  scale: [0, 0, 0, 0, 0, 0, 0.5, 1, 1.2, 1],
                  opacity: [0, 0, 0, 0, 0, 0, 0.7, 1, 1, 0],
                }
              : {}
          }
          transition={
            animationComplete
              ? {
                  duration: 1.5,
                  times: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 1],
                  ease: "easeOut",
                }
              : {}
          }
        >
          {/* Marble shine effect */}
          <motion.div
            className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/50 to-transparent"
            animate={{
              x: [-20, 20],
              opacity: [0, 0.7, 0],
            }}
            transition={{
              duration: 1,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "loop",
            }}
          />

          {/* Marble trail */}
          <motion.div
            className="absolute top-1/2 left-0 h-2 w-full bg-gradient-to-r from-transparent via-gray-400 to-transparent rounded-full"
            initial={{ opacity: 0, scaleX: 0 }}
            animate={
              animationComplete
                ? {
                    opacity: [0, 0.7, 0],
                    scaleX: [0, 1, 0],
                  }
                : {}
            }
            transition={
              animationComplete
                ? {
                    duration: 0.8,
                    delay: 0.7,
                    ease: "easeOut",
                  }
                : {}
            }
            style={{ transformOrigin: "left" }}
          />
        </motion.div>

        {/* Explosion effect */}
        <motion.div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full"
          initial={{ opacity: 0, scale: 0 }}
          animate={
            animationComplete
              ? {
                  opacity: [0, 0, 0, 0, 0, 0, 0.2, 0.5, 1, 0],
                  scale: [0, 0, 0, 0, 0, 0, 0.5, 1, 1.5, 2],
                }
              : {}
          }
          transition={
            animationComplete
              ? {
                  duration: 1.5,
                  times: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 1],
                  ease: "easeOut",
                }
              : {}
          }
        >
          <div className="w-full h-full bg-gradient-radial from-red-500 via-orange-500 to-transparent rounded-full blur-xl"></div>
        </motion.div>

        {/* Shockwave effect */}
        <motion.div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
          initial={{ opacity: 0, scale: 0 }}
          animate={
            animationComplete
              ? {
                  opacity: [0, 0, 0, 0, 0, 0, 0, 0.8, 1, 0],
                  scale: [0, 0, 0, 0, 0, 0, 0, 1, 2, 3],
                }
              : {}
          }
          transition={
            animationComplete
              ? {
                  duration: 1.5,
                  times: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 1],
                  ease: "easeOut",
                }
              : {}
          }
        >
          <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-2 border-white/30 opacity-50"></div>
        </motion.div>

        {/* Secondary shockwave */}
        <motion.div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
          initial={{ opacity: 0, scale: 0 }}
          animate={
            animationComplete
              ? {
                  opacity: [0, 0, 0, 0, 0, 0, 0, 0.6, 0.8, 0],
                  scale: [0, 0, 0, 0, 0, 0, 0, 0.5, 1.5, 2.5],
                }
              : {}
          }
          transition={
            animationComplete
              ? {
                  duration: 1.5,
                  delay: 0.1,
                  times: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 1],
                  ease: "easeOut",
                }
              : {}
          }
        >
          <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border border-blue-400/30 opacity-50"></div>
        </motion.div>

        {/* Particles */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute top-1/2 left-1/2 w-1 h-1 md:w-2 md:h-2 rounded-full"
            style={{
              backgroundColor: i % 3 === 0 ? "#ef4444" : i % 3 === 1 ? "#3b82f6" : "#ffffff",
              boxShadow: i % 3 === 0 ? "0 0 5px #ef4444" : i % 3 === 1 ? "0 0 5px #3b82f6" : "0 0 5px #ffffff",
            }}
            initial={{
              x: 0,
              y: 0,
              opacity: 0,
            }}
            animate={
              animationComplete
                ? {
                    x: [0, 0, 0, 0, 0, 0, (Math.random() - 0.5) * 100, (Math.random() - 0.5) * 200],
                    y: [0, 0, 0, 0, 0, 0, (Math.random() - 0.5) * 100, (Math.random() - 0.5) * 200],
                    opacity: [0, 0, 0, 0, 0, 0, 1, 0],
                    scale: [1, 1, 1, 1, 1, 1, 1.5, 0],
                  }
                : {}
            }
            transition={
              animationComplete
                ? {
                    duration: 1.5,
                    times: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.7, 1],
                    ease: "easeOut",
                  }
                : {}
            }
          />
        ))}

        {/* Motion blur effect */}
        <motion.div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 md:w-10 md:h-10"
          initial={{
            x: 0,
            opacity: 0,
          }}
          animate={
            animationComplete
              ? {
                  x: [0, 0, 0, 0, 0, 0, 40, 100],
                  opacity: [0, 0, 0, 0, 0, 0, 0.3, 0],
                }
              : {}
          }
          transition={
            animationComplete
              ? {
                  duration: 1.5,
                  times: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.7, 1],
                  ease: "easeOut",
                }
              : {}
          }
        >
          <div className="w-full h-4 bg-gradient-to-r from-gray-500 to-transparent blur-md"></div>
        </motion.div>
      </motion.div>
    </div>
  )
}
