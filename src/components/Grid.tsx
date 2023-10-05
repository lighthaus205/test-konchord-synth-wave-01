import { useLoader } from "@react-three/fiber"
import { RigidBody } from "@react-three/rapier"
import { KOLORS } from "~/utils/globals"
import { TextureLoader } from 'three/src/loaders/TextureLoader'


export default function Grid() {
  const gridMap = useLoader(TextureLoader, 'gridmap.png')
  return <>
    <RigidBody>
      <mesh
        rotation={[-Math.PI * 0.5, 0, 0]}
        scale={1}
      >
        <planeGeometry
          args={[16, 16, 24, 24]}
        />
        <meshStandardMaterial
          map={gridMap}
          color={KOLORS.SPACE}
          transparent={true}
          opacity={1}
          emissive={KOLORS.SPACE}
          emissiveIntensity={2}
        />
      </mesh>
    </RigidBody>
  </>

}