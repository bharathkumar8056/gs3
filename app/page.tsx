"use client"

import { useEffect, useRef, useState } from "react"
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { useMobile } from "@/hooks/use-mobile"
import { CharacterCard } from "@/components/character-card"
import { ParticleBackground } from "@/components/particle-background"
import { DirectorSection } from "@/components/director-section"
import { ProductionSection } from "@/components/production-section"
import { SafeHandAnimation } from "@/components/safe-hand-animation"
import { SafeCompassAnimation } from "@/components/safe-compass-animation"
import { SafeVideoPlayer } from "@/components/safe-video-player"
import { InitialAnimation } from "@/components/initial-animation"
import { SmokeEffect } from "@/components/smoke-effect"
import { ScrollCue } from "@/components/scroll-cue"
import { TrailerReveal } from "@/components/trailer-reveal"
import { CharacterIntroSection } from "@/components/character-intro-section"

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null)
  const isMobile = useMobile()
  const [isLoaded, setIsLoaded] = useState(false)
  const [showScrollCue, setShowScrollCue] = useState(true)
  const [activeSection, setActiveSection] = useState(0)
  const [isClient, setIsClient] = useState(false)

  // Set isClient to true when component mounts
  useEffect(() => {
    setIsClient(true)
  }, [])

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  })

  // Opacity for scroll cue
  const scrollCueOpacity = useTransform(scrollYProgress, [0, 0.1], [1, 0])

  useEffect(() => {
    // Only run on client side
    if (typeof window === "undefined") return

    // Hide scroll cue after user has scrolled
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setShowScrollCue(false)
      } else {
        setShowScrollCue(true)
      }

      // Update active section based on scroll position
      const sections = document.querySelectorAll("section")
      sections.forEach((section, index) => {
        const rect = section.getBoundingClientRect()
        if (rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2) {
          setActiveSection(index)
        }
      })
    }

    window.addEventListener("scroll", handleScroll)

    // Reset scroll position to top
    window.scrollTo(0, 0)

    // Simulate loading state
    const timer = setTimeout(() => {
      setIsLoaded(true)
    }, 800)

    return () => {
      window.removeEventListener("scroll", handleScroll)
      clearTimeout(timer)
    }
  }, [])

  const characters = [
    {
      name: "RAJ THARUN",
      role: "BALA",
      tagline: "Boy-next-door charm meets raw intensity",
      description:
        "Raj Tharun is a popular Telugu actor known for his work in Telugu cinema. He made his debut in 2014 with the film Uyyala Jampala, which was a commercial success. In addition to his success in Telugu, Raj Tharun is making his Tamil debut with our film, marking an exciting new chapter in his career. He will be seen in the role of Bala, bringing his signature charm and versatility to Tamil audiences for the first time.",
      image: "/assets/raj-tharun.jpg",
      color: "from-blue-600/30 to-transparent",
      animationType: "book",
    },
    {
      name: "ANISH",
      role: "PAAL DABBA / YUVRAJ",
      tagline: "From viral hits to explosive action",
      description:
        "Anish aka Paal Dabba is an emerging Indian singer and performer with a large and dedicated fanbase. He gained recognition with his 2022 debut single '3SHA' while part of Bfab Dance Crew. His track '170CM' (2023) was featured in Apple's Work is Worth It campaign, earning critical acclaim. In 2024, he sang 'Galatta' (Aavesham), which amassed 30M+ streams, and his viral hit 'Kathu Mela' with OfRo charted in Spotify India's Top 100. With a rapidly growing following, Anish is now set to make his acting debut in our upcoming film.",
      image: "/assets/paal-dabba.jpg",
      color: "from-red-600/30 to-transparent",
      animationType: "magical",
    },
    {
      name: "KISHORE DS",
      role: "INBARAJ",
      tagline: "Intensity personified",
      description:
        "Kishore DS is an Indian actor best known for his role in the critically acclaimed Tamil film Goli Soda (2014). His performance in the film was widely praised for its intensity and authenticity. Kishore started his career as a child artist and gained recognition for his natural acting style. He continues to be a promising talent in the Tamil film industry.",
      image: "/assets/kishore.jpg",
      color: "from-purple-600/30 to-transparent",
      animationType: "slide",
    },
    {
      name: "BHARATH SEENI",
      role: "MAARAN",
      tagline: "The legacy continues",
      description:
        "Bharath Seeni is an Indian actor known for his work in Tamil cinema. He gained recognition for his role as Maaran in Goli Soda 2 (2018) and reprised this character in the 2024 web series Goli Soda Rising, a sequel to the original film. His filmography also includes Kadugu (2017). With his impactful screen presence and versatile acting, Bharath continues to be a promising talent in the industry.",
      image: "/assets/Bharath-Seeni.jpg",
      color: "from-green-600/30 to-transparent",
      animationType: "fade",
    },
    {
      name: "JEFFREY",
      role: "BIGG BOSS JEFFREY",
      tagline: "From reality TV to raw reality",
      description:
        "Bigg Boss Jeffrey is a Tamil gana singer and rapper known for his raw and relatable music. He gained widespread recognition as a contestant on Bigg Boss Tamil Season 8 in 2024. His participation in the show further boosted his popularity in the media industry. Jeffrey is now set to make his acting debut in our upcoming film, marking an exciting new phase in his career.",
      image: "/assets/Jeffrey.jpg",
      color: "from-yellow-600/30 to-transparent",
      animationType: "rotate",
    },
    {
      name: "BHARATH",
      role: "KALVETTU",
      tagline: "Emotional depth meets raw intensity",
      description:
        "Bharath is a versatile Tamil actor known for his natural performances and emotional depth. Debuting in 'Boys' (2003), he quickly gained recognition for his ability to tackle both lighthearted and intense roles. With films like 'Veyil' (2006) and 'Kadhal' (2003), he showcased his wide range. His strong screen presence and ability to connect emotionally with audiences make him an excellent choice for varied roles, from romantic dramas to action films.",
      image: "/assets/bharath.jpg",
      color: "from-indigo-600/30 to-transparent",
      animationType: "portal",
    },
    {
      name: "AMMU ABHIRAMI",
      role: "NANDHINI",
      tagline: "Subtle strength with captivating presence",
      description:
        "Ammu Abhirami is a talented Indian actress who has made a significant impact in Tamil cinema with her nuanced performances. She gained widespread recognition for her role in the critically acclaimed film 'Asuran' (2019), where her portrayal of a strong-willed character earned her praise from both audiences and critics. Known for her ability to convey complex emotions with subtle expressions, Ammu brings depth and authenticity to every character she portrays. In Goli Soda 3, she takes on the challenging role of Nandhini, a character that showcases her versatility and emotional range as an actress. Her natural acting style and screen presence make her a perfect addition to the Goli Soda universe.",
      image: "/assets/ammu-abhirami.jpg", 
      color: "from-pink-600/30 to-transparent",
      animationType: "glitch",
    },
    {
      name: "AARI",
      role: "IRIS",
      tagline: "From Bigg Boss winner to big screen",
      description:
        "Aari Arujunan is an Indian actor known for his work in Tamil cinema. He made his lead debut in Rettaisuzhi (2010), produced by director Shankar, and gained recognition for his performance as Murugan in Nedunchaalai (2014). He also starred in the supernatural thriller Maya. In 2021, Aari won Bigg Boss Tamil Season 4, further increasing his popularity. His dedication to diverse roles and strong screen presence make him a valuable addition to any film project.",
      image: "/assets/aari.jpg",
      color: "from-teal-600/30 to-transparent",
      animationType: "flip3d",
    },
    {
      name: "PRASANNA",
      role: "PANDI",
      tagline: "Digital sensation to screen powerhouse",
      description:
        "Prasanna Balachandran is an Indian actor and scriptwriter, best known for his work with the popular Tamil YouTube channel Nakkalites, which he co-founded in 2017. He has played significant roles in various web series and short films, including portraying a Tamil teacher in the 2021 series Return to School. Prasanna made his Tamil film debut with Seththumaan and has contributed to projects like Ammuchi, Boomika Back to School, and Suzhal: The Vortex.",
      image: "/assets/prasanna.jpg",
      color: "from-orange-600/30 to-transparent",
      animationType: "morph",
    },
    {
      name: "SUNIL",
      role: "POONGA",
      tagline: "180 films, countless memories",
      description:
        "Sunil is a versatile Indian actor known for his work in Telugu cinema, with over 180 films to his credit. Starting as a comedian, he won three Nandi Awards and two Filmfare Awards South before transitioning to lead and character roles. He delivered acclaimed performances in films like Maryada Ramanna, Poola Rangadu, Pushpa: The Rise, and Jailer. With his adaptability and strong screen presence, Sunil remains a valuable asset to any film project.",
      image: "/assets/sunil.jpg",
      color: "from-purple-600/30 to-transparent",
      animationType: "reveal",
    },
  ]

  // Update the charactersWithVideos array to use local video files
  const charactersWithVideos = characters.map((character) => {
    let videoPath = "";
    
    // Assign specific video paths for each character with correct filenames
    if (character.name === "RAJ THARUN") {
      videoPath = "/assets/videos/raj-tharun.mov";
    } else if (character.name === "ANISH") {
      videoPath = "/assets/videos/anish.mov";
    } else if (character.name === "KISHORE DS") {
      videoPath = "/assets/videos/kishore.mov";
    } else if (character.name === "BHARATH SEENI") {
      videoPath = "/assets/videos/BHARATH ANNA.mov";
    } else if (character.name === "JEFFREY") {
      videoPath = "/assets/videos/jeffrey.mov";
    } else if (character.name === "BHARATH") {
      videoPath = "/assets/videos/bharath.mov";
    } else if (character.name === "AMMU ABHIRAMI") {
      videoPath = "/assets/videos/ammu.mov";
    } else if (character.name === "AARI") {
      videoPath = "/assets/videos/aari.mov";
    } else if (character.name === "PRASANNA") {
      videoPath = "/assets/videos/prasanna.mov";
    } else if (character.name === "SUNIL") {
      videoPath = "/assets/videos/sunil.mov";
    }
    
    return {
      ...character,
      videoSources: [
        videoPath,
        // Add a fallback in case the primary video doesn't work
        "/assets/videos/sample-video.mp4"
      ],
      videoTitle: `${character.name} - Character Spotlight`,
    }
  })

  // Calculate total number of sections for navigation dots
  const totalSections = 5 + charactersWithVideos.length + 2 // +5 for intro, 3 trailers, character intro, +2 for director and production sections

  if (!isClient) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }

  return (
    <motion.div
      ref={containerRef}
      className="relative bg-black text-white overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      {/* Opening dot animation */}
      {isClient && <InitialAnimation />}

      {/* Global smoke effect */}
      <SmokeEffect />

      {/* Loading overlay */}
      <AnimatePresence>
        {!isLoaded && (
          <motion.div
            className="fixed inset-0 bg-black z-50 flex items-center justify-center"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{
                scale: [0.8, 1, 0.9, 1.1, 1],
                opacity: [0, 1, 1, 1, 1],
              }}
              exit={{ scale: 1.2, opacity: 0 }}
              transition={{
                duration: 1.5,
                times: [0, 0.2, 0.4, 0.6, 1],
                ease: "easeInOut",
              }}
            >
              <div className="relative w-24 h-24">
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-red-500 to-blue-500 animate-spin blur-md opacity-50"></div>
                <div className="absolute inset-2 rounded-full bg-black"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.span
                    className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-blue-500"
                    animate={{
                      backgroundPosition: ["0% 0%", "100% 100%"],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Number.POSITIVE_INFINITY,
                      repeatType: "reverse",
                    }}
                  >
                    GS
                  </motion.span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation dots */}
      <div className="fixed right-4 md:right-8 top-1/2 transform -translate-y-1/2 z-50">
        <div className="flex flex-col gap-4">
          {[...Array(totalSections)].map((_, index) => (
            <Link
              key={index}
              href={`#section-${index}`}
              className={cn(
                "w-2 md:w-3 h-2 md:h-3 rounded-full transition-all duration-300 relative group",
                activeSection === index ? "bg-white scale-125" : "bg-white/30 hover:bg-white/50",
              )}
              aria-label={`Navigate to section ${index + 1}`}
            >
              <motion.span
                className="absolute -left-24 top-0 opacity-0 text-xs whitespace-nowrap bg-black/80 px-2 py-1 rounded hidden md:block"
                animate={{ opacity: activeSection === index ? 1 : 0 }}
                transition={{ duration: 0.3 }}
              >
                {index === 0
                  ? "Intro"
                  : index === 1
                    ? "Goli Soda 1"
                    : index === 2
                      ? "Goli Soda 2"
                      : index === 3
                        ? "Goli Soda 1.5"
                        : index === 4
                          ? "Legacy Continues"
                          : index === 5
                            ? "Meet Characters"
                            : index < 6 + charactersWithVideos.length
                              ? charactersWithVideos[index - 6].name
                              : index === 6 + charactersWithVideos.length
                                ? "Director"
                                : index === 7 + charactersWithVideos.length
                                  ? "Production"
                                  : "Finale"}
              </motion.span>
            </Link>
          ))}
        </div>
      </div>

      {/* Particle background */}
      <div className="fixed inset-0 z-0 opacity-30">
        <ParticleBackground />
      </div>

      {/* Intro Section - Simplified to just have the scroll animation */}
      <section id="section-0" className="relative h-screen flex flex-col items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/90 to-black/70 z-0"></div>
        <Image
          src="/assets/banner.png"
          alt="Moody background"
          fill
          className="object-cover opacity-20 z-0"
          priority
        />

        <div className="container relative z-10 px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: isLoaded ? 1 : 0, y: 0 }}
            transition={{ duration: 0.8, delay: 1.5 }}
            className="mb-8"
          >
            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-4">
              <span className="text-gradient-red-blue">GOLI SODA</span>
            </h1>
          </motion.div>
        </div>

        {/* Scroll cue */}
        <AnimatePresence>
          {showScrollCue && <ScrollCue opacity={scrollCueOpacity} text="Scroll to Discover the Legacy" />}
        </AnimatePresence>
      </section>

      {/* Video Section 1 - Goli Soda 1 */}
      <section id="section-1" className="relative min-h-screen flex items-center py-20">
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/70 to-black/80 z-0"></div>

        <div className="container relative z-10 px-4">
          <TrailerReveal
            title="Goli Soda (2014)"
            videoSources={[
              "/assets/videos/gs1-vd.mp4",
              "/assets/videos/trailer-1.mp4",
            ]}
            description="Released on January 24, 2014, this film featuring a cast of newcomers became a significant success, launching the Goli Soda franchise."
          />
        </div>
      </section>

      {/* Video Section 2 - Goli Soda 2 */}
      <section id="section-2" className="relative min-h-screen flex items-center py-20">
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/70 z-0"></div>

        <div className="container relative z-10 px-4">
          <TrailerReveal
            title="Goli Soda 2 (2018)"
            videoSources={[
              "/assets/videos/gs2-vd.mp4",
              "/assets/videos/trailer-2.mp4",
            ]}
            description="Following the success of the first film, Goli Soda 2 was released on June 14, 2018, and also garnered widespread acclaim."
            reverse={true}
          />
        </div>
      </section>

      {/* Video Section 3 - Goli Soda Rising */}
      <section id="section-3" className="relative min-h-screen flex items-center py-20">
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/60 z-0"></div>

        <div className="container relative z-10 px-4">
          <TrailerReveal
            title="Goli Soda Rising (2024)"
            videoSources={[
              "/assets/videos/gs-rising.mp4",
              "/assets/videos/gs3-vd.mp4",
            ]}
            description="In 2024, the next installment, Goli Soda Rising, was launched as a web series on the Hotstar OTT platform, receiving positive reception from audiences."
          />
        </div>
      </section>

      {/* The Legacy Continues - Hand Animation Section */}
      <section id="section-4">
        <SafeHandAnimation />
      </section>

      {/* Character Intro Section - NEW */}
      <section id="section-5">
        <CharacterIntroSection />
      </section>

      {/* Character Sections with Videos */}
      {charactersWithVideos.map((character, index) => (
        <section key={character.name} id={`section-${index + 6}`} className="relative">
          <ScrollCue
            text={`Scroll to Meet ${character.name}`}
            showOnlyWhenActive={activeSection === index + 6}
            position="top"
          />
          <CharacterCard 
            character={{
              ...character,
              animationType: character.animationType as "book" | "magical" | "slide" | "fade" | "rotate" | "portal" | "glitch" | "flip3d" | "morph" | "reveal"
            }} 
            index={index} 
            sectionId={`character-${index}`} 
            isMobile={isMobile} 
          />
          <SafeVideoPlayer
            videoSources={
              character.videoSources || [
                "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
              ]
            }
            title={character.videoTitle || `${character.name} Highlight Reel`}
            className="w-full aspect-video max-w-2xl mx-auto shadow-2xl rounded-xl overflow-hidden"
            autoplay={true}
          />
        </section>
      ))}

      {/* Director Section */}
      <section id={`section-${6 + charactersWithVideos.length}`}>
        <ScrollCue
          text="Scroll to Meet the Director"
          showOnlyWhenActive={activeSection === 6 + charactersWithVideos.length - 1}
          position="top"
        />
        <DirectorSection />
      </section>

      {/* Production Company Section */}
      <section id={`section-${7 + charactersWithVideos.length}`}>
        <ScrollCue
          text="Scroll to Discover the Production"
          showOnlyWhenActive={activeSection === 7 + charactersWithVideos.length - 1}
          position="top"
        />
        <ProductionSection />
      </section>

      {/* Final Compass Animation */}
      <section id={`section-${8 + charactersWithVideos.length}`}>
        <ScrollCue
          text="Scroll to See What's Coming"
          showOnlyWhenActive={activeSection === 8 + charactersWithVideos.length - 1}
          position="top"
        />
        <SafeCompassAnimation />
      </section>
    </motion.div>
  )
}









