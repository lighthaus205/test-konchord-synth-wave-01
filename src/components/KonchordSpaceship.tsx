import { useEffect, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useLoader } from "@react-three/fiber"
import { STLLoader } from "three/examples/jsm/loaders/STLLoader"
import { RigidBody, RapierRigidBody } from '@react-three/rapier'
import { useKeyboardControls } from '@react-three/drei'
import * as THREE from 'three'


export default function KonchordSpaceship() {
  const fileUrl = "/konchord-spaceship/konchord_spaceship.stl"
  const konchordSpaceship = useRef<RapierRigidBody>(null!)
  const geom = useLoader(STLLoader, fileUrl)

  const [subscribeKeys, getKeys] = useKeyboardControls()

  useEffect(() => {
    /*
    const unsubscribeReset = useGame.subscribe((state) => state.phase, (value) => {
      if (value === 'ready') {
        reset()
      }
    })

    const unsubscribeJump = subscribeKeys((state) => state.jump, (value) => {
      if (value) {
        jump()
      }
    })

    const unsubscribeAny = subscribeKeys(() => {
      start()
    })

    return () => {
      unsubscribeReset()
      unsubscribeJump()
      unsubscribeAny()
    }
    */
  })

  useFrame((state, delta) => {
    /**
     * Controls
     */
    const { forward, backward, leftward, rightward } = getKeys()

    const impulse = { x: 0, y: 0, z: 0 }
    const torque = { x: 0, y: 0, z: 0 }

    const impulseStrength = 5 * delta
    const torqueStrength = 0.2 * delta

    if (forward) {
      impulse.z -= impulseStrength
      torque.x -= torqueStrength
    }

    if (backward) {
      impulse.z = impulseStrength
      torque.x = torqueStrength
    }

    if (leftward) {
      impulse.x -= impulseStrength
      torque.z = torqueStrength
    }

    if (rightward) {
      impulse.x = impulseStrength
      torque.z -= torqueStrength
    }

    konchordSpaceship.current.applyImpulse(impulse, true)
    // konchordSpaceship.current.applyTorqueImpulse(torque, true)

    /**
     * Camera
     */
    const bodyPosition = konchordSpaceship.current.translation()
    const cameraPosition = new THREE.Vector3()
    cameraPosition.x = bodyPosition.x
    cameraPosition.z = bodyPosition.z + 4
    cameraPosition.y = bodyPosition.y + 2

    const cameraTarget = new THREE.Vector3()
    cameraTarget.x += bodyPosition.x
    cameraTarget.y += bodyPosition.y + 0.25
    cameraTarget.z += bodyPosition.z

    // smoothedCameraPosition.lerp(cameraPosition, 7 * delta)
    // smoothedCameraTarget.lerp(cameraTarget, 7 * delta)

    state.camera.position.copy(cameraPosition)
    state.camera.lookAt(cameraTarget)
  })

  return (
    <>
      <RigidBody
        ref={konchordSpaceship}
        restitution={0.2}
        friction={1}
        scale={0.03}
        rotation={[Math.PI / 2, Math.PI, 0]}
        position={[0, 1, 0]}
        gravityScale={0}
      >
        <mesh>
          <primitive
            object={geom}
            attach="geometry"
          />
          <meshStandardMaterial
            color={"#ffcc02"}
          />
        </mesh>
      </RigidBody>

    </>
  );
}