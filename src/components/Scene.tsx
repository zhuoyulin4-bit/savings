import { Canvas } from '@react-three/fiber'
import { OrbitControls, Stars } from '@react-three/drei'
import { EffectComposer, Bloom, ChromaticAberration } from '@react-three/postprocessing'
import { Singularity } from './Singularity'
import { SettlementEvent } from './SettlementEvent'
import * as THREE from 'three'

export function Scene() {
  return (
    <div className="absolute inset-0 z-0 bg-deep-space">
      <Canvas camera={{ position: [0, 0, 8], fov: 45 }} dpr={[1, 2]}>
        <color attach="background" args={['#050510']} />
        
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        
        <Singularity />
        <SettlementEvent />
        
        <OrbitControls 
          enableZoom={false} 
          enablePan={false} 
          enableRotate={true}
          autoRotate={false}
          maxPolarAngle={Math.PI / 1.5}
          minPolarAngle={Math.PI / 3}
        />
        
        <EffectComposer disableNormalPass>
          <Bloom luminanceThreshold={0.5} mipmapBlur intensity={1.5} radius={0.4} />
          <ChromaticAberration offset={new THREE.Vector2(0.002, 0.002)} radialModulation={false} modulationOffset={0} />
        </EffectComposer>
      </Canvas>
    </div>
  )
}
