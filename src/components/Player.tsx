import { RigidBody, RapierRigidBody } from "@react-three/rapier"
import * as THREE from 'three'
import { useRef } from "react"
import useBeutomelloGame from "~/stores/useBeutomelloGame"
import { MeepleEnum, PlayerEnum, GameBoardElementKeyEnum } from "~/utils/enums"
import { useThree } from '@react-three/fiber'


export default function Player() {
  const currentPlayer = PlayerEnum.player1
  const currentMeeple = MeepleEnum.meeple1
  const playerRef = useRef<RapierRigidBody>(null!)
  const playerMeshRef = useRef<THREE.Mesh>(null!)
  const state = useThree()

  const beutomelloGameState = useBeutomelloGame((state) => state.beutomelloGameState)
  const updateBeutomelloGameState = useBeutomelloGame((state) => state.updateBeutomelloGameState)


  const playerJump = () => {
    console.log('playerJump...');
    const currentGameBoardElementKey = beutomelloGameState[currentPlayer][currentMeeple]
    const newGameBoardElementKey = currentGameBoardElementKey === GameBoardElementKeyEnum.One ? GameBoardElementKeyEnum.Two : GameBoardElementKeyEnum.One
    updateBeutomelloGameState(currentPlayer, currentMeeple, newGameBoardElementKey)
    const gameBoardElementName = `${currentPlayer}_gameBoardElement${newGameBoardElementKey}`
    const gameBoardElement = state.scene.getObjectByName(gameBoardElementName)
    if (gameBoardElement?.position) {
      playerMeshRef.current.position.set(
        gameBoardElement?.position.x,
        gameBoardElement?.position.y,
        gameBoardElement?.position.z
      )
    }

  }

  const onPlayerSleep = () => {
    console.log('onPlayerSleep...')
  }
  return <>
    <RigidBody
      ref={playerRef}
      onSleep={onPlayerSleep}
    >
      <mesh
        ref={playerMeshRef}
        position={[-6, 0, 6]}
        onClick={playerJump}
      >
        <cylinderGeometry
          args={[0.15, 0.2, 0.8, 24]}
        />
        <meshStandardMaterial
          color={'blue'}
        />
      </mesh>
    </RigidBody>
  </>
}