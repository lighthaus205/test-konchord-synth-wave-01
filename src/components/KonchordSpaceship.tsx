import { useState, useEffect, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useLoader } from "@react-three/fiber"
import { STLLoader } from "three/examples/jsm/loaders/STLLoader"
import { RigidBody, RapierRigidBody, vec3, quat } from '@react-three/rapier'
import { useKeyboardControls } from '@react-three/drei'
import * as THREE from 'three'
import useKonchordExperience from '~/stores/useKonchordExperience'
import useMobileJoystick from '~/stores/useMobileJoystick'


export default function KonchordSpaceship() {
  const fileUrl = "/konchord-spaceship/konchord_spaceship.stl"
  const konchordSpaceshipRef = useRef<RapierRigidBody>(null!)
  const konchordSpaceshipMeshRef = useRef<THREE.Mesh>(null!)
  const geom = useLoader(STLLoader, fileUrl)

  const [subscribeKeys, getKeys] = useKeyboardControls()
  const maxJoystickDistance = 50
  const joystickDistanceL = useMobileJoystick((state) => state.distance_l)
  const joystickDirectionL = useMobileJoystick((state) => state.direction_l)
  const joystickDistanceR = useMobileJoystick((state) => state.distance_r)
  const joystickDirectionR = useMobileJoystick((state) => state.direction_r)
  const isTouchDevice = useMobileJoystick((state) => state.isTouchDevice)

  const [smoothedCameraPosition] = useState(() => new THREE.Vector3(10, 10, 10))
  const [smoothedCameraTarget] = useState(() => new THREE.Vector3())

  const askToEnterPlanet = useKonchordExperience((state) => state.askToEnterPlanet)
  const konchordSpaceshipRefStore = useKonchordExperience((state) => state.konchordSpaceshipRef)
  const setKonchordSpaceshipRef = useKonchordExperience((state) => state.setKonchordSpaceshipRef)
  if (!konchordSpaceshipRefStore) {
    setKonchordSpaceshipRef(konchordSpaceshipRef)
  }

  const eulerVector = new THREE.Vector3(0, 1, 0)
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
    konchordSpaceshipRef.current?.setLinvel(impulse, true)
    konchordSpaceshipRef.current?.setEnabled(false)
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
    const torque = { x: 0, y: 0, z: 0 }
    const impulse = { x: 0, y: 0, z: 0 }
    const impulseStrength = 1 * delta
    const torqueStrength = 0.1 * delta
    const angvel = konchordSpaceshipRef.current?.angvel()
    const linvel = konchordSpaceshipRef.current?.linvel()
    const maxLinvel = 15
    const linvelSlowDownFactor = 0.99
    const maxAngvel = 0.7
    const angvelSlowDownFactor = 0.97
    const bodyPosition = konchordSpaceshipRef.current?.translation()
    const bodyRotation = konchordSpaceshipRef.current?.rotation()
    const bodyRotationEuler = new THREE.Euler().setFromQuaternion(quat(bodyRotation))

    if (isTouchDevice) {
      // Set linear velocity for z dimension
      if (joystickDirectionL && joystickDirectionL.angle === 'up') {
        impulse.z -= impulseStrength * (joystickDistanceL / maxJoystickDistance) * Math.cos(bodyRotationEuler.z)
        impulse.x -= impulseStrength * (joystickDistanceL / maxJoystickDistance) * Math.sin(bodyRotationEuler.z)
      }
      if (joystickDirectionL && joystickDirectionL.angle === 'down') {
        impulse.z = impulseStrength * (joystickDistanceL / maxJoystickDistance) * Math.cos(bodyRotationEuler.z)
        impulse.x = impulseStrength * (joystickDistanceL / maxJoystickDistance) * Math.sin(bodyRotationEuler.z)
      }

      // Set linear velocity for x dimension
      if (joystickDirectionL && joystickDirectionL.angle === 'left') {
        impulse.x -= impulseStrength * (joystickDistanceL / maxJoystickDistance) * Math.cos(bodyRotationEuler.z)
        impulse.z = impulseStrength * (joystickDistanceL / maxJoystickDistance) * Math.sin(bodyRotationEuler.z)
      }
      if (joystickDirectionL && joystickDirectionL.angle === 'right') {
        impulse.x = impulseStrength * (joystickDistanceL / maxJoystickDistance) * Math.cos(bodyRotationEuler.z)
        impulse.z -= impulseStrength * (joystickDistanceL / maxJoystickDistance) * Math.sin(bodyRotationEuler.z)
      }
      
      // Set angular velocity for y dimension
      if (joystickDirectionR && joystickDirectionR.angle === 'left') {
        torque.y = torqueStrength * (joystickDistanceR / maxJoystickDistance)
      }
      if (joystickDirectionR && joystickDirectionR.angle === 'right') {
        torque.y -= torqueStrength * (joystickDistanceR / maxJoystickDistance)
      }

    } else {
      const { forward, backward, leftward, rightward } = getKeys()

      if (forward) {
        impulse.z -= impulseStrength
      }

      if (backward) {
        impulse.z = impulseStrength
      }

      if (leftward) {
        impulse.x -= impulseStrength
      }

      if (rightward) {
        impulse.x = impulseStrength
      }
    }

    // Apply impulse and handle "friction" of linear velocity
    if (impulse.x !== 0 || impulse.z !== 0) {
      konchordSpaceshipRef.current?.applyImpulse(impulse, true)
    } else if (linvel) {
      linvel.x *= linvelSlowDownFactor
      linvel.z *= linvelSlowDownFactor
      konchordSpaceshipRef.current?.setLinvel(linvel, true)
    }
    
    // Apply torque impulse and handle "friction" of rotation
    if (torque.y !== 0) {
      konchordSpaceshipRef.current?.applyTorqueImpulse(torque, true)
    } else if (angvel) {
      angvel.y *= angvelSlowDownFactor
      konchordSpaceshipRef.current?.setAngvel(angvel, true)
    }

    // Limit max linear velocity
    if (linvel && linvel.x > maxLinvel) {
      linvel.x = maxLinvel
      konchordSpaceshipRef.current?.setLinvel(linvel, true)
    }
    if (linvel && linvel.x < -maxLinvel) {
      linvel.x = -maxLinvel
      konchordSpaceshipRef.current?.setLinvel(linvel, true)
    }
    if (linvel && linvel.z > maxLinvel) {
      linvel.z = maxLinvel
      konchordSpaceshipRef.current?.setLinvel(linvel, true)
    }
    if (linvel && linvel.z < -maxLinvel) {
      linvel.z = -maxLinvel
      konchordSpaceshipRef.current?.setLinvel(linvel, true)
    }

    // Limit max angular velocity
    if (angvel && angvel.y > maxAngvel) {
      angvel.y = maxAngvel
      konchordSpaceshipRef.current?.setAngvel(angvel, true)
    }
    if (angvel && angvel.y < -maxAngvel) {
      angvel.y = -maxAngvel
      konchordSpaceshipRef.current?.setAngvel(angvel, true)
    }

    /**
     * Camera
     */
    const cameraPosition = new THREE.Vector3()
    const cameraTarget = new THREE.Vector3()

    if (bodyPosition && bodyRotation && bodyRotationEuler) {
      cameraPosition.x = bodyPosition.x + (Math.sin(bodyRotationEuler.z) * 2)
      cameraPosition.y = bodyPosition.y + 2
      cameraPosition.z = bodyPosition.z + (Math.cos(bodyRotationEuler.z) * 2)

      cameraTarget.x += bodyPosition.x
      cameraTarget.y += bodyPosition.y + 1
      cameraTarget.z += bodyPosition.z
    }

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
        position={[0, 10, 0]}
        rotation={[- Math.PI / 2, 0, 0]}
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
        <mesh
          receiveShadow
          castShadow
          ref={konchordSpaceshipMeshRef}
        >
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