import { RigidBody } from "@react-three/rapier"

export default function Player() {
  return <>
  <RigidBody>
      <mesh
        position={[-6, 0, 6]}
      >
        <cylinderGeometry
          args={[0.15, 0.2, 0.8, 24]}
        />
        <meshBasicMaterial
          color={'blue'}
        />
      </mesh>
    </RigidBody>
  </>
}