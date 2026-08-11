import { useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// Drifting lottery balls behind the hero — a nod to Fantasy League Lottery's
// ball-draw machine. Deliberately quiet: slow drift, soft color, no bloom.

const BALL_COLORS = ['#c8a1ff', '#83dcef', '#85de9e', '#ff8aa2', '#fdb97c', '#f4f6fa', '#f4f6fa']

type BallSeed = {
  base: THREE.Vector3
  phase: number
  speed: number
  amp: number
  scale: number
}

function Balls({ count = 42 }: { count?: number }) {
  const mesh = useRef<THREE.InstancedMesh>(null!)
  const dummy = useMemo(() => new THREE.Object3D(), [])

  const seeds = useMemo<BallSeed[]>(() => {
    const rng = mulberry32(20220510) // FLL's first-commit date as the seed
    return Array.from({ length: count }, () => ({
      base: new THREE.Vector3((rng() - 0.5) * 18, (rng() - 0.5) * 10, -5 - rng() * 7),
      phase: rng() * Math.PI * 2,
      speed: 0.2 + rng() * 0.35,
      amp: 0.35 + rng() * 0.6,
      scale: 0.1 + rng() * 0.16,
    }))
  }, [count])

  const colors = useMemo(() => {
    const rng = mulberry32(7)
    const arr = new Float32Array(count * 3)
    const c = new THREE.Color()
    for (let i = 0; i < count; i++) {
      c.set(BALL_COLORS[Math.floor(rng() * BALL_COLORS.length)])
      c.toArray(arr, i * 3)
    }
    return arr
  }, [count])

  useFrame(({ clock, pointer }) => {
    const t = clock.elapsedTime
    for (let i = 0; i < seeds.length; i++) {
      const s = seeds[i]
      dummy.position.set(
        s.base.x + Math.sin(t * s.speed + s.phase) * s.amp + pointer.x * 0.4,
        s.base.y + Math.cos(t * s.speed * 0.8 + s.phase) * s.amp + pointer.y * 0.25,
        s.base.z,
      )
      dummy.scale.setScalar(s.scale)
      dummy.updateMatrix()
      mesh.current.setMatrixAt(i, dummy.matrix)
    }
    mesh.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 24, 24]}>
        <instancedBufferAttribute attach="attributes-color" args={[colors, 3]} />
      </sphereGeometry>
      <meshStandardMaterial vertexColors roughness={0.25} metalness={0} transparent opacity={0.35} />
    </instancedMesh>
  )
}

// Deterministic PRNG so the scene is identical every load.
function mulberry32(a: number) {
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export default function LotteryBalls() {
  return (
    <Canvas
      className="hero-canvas"
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true, powerPreference: 'low-power' }}
      camera={{ position: [0, 0, 6], fov: 50 }}
      aria-hidden
    >
      <ambientLight intensity={0.9} />
      <directionalLight position={[4, 6, 5]} intensity={1.1} />
      <Balls />
    </Canvas>
  )
}
