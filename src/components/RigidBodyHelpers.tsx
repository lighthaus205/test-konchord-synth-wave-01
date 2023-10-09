import { CuboidCollider, RigidBody } from "@react-three/rapier"
import * as THREE from 'three'

export function QuadraticWalls({
  center = new THREE.Vector3(0, 0, 0),
  height = 2,
  thickness = 0.1,
  length = 8,
}: {
  center?: THREE.Vector3
  height?: number
  thickness?: number
  length?: number

}) {
  return <>
    <RigidBody type="fixed">
      <CuboidCollider
        args={[thickness, height, length]}
        position={[center.x + length, center.y + height, center.z + 0]}
      />
    </RigidBody>
    <RigidBody type="fixed">
      <CuboidCollider
        args={[thickness, height, length]}
        position={[center.x + -length, center.y + height, center.z + 0]}
      />
    </RigidBody>
    <RigidBody type="fixed">
      <CuboidCollider
        args={[length, height, thickness]}
        position={[center.x + 0, center.y + height, center.z + length]}
      />
    </RigidBody>
    <RigidBody type="fixed">
      <CuboidCollider
        args={[length, height, thickness]}
        position={[center.x + 0, center.y + height, center.z + -length]}
      />
    </RigidBody>
  </>
}

export function CuboidColliderBox({
  center = new THREE.Vector3(0, 0, 0),
  height = 2,
  thickness = 0.1,
  length = 8,
}: {
  center?: THREE.Vector3
  height?: number
  thickness?: number
  length?: number

}) {
  return <>
    <QuadraticWalls
      center={center}
      length={length}
      height={height}
    />
    <RigidBody type="fixed">
      <CuboidCollider
        args={[length, thickness, length]}
        position={[center.x, center.y, center.z]}
      />
    </RigidBody>
    <RigidBody type="fixed">
      <CuboidCollider
        args={[length, thickness, length]}
        position={[center.x, center.y + height * 2, center.z]}
      />
    </RigidBody>
  </>
}