"use client"

import { useRef, useEffect } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { Environment } from "@react-three/drei"
import type { MotionValue } from "framer-motion"
import * as THREE from "three"

// Realistic hand model
function RealisticHand({ scrollProgress }) {
  const handRef = useRef<THREE.Group>(null)

  // Animate hand based on scroll
  useFrame(() => {
    if (!handRef.current) return

    const progress = scrollProgress.get()

    // Keep hand centered in view during scroll
    handRef.current.position.y = THREE.MathUtils.lerp(-0.5, 0, progress)

    // Rotate hand to show bottle better
    handRef.current.rotation.x = THREE.MathUtils.lerp(-Math.PI / 6, -Math.PI / 4, progress)

    // Adjust hand position to keep bottle visible
    handRef.current.position.z = THREE.MathUtils.lerp(0, 0.5, progress)

    // Rotate wrist slightly to better display the bottle
    handRef.current.rotation.z = THREE.MathUtils.lerp(0, 0.1, progress)
  })

  return (
    <group ref={handRef} position={[0, -0.5, 0]}>
      {/* Wrist */}
      <mesh castShadow position={[0, -0.3, 0]} rotation={[0.2, 0, 0]}>
        <cylinderGeometry args={[0.25, 0.3, 0.5, 16]} />
        <meshStandardMaterial color="#f0d0c0" roughness={0.7} metalness={0.1} />
      </mesh>

      {/* Palm */}
      <mesh castShadow position={[0, 0, 0.1]} rotation={[0.3, 0, 0]}>
        <boxGeometry args={[0.8, 0.2, 0.6]} />
        <meshStandardMaterial color="#f0d0c0" roughness={0.7} metalness={0.1} />
      </mesh>

      {/* Thumb base */}
      <mesh castShadow position={[-0.45, 0, 0.1]} rotation={[0, 0, -0.5]}>
        <boxGeometry args={[0.2, 0.25, 0.2]} />
        <meshStandardMaterial color="#f0d0c0" roughness={0.7} metalness={0.1} />
      </mesh>

      {/* Thumb tip */}
      <mesh castShadow position={[-0.6, 0.1, 0.2]} rotation={[0.2, 0, -0.8]}>
        <capsuleGeometry args={[0.08, 0.25, 8, 16]} />
        <meshStandardMaterial color="#f0d0c0" roughness={0.7} metalness={0.1} />
      </mesh>

      {/* Fingers */}
      {[...Array(4)].map((_, i) => {
        const posX = -0.3 + i * 0.2
        return (
          <group key={i} position={[posX, 0.1, 0.3]} rotation={[0.5, 0, 0]}>
            {/* Finger base */}
            <mesh castShadow position={[0, 0.15, 0]}>
              <capsuleGeometry args={[0.07, 0.3, 8, 16]} />
              <meshStandardMaterial color="#f0d0c0" roughness={0.7} metalness={0.1} />
            </mesh>

            {/* Finger middle joint */}
            <mesh castShadow position={[0, 0.35, 0.05]} rotation={[0.3, 0, 0]}>
              <capsuleGeometry args={[0.06, 0.25, 8, 16]} />
              <meshStandardMaterial color="#f0d0c0" roughness={0.7} metalness={0.1} />
            </mesh>

            {/* Finger tip */}
            <mesh castShadow position={[0, 0.55, 0.15]} rotation={[0.4, 0, 0]}>
              <capsuleGeometry args={[0.05, 0.2, 8, 16]} />
              <meshStandardMaterial color="#f0d0c0" roughness={0.7} metalness={0.1} />
            </mesh>
          </group>
        )
      })}

      {/* Fingernails */}
      {[...Array(4)].map((_, i) => (
        <mesh key={`nail-${i}`} castShadow position={[-0.3 + i * 0.2, 0.65, 0.35]} rotation={[0.9, 0, 0]}>
          <planeGeometry args={[0.09, 0.12]} />
          <meshStandardMaterial color="#f8f8f8" roughness={0.3} />
        </mesh>
      ))}

      {/* Thumb nail */}
      <mesh castShadow position={[-0.65, 0.2, 0.3]} rotation={[0.5, -0.3, -0.8]}>
        <planeGeometry args={[0.1, 0.12]} />
        <meshStandardMaterial color="#f8f8f8" roughness={0.3} />
      </mesh>
    </group>
  )
}

// Realistic bottle model
function RealisticBottle({ scrollProgress }) {
  const bottleRef = useRef<THREE.Mesh>(null)
  const capRef = useRef<THREE.Mesh>(null)
  const marbleRef = useRef<THREE.Mesh>(null)

  // Animate bottle based on scroll
  useFrame(() => {
    if (!bottleRef.current || !capRef.current || !marbleRef.current) return

    const progress = scrollProgress.get()

    // Keep bottle centered in view
    bottleRef.current.position.x = THREE.MathUtils.lerp(2, 0, Math.min(1, progress * 2))
    bottleRef.current.position.y = THREE.MathUtils.lerp(-1, 0, Math.min(1, progress * 2))

    // Rotate bottle to fit in hand
    bottleRef.current.rotation.z = THREE.MathUtils.lerp(Math.PI / 4, 0, Math.min(1, progress * 2))

    // Cap follows bottle
    capRef.current.position.x = bottleRef.current.position.x
    capRef.current.position.y = bottleRef.current.position.y + 0.6
    capRef.current.rotation.z = bottleRef.current.rotation.z

    // Marble follows bottle until it shoots out
    if (progress < 0.7) {
      marbleRef.current.visible = true
      marbleRef.current.position.x = bottleRef.current.position.x
      marbleRef.current.position.y = bottleRef.current.position.y
      marbleRef.current.rotation.z = bottleRef.current.rotation.z
    } else {
      // Marble shoots out
      const shootProgress = (progress - 0.7) / 0.3
      marbleRef.current.position.x = THREE.MathUtils.lerp(
        bottleRef.current.position.x,
        bottleRef.current.position.x + 3,
        shootProgress,
      )
      marbleRef.current.position.y = THREE.MathUtils.lerp(
        bottleRef.current.position.y,
        bottleRef.current.position.y + 1 - shootProgress * 0.5, // Arc trajectory
        shootProgress,
      )
      marbleRef.current.rotation.x += 0.1
      marbleRef.current.rotation.y += 0.1
    }
  })

  return (
    <>
      {/* Bottle body */}
      <mesh ref={bottleRef} castShadow position={[0, 0, 0]}>
        <cylinderGeometry args={[0.2, 0.25, 1.2, 32]} />
        <meshPhysicalMaterial
          color="#88ccff"
          transmission={0.9}
          thickness={0.5}
          roughness={0.1}
          clearcoat={1}
          clearcoatRoughness={0.1}
        />

        {/* Bottle label */}
        <mesh position={[0, 0, 0.22]} rotation={[0, 0, 0]}>
          <planeGeometry args={[0.5, 0.6]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>
      </mesh>

      {/* Bottle cap */}
      <mesh ref={capRef} castShadow position={[0, 0.6, 0]}>
        <cylinderGeometry args={[0.15, 0.18, 0.2, 16]} />
        <meshStandardMaterial color="#444" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Marble */}
      <mesh ref={marbleRef} castShadow position={[0, 0, 0]}>
        <sphereGeometry args={[0.15, 32, 32]} />
        <meshStandardMaterial color="#3366ff" metalness={0.5} roughness={0.2} />

        {/* Marble shine */}
        <mesh position={[0.05, 0.05, 0.05]}>
          <sphereGeometry args={[0.05, 16, 16]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.7} />
        </mesh>
      </mesh>
    </>
  )
}

// Water splash and effects
function SplashEffects({ scrollProgress }) {
  const effectsRef = useRef<THREE.Group>(null)
  const splashPositions = useRef<
    Array<{
      position: [number, number, number]
      direction: [number, number, number]
      speed: number
    }>
  >(
    Array(20)
      .fill(null)
      .map(() => ({
        position: [(Math.random() - 0.5) * 0.5, (Math.random() - 0.5) * 0.5, (Math.random() - 0.5) * 0.5],
        direction: [(Math.random() - 0.5) * 0.1, Math.random() * 0.1, (Math.random() - 0.5) * 0.1],
        speed: Math.random() * 0.05 + 0.02,
      })),
  )

  useFrame(() => {
    if (!effectsRef.current) return

    const progress = scrollProgress.get()

    // Only show effects when scroll progress is high enough
    effectsRef.current.visible = progress > 0.7

    if (progress > 0.7) {
      // Calculate animation progress (0 to 1) from scroll progress (0.7 to 1)
      const animProgress = (progress - 0.7) / 0.3

      // Scale effects
      const scale = THREE.MathUtils.lerp(0.1, 2, animProgress)
      effectsRef.current.scale.set(scale, scale, scale)
    }
  })

  return (
    <group ref={effectsRef} visible={false}>
      {/* Water splash particles */}
      {splashPositions.current.map((splash, i) => (
        <mesh key={i} position={splash.position as any}>
          <sphereGeometry args={[0.05 + Math.random() * 0.05, 8, 8]} />
          <meshBasicMaterial color="#88ccff" transparent opacity={0.7} />
        </mesh>
      ))}

      {/* Glow effect */}
      <mesh>
        <sphereGeometry args={[0.5, 16, 16]} />
        <meshBasicMaterial color="#4080ff" transparent opacity={0.3} />
      </mesh>
    </group>
  )
}

// Camera controller
function CameraController() {
  const { camera } = useThree()

  useEffect(() => {
    camera.position.set(0, 0, 5)
    camera.lookAt(0, 0, 0)
  }, [camera])

  return null
}

// Main scene component
function Scene({ scrollProgress }) {
  return (
    <>
      <CameraController />
      <ambientLight intensity={0.5} />
      <spotLight position={[5, 5, 5]} intensity={1} castShadow />
      <spotLight position={[-5, 5, 5]} intensity={0.8} color="#ff4040" />

      <RealisticHand scrollProgress={scrollProgress} />
      <RealisticBottle scrollProgress={scrollProgress} />
      <SplashEffects scrollProgress={scrollProgress} />

      <Environment preset="sunset" />

      {/* Ground plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#111" roughness={0.8} metalness={0.2} />
      </mesh>
    </>
  )
}

// Main exported component
export function HandBottleScene({ scrollProgress }: { scrollProgress: MotionValue<number> }) {
  return (
    <div className="w-full h-full">
      <Canvas shadows>
        <Scene scrollProgress={scrollProgress} />
      </Canvas>
    </div>
  )
}
