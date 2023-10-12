import { RigidBody, RapierRigidBody } from "@react-three/rapier"
import * as THREE from 'three'
import { useRef } from "react"
import useBeutomelloGame from "~/stores/useBeutomelloGame"
import { MeepleEnum, PlayerEnum, GameBoardElementKeyEnum } from "~/utils/enums"


export default function Player() {
  const currentPlayer = PlayerEnum.player1
  const currentMeeple = MeepleEnum.meeple1
  const playerRef = useRef<RapierRigidBody>(null!)
  const playerMeshRef = useRef<THREE.Mesh>(null!)

  // const beutomelloGameState = useBeutomelloGame((state) => state.beutomelloGameState)
  // const updateBeutomelloGameState = useBeutomelloGame((state) => state.updateBeutomelloGameState)


  const playerJump = () => {
    console.log('playerJump...');
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
        name="player1_meeple1"
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