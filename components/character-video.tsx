"use client"

import { motion } from "framer-motion"
import { SafeVideoPlayer } from "./safe-video-player"

interface CharacterVideoProps {
  character: {
    name: string
    videoSrc?: string
    videoTitle?: string
  }
}

export function CharacterVideo({ character }: CharacterVideoProps) {
  // Assign specific video paths for each character with correct filenames
  let videoPath = "";
  
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
    videoPath = "/assets/videos/paldabba.mov";
  } else if (character.name === "SUNIL") {
    videoPath = "/assets/videos/sunil.mov";
  }
  
  const videoSources = character.videoSrc
    ? [character.videoSrc, videoPath]
    : [videoPath, "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"]

  const videoTitle = character.videoTitle || `${character.name} Highlight Reel`

  return (
    <motion.div
      className="mt-8 md:mt-12"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true, margin: "-100px" }}
    >
      <SafeVideoPlayer
        videoSources={videoSources}
        title={videoTitle}
        className="w-full aspect-video max-w-2xl mx-auto shadow-2xl rounded-xl overflow-hidden"
        autoplay={true}
      />

      {/* Video caption */}
      <motion.p
        className="text-center text-gray-400 text-sm mt-3 max-w-lg mx-auto"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        viewport={{ once: true }}
      >
        Watch {character.name}'s character clip from Goli Soda series
      </motion.p>
    </motion.div>
  )
}


