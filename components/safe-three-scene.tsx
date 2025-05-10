"use client"

import { Suspense, useEffect, useState } from "react"
import dynamic from "next/dynamic"
import { ErrorBoundary } from "./error-boundary"
import { isWebGLSupported } from "@/lib/client-utils"

// Dynamically import the ThreeScene component
const ThreeSceneComponent = dynamic(() => import("./three-scene").then((mod) => mod.ThreeScene), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[300px] md:h-[400px] flex items-center justify-center bg-black/50 rounded-lg">
      <div className="text-white text-lg">Loading 3D Scene...</div>
    </div>
  ),
})

export function SafeThreeScene() {
  const [supported, setSupported] = useState(true)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    setSupported(isWebGLSupported())
  }, [])

  if (!mounted) {
    return (
      <div className="w-full h-[300px] md:h-[400px] flex items-center justify-center bg-black/50 rounded-lg">
        <div className="text-white text-lg">Loading...</div>
      </div>
    )
  }

  if (!supported) {
    return (
      <div className="w-full h-[300px] md:h-[400px] flex items-center justify-center bg-black/50 rounded-lg">
        <div className="text-white text-center p-4">
          <h3 className="text-xl font-bold mb-2">3D Not Supported</h3>
          <p className="text-sm text-gray-300">Your device doesn't support WebGL required for 3D content</p>
        </div>
      </div>
    )
  }

  return (
    <ErrorBoundary>
      <Suspense
        fallback={
          <div className="w-full h-[300px] md:h-[400px] flex items-center justify-center bg-black/50 rounded-lg">
            <div className="text-white text-lg">Loading 3D Scene...</div>
          </div>
        }
      >
        <ThreeSceneComponent />
      </Suspense>
    </ErrorBoundary>
  )
}
