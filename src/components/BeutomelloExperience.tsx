import Lights from "./Lights"
import BeutomelloGameBoard from "./BeutomelloGameBoard"
import { Physics } from '@react-three/rapier'
import Player from "./Player"

export default function BeutomelloExperience() {
  return <>
    <Physics debug>
      <Lights />
      <BeutomelloGameBoard />
      <Player />
    </Physics>
  </>
}