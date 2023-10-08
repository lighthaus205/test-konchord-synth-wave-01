import { RapierRigidBody, RigidBody } from "@react-three/rapier";
import { QuadraticWalls } from "./BeutomelloGameBoard";
import * as THREE from 'three'
import { useRef } from "react";
import { useLoader } from "@react-three/fiber"
import { TextureLoader } from 'three/src/loaders/TextureLoader'


export default function Dice() {
  const dice_texture_1 = useLoader(TextureLoader, 'dice_textures/1.jpg')
  const dice_texture_2 = useLoader(TextureLoader, 'dice_textures/2.jpg')
  const dice_texture_3 = useLoader(TextureLoader, 'dice_textures/3.jpg')
  const dice_texture_4 = useLoader(TextureLoader, 'dice_textures/4.jpg')
  const dice_texture_5 = useLoader(TextureLoader, 'dice_textures/5.jpg')
  const dice_texture_6 = useLoader(TextureLoader, 'dice_textures/6.jpg')

  const diceRef = useRef<RapierRigidBody>(null!)

  const cubeJump = () => {
    const diceMass = diceRef.current.mass()
    const impulseFactor = 10
    const torqueFactor = 10
    diceRef.current.applyImpulse({
      x: 0,
      y: diceMass * impulseFactor,
      z: 0
    }, true)
    diceRef.current.applyTorqueImpulse({
      x: (Math.random() - 0.5) * diceMass * torqueFactor,
      y: (Math.random() - 0.5) * diceMass * torqueFactor,
      z: (Math.random() - 0.) * diceMass * torqueFactor
    }, true)
  }

  const onDiceSleep = () => {
    diceRef
  }

  const center = new THREE.Vector3(0, 0, -12)
  return <>
    <QuadraticWalls
      center={center}
      length={4}
      height={10}
    />
    <RigidBody type="fixed">
      <mesh
        rotation={[Math.PI / -2, 0, 0]}
        position={center}
      >
        <planeGeometry
          args={[8, 8, 4, 4]}
        />
        <meshBasicMaterial
          color={'darkblue'}
        />
      </mesh>
    </RigidBody>
    <RigidBody
      ref={diceRef}
      onSleep={onDiceSleep}
    >
      <mesh
        onClick={cubeJump}
        position={[center.x, center.y + 2, center.z]}
      >
        <boxGeometry
          args={[2, 2, 2]}
        />
        <meshStandardMaterial map={dice_texture_1} />
        <meshStandardMaterial map={dice_texture_2} />
        <meshStandardMaterial map={dice_texture_3} />
        <meshStandardMaterial map={dice_texture_4} />
        <meshStandardMaterial map={dice_texture_5} />
        <meshStandardMaterial map={dice_texture_6} />
      </mesh>
    </RigidBody>
  </>
}