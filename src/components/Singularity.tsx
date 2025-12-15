import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useStore } from '../store/useStore'

export function Singularity() {
  const status = useStore((state) => state.status)
  const pointsRef = useRef<THREE.Points>(null)
  const materialRef = useRef<THREE.PointsMaterial>(null)
  
  // Generate particles
  const particlesCount = 8000
  const positions = useMemo(() => {
    const pos = new Float32Array(particlesCount * 3)
    for (let i = 0; i < particlesCount; i++) {
      // Spherical distribution
      const r = 2 + (Math.random() - 0.5) * 0.5 // Base radius 2, with some fuzziness
      const theta = 2 * Math.PI * Math.random()
      const phi = Math.acos(2 * Math.random() - 1)
      
      const x = r * Math.sin(phi) * Math.cos(theta)
      const y = r * Math.sin(phi) * Math.sin(theta)
      const z = r * Math.cos(phi)
      
      pos[i * 3] = x
      pos[i * 3 + 1] = y
      pos[i * 3 + 2] = z
    }
    return pos
  }, [])

  // Target colors
  const colorStandby = new THREE.Color('#4d88ff') // Ghost Blue
  const colorWorking = new THREE.Color('#FFD700') // Gold
  const colorSettlement = new THREE.Color('#FFFFFF') // White Hot
  
  useFrame((state, delta) => {
    if (!pointsRef.current || !materialRef.current) return

    const isWorking = status === 'working'
    const isSettlement = status === 'settlement'

    // Rotation
    let targetSpeed = 0.1
    if (isWorking) targetSpeed = 1.5
    if (isSettlement) targetSpeed = 8.0 // Super fast spin before collapse

    pointsRef.current.rotation.y += delta * targetSpeed

    // Breathing / Pulsing / Collapse
    const time = state.clock.elapsedTime
    let scale = 1

    if (isSettlement) {
      // Collapse
      // In a real implementation we might want a tween here, 
      // but for now let's make it shrink fast
      scale = 0.05 + Math.sin(time * 20) * 0.05 // Rapid vibration at small scale
    } else {
      const freq = isWorking ? 5 : 0.5
      const amp = isWorking ? 0.05 : 0.02
      scale = 1 + Math.sin(time * freq) * amp
    }
    
    // Smooth scale transition would be better, but direct set for MVP
    // To make it smooth, we could lerp the scale ref
    pointsRef.current.scale.lerp(new THREE.Vector3(scale, scale, scale), delta * 5)

    // Color transition
    let targetColor = colorStandby
    if (isWorking) targetColor = colorWorking
    if (isSettlement) targetColor = colorSettlement
    
    materialRef.current.color.lerp(targetColor, delta * 2) 
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particlesCount}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        ref={materialRef}
        size={0.03}
        color="#4d88ff"
        sizeAttenuation
        transparent
        opacity={0.8}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  )
}
