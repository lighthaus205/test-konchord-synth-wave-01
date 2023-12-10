import { useTexture } from "@react-three/drei"
import { useRef } from "react"
import { RigidBody, BallCollider } from '@react-three/rapier'
import { useFrame } from "@react-three/fiber"
import { Mesh } from "three"
import { planetDataInterface } from "~/utils/interfaces"
import * as THREE from 'three'


interface planetInterface extends planetDataInterface {
  position: THREE.Vector3
  scale: number
  rotation: THREE.Vector3
}

export default function Planet({
  texture_path,
  planet_key,
  redirect_url,
  planet_name,
  position,
  scale,
  rotation,
}: planetInterface) {
  const sunRef = useRef<Mesh>(null!)
  const [sunTexture] = useTexture([texture_path ? texture_path : ''])

  const planetData: planetDataInterface = {
    planet_key: planet_key,
    redirect_url: redirect_url,
    planet_name: planet_name
  }

  useFrame((state, delta) => {
    sunRef.current.rotation.x += rotation.x * delta
    sunRef.current.rotation.y += rotation.y * delta
    sunRef.current.rotation.z += rotation.z * delta
  })

  return <>
    <RigidBody
      colliders="ball"
      restitution={0.2}
      friction={1}
      scale={scale}
      rotation={[0, 0, 0]}
      position={position}
      gravityScale={0}
      type="fixed"
      userData={planetData}
    >
      <BallCollider
        args={[3]}
        sensor
      />
      <BallCollider
        args={[2.9]}
      />
      <mesh ref={sunRef}>
        <sphereGeometry />
        <meshPhongMaterial map={sunTexture} />
      </mesh>
    </RigidBody>
  </>
}