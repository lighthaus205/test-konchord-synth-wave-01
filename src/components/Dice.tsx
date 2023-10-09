import { CuboidCollider, RapierRigidBody, RigidBody } from "@react-three/rapier";
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
  const diceMeshRef = useRef<THREE.Mesh>(null!)

  const cubeJump = () => {
    const diceMass = diceRef.current.mass()
    const impulseFactor = 3
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
    const euler = new THREE.Euler()
    if (diceMeshRef.current.parent?.quaternion) {
      euler.setFromQuaternion(
        diceMeshRef.current.parent?.quaternion
      )
    }

    const eps = 0.1;
    let isZero = (angle: number) => Math.abs(angle) < eps;
    let isHalfPi = (angle: number) => Math.abs(angle - .5 * Math.PI) < eps;
    let isMinusHalfPi = (angle: number) => Math.abs(.5 * Math.PI + angle) < eps;
    let isPiOrMinusPi = (angle: number) => (Math.abs(Math.PI - angle) < eps || Math.abs(Math.PI + angle) < eps);

    // console.log('euler.x', euler.x);
    // console.log('isZero(euler.x)', isZero(euler.x))
    // console.log('isHalfPi(euler.x)', isHalfPi(euler.x))
    // console.log('isMinusHalfPi(euler.x)', isMinusHalfPi(euler.x))
    // console.log('isPiOrMinusPi(euler.x)', isPiOrMinusPi(euler.x))
    // console.log('---')
    // console.log('euler.y', euler.y);
    // console.log('isZero(euler.y)', isZero(euler.y))
    // console.log('isHalfPi(euler.y)', isHalfPi(euler.y))
    // console.log('isMinusHalfPi(euler.y)', isMinusHalfPi(euler.y))
    // console.log('isPiOrMinusPi(euler.y)', isPiOrMinusPi(euler.y))
    // console.log('---')
    // console.log('euler.z', euler.z);
    // console.log('isZero(euler.z)', isZero(euler.z))
    // console.log('isHalfPi(euler.z)', isHalfPi(euler.z))
    // console.log('isMinusHalfPi(euler.z)', isMinusHalfPi(euler.z))
    // console.log('isPiOrMinusPi(euler.z)', isPiOrMinusPi(euler.z))

    if (isZero(euler.x)) {
      if (isZero(euler.z)) {
        console.log('1')
      } else if (isHalfPi(euler.z)) {
        console.log('2')
      } else if (isMinusHalfPi(euler.z)) {
        console.log('5')
      } else if (isPiOrMinusPi(euler.z)) {
        console.log('6')
      } else {
        console.log('landed on edge')
      }
    } else if (isHalfPi(euler.x)) {
      if (isZero(euler.y)) {
        console.log('4')
      } else if (isHalfPi(euler.y)) {
        console.log('not implemented')
      } else if (isMinusHalfPi(euler.y)) {
        console.log('not implemented')
      } else if (isPiOrMinusPi(euler.y)) {
        console.log('not implemented')
      } else {
        console.log('landed on edge')
      }
    } else if (isMinusHalfPi(euler.x)) {
      if (isZero(euler.y)) {
        console.log('3')
      } else if (isHalfPi(euler.y)) {
        console.log('not implemented')
      } else if (isMinusHalfPi(euler.y)) {
        console.log('not implemented')
      } else if (isPiOrMinusPi(euler.y)) {
        console.log('not implemented')
      } else {
        console.log('landed on edge')
      }
    } else if (isPiOrMinusPi(euler.x)) {
      if (isZero(euler.z)) {
        console.log('6')
      } else if (isHalfPi(euler.z)) {
        console.log('5')
      } else if (isMinusHalfPi(euler.z)) {
        console.log('2')
      } else if (isPiOrMinusPi(euler.z)) {
        console.log('1')
      } else {
        console.log('landed on edge')
      }
    }
  }

  const center = new THREE.Vector3(0, 0, -12)
  const length = 4
  return <>
    <QuadraticWalls
      center={center}
      length={length}
      height={10}
    />
    <RigidBody type="fixed">
      <CuboidCollider
        args={[4, 0.1, 4]}
        position={[center.x, center.y, center.z]}
      />
    </RigidBody>
    <RigidBody
      ref={diceRef}
      onSleep={onDiceSleep}
    >
      <mesh
        ref={diceMeshRef}
        onClick={cubeJump}
        position={[center.x, center.y + 2, center.z]}
      >
        <boxGeometry
          args={[1.5, 1.5, 1.5]}
        />
        <meshStandardMaterial map={dice_texture_1} attach="material-2" />
        <meshStandardMaterial map={dice_texture_2} attach="material-0" />
        <meshStandardMaterial map={dice_texture_3} attach="material-4" />
        <meshStandardMaterial map={dice_texture_4} attach="material-5" />
        <meshStandardMaterial map={dice_texture_5} attach="material-1" />
        <meshStandardMaterial map={dice_texture_6} attach="material-3" />
      </mesh>
    </RigidBody>
  </>
}