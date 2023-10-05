import { RigidBody } from "@react-three/rapier"
import { KOLORS } from "~/utils/globals"

export default function Grid() {
  return <>
    <RigidBody>
      <mesh>
        <gridHelper
          args={[200, 40, KOLORS.FOOLS_GOLD, KOLORS.FOOLS_GOLD]}
          rotation={[0, 0, 0]}
          position={[0, -8, 0]}
        />
      </mesh>
    </RigidBody>
  </>

}