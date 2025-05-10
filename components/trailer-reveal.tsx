"use client"

import { motion, useInView } from "framer-motion"
import { useRef, useState } from "react"
import { SafeVideoPlayer } from "./safe-video-player"

interface TrailerRevealProps {
  title: string
  videoSources: string[]
  description: string
  reverse?: boolean
}

export function TrailerReveal({ title, videoSources, description, reverse = false }: TrailerRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(containerRef, { once: true, amount: 0.3 })
  const [isHovered, setIsHovered] = useState(false)

  // Process video sources to include local files as fallbacks
  const processedVideoSources = [...videoSources]

  // Add local fallback videos based on which trailer this is
  if (title.includes("2014")) {
    processedVideoSources.push("/assets/videos/trailer-1.mp4", "/assets/videos/sample-video.mp4")
  } else if (title.includes("2018")) {
    processedVideoSources.push("/assets/videos/trailer-2.mp4", "/assets/videos/sample-video.mp4")
  } else {
    processedVideoSources.push("/assets/videos/trailer-3.mp4", "/assets/videos/sample-video.mp4")
  }

  // Different transition effects for each trailer
  const getTransitionEffect = () => {
    if (title.includes("2014")) {
      return {
        initial: { opacity: 0, scale: 0.9, y: 30 },
        animate: { opacity: 1, scale: 1, y: 0 },
        transition: {
          duration: 0.8,
          type: "spring",
          stiffness: 100,
          damping: 15,
        },
      }
    } else if (title.includes("2018")) {
      return {
        initial: { opacity: 0, x: reverse ? 50 : -50 },
        animate: { opacity: 1, x: 0 },
        transition: {
          duration: 0.8,
          type: "spring",
          stiffness: 100,
          damping: 15,
        },
      }
    } else {
      return {
        initial: { opacity: 0, y: 50, rotateX: 15 },
        animate: { opacity: 1, y: 0, rotateX: 0 },
        transition: {
          duration: 0.8,
          type: "spring",
          stiffness: 100,
          damping: 15,
        },
      }
    }
  }

  const transitionEffect = getTransitionEffect()

  return (
    <motion.div
      ref={containerRef}
      className="max-w-4xl mx-auto"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
    >
      <motion.div
        className="relative mb-8"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.8,
          type: "spring",
          stiffness: 100,
          damping: 15,
        }}
        viewport={{ once: true }}
      >
        <motion.h2
          className="text-3xl md:text-5xl font-bold text-center relative z-10"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <span className={reverse ? "text-gradient-blue-red" : "text-gradient-red-blue"}>{title}</span>
        </motion.h2>

        {/* Enhanced decorative elements */}
        <motion.div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full -z-10"
          initial={{ opacity: 0, scale: 0.5, rotate: 0 }}
          whileInView={{ opacity: 0.2, scale: 1.2, rotate: reverse ? -10 : 10 }}
          transition={{ duration: 1, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <div
            className={`w-full h-full rounded-full bg-gradient-to-tr ${reverse ? "from-blue-500/20 to-red-500/20" : "from-red-500/20 to-blue-500/20"} blur-3xl`}
          ></div>
        </motion.div>

        {/* Animated circles */}
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full -z-5"
            style={{
              width: `${100 + i * 50}%`,
              height: `${100 + i * 50}%`,
              opacity: 0.05 - i * 0.01,
              border: `1px solid ${reverse ? "rgba(59, 130, 246, 0.3)" : "rgba(239, 68, 68, 0.3)"}`,
            }}
            animate={{
              scale: [1, 1.05, 1],
              rotate: reverse ? [0, -360] : [0, 360],
            }}
            transition={{
              duration: 20 + i * 5,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
          />
        ))}
      </motion.div>

      <motion.div
        className="relative perspective-1000"
        initial={transitionEffect.initial}
        whileInView={transitionEffect.animate}
        transition={transitionEffect.transition}
        viewport={{ once: true }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Enhanced animated frame */}
        <motion.div
          className="absolute -inset-2 md:-inset-4 rounded-xl border border-white/10 z-0"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          viewport={{ once: true }}
          animate={{
            boxShadow: [
              `0 0 10px rgba(${reverse ? "59, 130, 246" : "239, 68, 68"}, 0.3)`,
              `0 0 20px rgba(${reverse ? "59, 130, 246" : "239, 68, 68"}, 0.5)`,
              `0 0 10px rgba(${reverse ? "59, 130, 246" : "239, 68, 68"}, 0.3)`,
            ],
            scale: isHovered ? 1.02 : 1,
          }}
          transition={{
            boxShadow: {
              duration: 3,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
            },
            scale: {
              duration: 0.3,
            },
          }}
        />

        {/* Video player */}
        <SafeVideoPlayer
          videoSources={processedVideoSources}
          title={`${title} - Official Trailer`}
          className="w-full aspect-video max-w-4xl mx-auto shadow-2xl rounded-xl overflow-hidden relative z-10"
          autoplay={true}
        />

        {/* Enhanced animated corner accents */}
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={i}
            className={`absolute w-8 h-8 md:w-12 md:h-12 ${
              i === 0 ? "top-0 left-0" : i === 1 ? "top-0 right-0" : i === 2 ? "bottom-0 left-0" : "bottom-0 right-0"
            } z-20 pointer-events-none`}
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 + i * 0.1 }}
            viewport={{ once: true }}
          >
            <motion.div
              className={`w-full h-full border-2 ${
                i === 0
                  ? "border-l-2 border-t-2 border-r-0 border-b-0 rounded-tl-xl"
                  : i === 1
                    ? "border-r-2 border-t-2 border-l-0 border-b-0 rounded-tr-xl"
                    : i === 2
                      ? "border-l-2 border-b-2 border-r-0 border-t-0 rounded-bl-xl"
                      : "border-r-2 border-b-2 border-l-0 border-t-0 rounded-br-xl"
              } ${reverse ? "border-blue-500/50" : "border-red-500/50"}`}
              animate={{
                opacity: [0.5, 1, 0.5],
                scale: [0.95, 1.05, 0.95],
              }}
              transition={{
                duration: 3,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "reverse",
                delay: i * 0.2,
              }}
            />
          </motion.div>
        ))}

        {/* Animated particles */}
        {isInView &&
          [...Array(10)].map((_, i) => (
            <motion.div
              key={`particle-${i}`}
              className="absolute rounded-full z-30 pointer-events-none"
              style={{
                width: 3 + Math.random() * 5,
                height: 3 + Math.random() * 5,
                background: reverse
                  ? `rgba(59, 130, 246, ${0.3 + Math.random() * 0.5})`
                  : `rgba(239, 68, 68, ${0.3 + Math.random() * 0.5})`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                boxShadow: reverse ? "0 0 5px rgba(59, 130, 246, 0.5)" : "0 0 5px rgba(239, 68, 68, 0.5)",
              }}
              animate={{
                y: [0, -50 - Math.random() * 50],
                x: [(Math.random() - 0.5) * 20, (Math.random() - 0.5) * 40],
                opacity: [0, 0.8, 0],
                scale: [0, 1, 0.5],
              }}
              transition={{
                duration: 2 + Math.random() * 3,
                repeat: Number.POSITIVE_INFINITY,
                delay: Math.random() * 5,
              }}
            />
          ))}
      </motion.div>

      <motion.p
        className="mt-8 text-lg text-gray-300 text-center max-w-2xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        viewport={{ once: true }}
      >
        {description}
      </motion.p>

      {/* Additional info tags */}
      <motion.div
        className="flex flex-wrap gap-3 justify-center mt-6"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        viewport={{ once: true }}
      >
        {[
          reverse ? "2018" : reverse === false ? "2014" : "2024",
          "Tamil",
          "Action",
          "Drama",
          reverse ? "Hotstar" : "Theatrical Release",
        ].map((tag, i) => (
          <motion.span
            key={tag}
            className="px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full text-sm"
            whileHover={{
              scale: 1.05,
              backgroundColor: reverse ? "rgba(59, 130, 246, 0.2)" : "rgba(239, 68, 68, 0.2)",
            }}
            transition={{ delay: i * 0.1 }}
          >
            {tag}
          </motion.span>
        ))}
      </motion.div>
    </motion.div>
  )
}

