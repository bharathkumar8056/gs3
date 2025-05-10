"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import { useRef } from "react"
import Image from "next/image"
import { SafeVideoPlayer } from "./safe-video-player"
import { ScrollCue } from "./scroll-cue"

export function DirectorSection() {
  const containerRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  })

  // Enhanced circle expansion animation based on scroll
  const circleScale = useTransform(scrollYProgress, [0, 0.3], [0.2, 1.5])
  const circleOpacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0])
  const contentOpacity = useTransform(scrollYProgress, [0.1, 0.3], [0, 1])

  return (
    <section ref={containerRef} className="relative min-h-screen py-20 overflow-hidden" id="director-section">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/70 to-black/80 z-0"></div>

      {/* Animated expanding circle background */}
      <motion.div
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
        style={{
          scale: circleScale,
          opacity: circleOpacity,
        }}
      >
        <div className="relative">
          {/* Main circle */}
          <motion.div
            className="w-32 h-32 md:w-48 md:h-48 rounded-full bg-gradient-to-br from-red-500/20 to-blue-500/20 backdrop-blur-md"
            animate={{
              boxShadow: [
                "0 0 20px rgba(239, 68, 68, 0.3)",
                "0 0 40px rgba(59, 130, 246, 0.3)",
                "0 0 20px rgba(239, 68, 68, 0.3)",
              ],
              rotate: 360,
            }}
            transition={{
              duration: 15,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
          />

          {/* Orbiting elements */}
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-8 h-8 md:w-12 md:h-12 rounded-full bg-black/50 backdrop-blur-sm border border-white/10"
              style={{
                top: `${50 + 45 * Math.sin((i * (Math.PI * 2)) / 5)}%`,
                left: `${50 + 45 * Math.cos((i * (Math.PI * 2)) / 5)}%`,
                transform: "translate(-50%, -50%)",
              }}
              animate={{
                rotate: 360,
              }}
              transition={{
                duration: 20 + i * 5,
                repeat: Number.POSITIVE_INFINITY,
                ease: "linear",
              }}
            >
              <motion.div
                className="w-full h-full rounded-full bg-gradient-to-br from-red-500/20 to-blue-500/20"
                animate={{
                  scale: [0.8, 1, 0.8],
                  opacity: [0.5, 0.8, 0.5],
                }}
                transition={{
                  duration: 3,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "reverse",
                }}
              />
            </motion.div>
          ))}
        </div>
      </motion.div>

      <div className="container relative z-10 px-4">
        <motion.div className="max-w-6xl mx-auto" style={{ opacity: contentOpacity }}>
          <motion.h2
            className="text-3xl md:text-5xl font-bold mb-8 text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <span className="text-gradient-red-blue">The Visionary</span>
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* Director Image */}
            <motion.div
              className="relative h-[400px] md:h-[500px] rounded-xl overflow-hidden"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <Image
                src="/assets/Vijay-Milton.jpg"
                alt="Director Vijay Milton"
                fill
                className="object-cover"
              />

              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>

              {/* Name overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h3 className="text-2xl font-bold text-white">Vijay Milton</h3>
                <p className="text-gray-300">Director & Cinematographer</p>
              </div>

              {/* Animated border */}
              <motion.div
                className="absolute inset-0 border border-white/10 rounded-xl z-10 pointer-events-none"
                animate={{
                  boxShadow: [
                    "0 0 10px rgba(239, 68, 68, 0.2)",
                    "0 0 20px rgba(59, 130, 246, 0.2)",
                    "0 0 10px rgba(239, 68, 68, 0.2)",
                  ],
                  borderColor: ["rgba(239, 68, 68, 0.3)", "rgba(59, 130, 246, 0.3)", "rgba(239, 68, 68, 0.3)"],
                }}
                transition={{
                  duration: 5,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "reverse",
                }}
              />

              {/* Floating elements */}
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute rounded-full bg-gradient-to-br from-red-500/20 to-blue-500/20 backdrop-blur-sm border border-white/10"
                  style={{
                    width: 20 + i * 10,
                    height: 20 + i * 10,
                    top: `${20 + i * 30}%`,
                    left: `${10 + i * 30}%`,
                  }}
                  animate={{
                    y: [0, -10, 0],
                    x: [0, 5, 0],
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    duration: 3 + i,
                    repeat: Number.POSITIVE_INFINITY,
                    repeatType: "reverse",
                    delay: i * 0.5,
                  }}
                />
              ))}
            </motion.div>

            {/* Director Bio */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <h3 className="text-2xl md:text-3xl font-bold mb-4">Vijay Milton</h3>
              <div className="h-1 w-20 bg-gradient-to-r from-red-500 to-blue-500 rounded-full mb-6"></div>

              <p className="text-gray-300 mb-6 leading-relaxed">
                Vijay Milton is an acclaimed Indian filmmaker and cinematographer known for his distinctive visual style
                and storytelling. With a career spanning over two decades, he has established himself as a versatile
                talent in Tamil cinema.
              </p>

              <p className="text-gray-300 mb-6 leading-relaxed">
                After beginning his journey as a cinematographer, Milton made his directorial debut with "Azhagai
                Irukkirai Bayamai Irukkirathu" (2006). However, it was the Goli Soda franchise that truly showcased his
                unique vision and cemented his reputation as a director with a keen eye for authentic narratives.
              </p>

              <p className="text-gray-300 leading-relaxed">
                His approach to filmmaking combines raw realism with visual poetry, creating stories that resonate
                deeply with audiences while pushing cinematic boundaries. The Goli Soda series represents his signature
                blend of gritty storytelling and visual flair.
              </p>

              {/* Animated tags */}
              <motion.div
                className="flex flex-wrap gap-3 mt-6"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                viewport={{ once: true }}
              >
                {["Director", "Cinematographer", "Visionary", "Storyteller"].map((tag, i) => (
                  <motion.span
                    key={tag}
                    className="px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full text-sm"
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.7 + i * 0.1 }}
                    viewport={{ once: true }}
                    whileHover={{
                      scale: 1.05,
                      backgroundColor: "rgba(59, 130, 246, 0.2)",
                    }}
                  >
                    {tag}
                  </motion.span>
                ))}
              </motion.div>
            </motion.div>
          </div>

          {/* Director Interview Video */}
          <motion.div
            className="mt-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-bold mb-6 text-center">Director's Vision</h3>
            <SafeVideoPlayer
              videoSources={[
                "/assets/videos/director.mp4",
                "/assets/videos/sample-video.mp4",
              ]}
              title="Vijay Milton on Goli Soda Universe"
              className="w-full aspect-video max-w-4xl mx-auto shadow-2xl rounded-xl overflow-hidden"
              autoplay={true}
            />
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll cue */}
      <div className="absolute bottom-10 left-0 right-0">
        <ScrollCue text="Scroll to Production" position="bottom" />
      </div>
    </section>
  )
}

