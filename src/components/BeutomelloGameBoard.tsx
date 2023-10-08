import { RigidBody } from "@react-three/rapier"
import { TextureLoader } from 'three/src/loaders/TextureLoader'
import { useLoader } from "@react-three/fiber"
import * as THREE from 'three'
import { useMemo } from "react"

// const heartShape = new THREE.Shape()
// const x = -4.8, y = -5.8
// heartShape.moveTo(x, y)
// heartShape.lineTo(x + 0.8, y + 0.3)
// heartShape.lineTo(x + 0.1, y + 1)
// heartShape.lineTo(x + -0.5, y + 0.45)

enum PlayerEnum {
  player1 = 'player1',
  player2 = 'player2',
  player3 = 'player3',
  player4 = 'player4'
}

enum GameBoardElementKeyEnum {
  One = 1,
  Two = 2,
  Three = 3,
  Four = 4,
  Five = 5,
  Six = 6,
  Seven = 7,
  Eight = 8,
  Nine = 9,
  Ten = 10,
}

const playingFieldElementGeometry = new THREE.BoxGeometry(2, 0.01, 0.6)
const playingFieldElementMaterial = new THREE.MeshBasicMaterial({ color: 'red' })

function GameBoardElement({
  player,
  gameBoardElementKey,
}: {
  player: PlayerEnum,
  gameBoardElementKey: GameBoardElementKeyEnum
}
) {
  const xzPositions = useMemo(() => {
    const xzPositions: { [key in PlayerEnum]: { [key in GameBoardElementKeyEnum]: { x: number, z: number } } } = {
      [PlayerEnum.player1]: {
        1: { x: -5.05, z: 5.05 },
        2: { x: -4.55, z: 4.55 },
        3: { x: -4.1, z: 4.1 },
        4: { x: -3.65, z: 3.65 },
        5: { x: -3.15, z: 3.15 },
        6: { x: -2.7, z: 2.7 },
        7: { x: -2.25, z: 2.25 },
        8: { x: -1.8, z: 1.8 },
        9: { x: -1.4, z: 1.4 },
        10: { x: -0.95, z: 0.95 },
      },
      [PlayerEnum.player2]: {
        1: { x: -5.05, z: -5.05 },
        2: { x: -4.55, z: -4.55 },
        3: { x: -4.1, z: -4.1 },
        4: { x: -3.65, z: -3.65 },
        5: { x: -3.15, z: -3.15 },
        6: { x: -2.7, z: -2.7 },
        7: { x: -2.25, z: -2.25 },
        8: { x: -1.8, z: -1.8 },
        9: { x: -1.4, z: -1.4 },
        10: { x: -0.95, z: -0.95 },
      },
      [PlayerEnum.player3]: {
        1: { x: 5.05, z: -5.05 },
        2: { x: 4.55, z: -4.55 },
        3: { x: 4.1, z: -4.1 },
        4: { x: 3.65, z: -3.65 },
        5: { x: 3.15, z: -3.15 },
        6: { x: 2.7, z: -2.7 },
        7: { x: 2.25, z: -2.25 },
        8: { x: 1.8, z: -1.8 },
        9: { x: 1.4, z: -1.4 },
        10: { x: 0.95, z: -0.95 },
      },
      [PlayerEnum.player4]: {
        1: { x: 5.05, z: 5.05 },
        2: { x: 4.55, z: 4.55 },
        3: { x: 4.1, z: 4.1 },
        4: { x: 3.65, z: 3.65 },
        5: { x: 3.15, z: 3.15 },
        6: { x: 2.7, z: 2.7 },
        7: { x: 2.25, z: 2.25 },
        8: { x: 1.8, z: 1.8 },
        9: { x: 1.4, z: 1.4 },
        10: { x: 0.95, z: 0.95 },
      }
    }
    return xzPositions;
  }, [])

  let yRotation = 0;
  if (player === PlayerEnum.player1) {
    yRotation = Math.PI / -4
  }
  if (player === PlayerEnum.player2) {
    yRotation = Math.PI / 4
  }
  if (player === PlayerEnum.player3) {
    yRotation = Math.PI / -4
  }
  if (player === PlayerEnum.player4) {
    yRotation = Math.PI / 4
  }
  return <>
    <RigidBody type="fixed">
      <mesh
        rotation={[0, yRotation, 0]}
        position={[
          xzPositions[player][gameBoardElementKey].x,
          0.02,
          xzPositions[player][gameBoardElementKey].z
        ]}
        geometry={playingFieldElementGeometry}
        material={playingFieldElementMaterial}
      >
      </mesh>
    </RigidBody>
  </>
}


export default function BeutomelloGameBoard() {
  const gridMap = useLoader(TextureLoader, 'beutomelloGameBoard.jpg')
  const players = [PlayerEnum.player1, PlayerEnum.player2, PlayerEnum.player3, PlayerEnum.player4]
  const boardElementKeys = [
    GameBoardElementKeyEnum.One,
    GameBoardElementKeyEnum.Two,
    GameBoardElementKeyEnum.Three,
    GameBoardElementKeyEnum.Four,
    GameBoardElementKeyEnum.Five,
    GameBoardElementKeyEnum.Six,
    GameBoardElementKeyEnum.Seven,
    GameBoardElementKeyEnum.Eight,
    GameBoardElementKeyEnum.Nine,
    GameBoardElementKeyEnum.Ten
  ]
  return <>
    {players.map((player, playerIndex) => {
      return boardElementKeys.map((boardElementKey, boardElementKeyIndex) => {
        return <GameBoardElement
          key={`player${playerIndex + 1}_boardElement${boardElementKeyIndex + 1}`}
          player={player}
          gameBoardElementKey={boardElementKey}
        />
      })
    })}
    <RigidBody type="fixed">
      <mesh
        rotation={[-Math.PI * 0.5, 0, 0]}
        scale={1}
      >
        <planeGeometry
          args={[16, 16, 24, 24]}
        />
        <meshStandardMaterial
          map={gridMap}
        />
      </mesh>
    </RigidBody>
  </>
}