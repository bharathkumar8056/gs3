"use client"

import { motion, AnimatePresence } from "framer-motion"
import { ArrowDown, ArrowUp } from "lucide-react"
import type { MotionValue } from "framer-motion"

interface ScrollCueProps {
  opacity?: MotionValue<number>
  text?: string
  showOnlyWhenActive?: boolean
  position?: "bottom" | "top"
}

export function ScrollCue({
  opacity,
  text = "Scroll to Explore",
  showOnlyWhenActive = false,
  position = "bottom",
}: ScrollCueProps) {
  return (
    <AnimatePresence>
      {(!showOnlyWhenActive || showOnlyWhenActive) && (
        <motion.div
          className={`absolute ${position === "bottom" ? "bottom-10" : "top-10"} left-1/2 transform -translate-x-1/2 z-10`}
          style={opacity ? { opacity } : undefined}
          initial={{ opacity: 0, y: position === "bottom" ? 20 : -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            animate={{ y: position === "bottom" ? [0, 10, 0] : [0, -10, 0] }}
            transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2 }}
            className="flex flex-col items-center"
          >
            {position === "top" && (
              <motion.div
                animate={{ y: [0, -5, 0] }}
                transition={{
                  repeat: Number.POSITIVE_INFINITY,
                  duration: 1.5,
                  ease: "easeInOut",
                }}
              >
                <ArrowUp className="h-6 w-6 text-white/70" />
              </motion.div>
            )}
            <span className="text-xs text-white/70 uppercase tracking-widest my-2">{text}</span>
            {position === "bottom" && (
              <motion.div
                animate={{ y: [0, 5, 0] }}
                transition={{
                  repeat: Number.POSITIVE_INFINITY,
                  duration: 1.5,
                  ease: "easeInOut",
                }}
              >
                <ArrowDown className="h-6 w-6 text-white/70" />
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
