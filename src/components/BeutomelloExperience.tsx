import Lights from "./Lights"
import BeutomelloGameBoard from "./BeutomelloGameBoard"
import { Physics } from '@react-three/rapier'


export default function BeutomelloExperience() {
  return <>
    <Physics>
      <Lights />
      <BeutomelloGameBoard />
    </Physics>
  </>
}