import { useEffect, useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'
import { useStore } from '../store/useStore'
import { Crystal } from './Crystal'

export function SettlementEvent() {
  const status = useStore(state => state.status)
  const [visible, setVisible] = useState(false)
  
  // Simple shockwave ring
  const ringRef = useRef<THREE.Mesh>(null)

  useEffect(() => {
    if (status === 'settlement') {
      // Delay slightly to let singularity collapse
      const t = setTimeout(() => setVisible(true), 500)
      return () => clearTimeout(t)
    } else {
      setVisible(false)
    }
  }, [status])

  useFrame((state, delta) => {
    if (!visible || !ringRef.current) return
    
    // Expand ring
    const scale = ringRef.current.scale.x + delta * 15
    if (scale < 20) {
      ringRef.current.scale.set(scale, scale, scale)
      const material = ringRef.current.material as THREE.MeshBasicMaterial
      material.opacity = Math.max(0, 1 - scale / 20)
    }
  })

  if (!visible) return null

  return (
    <group>
      {/* Shockwave */}
      <mesh ref={ringRef} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.9, 1, 64]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={1} toneMapped={false} />
      </mesh>

      <Crystal />

      <Html position={[0, 2.5, 0]} center zIndexRange={[100, 0]}>
        <div className="text-high-energy-gold font-display text-4xl font-bold drop-shadow-[0_0_10px_rgba(255,215,0,0.8)] animate-bounce whitespace-nowrap">
          +350
        </div>
      </Html>
    </group>
  )
}

