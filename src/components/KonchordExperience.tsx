import Lights from "./Lights"
import { Physics } from '@react-three/rapier'
import KonchordSpaceship from "./KonchordSpaceship"
import KonchordGrid from "./KonchordGrid"

export default function KonchordExperience() {
  return <>
    <Physics>
      <Lights />
      <KonchordGrid />
      <KonchordSpaceship />
    </Physics>
  </>
}