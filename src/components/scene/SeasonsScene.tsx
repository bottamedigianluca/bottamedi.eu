import React, { useRef, useMemo, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useReducedMotion } from 'framer-motion'
import * as THREE from 'three'

// Le quattro stagioni del banco. Non decorazione: la stagionalita' e' il
// mestiere, e questa scena la rende visibile prima di qualsiasi testo.
export type Season = {
  key: string
  light: string      // colore della luce d'ambiente
  ground: string     // fondo della scena
  produce: string[]  // colori dei frutti in scena
}

export const SEASONS: Season[] = [
  { key: 'primavera', light: '#ffe9c9', ground: '#f2f8ef', produce: ['#e4433f', '#74ae60', '#ff9a9a', '#c4dfb8'] },
  { key: 'estate',    light: '#fff3d0', ground: '#fff8ec', produce: ['#f97e3c', '#f5a623', '#e4433f', '#ffd45c'] },
  { key: 'autunno',   light: '#ffd9a8', ground: '#faf7f2', produce: ['#c9541b', '#ab8358', '#f5a623', '#8f6a47'] },
  { key: 'inverno',   light: '#dce8f0', ground: '#f3ece0', produce: ['#f5a623', '#ffd45c', '#548f41', '#c07510'] },
]

// Un frutto: sfera leggermente schiacciata, come la merce vera.
// Geometria procedurale invece di modelli scaricati: nessun asset da caricare,
// nessun peso aggiunto al primo caricamento.
const Fruit: React.FC<{
  position: [number, number, number]
  color: string
  scale: number
  speed: number
  still: boolean
}> = ({ position, color, scale, speed, still }) => {
  const ref = useRef<THREE.Mesh>(null)
  const phase = useMemo(() => Math.random() * Math.PI * 2, [])

  useFrame(({ clock }) => {
    if (!ref.current || still) return
    const t = clock.getElapsedTime()
    // galleggiamento lento: la merce respira, non rimbalza
    ref.current.position.y = position[1] + Math.sin(t * speed + phase) * 0.12
    ref.current.rotation.y = t * speed * 0.35 + phase
  })

  return (
    <mesh ref={ref} position={position} scale={[scale, scale * 0.92, scale]} castShadow>
      <sphereGeometry args={[1, 32, 32]} />
      <meshStandardMaterial color={color} roughness={0.45} metalness={0.02} />
    </mesh>
  )
}

const SeasonStage: React.FC<{ season: Season; still: boolean }> = ({ season, still }) => {
  // disposizione stabile tra i render: stessa scena, non un caos diverso ogni volta
  const items = useMemo(() => {
    const rng = (i: number, s: number) => {
      const x = Math.sin(i * 127.1 + s * 311.7) * 43758.5453
      return x - Math.floor(x)
    }
    return Array.from({ length: 11 }, (_, i) => ({
      position: [
        (rng(i, 1) - 0.5) * 7.5,
        (rng(i, 2) - 0.5) * 3.2,
        (rng(i, 3) - 0.5) * 3.5 - 1,
      ] as [number, number, number],
      color: season.produce[i % season.produce.length],
      scale: 0.34 + rng(i, 4) * 0.42,
      speed: 0.4 + rng(i, 5) * 0.5,
    }))
  }, [season])

  return (
    <group>
      <ambientLight intensity={0.85} color={season.light} />
      <directionalLight position={[4, 6, 5]} intensity={1.15} color={season.light} castShadow />
      <directionalLight position={[-5, -2, -3]} intensity={0.3} color="#ffffff" />
      {items.map((it, i) => (
        <Fruit key={i} {...it} still={still} />
      ))}
    </group>
  )
}

const SeasonsScene: React.FC<{ seasonIndex: number; className?: string }> = ({ seasonIndex, className }) => {
  const shouldReduceMotion = useReducedMotion()
  const season = SEASONS[Math.max(0, Math.min(SEASONS.length - 1, seasonIndex))]

  return (
    <div className={className} aria-hidden="true">
      <Canvas
        dpr={[1, 1.6]}
        camera={{ position: [0, 0, 7.5], fov: 42 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        // la scena si ferma quando non serve: niente loop che scalda la batteria
        frameloop={shouldReduceMotion ? 'demand' : 'always'}
      >
        <Suspense fallback={null}>
          <SeasonStage season={season} still={!!shouldReduceMotion} />
        </Suspense>
      </Canvas>
    </div>
  )
}

export default SeasonsScene
