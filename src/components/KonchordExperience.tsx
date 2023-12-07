import Lights from "./Lights"
import { Physics } from '@react-three/rapier'
import KonchordSpaceship from "./KonchordSpaceship"
import KonchordGrid from "./KonchordGrid"
import TestPlanet from "./planets/TestPlanet"

export default function KonchordExperience() {
  return <>
    <Physics debug>
      <Lights />
      <KonchordGrid />
      <KonchordSpaceship />
      <TestPlanet />
    </Physics>
  </>
}