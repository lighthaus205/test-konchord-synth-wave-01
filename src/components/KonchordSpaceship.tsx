import { useState, useEffect, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useLoader } from "@react-three/fiber"
import { STLLoader } from "three/examples/jsm/loaders/STLLoader"
import { RigidBody, RapierRigidBody, vec3 } from '@react-three/rapier'
import { useKeyboardControls } from '@react-three/drei'
import * as THREE from 'three'
import useKonchordExperience from '~/stores/useKonchordExperience'


export default function KonchordSpaceship() {
  const fileUrl = "/konchord-spaceship/konchord_spaceship.stl"
  const konchordSpaceshipRef = useRef<RapierRigidBody>(null!)
  const geom = useLoader(STLLoader, fileUrl)

  const [subscribeKeys, getKeys] = useKeyboardControls()

  const [smoothedCameraPosition] = useState(() => new THREE.Vector3(10, 10, 10))
  const [smoothedCameraTarget] = useState(() => new THREE.Vector3())

  const askToEnterPlanet = useKonchordExperience((state) => state.askToEnterPlanet)
  const konchordSpaceshipRefStore = useKonchordExperience((state) => state.konchordSpaceshipRef)
  const setKonchordSpaceshipRef = useKonchordExperience((state) => state.setKonchordSpaceshipRef)
  if (!konchordSpaceshipRefStore) {
    setKonchordSpaceshipRef(konchordSpaceshipRef)
  }
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

  const stopSpaceship = () => {
    const impulse = { x: 0, y: 0, z: 0 }
    konchordSpaceshipRef.current.setLinvel(impulse, true)
    konchordSpaceshipRef.current.setEnabled(false)
    // let factor = 20
    // let i = 0
    // let maxI = 10
    // for (i; i < maxI; i++) {
    //   setTimeout(() => {
    //     if (i === maxI) {
    //       console.log('STOP!!!')
    //     } else {
    //       let velocity = konchordSpaceshipRef.current.linvel()
    //       console.log('velocity', velocity)
    //       let impulse = {
    //         x: -velocity.x / factor,
    //         y: -velocity.y / factor,
    //         z: -velocity.z / factor,
    //       }
    //       console.log('Applying impulse...', impulse)
    //       konchordSpaceshipRef.current.applyImpulse(impulse, true)
    //     }
    //   }, 100 * i)
    // }
  }

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

    konchordSpaceshipRef.current.applyImpulse(impulse, true)
    // konchordSpaceship.current.applyTorqueImpulse(torque, true)

    /**
     * Camera
     */
    const bodyPosition = konchordSpaceshipRef.current.translation()
    const cameraPosition = new THREE.Vector3()
    cameraPosition.x = bodyPosition.x
    cameraPosition.z = bodyPosition.z + 4
    cameraPosition.y = bodyPosition.y + 2

    const cameraTarget = new THREE.Vector3()
    cameraTarget.x += bodyPosition.x
    cameraTarget.y += bodyPosition.y + 1.5
    cameraTarget.z += bodyPosition.z

    smoothedCameraPosition.lerp(cameraPosition, 7 * delta)
    smoothedCameraTarget.lerp(cameraTarget, 7 * delta)

    state.camera.position.copy(cameraPosition)
    state.camera.lookAt(cameraTarget)
  })

  return (
    <>
      <RigidBody
        ref={konchordSpaceshipRef}
        restitution={0.2}
        friction={1}
        scale={0.01}
        rotation={[- Math.PI / 2, 0, 0]}
        position={[0, 10, 0]}
        gravityScale={0}
        onIntersectionEnter={(payload) => {
          let enterPlanetData = payload.other.rigidBodyObject?.userData
          let velocity = vec3(konchordSpaceshipRef.current.linvel())
          if (velocity.length() > 0.0001) {
            stopSpaceship()
            askToEnterPlanet(enterPlanetData)
          }
        }}
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