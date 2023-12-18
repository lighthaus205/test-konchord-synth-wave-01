import { Physics } from '@react-three/rapier'
import { Environment } from "@react-three/drei"
import dynamic from 'next/dynamic'


const AndWeDanceHandInHandStemPlayer = dynamic(
  () => import("~/components/AndWeDanceHandInHandStemPlayer"),
  { ssr: false }
)

export default function StartAgainExperience() {
  console.log('render StartAgainExperience')
  return <>
    <Environment
      background
      files={[
        "/environments/nasa/deep-star-maps-2012-res-1024/px.png",
        "/environments/nasa/deep-star-maps-2012-res-1024/nx.png",
        "/environments/nasa/deep-star-maps-2012-res-1024/py.png",
        "/environments/nasa/deep-star-maps-2012-res-1024/ny.png",
        "/environments/nasa/deep-star-maps-2012-res-1024/pz.png",
        "/environments/nasa/deep-star-maps-2012-res-1024/nz.png",
      ]}
    />
    <Physics timeStep="vary">
      <AndWeDanceHandInHandStemPlayer />
    </Physics>
  </>
}