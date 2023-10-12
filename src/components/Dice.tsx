import { RapierRigidBody, RigidBody } from "@react-three/rapier";
import { CuboidColliderBox } from "./RigidBodyHelpers";
import * as THREE from 'three'
import { useRef, useState } from "react";
import { useFrame, useLoader } from "@react-three/fiber"
import { TextureLoader } from 'three/src/loaders/TextureLoader'
import { isZero, isHalfPi, isMinusHalfPi, isPiOrMinusPi } from "~/utils/mathHelpers";
import useBeutomelloGame from "~/stores/useBeutomelloGame";
import { useThree } from '@react-three/fiber'


export default function Dice({
  center = new THREE.Vector3(-4, 0, -12)
}: {
  center?: THREE.Vector3
}) {
  const threeState = useThree()
  const dice_texture_1 = useLoader(TextureLoader, 'dice_textures/1.jpg')
  const dice_texture_2 = useLoader(TextureLoader, 'dice_textures/2.jpg')
  const dice_texture_3 = useLoader(TextureLoader, 'dice_textures/3.jpg')
  const dice_texture_4 = useLoader(TextureLoader, 'dice_textures/4.jpg')
  const dice_texture_5 = useLoader(TextureLoader, 'dice_textures/5.jpg')
  const dice_texture_6 = useLoader(TextureLoader, 'dice_textures/6.jpg')

  const diceRef = useRef<RapierRigidBody>(null!)
  const diceMeshRef = useRef<THREE.Mesh>(null!)
  const diceGroupRef = useRef<THREE.Group>(null!)
  const moveCurrentMeeple = useBeutomelloGame((state) => state.moveCurrentMeeple)
  const setDiceWasThrown = useBeutomelloGame((state) => state.setDiceWasThrown)
  const currentPlayer = useBeutomelloGame((state) => state.currentPlayer)
  const currentMeeple = useBeutomelloGame((state) => state.currentMeeple)
  const setDisplayTextInInterface = useBeutomelloGame((state) => state.setDisplayTextInInterface)

  const dicePosition = useBeutomelloGame(state => state.dicePosition)
  useFrame((state, delta) => {
    diceGroupRef.current.position.copy(dicePosition)
  })

  const cubeJump = () => {
    console.log('cubeJump...');
    if (!currentPlayer || !currentMeeple) {
      setDisplayTextInInterface('Please select meeple first')
      setTimeout(() => {
        setDisplayTextInInterface('')
      }, 5000)
      console.error('Need to select player and meeple in order to jump!')
      return
    }
    setDiceWasThrown(true)
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
    console.log('onDiceSleep...');
    const euler = new THREE.Euler()
    if (diceMeshRef.current.parent?.quaternion) {
      euler.setFromQuaternion(
        diceMeshRef.current.parent?.quaternion
      )
    }

    console.log('euler.x', euler.x);
    console.log('isZero(euler.x)', isZero(euler.x))
    console.log('isHalfPi(euler.x)', isHalfPi(euler.x))
    console.log('isMinusHalfPi(euler.x)', isMinusHalfPi(euler.x))
    console.log('isPiOrMinusPi(euler.x)', isPiOrMinusPi(euler.x))
    console.log('---')
    console.log('euler.y', euler.y);
    console.log('isZero(euler.y)', isZero(euler.y))
    console.log('isHalfPi(euler.y)', isHalfPi(euler.y))
    console.log('isMinusHalfPi(euler.y)', isMinusHalfPi(euler.y))
    console.log('isPiOrMinusPi(euler.y)', isPiOrMinusPi(euler.y))
    console.log('---')
    console.log('euler.z', euler.z);
    console.log('isZero(euler.z)', isZero(euler.z))
    console.log('isHalfPi(euler.z)', isHalfPi(euler.z))
    console.log('isMinusHalfPi(euler.z)', isMinusHalfPi(euler.z))
    console.log('isPiOrMinusPi(euler.z)', isPiOrMinusPi(euler.z))

    let diceResult
    if (isZero(euler.x)) {
      if (isZero(euler.z)) {
        diceResult = 1
      } else if (isHalfPi(euler.z)) {
        diceResult = 2
      } else if (isMinusHalfPi(euler.z)) {
        diceResult = 5
      } else if (isPiOrMinusPi(euler.z)) {
        diceResult = 6
      } else {
        console.log('landed on edge')
      }
    } else if (isHalfPi(euler.x)) {
      if (isZero(euler.y)) {
        diceResult = 4
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
        diceResult = 3
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
        diceResult = 6
      } else if (isHalfPi(euler.z)) {
        diceResult = 5
      } else if (isMinusHalfPi(euler.z)) {
        diceResult = 2
      } else if (isPiOrMinusPi(euler.z)) {
        diceResult = 1
      } else {
        console.log('landed on edge')
      }
    }
    if (diceResult) {
      console.log('Move meeple ' + diceResult + ' steps')
      moveCurrentMeeple(diceResult, threeState)
      setDiceWasThrown(false)
    } else {
      console.error('Unknown dice result!')
    }
  }

  return <>
    <group
      ref={diceGroupRef}
      position={[dicePosition.x, dicePosition.y + 2, dicePosition.z]}
    >
      <CuboidColliderBox
        height={5}
        length={4}
      />
      <RigidBody
        ref={diceRef}
        onSleep={onDiceSleep}
        position={[0, 1, 0]}
      >
        <mesh
          ref={diceMeshRef}
          onClick={cubeJump}
          position={[0, 1, 0]}
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
    </group>
  </>
}