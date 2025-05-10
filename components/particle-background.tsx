"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"

interface Particle {
  id: number
  x: number
  y: number
  size: number
  duration: number
  delay: number
  color: string
  blur: number
}

export function ParticleBackground() {
  const [particles, setParticles] = useState<Particle[]>([])
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)

    // Generate random particles
    const newParticles: Particle[] = []
    for (let i = 0; i < 100; i++) {
      const isColorParticle = Math.random() > 0.7

      newParticles.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 4 + 1,
        duration: Math.random() * 10 + 10,
        delay: Math.random() * 5,
        color: isColorParticle
          ? i % 3 === 0
            ? "rgba(239, 68, 68, 0.3)" // red
            : i % 3 === 1
              ? "rgba(59, 130, 246, 0.3)" // blue
              : "rgba(168, 85, 247, 0.3)" // purple
          : "rgba(255, 255, 255, 0.2)",
        blur: isColorParticle ? 10 : 0,
      })
    }
    setParticles(newParticles)
  }, [])

  // Don't render anything on server
  if (!isMounted) {
    return null
  }

  return (
    <div className="relative w-full h-full overflow-hidden">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full"
          style={{
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            backgroundColor: particle.color,
            filter: particle.blur ? `blur(${particle.blur}px)` : undefined,
          }}
          animate={{
            opacity: [0.1, 0.5, 0.1],
            scale: [1, 1.5, 1],
            y: [`${particle.y}%`, `${particle.y - 20}%`, `${particle.y}%`],
          }}
          transition={{
            duration: particle.duration,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "loop",
            delay: particle.delay,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Larger glowing orbs */}
      {isMounted &&
        [...Array(5)].map((_, i) => (
          <motion.div
            key={`orb-${i}`}
            className="absolute rounded-full opacity-10"
            style={{
              width: "100px",
              height: "100px",
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              background:
                i % 2 === 0
                  ? "radial-gradient(circle, rgba(59, 130, 246, 0.3) 0%, rgba(59, 130, 246, 0) 70%)"
                  : "radial-gradient(circle, rgba(239, 68, 68, 0.3) 0%, rgba(239, 68, 68, 0) 70%)",
              filter: "blur(20px)",
            }}
            animate={{
              x: [`${Math.random() * 100}%`, `${Math.random() * 100}%`, `${Math.random() * 100}%`],
              y: [`${Math.random() * 100}%`, `${Math.random() * 100}%`, `${Math.random() * 100}%`],
              opacity: [0.05, 0.1, 0.05],
            }}
            transition={{
              duration: 30 + i * 10,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
            }}
          />
        ))}
    </div>
  )
}
