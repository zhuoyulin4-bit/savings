import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { MeshTransmissionMaterial } from '@react-three/drei'
import * as THREE from 'three'

export function Crystal() {
  const ref = useRef<THREE.Mesh>(null)
  
  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.x += delta * 0.2
      ref.current.rotation.y += delta * 0.3
      // Floating
      ref.current.position.y = Math.sin(state.clock.elapsedTime) * 0.1
    }
  })

  return (
    <mesh ref={ref} scale={1.5}>
      <octahedronGeometry args={[1, 0]} />
      <MeshTransmissionMaterial 
        backside
        samples={4} // Lower samples for mobile performance
        resolution={256}
        transmission={1}
        roughness={0}
        thickness={1.5}
        ior={1.5}
        chromaticAberration={0.4}
        anisotropy={0.5}
        color="#bd00ff"
        toneMapped={false}
      />
    </mesh>
  )
}

