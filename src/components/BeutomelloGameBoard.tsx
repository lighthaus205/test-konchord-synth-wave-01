import { RigidBody, CuboidCollider } from "@react-three/rapier"
import { TextureLoader } from 'three/src/loaders/TextureLoader'
import { useLoader } from "@react-three/fiber"
import * as THREE from 'three'
import { PlayerEnum, GameBoardElementKeyEnum } from "~/utils/enums"
import { QuadraticWalls } from "./RigidBodyHelpers"
import { Float, Text } from '@react-three/drei'
import useBeutomelloGame from "~/stores/useBeutomelloGame"
import { gameBoardProps } from "~/utils/positions"


const GameBoardElementGeometry = new THREE.BoxGeometry(2, 0, 0.6)
const GameBoardElementMaterial = new THREE.MeshStandardMaterial({
  color: 'darkblue',
  opacity: 0,
  transparent: true
})



function GameBoardElement({
  player,
  name,
  gameBoardElementKey,
}: {
  player: PlayerEnum,
  gameBoardElementKey: GameBoardElementKeyEnum
  name: string
}
) {
  let yRotation = 0
  let xPosition = 0
  let zPosition = 0
  if (player === PlayerEnum.player1) {
    if (gameBoardElementKey > 11) {
      yRotation = Math.PI / 4
      xPosition = -gameBoardProps[player][gameBoardElementKey].x
      zPosition = -gameBoardProps[player][gameBoardElementKey].z
    } else {
      yRotation = Math.PI / -4
      xPosition = -gameBoardProps[player][gameBoardElementKey].x
      zPosition = gameBoardProps[player][gameBoardElementKey].z
    }
  }
  if (player === PlayerEnum.player2) {
    if (gameBoardElementKey > 11) {
      yRotation = Math.PI / -4
      xPosition = gameBoardProps[player][gameBoardElementKey].x
      zPosition = -gameBoardProps[player][gameBoardElementKey].z
    } else {
      yRotation = Math.PI / 4
      xPosition = -gameBoardProps[player][gameBoardElementKey].x
      zPosition = -gameBoardProps[player][gameBoardElementKey].z
    }
  }
  if (player === PlayerEnum.player3) {
    if (gameBoardElementKey > 11) {
      yRotation = Math.PI / 4
      xPosition = gameBoardProps[player][gameBoardElementKey].x
      zPosition = gameBoardProps[player][gameBoardElementKey].z
    } else {
      yRotation = Math.PI / -4
      xPosition = gameBoardProps[player][gameBoardElementKey].x
      zPosition = -gameBoardProps[player][gameBoardElementKey].z
    }
  }
  if (player === PlayerEnum.player4) {
    if (gameBoardElementKey > 11) {
      yRotation = Math.PI / -4
      xPosition = -gameBoardProps[player][gameBoardElementKey].x
      zPosition = gameBoardProps[player][gameBoardElementKey].z
    } else {
      yRotation = Math.PI / 4
      xPosition = gameBoardProps[player][gameBoardElementKey].x
      zPosition = gameBoardProps[player][gameBoardElementKey].z
    }
  }

  return <>
    <mesh
      name={name}
      rotation={[0, yRotation, 0]}
      position={[
        xPosition,
        0,
        zPosition
      ]}
      geometry={GameBoardElementGeometry}
      material={GameBoardElementMaterial}
    >
    </mesh>
  </>
}

function PlayerText({
  player
}: {
  player: PlayerEnum
}) {
  const playerDisplayNames = useBeutomelloGame((state) => state.playerDisplayNames)
  const playerTextConfig = {
    [PlayerEnum.player1]: {
      displayName: playerDisplayNames[player as PlayerEnum],
      positionX: -8.5,
      positionZ: 8.5,
      rotationZ: Math.PI / -4
    },
    [PlayerEnum.player2]: {
      displayName: playerDisplayNames[player as PlayerEnum],
      positionX: -8.5,
      positionZ: -8.5,
      rotationZ: Math.PI / 4 + Math.PI
    },
    [PlayerEnum.player3]: {
      displayName: playerDisplayNames[player as PlayerEnum],
      positionX: 8.5,
      positionZ: -8.5,
      rotationZ: Math.PI / -4 + Math.PI
    },
    [PlayerEnum.player4]: {
      displayName: playerDisplayNames[player as PlayerEnum],
      positionX: 8.5,
      positionZ: 8.5,
      rotationZ: Math.PI / 4
    },
  }
  return <>
    <Float floatIntensity={0.25} rotationIntensity={0.25}>
      <Text
        scale={0.8}
        font="/fonts/Anton-Regular.ttf"
        // maxWidth={0.25}
        lineHeight={0.75}
        textAlign='right'
        position={[
          playerTextConfig[player].positionX,
          0,
          playerTextConfig[player].positionZ
        ]}
        rotation={[
          - Math.PI / 2,
          0,
          playerTextConfig[player].rotationZ
        ]}
      >
        {playerTextConfig[player].displayName}
        <meshBasicMaterial toneMapped={false} />
      </Text>
    </Float>
  </>
}


export default function BeutomelloGameBoard() {
  const gridMap = useLoader(TextureLoader, '/beutomelloGameBoard.jpg')
  const numberOfPlayers = useBeutomelloGame((state) => state.numberOfPlayers)

  return <>
    {Object.keys(gameBoardProps).map((player, playerIndex) => {
      if (playerIndex + 1 > numberOfPlayers) {
        return
      }
      return <>
        <PlayerText
          key={`displayText_${player}`}
          player={player as PlayerEnum}
        />
        {Object.keys(gameBoardProps[player as PlayerEnum]).map((boardElementKey, boardElementKeyIndex) => {
          return <GameBoardElement
            name={`${player}_gameBoardElement${boardElementKey}`}
            key={`${player}_gameBoardElement${boardElementKey}`}
            player={player as PlayerEnum}
            gameBoardElementKey={parseInt(boardElementKey) as GameBoardElementKeyEnum}
          />
        })}
      </>
    })}
    <QuadraticWalls />
    <RigidBody type="fixed">
      <mesh
        rotation={[-Math.PI * 0.5, 0, 0]}
        scale={1}
        receiveShadow
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