import { RapierRigidBody, RigidBody } from "@react-three/rapier";
import { CuboidColliderBox } from "./RigidBodyHelpers";
import * as THREE from 'three'
import { useRef } from "react";
import { useFrame, useLoader, useThree } from "@react-three/fiber"
// import { TextureLoader } from 'three/src/loaders/TextureLoader'
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { isHalfPi, isMinusHalfPi } from "~/utils/mathHelpers";
import useBeutomelloGame from "~/stores/useBeutomelloGame";
import { GameBoardElementKeyEnum, GamePhaseEnum } from "~/utils/enums";


export default function Dice() {
  const threeState = useThree()

  const coinRef = useRef<RapierRigidBody>(null!)
  const coinMeshRef = useRef<THREE.Mesh>(null!)
  const coinGroupRef = useRef<THREE.Group>(null!)
  const fileUrl = "/penny_coin/scene.gltf";
  const coinModel = useLoader(GLTFLoader, fileUrl)

  /**
   * Get States
   */
  const moveCurrentMeeple = useBeutomelloGame((state) => state.moveCurrentMeeple)
  const currentPlayer = useBeutomelloGame((state) => state.currentPlayer)
  const currentMeeple = useBeutomelloGame((state) => state.currentMeeple)
  const setDisplayTextInInterface = useBeutomelloGame((state) => state.setDisplayTextInInterface)
  const coinPosition = useBeutomelloGame(state => state.coinPosition)
  const beutomelloGameState = useBeutomelloGame((state) => state.beutomelloGameState)
  const setAllowMoveMeeple = useBeutomelloGame((state) => state.setAllowMoveMeeple)
  const gamePhase = useBeutomelloGame((state) => state.gamePhase)

  /**
   * Calculate if dice can be thrown
   */
  let meeplePosition: GameBoardElementKeyEnum | undefined
  let canThrowCoin: boolean
  if (beutomelloGameState && currentPlayer && currentMeeple) {
    meeplePosition = beutomelloGameState[currentPlayer][currentMeeple].currentGameBoardElement
  }
  
  if (meeplePosition !== undefined) {
    if ([
      GameBoardElementKeyEnum.One,
      GameBoardElementKeyEnum.Two,
      GameBoardElementKeyEnum.Three,
      GameBoardElementKeyEnum.Four,
      GameBoardElementKeyEnum.Five,
      GameBoardElementKeyEnum.Six,
      GameBoardElementKeyEnum.Seven,
      GameBoardElementKeyEnum.Eight,
      GameBoardElementKeyEnum.Nine,
      GameBoardElementKeyEnum.Ten,
    ].includes(meeplePosition)) {
      canThrowCoin = true
    } else {
      canThrowCoin = false
    }
  } else {
    canThrowCoin = false
  }  

  /**
   * Update color of coin
   */
  if (!canThrowCoin) {
    coinModel.scene.traverse((child: any) => {
      if (child.isMesh) {
        const material = child.material
        if (material.color) {
          material.color.set('#333')
        }
      }
    })
  } else {
    coinModel.scene.traverse((child: any) => {
      if (child.isMesh) {
        const material = child.material
        if (material.color) {
          material.color.set('#fff')
        }
      }
    })
  }

  useFrame((state, delta) => {
    coinGroupRef.current.position.copy(coinPosition)
  })

  const coinJump = () => {
    console.log('coinJump...')
    if (!canThrowCoin) {
      setDisplayTextInInterface('Cannot throw Coin for selected meeple')
      setTimeout(() => {
        setDisplayTextInInterface('')
      }, 5000)
      console.error('Cannot throw Coin for selected meeple')
      return
    }
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
    if (gamePhase === GamePhaseEnum.init) {
      return
    }
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
      setAllowMoveMeeple(true)
      moveCurrentMeeple('Zahl', threeState)
      setAllowMoveMeeple(false)
    } else if (isMinusHalfPi(euler.x)) {
      moveCurrentMeeple('Kopf', threeState)
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
        length={2}
      />
      <RigidBody
        ref={coinRef}
        onSleep={onCoinSleep}
        scale={0.007}
        position={[0, 1, 0]}
        rotation={[Math.PI / 2, 0, 0]}
      >
        <mesh
          ref={coinMeshRef}
          onClick={coinJump}
          position={[0, 1, 0]}
        >
          <primitive object={coinModel.scene} />
        </mesh>
      </RigidBody>
    </group>

  </>
}