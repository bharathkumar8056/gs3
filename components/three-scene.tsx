"use client"

import { useRef } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { Text3D, PerspectiveCamera, Environment } from "@react-three/drei"
import * as THREE from "three"

function GlowingText({ text, position, color, glowColor, glowIntensity = 1.5, ...props }) {
  const textRef = useRef<THREE.Mesh>(null)
  const glowRef = useRef<THREE.Mesh>(null)

  useFrame(({ clock }) => {
    if (textRef.current) {
      textRef.current.rotation.y = Math.sin(clock.getElapsedTime() * 0.3) * 0.1
      textRef.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.2) * 0.05
    }

    if (glowRef.current && textRef.current) {
      glowRef.current.rotation.copy(textRef.current.rotation)
      glowRef.current.position.copy(textRef.current.position)
      glowRef.current.scale.copy(textRef.current.scale)
    }
  })

  return (
    <group position={position} {...props}>
      {/* Glow effect */}
      <mesh ref={glowRef} scale={[1.1, 1.1, 1.1]}>
        <Text3D
          font="/fonts/Geist_Bold.json"
          size={1.2}
          height={0.2}
          curveSegments={12}
          bevelEnabled
          bevelThickness={0.02}
          bevelSize={0.02}
          bevelOffset={0}
          bevelSegments={5}
        >
          {text}
          <meshBasicMaterial color={glowColor} toneMapped={false} opacity={0.4} transparent />
        </Text3D>
      </mesh>

      {/* Main text */}
      <mesh ref={textRef}>
        <Text3D
          font="/fonts/Geist_Bold.json"
          size={1.2}
          height={0.2}
          curveSegments={12}
          bevelEnabled
          bevelThickness={0.02}
          bevelSize={0.02}
          bevelOffset={0}
          bevelSegments={5}
        >
          {text}
          <meshStandardMaterial
            color={color}
            roughness={0.1}
            metalness={0.8}
            emissive={color}
            emissiveIntensity={0.5}
          />
        </Text3D>
      </mesh>
    </group>
  )
}

function FloatingBottle() {
  const bottleRef = useRef<THREE.Group>(null)

  useFrame(({ clock }) => {
    if (bottleRef.current) {
      bottleRef.current.rotation.y = clock.getElapsedTime() * 0.5
      bottleRef.current.position.y = Math.sin(clock.getElapsedTime()) * 0.1 + 0.1
    }
  })

  return (
    <group ref={bottleRef} position={[0, 0, -2]}>
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.3, 0.3, 1, 32]} />
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
      <mesh position={[0, 0.6, 0]}>
        <cylinderGeometry args={[0.2, 0.2, 0.2, 32]} />
        <meshStandardMaterial color="#444" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Marble */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.15, 32, 32]} />
        <meshStandardMaterial color="#3366ff" metalness={0.5} roughness={0.2} />
      </mesh>
    </group>
  )
}

function Particles() {
  const particlesRef = useRef<THREE.Points>(null)

  const particleCount = 500
  const positions = new Float32Array(particleCount * 3)
  const colors = new Float32Array(particleCount * 3)
  const sizes = new Float32Array(particleCount)

  for (let i = 0; i < particleCount; i++) {
    const i3 = i * 3
    positions[i3] = (Math.random() - 0.5) * 10
    positions[i3 + 1] = (Math.random() - 0.5) * 5
    positions[i3 + 2] = (Math.random() - 0.5) * 5

    // Colors: alternate between blue and red
    if (i % 2 === 0) {
      colors[i3] = 0.2 + Math.random() * 0.2 // R
      colors[i3 + 1] = 0.3 + Math.random() * 0.3 // G
      colors[i3 + 2] = 0.8 + Math.random() * 0.2 // B
    } else {
      colors[i3] = 0.8 + Math.random() * 0.2 // R
      colors[i3 + 1] = 0.2 + Math.random() * 0.2 // G
      colors[i3 + 2] = 0.2 + Math.random() * 0.2 // B
    }

    sizes[i] = Math.random() * 5
  }

  useFrame(({ clock }) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = clock.getElapsedTime() * 0.05

      const positions = particlesRef.current.geometry.attributes.position.array as Float32Array
      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3
        positions[i3 + 1] += Math.sin(clock.getElapsedTime() * 0.5 + i * 0.1) * 0.01
      }
      particlesRef.current.geometry.attributes.position.needsUpdate = true
    }
  })

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={particleCount} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-color" count={particleCount} array={colors} itemSize={3} />
        <bufferAttribute attach="attributes-size" count={particleCount} array={sizes} itemSize={1} />
      </bufferGeometry>
      <pointsMaterial size={0.05} vertexColors transparent opacity={0.8} sizeAttenuation />
    </points>
  )
}

function Scene() {
  const cameraRef = useRef<THREE.PerspectiveCamera>(null)
  const { mouse, viewport } = useThree()

  useFrame(() => {
    if (cameraRef.current) {
      // Subtle camera movement based on mouse position
      cameraRef.current.position.x = THREE.MathUtils.lerp(
        cameraRef.current.position.x,
        (mouse.x * viewport.width) / 80,
        0.05,
      )
      cameraRef.current.position.y = THREE.MathUtils.lerp(
        cameraRef.current.position.y,
        (mouse.y * viewport.height) / 80,
        0.05,
      )
      cameraRef.current.lookAt(0, 0, 0)
    }
  })

  return (
    <>
      <PerspectiveCamera ref={cameraRef} makeDefault position={[0, 0, 5]} fov={50} />
      <ambientLight intensity={0.5} />
      <spotLight position={[5, 5, 5]} intensity={1} castShadow />
      <spotLight position={[-5, 5, 5]} intensity={0.8} color="#ff4040" />
      <spotLight position={[0, -5, 5]} intensity={0.8} color="#4080ff" />

      <GlowingText text="GOLI" position={[-2.5, 0.5, 0]} color="#ff4040" glowColor="#ff0000" />
      <GlowingText text="SODA" position={[0.5, -0.5, 0]} color="#4080ff" glowColor="#0040ff" />

      <FloatingBottle />
      <Particles />

      <Environment preset="sunset" />
    </>
  )
}

export function ThreeScene() {
  return (
    <div className="w-full h-full">
      <Canvas>
        <Scene />
      </Canvas>
    </div>
  )
}
