import React, { useRef, useMemo, useState, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'
import { easing } from 'maath'
import * as THREE from 'three'

/**
 * Galleria curva delle foto del banco.
 *
 * I piani sono disposti su un arco: chi sta ai lati arretra in Z e ruota verso
 * il centro, come cassette allineate lungo il bancone. Lo scroll non sposta
 * layer 2D, muove la posizione lungo l'arco con inerzia.
 *
 * Valori continui in ref mutabili, non in stato React: a 60fps la
 * riconciliazione costerebbe piu' del rendering.
 */

const CFG = {
  radius: 7.2,        // raggio dell'arco
  arc: 1.05,          // ampiezza angolare fra due tessere
  planeW: 2.5,
  planeH: 3.2,
  damp: 0.22,
}

type Shot = { src: string; label: string; note: string }

const vertexShader = /* glsl */ `
  uniform float uVelocity;
  uniform float uHover;
  varying vec2 vUv;

  void main() {
    vUv = uv;
    vec3 p = position;
    // il piano si incurva in base alla velocita' di scorrimento:
    // la merce "resiste" al movimento invece di scivolare rigida
    float bend = sin(uv.x * 3.14159) * uVelocity * 0.55;
    p.z += bend;
    // leggero respiro quando la tessera e' attiva
    p.z += sin(uv.y * 3.14159) * uHover * 0.12;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
  }
`

const fragmentShader = /* glsl */ `
  uniform sampler2D uTexture;
  uniform float uHover;
  uniform float uVelocity;
  uniform vec2 uPlaneScale;
  uniform vec2 uImgScale;
  varying vec2 vUv;

  void main() {
    // cover: riempie il piano senza deformare la foto
    vec2 ratio = vec2(
      min((uPlaneScale.x / uPlaneScale.y) / (uImgScale.x / uImgScale.y), 1.0),
      min((uPlaneScale.y / uPlaneScale.x) / (uImgScale.y / uImgScale.x), 1.0)
    );
    vec2 uv = vec2(
      vUv.x * ratio.x + (1.0 - ratio.x) * 0.5,
      vUv.y * ratio.y + (1.0 - ratio.y) * 0.5
    );

    // aberrazione cromatica proporzionale alla velocita': si vede solo in
    // movimento, come lo strascico di una foto scattata in corsa
    float ab = uVelocity * 0.02;
    float r = texture2D(uTexture, uv + vec2(ab, 0.0)).r;
    float g = texture2D(uTexture, uv).g;
    float b = texture2D(uTexture, uv - vec2(ab, 0.0)).b;
    vec3 col = vec3(r, g, b);

    // le tessere non attive restano indietro, senza sparire
    col = mix(col * 0.72, col, uHover);

    // grana finissima: toglie il banding e da' materia
    float grain = fract(sin(dot(vUv * 999.0, vec2(12.9898, 78.233))) * 43758.5453);
    col += (grain - 0.5) * 0.035;

    gl_FragColor = vec4(col, 1.0);
  }
`

const Tile: React.FC<{
  shot: Shot
  index: number
  offset: React.MutableRefObject<number>
  velocity: React.MutableRefObject<number>
  onFocus: (i: number) => void
}> = ({ shot, index, offset, velocity, onFocus }) => {
  const mesh = useRef<THREE.Mesh>(null)
  const mat = useRef<THREE.ShaderMaterial>(null)
  const texture = useTexture(shot.src)

  const uniforms = useMemo(() => ({
    uTexture: { value: texture },
    uHover: { value: 0 },
    uVelocity: { value: 0 },
    uPlaneScale: { value: new THREE.Vector2(CFG.planeW, CFG.planeH) },
    uImgScale: { value: new THREE.Vector2(1, 1) },
  }), [texture])

  useEffect(() => {
    texture.colorSpace = THREE.SRGBColorSpace
    const img: any = texture.image
    if (img?.width) uniforms.uImgScale.value.set(img.width, img.height)
  }, [texture, uniforms])

  useFrame((_, dt) => {
    if (!mesh.current || !mat.current) return
    // posizione lungo l'arco
    const a = (index - offset.current) * CFG.arc
    const clamped = Math.max(-1.4, Math.min(1.4, a))
    mesh.current.position.x = Math.sin(clamped) * CFG.radius
    mesh.current.position.z = Math.cos(clamped) * CFG.radius - CFG.radius
    mesh.current.rotation.y = -clamped * 0.85

    // vicinanza al centro: guida sia luce che scala
    const focus = 1 - Math.min(1, Math.abs(a) / 1.1)
    easing.damp(mat.current.uniforms.uHover, 'value', focus, 0.25, dt)
    mat.current.uniforms.uVelocity.value = velocity.current

    const s = 0.9 + focus * 0.18
    easing.damp3(mesh.current.scale, [s, s, 1], 0.3, dt)
    mesh.current.visible = Math.abs(a) < 2.2

    if (focus > 0.92) onFocus(index)
  })

  return (
    <mesh ref={mesh}>
      <planeGeometry args={[CFG.planeW, CFG.planeH, 32, 32]} />
      <shaderMaterial
        ref={mat}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
      />
    </mesh>
  )
}

const Rig: React.FC<{
  shots: Shot[]
  offset: React.MutableRefObject<number>
  velocity: React.MutableRefObject<number>
  onFocus: (i: number) => void
}> = ({ shots, offset, velocity, onFocus }) => {
  const target = useRef(0)
  const { size } = useThree()

  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      target.current += e.deltaY * 0.0022
      target.current = Math.max(0, Math.min(shots.length - 1, target.current))
    }
    let dragging = false
    let lastX = 0
    const down = (e: PointerEvent) => { dragging = true; lastX = e.clientX }
    const move = (e: PointerEvent) => {
      if (!dragging) return
      const dx = e.clientX - lastX
      lastX = e.clientX
      target.current -= dx * 0.006
      target.current = Math.max(0, Math.min(shots.length - 1, target.current))
    }
    const up = () => { dragging = false }
    window.addEventListener('wheel', onWheel, { passive: true })
    window.addEventListener('pointerdown', down)
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', up)
    return () => {
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('pointerdown', down)
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', up)
    }
  }, [shots.length, size])

  useFrame((_, dt) => {
    const prev = offset.current
    easing.damp(offset, 'current', target.current, CFG.damp, dt)
    velocity.current = (offset.current - prev) * 12
  })

  return (
    <>
      {shots.map((s, i) => (
        <Tile key={s.src} shot={s} index={i} offset={offset} velocity={velocity} onFocus={onFocus} />
      ))}
    </>
  )
}

const CurvedGallery: React.FC<{ shots: Shot[]; onFocus: (i: number) => void }> = ({ shots, onFocus }) => {
  const offset = useRef(0)
  const velocity = useRef(0)
  return (
    <Canvas
      dpr={[1, 1.75]}
      camera={{ position: [0, 0, 6.2], fov: 40 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
    >
      <React.Suspense fallback={null}>
        <Rig shots={shots} offset={offset} velocity={velocity} onFocus={onFocus} />
      </React.Suspense>
    </Canvas>
  )
}

export default CurvedGallery
