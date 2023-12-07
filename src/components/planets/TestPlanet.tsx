import { useTexture } from "@react-three/drei"
import { useRef } from "react"
import { RigidBody, BallCollider } from '@react-three/rapier'
import { useFrame } from "@react-three/fiber"
import { Mesh } from "three"

export default function TestPlanet() {
  const sunRef = useRef<Mesh>(null!)
  const [sunTexture] = useTexture(['/planet_textures/2k_makemake_fictional.jpeg'])

  useFrame((state, delta) => {
    sunRef.current.rotation.y -= 0.002
  })

  return <>
    <RigidBody
      colliders="ball"
      restitution={0.2}
      friction={1}
      scale={10}
      rotation={[- Math.PI / 2, 0, 0]}
      position={[0, 10, -100]}
      gravityScale={0}
      type="fixed"
      userData={{
        key: 'test_planet',
        redirect_url: 'planets/start-again',
        name: 'Test Planet'
      }}
    >
      <BallCollider
        args={[3]}
        sensor
      />
      <BallCollider
        args={[2.95]}
      />
      <mesh ref={sunRef}>
        <sphereGeometry />
        <meshPhongMaterial map={sunTexture} />
      </mesh>
    </RigidBody>
  </>
}