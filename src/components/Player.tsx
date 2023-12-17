import { ThreeEvent, useFrame } from "@react-three/fiber"
import useBeutomelloGame from "~/stores/useBeutomelloGame"
import { MeepleEnum, PlayerEnum, GamePhaseEnum } from "~/utils/enums"
import * as THREE from 'three'
import { initialMeeplePositions } from "~/utils/positions"


const meepleProps: { [key in PlayerEnum]: { meeplePostions: { [key in MeepleEnum]: { x: number, z: number } }, color: string } } = {
  [PlayerEnum.player1]: { meeplePostions: initialMeeplePositions, color: 'red' },
  [PlayerEnum.player2]: { meeplePostions: initialMeeplePositions, color: 'blue' },
  [PlayerEnum.player3]: { meeplePostions: initialMeeplePositions, color: 'yellow' },
  [PlayerEnum.player4]: { meeplePostions: initialMeeplePositions, color: 'green' },
}

function Meeple({
  player,
  meeple,
  positionX,
  positionZ,
}: {
  player: PlayerEnum
  meeple: MeepleEnum
  positionX: number
  positionZ: number
}) {
  const currentMeeple = useBeutomelloGame((state) => state.currentMeeple)
  const currentPlayer = useBeutomelloGame((state) => state.currentPlayer)
  const selectMeeple = useBeutomelloGame((state) => state.selectMeeple)
  const moveMeepleCurve = useBeutomelloGame((state) => state.moveMeepleCurve)
  const setMoveMeepleCurve = useBeutomelloGame((state) => state.setMoveMeepleCurve)
  const setGamePhase = useBeutomelloGame((state) => state.setGamePhase)

  const meepleOnClick = (e: ThreeEvent<MouseEvent>) => {
    const selectedPlayer = e.eventObject.name.split('_')[0]
    const selectedMeeple = e.eventObject.name.split('_')[1]
    if (currentPlayer === selectedPlayer) {
      selectMeeple(selectedMeeple)
    }
    setGamePhase(GamePhaseEnum.playing)
    return e;
  }
  let color = meepleProps[player as PlayerEnum].color
  let emissiveIntensity = 0
  if (player === currentPlayer && meeple === currentMeeple) {
    emissiveIntensity = 1
  }

  let getPointAtPosition = 0
  useFrame((state, delta) => {
    if (moveMeepleCurve.points.length) {
      const meepleObjectName = `${currentPlayer}_${currentMeeple}`
      const meepleObject = state.scene.getObjectByName(meepleObjectName)
      getPointAtPosition = getPointAtPosition + delta
      if (getPointAtPosition < 1) {
        const pointOnCurve = moveMeepleCurve.getPointAt(getPointAtPosition)
        meepleObject?.position.copy(pointOnCurve)
      } else {
        setMoveMeepleCurve(new THREE.CatmullRomCurve3())
      }
    }
  })
  return <>
    <group
      name={`${player}_${meeple}`}
      position={[
        player === PlayerEnum.player2 || player === PlayerEnum.player1 ? -positionX : positionX,
        0.4,
        player === PlayerEnum.player3 || player === PlayerEnum.player2 ? -positionZ : positionZ,
      ]}
      onClick={meepleOnClick}
    >
      <mesh castShadow>
        <cylinderGeometry
          args={[0.15, 0.2, 0.8, 24]}
        />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={emissiveIntensity}
        />
      </mesh>
    </group>
  </>
}

export default function Player() {
  const numberOfPlayers = useBeutomelloGame((state) => state.numberOfPlayers)

  return <>
    {Object.keys(meepleProps).map((player, playerIndex) => {
      if (playerIndex + 1 > numberOfPlayers) {
        return
      }
      return Object.keys(meepleProps[player as PlayerEnum].meeplePostions).map((meeple, meepleIndex) => {
        return <Meeple
          key={`${player}_${meeple}`}
          player={player as PlayerEnum}
          meeple={meeple as MeepleEnum}
          positionX={meepleProps[player as PlayerEnum].meeplePostions[meeple as MeepleEnum].x}
          positionZ={meepleProps[player as PlayerEnum].meeplePostions[meeple as MeepleEnum].z}
        />
      })
    })}
  </>
}