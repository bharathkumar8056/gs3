"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"

export function InitialAnimation() {
  const [scrolled, setScrolled] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const [complete, setComplete] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)

    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true)
      }
    }

    window.addEventListener("scroll", handleScroll)

    // Reset scroll position to top
    window.scrollTo(0, 0)

    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    if (scrolled) {
      setExpanded(true)
      const timer = setTimeout(() => {
        setComplete(true)
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [scrolled])

  if (!isMounted) return null

  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center z-50 bg-black"
      animate={{
        opacity: complete ? 0 : 1,
        pointerEvents: complete ? "none" : "auto",
      }}
      transition={{ duration: 0.8 }}
    >
      <motion.div
        className="relative"
        animate={{
          scale: expanded ? [1, 20, 30] : 1,
          opacity: expanded ? [1, 1, 0] : 1,
        }}
        transition={{
          duration: 1.5,
          times: expanded ? [0, 0.7, 1] : [0],
          ease: "easeInOut",
        }}
      >
        <motion.div
          className="w-16 h-16 rounded-full bg-gradient-to-r from-red-500 to-blue-500"
          animate={{
            scale: scrolled ? 1 : [1, 1.1, 1],
            boxShadow: scrolled
              ? "0 0 0 rgba(255,255,255,0)"
              : ["0 0 5px rgba(255,255,255,0.3)", "0 0 15px rgba(255,255,255,0.7)", "0 0 5px rgba(255,255,255,0.3)"],
          }}
          transition={{
            duration: 2,
            repeat: scrolled ? 0 : Number.POSITIVE_INFINITY,
            repeatType: "reverse",
          }}
        />

        <motion.div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white font-bold text-2xl"
          animate={{
            opacity: scrolled ? 0 : 1,
          }}
        >
          GS
        </motion.div>

        {!scrolled && (
          <motion.div
            className="absolute top-[calc(100%+20px)] left-1/2 transform -translate-x-1/2 text-white text-sm whitespace-nowrap"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
          >
            Scroll to begin
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  )
}
