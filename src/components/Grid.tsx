import { useLoader } from "@react-three/fiber"
import { RigidBody } from "@react-three/rapier"
import { KOLORS } from "~/utils/globals"
import { TextureLoader } from 'three/src/loaders/TextureLoader'


export default function Grid() {
  const gridMap = useLoader(TextureLoader, 'gridmap.png')
  return <>
    <RigidBody>
      <mesh
        rotation={[-Math.PI * 0.49, 0, 0]}
      >
        <planeGeometry
          args={[16, 8, 24, 24]}
        />
        <meshStandardMaterial map={gridMap} />
      </mesh>
    </RigidBody>
  </>

}