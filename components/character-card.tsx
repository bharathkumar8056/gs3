"use client"

import type React from "react"

import { motion, useScroll, useTransform, useSpring } from "framer-motion"
import { useRef, useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { ChevronRight } from "lucide-react"

interface CharacterCardProps {
  character: {
    name: string
    role: string
    tagline: string
    description: string
    image: string
    color: string
    animationType?:
      | "book"
      | "magical"
      | "slide"
      | "fade"
      | "rotate"
      | "portal"
      | "glitch"
      | "flip3d"
      | "morph"
      | "reveal"
  }
  index: number
  sectionId: string
  isMobile: boolean
}

export function CharacterCard({ character, index, sectionId, isMobile }: CharacterCardProps) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)
  const descriptionRef = useRef<HTMLDivElement>(null)
  const isEven = index % 2 === 0
  const [isHovered, setIsHovered] = useState(false)
  const [showFullBio, setShowFullBio] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isInView, setIsInView] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const [isUnfolded, setIsUnfolded] = useState(false)
  const [animationComplete, setAnimationComplete] = useState(false)

  // Determine animation type based on index or provided type
  const animationTypes = ["book", "magical", "slide", "fade", "rotate", "portal", "glitch", "flip3d", "morph", "reveal"]

  // Force simpler animations on mobile
  const animationType = isMobile
    ? "fade" // Use simpler animation type for mobile
    : (character.animationType || animationTypes[index % animationTypes.length])

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  })

  // Smoother animations with springs
  const smoothProgress = useSpring(scrollYProgress, { damping: 15, stiffness: 100 })

  // Enhanced parallax effects - reduced movement to keep content more visible
  const imageX = useTransform(smoothProgress, [0, 0.5, 1], isEven ? ["-15%", "0%", "15%"] : ["15%", "0%", "-15%"])
  const opacity = useTransform(smoothProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0.9])
  const scale = useTransform(smoothProgress, [0, 0.2, 0.8, 1], [0.8, 1, 1, 0.95])

  // Mobile-specific animation values
  const mobileImageScale = useTransform(smoothProgress, [0, 0.5, 1], [0.9, 1.05, 0.95])

  // Check if section is in view to expand description automatically
  useEffect(() => {
    if (!isMounted) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsInView(true)
          // Auto-expand description when in center view
          if (entries[0].intersectionRatio > 0.7) {
            setShowFullBio(true)
            // Trigger unfolding animation with a delay for better visual effect
            setTimeout(() => {
              setIsUnfolded(true)
              // Set animation complete after a delay
              setTimeout(() => {
                setAnimationComplete(true)
              }, 800)
            }, 300)
          }
        } else {
          setIsInView(false)
          setIsUnfolded(false)
          setAnimationComplete(false)
        }
      },
      { threshold: [0.1, 0.7] },
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current)
      }
    }
  }, [isMounted])

  // Handle mouse movement for 3D effect
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (typeof window === "undefined" || !cardRef.current || isMobile) return

    const rect = cardRef.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5

    setMousePosition({ x, y })
  }

  // Reset mouse position when not hovering
  const handleMouseLeave = () => {
    setIsHovered(false)
    setMousePosition({ x: 0, y: 0 })
  }

  // Update image source handling
  const imageSrc = character.image || "/placeholder.svg"

  // Animation variants based on animation type
  const getImageAnimationVariants = () => {
    switch (animationType) {
      case "book":
        return {
          closed: {
            rotateY: isEven ? 90 : -90,
            opacity: 0,
            transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
          },
          open: {
            rotateY: 0,
            opacity: 1,
            transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
          },
        }
      case "magical":
        return {
          closed: {
            scale: 0.5,
            opacity: 0,
            filter: "blur(20px)",
            transition: { duration: 0.8, ease: "easeOut" },
          },
          open: {
            scale: 1,
            opacity: 1,
            filter: "blur(0px)",
            transition: { duration: 0.8, ease: "easeOut" },
          },
        }
      case "slide":
        return {
          closed: {
            x: isEven ? -200 : 200,
            opacity: 0,
            transition: { duration: 0.8, ease: "easeOut" },
          },
          open: {
            x: 0,
            opacity: 1,
            transition: { duration: 0.8, ease: "easeOut" },
          },
        }
      case "fade":
        return {
          closed: {
            opacity: 0,
            y: 50,
            transition: { duration: 0.8, ease: "easeOut" },
          },
          open: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.8, ease: "easeOut" },
          },
        }
      case "rotate":
        return {
          closed: {
            rotate: isEven ? -180 : 180,
            scale: 0.5,
            opacity: 0,
            transition: { duration: 0.8, ease: "easeOut" },
          },
          open: {
            rotate: 0,
            scale: 1,
            opacity: 1,
            transition: { duration: 0.8, ease: "easeOut" },
          },
        }
      case "portal":
        return {
          closed: {
            scale: 0,
            opacity: 0,
            borderRadius: "100%",
            transition: { duration: 0.8, ease: "easeOut" },
          },
          open: {
            scale: 1,
            opacity: 1,
            borderRadius: "0.5rem",
            transition: { duration: 0.8, ease: "easeOut" },
          },
        }
      case "glitch":
        return {
          closed: {
            opacity: 0,
            x: [0, -10, 10, -10, 0],
            y: [0, 10, -10, 10, 0],
            transition: { duration: 0.5 },
          },
          open: {
            opacity: 1,
            x: 0,
            y: 0,
            transition: {
              duration: 0.8,
              x: { duration: 0.4, times: [0, 0.2, 0.4, 0.6, 1] },
              y: { duration: 0.4, times: [0, 0.2, 0.4, 0.6, 1] },
            },
          },
        }
      case "flip3d":
        return {
          closed: {
            rotateX: 90,
            opacity: 0,
            transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
          },
          open: {
            rotateX: 0,
            opacity: 1,
            transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
          },
        }
      case "morph":
        return {
          closed: {
            borderRadius: "50%",
            opacity: 0,
            scale: 0.3,
            transition: { duration: 0.8, ease: "easeOut" },
          },
          open: {
            borderRadius: "0.5rem",
            opacity: 1,
            scale: 1,
            transition: { duration: 0.8, ease: "easeOut" },
          },
        }
      case "reveal":
        return {
          closed: {
            clipPath: "inset(50% 50% 50% 50%)",
            opacity: 0,
            transition: { duration: 0.8, ease: "easeOut" },
          },
          open: {
            clipPath: "inset(0% 0% 0% 0%)",
            opacity: 1,
            transition: { duration: 0.8, ease: "easeOut" },
          },
        }
      default:
        return {
          closed: { opacity: 0, scale: 0.8 },
          open: { opacity: 1, scale: 1 },
        }
    }
  }

  // Get animation-specific effects
  const getAnimationEffects = () => {
    if (animationType === "magical" && animationComplete) {
      return (
        <>
          {/* Magical particles */}
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={`magic-particle-${i}`}
              className="absolute rounded-full bg-white"
              style={{
                width: 2 + Math.random() * 4,
                height: 2 + Math.random() * 4,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                boxShadow: `0 0 ${2 + Math.random() * 4}px ${Math.random() > 0.5 ? "#3b82f6" : "#ef4444"}`,
              }}
              animate={{
                y: [0, -Math.random() * 100 - 50],
                x: [(Math.random() - 0.5) * 20, (Math.random() - 0.5) * 100],
                opacity: [0, 0.8, 0],
                scale: [0, 1, 0],
              }}
              transition={{
                duration: 2 + Math.random() * 2,
                repeat: Number.POSITIVE_INFINITY,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </>
      )
    }

    if (animationType === "glitch" && animationComplete) {
      return (
        <>
          {/* Glitch effects */}
          <motion.div
            className="absolute inset-0 bg-blue-500/10 z-0"
            animate={{
              opacity: [0, 0.2, 0, 0.1, 0],
              x: [0, -5, 5, -2, 0],
            }}
            transition={{
              duration: 0.5,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "loop",
              repeatDelay: 5,
            }}
          />
          <motion.div
            className="absolute inset-0 bg-red-500/10 z-0"
            animate={{
              opacity: [0, 0.1, 0, 0.2, 0],
              x: [0, 5, -5, 2, 0],
            }}
            transition={{
              duration: 0.5,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "loop",
              repeatDelay: 7,
              delay: 0.2,
            }}
          />
        </>
      )
    }

    if (animationType === "portal" && animationComplete) {
      return (
        <>
          {/* Portal effects */}
          <motion.div
            className="absolute inset-0 rounded-lg z-0 overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-red-500/20"
              animate={{
                rotate: 360,
              }}
              transition={{
                duration: 20,
                repeat: Number.POSITIVE_INFINITY,
                ease: "linear",
              }}
            />
          </motion.div>
        </>
      )
    }

    if (animationType === "flip3d" && animationComplete) {
      return (
        <>
          {/* 3D flip effects */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 z-0"
            animate={{
              rotateX: [0, 10, 0, -10, 0],
              rotateY: [0, -10, 0, 10, 0],
            }}
            transition={{
              duration: 8,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "loop",
            }}
          />
        </>
      )
    }

    if (animationType === "morph" && animationComplete) {
      return (
        <>
          {/* Morph effects */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-yellow-500/10 z-0 rounded-lg"
            animate={{
              borderRadius: ["0.5rem", "30%", "50%", "30%", "0.5rem"],
            }}
            transition={{
              duration: 8,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "loop",
            }}
          />
        </>
      )
    }

    if (animationType === "reveal" && animationComplete) {
      return (
        <>
          {/* Reveal effects */}
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={`reveal-${i}`}
              className="absolute inset-0 bg-gradient-to-br from-pink-500/5 to-purple-500/5 z-0 rounded-lg"
              initial={{ opacity: 0 }}
              animate={{
                opacity: [0, 0.3, 0],
                scale: [0.8, 1.1, 1.3],
              }}
              transition={{
                duration: 3,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "loop",
                delay: i * 0.6,
              }}
            />
          ))}
        </>
      )
    }

    return null
  }

  const imageVariants = getImageAnimationVariants()

  // Don't render anything on server
  if (!isMounted) {
    return null
  }

  return (
    <div ref={sectionRef} className="relative min-h-[100vh] flex items-center py-10 md:py-20 overflow-hidden" id={sectionId}>
      {/* Dynamic background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-black/90"></div>
        <motion.div
          className={cn("absolute inset-0 bg-gradient-radial", character.color)}
          initial={{ opacity: 0, scale: 1.1 }}
          whileInView={{ opacity: 0.4, scale: 1 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
        />

        {/* Animated background particles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-white/10"
              style={{
                width: Math.random() * 4 + 1,
                height: Math.random() * 4 + 1,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, Math.random() * -100],
                opacity: [0, 0.5, 0],
              }}
              transition={{
                duration: Math.random() * 5 + 5,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "loop",
                delay: Math.random() * 5,
              }}
            />
          ))}
        </div>

        {/* Character-specific background effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-black/20 to-transparent"
          animate={{
            backgroundPosition: ["200% 0%", "-200% 0%"],
          }}
          transition={{
            duration: 20,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "loop",
            ease: "linear",
          }}
        />
      </div>

      <div className="container relative z-10 px-4">
        <div
          className={cn(
            "grid grid-cols-1 gap-8 items-center",
            !isMobile && "md:grid-cols-2",
            !isMobile && !isEven && "md:grid-flow-dense",
            isMobile && "px-4 flex flex-col items-center", // Better mobile layout
          )}
        >
          {/* Text content - NO ANIMATION */}
          <div
            className={cn(
              "text-center md:text-left",
              !isMobile && !isEven && "md:col-start-2",
              "order-2 md:order-none",
              "mb-8 md:mb-0",
            )}
          >
            <div className="mb-6 relative">
              <h3 className="text-xl md:text-2xl font-bold text-gray-400 mb-2">{character.role}</h3>

              <h2 className="text-4xl md:text-6xl font-bold mb-4 tracking-tight relative z-20">
                <span className="relative inline-block">
                  <span className="relative z-20 text-gradient-red-blue">{character.name}</span>
                  <span
                    className="absolute top-0 left-0 text-blue-500 z-0"
                    style={{
                      transform: "translate(-3px, 0)",
                      opacity: 0.5,
                    }}
                  >
                    {character.name}
                  </span>
                  <span
                    className="absolute top-0 left-0 text-red-500 z-0"
                    style={{
                      transform: "translate(3px, 0)",
                      opacity: 0.5,
                    }}
                  >
                    {character.name}
                  </span>
                </span>
              </h2>

              <div
                className="h-px w-24 bg-gradient-to-r from-red-500 to-blue-500 mx-auto md:mx-0 my-4"
                style={{ transformOrigin: isEven ? "left" : "right" }}
              />

              <p className="text-xl md:text-2xl text-gray-300 italic mb-6">"{character.tagline}"</p>

              <div className="relative">
                <div
                  ref={descriptionRef}
                  className={cn(
                    "text-base md:text-lg text-gray-400 leading-relaxed",
                    "max-h-[250px] pr-2 custom-scrollbar overflow-y-auto",
                  )}
                >
                  <p>{character.description}</p>
                </div>

                {!showFullBio && character.description.length > 150 && (
                  <>
                    <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-black to-transparent"></div>
                    <button
                      className="mt-2 text-blue-400 flex items-center mx-auto md:mx-0 bg-black/30 px-3 py-1 rounded-full backdrop-blur-sm"
                      onClick={() => setShowFullBio(true)}
                    >
                      Read more <ChevronRight className="h-4 w-4 ml-1" />
                    </button>
                  </>
                )}
              </div>
            </div>

            <div className="flex flex-wrap gap-3 justify-center md:justify-start mt-auto">
              {["Actor", "Goli Soda Rising", "Hotstar"].map((tag) => (
                <span key={tag} className="px-3 py-1 bg-black/50 border border-white/20 rounded-full text-sm">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Desktop/Tablet version */}
          {!isMobile && (
            <motion.div
              ref={cardRef}
              style={{
                x: imageX,
                opacity,
                scale,
              }}
              className={cn(
                "relative mx-auto perspective-1000 preserve-3d",
                !isEven && "md:col-start-1",
                "order-1 md:order-none",
                "mb-8 md:mb-0",
                "w-full",
                "max-w-[280px]",
              )}
              onMouseMove={handleMouseMove}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={handleMouseLeave}
            >
              {/* Animation-specific effects */}
              {getAnimationEffects()}

              {/* Book spine effect */}
              <motion.div
                className={`absolute inset-y-0 ${isEven ? "left-0" : "right-0"} w-4 bg-gradient-to-r from-black/80 to-black/40 z-30 hidden md:block`}
                style={{
                  transformOrigin: isEven ? "left" : "right",
                  boxShadow: isEven ? "inset 5px 0 10px rgba(0,0,0,0.5)" : "inset -5px 0 10px rgba(0,0,0,0.5)",
                }}
              />

              <motion.div
                className="relative w-full aspect-[3/4] mx-auto overflow-hidden rounded-lg shadow-2xl"
                style={{
                  transformStyle: "preserve-3d",
                  transform: isHovered
                    ? `rotateY(${mousePosition.x * 20}deg) rotateX(${-mousePosition.y * 20}deg)`
                    : "rotateY(0) rotateX(0)",
                  transition: "transform 0.2s ease-out",
                  transformOrigin: isEven ? "left center" : "right center",
                  height: "400px",
                }}
                animate={isUnfolded ? "open" : "closed"}
                variants={imageVariants}
                initial="closed"
              >
                {/* Card background with parallax effect */}
                <img
                  src={imageSrc}
                  alt={character.name}
                  className={cn(
                    "absolute inset-0 w-full h-full object-cover z-0",
                    isHovered ? "grayscale-0 contrast-110" : "grayscale contrast-125"
                  )}
                  style={{
                    transition: "transform 0.2s ease-out, filter 0.3s ease",
                    transform: isHovered
                      ? `translateX(${mousePosition.x * -10}px) translateY(${mousePosition.y * -10}px) scale(1.1)`
                      : "translateX(0) translateY(0) scale(1)",
                  }}
                />

                {/* Overlay gradients */}
                <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent z-10"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-transparent to-red-500/10 mix-blend-color-dodge z-20"></div>

                {/* Animated border */}
                <div className="absolute inset-0 z-30 overflow-hidden rounded-lg pointer-events-none">
                  <motion.div
                    className="absolute top-0 left-0 w-full h-full"
                    animate={{
                      background: [
                        "linear-gradient(90deg, transparent 0%, transparent 35%, rgba(255,255,255,0.2) 50%, transparent 65%, transparent 100%)",
                        "linear-gradient(90deg, transparent 0%, transparent 35%, rgba(255,255,255,0.2) 50%, transparent 65%, transparent 100%)",
                      ],
                      backgroundPosition: ["200% 0", "-200% 0"],
                    }}
                    transition={{
                      duration: 2.5,
                      repeat: Number.POSITIVE_INFINITY,
                      repeatType: "loop",
                      ease: "linear",
                    }}
                  />
                </div>

                {/* Hover effect overlay */}
                <motion.div
                  className="absolute inset-0 z-25 bg-gradient-to-t from-blue-900/40 to-transparent"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: isHovered ? 0.6 : 0 }}
                  transition={{ duration: 0.3 }}
                />

                {/* Character name overlay */}
                <motion.div
                  className="absolute bottom-0 left-0 right-0 p-4 z-40"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: isHovered ? 0 : 10, opacity: isHovered ? 1 : 0.7 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="text-xl font-bold text-white">{character.name}</div>
                  <div className="text-sm text-gray-300">{character.role}</div>
                </motion.div>

                {/* Interactive elements */}
                {isHovered && (
                  <motion.div
                    className="absolute inset-0 z-50 pointer-events-none"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    {[...Array(5)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute rounded-full bg-white/30 backdrop-blur-sm"
                        style={{
                          width: 10 + Math.random() * 20,
                          height: 10 + Math.random() * 20,
                          left: `${Math.random() * 100}%`,
                          top: `${Math.random() * 100}%`,
                          transform: `translateZ(${50 + Math.random() * 50}px)`,
                        }}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 0.5 + Math.random() * 0.5, scale: 1 }}
                        transition={{ duration: 0.3, delay: i * 0.05 }}
                      />
                    ))}
                  </motion.div>
                )}
              </motion.div>

              {/* Book page turn effect */}
              <motion.div
                className={`absolute inset-0 bg-gradient-to-r ${
                  isEven ? "from-black/80 to-transparent" : "from-transparent to-black/80"
                } rounded-lg z-20 hidden md:block`}
                style={{
                  opacity: isUnfolded ? 0 : 0.7,
                  transformOrigin: isEven ? "left center" : "right center",
                }}
                animate={{
                  rotateY: isUnfolded ? (isEven ? -90 : 90) : 0,
                }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              />

              {/* Floating 3D elements */}
              <motion.div
                className="absolute -top-12 -left-12 w-12 h-12 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 backdrop-blur-sm border border-white/10 z-40"
                initial={{ opacity: 0, y: 20, x: -20 }}
                whileInView={{ opacity: 1, y: 0, x: 0 }}
                transition={{ duration: 0.5, delay: 0.7 }}
                viewport={{ once: true }}
                animate={{
                  y: [0, -10, 0],
                  rotate: [0, 10, 0],
                }}
              />

              <motion.div
                className="absolute -bottom-12 left-10 w-8 h-8 rounded-full bg-gradient-to-br from-red-500/20 to-orange-500/20 backdrop-blur-sm border border-white/10 z-40"
                initial={{ opacity: 0, y: -20, x: 20 }}
                whileInView={{ opacity: 1, y: 0, x: 0 }}
                transition={{ duration: 0.5, delay: 0.8 }}
                viewport={{ once: true }}
                animate={{
                  y: [0, 10, 0],
                  rotate: [0, -10, 0],
                }}
              />

              {/* Rotating frame effect */}
              <motion.div
                className="absolute -inset-4 border border-white/10 rounded-lg z-30 hidden md:block"
                style={{
                  transformStyle: "preserve-3d",
                  transform: isHovered
                    ? `rotateY(${mousePosition.x * 10}deg) rotateX(${-mousePosition.y * 10}deg)`
                    : "rotateY(0) rotateX(0)",
                }}
                animate={{
                  borderColor: isHovered ? "rgba(59, 130, 246, 0.3)" : "rgba(255, 255, 255, 0.1)",
                  boxShadow: isHovered ? "0 0 20px rgba(59, 130, 246, 0.2)" : "none",
                }}
                transition={{ duration: 0.3 }}
              />
            </motion.div>
          )}

          {/* Mobile-specific version with simpler animations */}
          {isMobile && (
            <motion.div
              className="w-full max-w-[280px] mx-auto mb-8 order-1"
              style={{
                scale: mobileImageScale,
              }}
            >
              {/* Simple card with basic animations */}
              <motion.div
                className="relative w-full aspect-[3/4] rounded-lg overflow-hidden shadow-xl"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                whileInView={{
                  boxShadow: [
                    "0 0 20px rgba(59, 130, 246, 0.2)",
                    "0 0 30px rgba(239, 68, 68, 0.3)",
                    "0 0 20px rgba(59, 130, 246, 0.2)"
                  ]
                }}
                viewport={{ once: false }}
              >
                {/* Character image */}
                <motion.div
                  className="absolute inset-0 w-full h-full"
                  animate={{
                    scale: [1, 1.05, 1],
                    filter: ["grayscale(100%) contrast(125%)", "grayscale(80%) contrast(120%)", "grayscale(100%) contrast(125%)"]
                  }}
                  transition={{
                    duration: 5,
                    repeat: Number.POSITIVE_INFINITY,
                    repeatType: "reverse"
                  }}
                >
                  <img
                    src={imageSrc}
                    alt={character.name}
                    className="w-full h-full object-cover"
                  />
                </motion.div>

                {/* Overlay gradients */}
                <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>

                {/* Animated border */}
                <motion.div
                  className="absolute inset-0 border-2 border-transparent"
                  animate={{
                    borderColor: ["rgba(59, 130, 246, 0.3)", "rgba(239, 68, 68, 0.3)", "rgba(59, 130, 246, 0.3)"]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Number.POSITIVE_INFINITY,
                    repeatType: "reverse"
                  }}
                />

                {/* Animated overlay */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-transparent to-red-500/10 mix-blend-color-dodge"
                  animate={{
                    opacity: [0.2, 0.4, 0.2]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Number.POSITIVE_INFINITY,
                    repeatType: "reverse"
                  }}
                />

                {/* Character name with animation */}
                <motion.div
                  className="absolute bottom-0 left-0 right-0 p-4"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <motion.div
                    className="text-xl font-bold text-white"
                    animate={{
                      textShadow: [
                        "0 0 8px rgba(59, 130, 246, 0.7)",
                        "0 0 8px rgba(239, 68, 68, 0.7)",
                        "0 0 8px rgba(59, 130, 246, 0.7)"
                      ]
                    }}
                    transition={{
                      duration: 3,
                      repeat: Number.POSITIVE_INFINITY,
                      repeatType: "reverse"
                    }}
                  >
                    {character.name}
                  </motion.div>
                  <div className="text-sm text-gray-300">{character.role}</div>
                </motion.div>

                {/* Floating particles */}
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute rounded-full bg-white/30"
                    style={{
                      width: 4 + Math.random() * 8,
                      height: 4 + Math.random() * 8,
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                    }}
                    animate={{
                      y: [0, -20, 0],
                      opacity: [0, 0.8, 0],
                      scale: [0, 1, 0],
                    }}
                    transition={{
                      duration: 2 + Math.random() * 3,
                      repeat: Number.POSITIVE_INFINITY,
                      delay: Math.random() * 2,
                    }}
                  />
                ))}
              </motion.div>

              {/* Decorative elements */}
              <motion.div
                className="absolute top-2 right-2 w-8 h-8 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 backdrop-blur-sm border border-white/10 z-40"
                initial={{ opacity: 0, scale: 0 }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  rotate: 360
                }}
                transition={{
                  opacity: { duration: 0.5 },
                  scale: { duration: 0.5 },
                  rotate: {
                    duration: 10,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "linear"
                  }
                }}
              />

              <motion.div
                className="absolute bottom-2 left-2 w-6 h-6 rounded-full bg-gradient-to-br from-red-500/20 to-orange-500/20 backdrop-blur-sm border border-white/10 z-40"
                initial={{ opacity: 0, scale: 0 }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  rotate: -360
                }}
                transition={{
                  opacity: { duration: 0.5, delay: 0.2 },
                  scale: { duration: 0.5, delay: 0.2 },
                  rotate: {
                    duration: 15,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "linear"
                  }
                }}
              />
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}
