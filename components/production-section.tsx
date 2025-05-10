"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import { useRef, useState } from "react"
import Image from "next/image"

export function ProductionSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  })

  const contentOpacity = useTransform(scrollYProgress, [0.1, 0.3], [0, 1])

  // Production company details
  const productionDetails = [
    {
      // title: "Rough Note Productions",
      // description:
      //   "Founded with a vision to support innovative storytelling, the company has been instrumental in bringing the Goli Soda universe to audiences worldwide.",
      stats: { films: "10+", awards: "25+", years: "15+" },
    },
    {
      title: "Creative Vision",
      description: "Committed to authentic cinema that resonates with audiences while pushing creative boundaries.",
      stats: { projects: "30+", collaborations: "50+", platforms: "5+" },
    },
    {
      title: "Technical Excellence",
      description:
        "Employing cutting-edge technology and innovative techniques to create visually stunning and emotionally impactful stories.",
      stats: { innovations: "15+", techniques: "20+", equipment: "Premium" },
    },
  ]

  return (
    <section ref={containerRef} className="relative min-h-screen py-20 overflow-hidden" id="production-section">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/70 z-0"></div>

      <div className="container relative z-10 px-4">
        <motion.div className="max-w-5xl mx-auto text-center" style={{ opacity: contentOpacity }}>
          <motion.h2
            className="text-3xl md:text-5xl font-bold mb-6"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <span className="text-gradient-blue-red">Presented By</span>
          </motion.h2>

          {/* Production House Logo - Added square format image */}
          <motion.div
            className="w-40 h-40 mx-auto mb-8 relative"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <div className="w-full h-full rounded-lg overflow-hidden bg-black/30 backdrop-blur-sm border border-white/10 p-2">
              <div className="w-full h-full relative">
                <Image
                  src="/assets/rough-note.jpg"
                  alt="Rough Note Productions Logo"
                  fill
                  className="object-contain"
                />
              </div>
            </div>

            {/* Animated glow effect */}
            <motion.div
              className="absolute inset-0 rounded-lg"
              animate={{
                boxShadow: [
                  "0 0 10px rgba(59, 130, 246, 0.3)",
                  "0 0 20px rgba(239, 68, 68, 0.3)",
                  "0 0 10px rgba(59, 130, 246, 0.3)",
                ],
              }}
              transition={{
                duration: 4,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "reverse",
              }}
            />
          </motion.div>

          <motion.h3
            className="text-2xl md:text-4xl font-bold mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            Rough Note Productions
          </motion.h3>

          <motion.p
            className="text-lg text-gray-300 max-w-2xl mx-auto mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            Founded with a vision to support innovative storytelling, the company has been instrumental in bringing the
            Goli Soda universe to audiences worldwide.
          </motion.p>

          {/* Revolver Chamber Animation */}
          <div className="relative h-[100px] md:h-[200px] mx-auto mb-6">
            {/* Outer cylinder */}
            <motion.div
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 md:w-96 md:h-96"
              animate={{
                rotate: 360,
                transition: {
                  duration: 30,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "linear",
                },
              }}
            >
              {/* Chamber bullets */}
              {[...Array(6)].map((_, i) => {
                const angle = i * 60 * (Math.PI / 180)
                const x = Math.cos(angle) * 120
                const y = Math.sin(angle) * 120

                return (
                  <motion.div
                    key={i}
                    className="absolute w-16 h-16 md:w-24 md:h-24 rounded-full bg-black/70 backdrop-blur-sm border border-white/10 flex items-center justify-center cursor-pointer"
                    style={{
                      left: `calc(50% + ${x}px)`,
                      top: `calc(50% + ${y}px)`,
                      transform: "translate(-50%, -50%)",
                    }}
                    whileHover={{ scale: 1.1, backgroundColor: "rgba(0,0,0,0.8)" }}
                    onClick={() => setActiveIndex(i % 3)}
                  >
                    <motion.div
                      className="w-10 h-10 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-blue-500/30 to-red-500/30"
                      animate={{
                        scale: [0.9, 1, 0.9],
                        opacity: [0.7, 1, 0.7],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Number.POSITIVE_INFINITY,
                        repeatType: "reverse",
                      }}
                    />
                  </motion.div>
                )
              })}

              {/* Connecting lines */}
              {[...Array(6)].map((_, i) => {
                const angle = i * 60 * (Math.PI / 180)
                const innerX = Math.cos(angle) * 40
                const innerY = Math.sin(angle) * 40
                const outerX = Math.cos(angle) * 120
                const outerY = Math.sin(angle) * 120

                return (
                  <motion.div
                    key={`line-${i}`}
                    className="absolute top-1/2 left-1/2 h-0.5 bg-gradient-to-r from-blue-500/30 to-red-500/30"
                    style={{
                      width: "80px",
                      transformOrigin: "left center",
                      transform: `translate(0, -50%) rotate(${i * 60}deg) translateX(40px)`,
                    }}
                  />
                )
              })}

              {/* Center hub */}
              <motion.div
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-blue-500/20 to-red-500/20 backdrop-blur-md border border-white/10"
                animate={{
                  boxShadow: [
                    "0 0 10px rgba(59, 130, 246, 0.3)",
                    "0 0 20px rgba(239, 68, 68, 0.3)",
                    "0 0 10px rgba(59, 130, 246, 0.3)",
                  ],
                  rotate: -360,
                }}
                transition={{
                  duration: 15,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "linear",
                }}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <Image
                    src="/assets/rough-note.jpg"
                    alt="Rough Note Productions Logo"
                    width={80}
                    height={80}
                    className="object-contain"
                  />
                </div>
              </motion.div>
            </motion.div>

            {/* Content that changes based on selected chamber */}
            <motion.div
              className="absolute bottom-0 left-0 right-0 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <motion.h3
                className="text-2xl md:text-3xl font-bold mb-4"
                key={`title-${activeIndex}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4 }}
              >
                {productionDetails[activeIndex].title}
              </motion.h3>

              <motion.p
                className="text-gray-300 max-w-2xl mx-auto mb-6"
                key={`desc-${activeIndex}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
              >
                {productionDetails[activeIndex].description}
              </motion.p>

              <motion.div
                className="flex flex-wrap gap-4 justify-center"
                key={`stats-${activeIndex}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4, delay: 0.2 }}
              >
                {Object.entries(productionDetails[activeIndex].stats).map(([key, value], i) => (
                  <motion.div
                    key={key}
                    className="bg-white/5 backdrop-blur-sm rounded-xl p-4"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: 0.3 + i * 0.1 }}
                    whileHover={{
                      backgroundColor: "rgba(59, 130, 246, 0.1)",
                      y: -5,
                    }}
                  >
                    <div className="text-2xl font-bold text-gradient-blue-red">{value}</div>
                    <div className="text-sm text-gray-300">{key}</div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </div>

          {/* Production tags */}
          <motion.div
            className="flex flex-wrap gap-4 justify-center mt-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            viewport={{ once: true }}
          >
            {["Innovative", "Authentic", "Bold", "Visionary", "Creative"].map((tag, i) => (
              <motion.span
                key={tag}
                className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.6 + i * 0.1 }}
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
    </section>
  )
}

