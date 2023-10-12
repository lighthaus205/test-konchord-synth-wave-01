import { RapierRigidBody, RigidBody } from "@react-three/rapier";
import { CuboidColliderBox } from "./RigidBodyHelpers";
import * as THREE from 'three'
import { useRef } from "react";
import { useFrame, useLoader } from "@react-three/fiber"
// import { TextureLoader } from 'three/src/loaders/TextureLoader'
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { isHalfPi, isMinusHalfPi } from "~/utils/mathHelpers";
import useBeutomelloGame from "~/stores/useBeutomelloGame";


export default function Dice() {
  const coinRef = useRef<RapierRigidBody>(null!)
  const coinMeshRef = useRef<THREE.Mesh>(null!)
  const coinGroupRef = useRef<THREE.Group>(null!)
  const fileUrl = "/penny_coin/scene.gltf";
  const gltf = useLoader(GLTFLoader, fileUrl);
  const currentPlayer = useBeutomelloGame((state) => state.currentPlayer)
  const currentMeeple = useBeutomelloGame((state) => state.currentMeeple)
  const setDisplayTextInInterface = useBeutomelloGame((state) => state.setDisplayTextInInterface)

  const coinPosition = useBeutomelloGame(state => state.coinPosition)
  useFrame((state, delta) => {
    coinGroupRef.current.position.copy(coinPosition)
  })



  const coinJump = () => {
    console.log('coinJump...');
    if (!currentPlayer || !currentMeeple) {
      setDisplayTextInInterface('Please select meeple first')
      setTimeout(() => {
        setDisplayTextInInterface('')
      }, 5000)
      console.error('Need to select player and meeple in order to jump!')
      return
    }
    const diceMass = coinRef.current.mass()
    const impulseFactor = 5
    const torqueFactor = 10
    coinRef.current.applyImpulse({
      x: 0,
      y: diceMass * impulseFactor,
      z: 0
    }, true)
    coinRef.current.applyTorqueImpulse({
      x: (Math.random() - 0.5) * diceMass * torqueFactor,
      y: 0,
      z: 0
    }, true)
  }

  const onCoinSleep = () => {
    console.log('onCoinSleep...');
    const euler = new THREE.Euler()
    if (coinMeshRef.current.parent?.quaternion) {
      euler.setFromQuaternion(
        coinMeshRef.current.parent?.quaternion
      )
    }

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

    if (isHalfPi(euler.x)) {
      console.log('Zahl')
    } else if (isMinusHalfPi(euler.x)) {
      console.log('Kopf')
    } else {
      console.log('not implemented')
    }
  }

  return <>
    <group
      ref={coinGroupRef}
      position={[coinPosition.x, coinPosition.y + 2, coinPosition.z]}
    >
      <CuboidColliderBox
        height={5}
        length={4}
      />
      <RigidBody
        ref={coinRef}
        onSleep={onCoinSleep}
        scale={0.01}
        position={[0, 1, 0]}
        rotation={[Math.PI / 2, 0, 0]}
      >
        <mesh
          ref={coinMeshRef}
          onClick={coinJump}
          position={[0, 1, 0]}
        >
          <primitive object={gltf.scene} />
        </mesh>
      </RigidBody>
    </group>

  </>
}