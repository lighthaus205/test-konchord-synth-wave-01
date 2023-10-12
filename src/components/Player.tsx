import { ThreeEvent } from "@react-three/fiber"
import useBeutomelloGame from "~/stores/useBeutomelloGame"
import { MeepleEnum, PlayerEnum } from "~/utils/enums"


const initialPositions = {
  [MeepleEnum.meeple1]: { x: 6.0, z: 6.0 },
  [MeepleEnum.meeple2]: { x: 6.4, z: 6.4 },
  [MeepleEnum.meeple3]: { x: 6.8, z: 6.8 },
  [MeepleEnum.meeple4]: { x: 7.2, z: 7.2 },
}

const meepleProps: { [key in PlayerEnum]: { meeplePostions: { [key in MeepleEnum]: { x: number, z: number } }, color: string } } = {
  [PlayerEnum.player1]: { meeplePostions: initialPositions, color: 'red' },
  [PlayerEnum.player2]: { meeplePostions: initialPositions, color: 'blue' },
  [PlayerEnum.player3]: { meeplePostions: initialPositions, color: 'yellow' },
  [PlayerEnum.player4]: { meeplePostions: initialPositions, color: 'green' },
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
  const meepleOnClick = (e: ThreeEvent<MouseEvent>) => {
    const selectedMeeple = e.eventObject.name.split('_')[1]
    selectMeeple(selectedMeeple)
    return e;
  }
  let color = meepleProps[player as PlayerEnum].color
  if (player === currentPlayer && meeple === currentMeeple) {
    color = 'white'
  }
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
      <mesh>
        <cylinderGeometry
          args={[0.15, 0.2, 0.8, 24]}
        />
        <meshStandardMaterial
          color={color}
        />
      </mesh>
    </group>
  </>
}

export default function Player() {
  return <>
    {Object.keys(meepleProps).map((player, playerIndex) => {
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