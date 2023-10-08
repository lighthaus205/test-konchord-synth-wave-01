import { RigidBody } from "@react-three/rapier";
import { QuadraticWalls } from "./BeutomelloGameBoard";
import * as THREE from 'three'

export default function Dice() {
  const center = new THREE.Vector3(0, 0, -12)
  return <>
  <QuadraticWalls
    center={center}
    length={4}
  />
  <RigidBody type="fixed">
    <mesh
      rotation={[Math.PI / -2, 0, 0]}
      position={center}
    >
      <planeGeometry
        args={[8, 8, 4, 4]}
      />
      <meshBasicMaterial
        color={'darkblue'}
      />
    </mesh>
  </RigidBody>
    <RigidBody>
      <mesh
        position={[center.x, center.y + 2, center.z]}
      >
        <boxGeometry
          args={[1, 1, 1]}
        />
        <meshBasicMaterial
          color={'green'}
        />
      </mesh>
    </RigidBody>
  </>
}