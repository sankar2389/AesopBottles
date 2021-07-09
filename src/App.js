import * as THREE from 'three'
import React, { Fragment, Suspense, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Reflector, Environment, Loader } from '@react-three/drei'
import Bottles from './Bottles'
import { geometry, material } from './store'

function Sphere(props) {
  return (
    <mesh
      receiveShadow
      castShadow
      {...props}
      renderOrder={-2000000}
      geometry={geometry.sphere}
      material={material.sphere}
    />
  )
}

function Zoom() {
  const vec = new THREE.Vector3(0, 0, 100)
  return useFrame((state) => {
    state.camera.position.lerp(vec, 0.075)
    state.camera.fov = THREE.MathUtils.lerp(state.camera.fov, 20, 0.075)
    state.camera.lookAt(0, 0, 0)
    state.camera.updateProjectionMatrix()
  })
}

function Spheres() {
  const group = useRef()
  useFrame(() => {
    group.current.children[0].position.x = THREE.MathUtils.lerp(group.current.children[0].position.x, -18, 0.02)
    group.current.children[1].position.x = THREE.MathUtils.lerp(group.current.children[1].position.x, -10, 0.01)
    group.current.children[2].position.x = THREE.MathUtils.lerp(group.current.children[2].position.x, 19, 0.03)
    group.current.children[3].position.x = THREE.MathUtils.lerp(group.current.children[3].position.x, 10, 0.04)
  })
  return (
    <group ref={group}>
      <Sphere position={[-40, 1, 10]} />
      <Sphere position={[-20, 10, -20]} scale={[10, 10, 10]} />
      <Sphere position={[40, 3, 5]} scale={[3, 3, 3]} />
      <Sphere position={[30, 0.75, 10]} scale={[0.75, 0.75, 0.75]} />
    </group>
  )
}

export default function App() {
  return (
    <Fragment>
      <Canvas pixelRatio={[1, 1.5]} concurrent shadowMap camera={{ position: [-500, 0, 90], fov: 100 }}>
        <fog attach="fog" args={['#a0a0a0', 100, 150]} />
        <color attach="background" args={['#a0a0a0']} />
        <spotLight
          penumbra={1}
          angle={0.35}
          castShadow
          position={[40, 80, 0]}
          intensity={1.5}
          shadow-mapSize-width={256}
          shadow-mapSize-height={256}
        />
        <pointLight position={[10, -10, 5]} intensity={1} color="#9C640C" />
        <Suspense fallback={null}>
          <group position={[0, -12, 0]}>
            <Bottles />
            <Spheres />
            <mesh
              rotation-x={-Math.PI / 2}
              position={[0, 0.01, 0]}
              scale={[200, 200, 200]}
              receiveShadow
              renderOrder={100000}>
              <planeBufferGeometry attach="geometry" />
              <shadowMaterial attach="material" transparent color="#251005" opacity={0.2} />
            </mesh>
            <Reflector
              resolution={1024}
              mirror={0}
              blur={[500, 100]}
              mixBlur={1}
              mixStrength={2}
              depthScale={0.5}
              minDepthThreshold={0.8}
              maxDepthThreshold={1}
              rotation-x={-Math.PI / 2}
              args={[100, 100]}>
              {(Material, props) => <Material {...props} color="#a0a0a0" metalness={0} roughness={0.5} />}
            </Reflector>
          </group>
          <Environment preset="apartment" />
          <Zoom />
        </Suspense>
      </Canvas>
      <Loader />
    </Fragment>
  )
}
