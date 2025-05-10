"use client"

import { useRef, useState, useEffect } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { PerspectiveCamera, Environment, Text3D } from "@react-three/drei"
import * as THREE from "three"

// Gun model that forms the compass circle
function Gun({ position, rotation, delay, scale = 1, color = "#ffffff", index, totalGuns = 20 }) {
  const gunRef = useRef<THREE.Group>(null)
  const [active, setActive] = useState(false)

  useEffect(() => {
    // Activate gun after delay
    const timer = setTimeout(() => {
      setActive(true)
    }, delay * 1000)

    return () => clearTimeout(timer)
  }, [delay])

  useFrame(({ clock }) => {
    if (!gunRef.current || !active) return

    const time = clock.getElapsedTime()

    // Calculate angle based on index
    const angle = (index / totalGuns) * Math.PI * 2

    // Start from outside and move toward final position in a circle
    const targetRadius = 5
    const currentRadius = targetRadius + 10 * Math.max(0, 1 - (time - delay) / 2)

    // Position gun in circular pattern
    gunRef.current.position.x = Math.cos(angle) * currentRadius
    gunRef.current.position.y = Math.sin(angle) * currentRadius

    // Rotate gun to point outward
    gunRef.current.rotation.z = angle + Math.PI / 2

    // Add slight wobble
    gunRef.current.rotation.x = Math.sin(time * 0.5 + index) * 0.05
  })

  // Alternate between black and silver guns
  const gunColor = index % 2 === 0 ? "#222222" : "#cccccc"

  return (
    <group ref={gunRef} position={position} rotation={rotation} scale={scale} visible={active}>
      {/* Gun barrel */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[0.2, 2, 0.2]} />
        <meshStandardMaterial color={gunColor} metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Gun handle */}
      <mesh castShadow receiveShadow position={[0, -1, 0.3]}>
        <boxGeometry args={[0.25, 0.8, 0.4]} />
        <meshStandardMaterial color={gunColor === "#222222" ? "#111111" : "#aaaaaa"} metalness={0.7} roughness={0.3} />
      </mesh>

      {/* Gun trigger */}
      <mesh castShadow position={[0, -0.6, 0.1]}>
        <boxGeometry args={[0.1, 0.3, 0.1]} />
        <meshStandardMaterial color="#333333" />
      </mesh>

      {/* Blood splatter - randomly positioned on some guns */}
      {Math.random() > 0.6 && (
        <mesh position={[(Math.random() - 0.5) * 0.3, Math.random() * 1 - 0.5, 0.11]}>
          <planeGeometry args={[0.3 + Math.random() * 0.3, 0.3 + Math.random() * 0.3]} />
          <meshStandardMaterial color="#cc0000" transparent opacity={0.8} />
        </mesh>
      )}
    </group>
  )
}

// Blood drips and splatters
function BloodEffects({ visible }) {
  const groupRef = useRef<THREE.Group>(null)
  const dripsRef = useRef<
    Array<{
      ref: { current: THREE.Mesh | null }
      speed: number
      position: [number, number, number]
      scale: number
    }>
  >([])

  // Initialize drip refs
  useEffect(() => {
    dripsRef.current = Array(15)
      .fill(null)
      .map(() => ({
        ref: { current: null },
        speed: Math.random() * 0.01 + 0.002,
        position: [(Math.random() - 0.5) * 8, (Math.random() - 0.5) * 8, Math.random() * 0.5],
        scale: 0.3 + Math.random() * 0.7,
      }))
  }, [])

  useFrame(({ clock }) => {
    if (!groupRef.current || !visible) return

    const time = clock.getElapsedTime()

    // Animate blood drips
    dripsRef.current.forEach((drip) => {
      if (drip.ref.current) {
        // Slow dripping motion
        drip.ref.current.position.y -= drip.speed

        // Reset position when it drips too far
        if (drip.ref.current.position.y < -10) {
          drip.ref.current.position.y = 10
        }

        // Pulsing effect
        const scale = drip.scale * (1 + Math.sin(time + drip.position[0]) * 0.1)
        drip.ref.current.scale.set(scale, scale, scale)
      }
    })
  })

  return (
    <group ref={groupRef} visible={visible}>
      {/* Blood drips */}
      {dripsRef.current.map((drip, i) => (
        <mesh
          key={i}
          ref={(el) => {
            if (el) drip.ref.current = el
          }}
          position={drip.position as any}
        >
          <planeGeometry args={[1, 1.5]} />
          <meshStandardMaterial color="#cc0000" transparent opacity={0.7} side={THREE.DoubleSide} />
        </mesh>
      ))}

      {/* Large blood splatters */}
      {[...Array(5)].map((_, i) => (
        <mesh
          key={`splatter-${i}`}
          position={[(Math.random() - 0.5) * 10, (Math.random() - 0.5) * 10, -0.5]}
          rotation={[0, 0, Math.random() * Math.PI * 2]}
          scale={[2 + Math.random() * 3, 2 + Math.random() * 3, 1]}
        >
          <planeGeometry args={[1, 1]} />
          <meshStandardMaterial color="#cc0000" transparent opacity={0.4} side={THREE.DoubleSide} />
        </mesh>
      ))}
    </group>
  )
}

// Center emblem with GS3 logo
function CenterEmblem({ visible }) {
  const emblRef = useRef<THREE.Group>(null)

  useFrame(({ clock }) => {
    if (!emblRef.current || !visible) return

    const time = clock.getElapsedTime()

    // Floating animation
    emblRef.current.position.y = Math.sin(time * 0.5) * 0.1

    // Slight rotation
    emblRef.current.rotation.z = Math.sin(time * 0.3) * 0.05
  })

  return (
    <group ref={emblRef} visible={visible}>
      {/* Blue shield background */}
      <mesh position={[0, 0, 0]}>
        <circleGeometry args={[2.5, 32]} />
        <meshStandardMaterial color="#0066cc" metalness={0.5} roughness={0.3} />
      </mesh>

      {/* Inner white circle */}
      <mesh position={[0, 0, 0.01]}>
        <circleGeometry args={[2.3, 32]} />
        <meshStandardMaterial color="#ffffff" metalness={0.2} roughness={0.5} />
      </mesh>

      {/* GS3 Text */}
      <group position={[0, 0.3, 0.1]}>
        <Text3D
          font="/fonts/Geist_Bold.json"
          size={0.8}
          height={0.2}
          curveSegments={12}
          bevelEnabled
          bevelThickness={0.02}
          bevelSize={0.02}
          position={[-1.2, 0, 0]}
        >
          GS
          <meshStandardMaterial
            color="#cc0000"
            metalness={0.8}
            roughness={0.2}
            emissive="#cc0000"
            emissiveIntensity={0.3}
          />
        </Text3D>

        <Text3D
          font="/fonts/Geist_Bold.json"
          size={1}
          height={0.2}
          curveSegments={12}
          bevelEnabled
          bevelThickness={0.02}
          bevelSize={0.02}
          position={[0.5, -0.1, 0]}
        >
          3
          <meshStandardMaterial
            color="#cc0000"
            metalness={0.8}
            roughness={0.2}
            emissive="#cc0000"
            emissiveIntensity={0.3}
          />
        </Text3D>
      </group>

      {/* "SOON" text with stylized font */}
      <Text3D
        font="/fonts/Geist_Bold.json"
        size={0.4}
        height={0.05}
        position={[-0.6, -1, 0.1]}
        bevelEnabled
        bevelThickness={0.01}
        bevelSize={0.01}
      >
        SOON
        <meshStandardMaterial
          color="#cc0000"
          metalness={0.5}
          roughness={0.3}
          emissive="#cc0000"
          emissiveIntensity={0.5}
        />
      </Text3D>

      {/* Subtitle */}
      <Text3D font="/fonts/Geist_Regular.json" size={0.2} height={0.02} position={[-1.5, -1.5, 0.1]}>
        GODS & SOLDIERS
        <meshStandardMaterial color="#000000" metalness={0.3} roughness={0.7} />
      </Text3D>
    </group>
  )
}

// Main scene component
function Scene({ animationComplete }) {
  // Red background plane
  const bgRef = useRef<THREE.Mesh>(null)

  useFrame(({ clock }) => {
    if (bgRef.current) {
      const time = clock.getElapsedTime()
      // Subtle pulsing effect for the background
      const material = bgRef.current.material as THREE.MeshBasicMaterial
      if (material) {
        material.opacity = 0.8 + Math.sin(time * 0.5) * 0.1
      }
    }
  })

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 15]} fov={40} />
      <ambientLight intensity={0.5} />
      <spotLight position={[10, 10, 10]} intensity={1} castShadow />
      <spotLight position={[-10, -10, 10]} intensity={0.5} color="#ff4040" />

      {/* Red background */}
      <mesh ref={bgRef} position={[0, 0, -5]}>
        <planeGeometry args={[50, 50]} />
        <meshBasicMaterial color="#cc0000" transparent opacity={0.8} />
      </mesh>

      {/* Blood effects */}
      <BloodEffects visible={true} />

      {/* Guns in circular pattern */}
      {[...Array(20)].map((_, i) => (
        <Gun
          key={i}
          index={i}
          totalGuns={20}
          position={[Math.cos((i / 20) * Math.PI * 2) * 15, Math.sin((i / 20) * Math.PI * 2) * 15, 0]}
          rotation={[0, 0, (i / 20) * Math.PI * 2 + Math.PI / 2]}
          delay={i * 0.15}
          scale={0.8 + Math.random() * 0.4}
          color={i % 2 === 0 ? "#222222" : "#cccccc"}
        />
      ))}

      {/* Center emblem */}
      <CenterEmblem visible={animationComplete} />

      <Environment preset="sunset" />
    </>
  )
}

// Main exported component - fixed to prevent hydration errors
export function CompassScene({ animationComplete }) {
  return (
    <div className="w-full h-full">
      <Canvas shadows>
        <Scene animationComplete={animationComplete} />
      </Canvas>
    </div>
  )
}
