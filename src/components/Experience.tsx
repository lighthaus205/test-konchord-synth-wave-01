import Lights from "./Lights"
import Grid from "./Grid"
import { BossPedal } from "./BossPedal"
import { Physics } from '@react-three/rapier'


export default function Experience() {
  return <>
    <Physics debug>
      <Lights />
      <Grid />
      <BossPedal />
    </Physics>
  </>
}