"use client"

import { useEffect, useRef, useState } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { PerspectiveCamera, Environment } from "@react-three/drei"
import * as THREE from "three"

function Bottle({ animationComplete, setAnimationComplete }) {
  const bottleRef = useRef<THREE.Group>(null)
  const marbleRef = useRef<THREE.Mesh>(null)
  const [bottleTilted, setBottleTilted] = useState(false)
  const [marbleReleased, setMarbleReleased] = useState(false)

  // Animation timeline
  useEffect(() => {
    const timeline = async () => {
      // Wait for initial delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Shake bottle
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Tilt bottle
      setBottleTilted(true)
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Release marble
      setMarbleReleased(true)
      await new Promise((resolve) => setTimeout(resolve, 300))

      // Complete animation
      setAnimationComplete(true)
    }

    timeline()
  }, [setAnimationComplete])

  useFrame(({ clock }) => {
    if (!bottleRef.current || !marbleRef.current) return

    const time = clock.getElapsedTime()

    // Initial subtle floating animation
    if (!bottleTilted) {
      bottleRef.current.position.y = Math.sin(time) * 0.05
      bottleRef.current.rotation.y = Math.sin(time * 0.5) * 0.1

      // Shake animation
      if (time > 1 && time < 2.5) {
        bottleRef.current.rotation.z = Math.sin(time * 15) * 0.1
        bottleRef.current.position.x = Math.sin(time * 15) * 0.05
      }
    }

    // Tilt bottle
    if (bottleTilted && !marbleReleased) {
      bottleRef.current.rotation.z = THREE.MathUtils.lerp(bottleRef.current.rotation.z, Math.PI * 0.25, 0.1)
    }

    // Marble physics
    if (marbleReleased) {
      // Keep bottle tilted
      bottleRef.current.rotation.z = Math.PI * 0.25

      // Marble trajectory
      marbleRef.current.position.x += 0.05
      marbleRef.current.position.y += 0.02
      marbleRef.current.rotation.x += 0.1
      marbleRef.current.rotation.z += 0.1

      // Gravity effect
      if (marbleRef.current.position.y > 0.5) {
        marbleRef.current.position.y -= 0.01
      }
    }
  })

  return (
    <group>
      {/* Bottle */}
      <group ref={bottleRef} position={[0, 0, 0]}>
        <mesh position={[0, 0, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.3, 0.3, 1.2, 32]} />
          <meshPhysicalMaterial
            color="#88ccff"
            transmission={0.9}
            thickness={0.5}
            roughness={0.1}
            clearcoat={1}
            clearcoatRoughness={0.1}
          />
        </mesh>

        {/* Bottle cap */}
        <mesh position={[0, 0.7, 0]} castShadow>
          <cylinderGeometry args={[0.2, 0.2, 0.2, 32]} />
          <meshStandardMaterial color="#444" metalness={0.8} roughness={0.2} />
        </mesh>

        {/* Bottle label */}
        <mesh position={[0, 0, 0.31]} rotation={[0, 0, 0]}>
          <planeGeometry args={[0.6, 0.4]} />
          <meshStandardMaterial color="#fff" metalness={0.1} roughness={0.6} />
        </mesh>
      </group>

      {/* Marble */}
      <mesh ref={marbleRef} position={[0, 0, 0]} castShadow>
        <sphereGeometry args={[0.15, 32, 32]} />
        <meshStandardMaterial color="#3366ff" metalness={0.5} roughness={0.2} />
      </mesh>

      {/* Splash particles - only visible when animation is complete */}
      {animationComplete && (
        <>
          {[...Array(20)].map((_, i) => (
            <mesh
              key={i}
              position={[0.5 + Math.random() * 1, 0.5 + Math.random() * 0.5, Math.random() - 0.5]}
              scale={[0.05, 0.05, 0.05]}
            >
              <sphereGeometry />
              <meshStandardMaterial color="#88ccff" transparent opacity={0.7} />
            </mesh>
          ))}
        </>
      )}
    </group>
  )
}

function Scene({ animationComplete, setAnimationComplete }) {
  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={40} />
      <ambientLight intensity={0.5} />
      <spotLight position={[5, 5, 5]} intensity={1} castShadow />
      <spotLight position={[-5, 5, 5]} intensity={0.8} color="#ff4040" />

      <Bottle animationComplete={animationComplete} setAnimationComplete={setAnimationComplete} />

      <Environment preset="sunset" />

      {/* Ground plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]} receiveShadow>
        <planeGeometry args={[10, 10]} />
        <meshStandardMaterial color="#111" roughness={0.8} metalness={0.2} />
      </mesh>
    </>
  )
}

export function BottleCanvas({ animationComplete, setAnimationComplete }) {
  return (
    <div className="w-full h-full">
      <Canvas shadows>
        <Scene animationComplete={animationComplete} setAnimationComplete={setAnimationComplete} />
      </Canvas>
    </div>
  )
}
