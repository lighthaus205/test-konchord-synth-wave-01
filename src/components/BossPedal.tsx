import { useRef } from "react"
import { useFrame, useLoader } from "@react-three/fiber"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"
import { useKeyboardControls } from '@react-three/drei'
import { RigidBody, RapierRigidBody } from '@react-three/rapier'


export function BossPedal() {
  const fileUrl = "/boss_ch-1/scene.gltf";
  const bossPedalRef = useRef<RapierRigidBody>(null!);
  const gltf = useLoader(GLTFLoader, fileUrl);

  const [subscribeKeys, getKeys] = useKeyboardControls()

  useFrame((state, delta) => {
    /**
     * Controls
     */
    const { forward, backward, leftward, rightward } = getKeys()

    const impulse = { x: 0, y: 0, z: 0 }

    const impulseStrength = 60 * delta

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

    bossPedalRef.current.applyImpulse(impulse, true)
  })

  return (
    <>
      <RigidBody
        ref={bossPedalRef}
        restitution={0.2}
        friction={1}
        scale={0.2}
        rotation={[Math.PI / 8, - Math.PI / 2, 0]}
        position={[0, 4, 0]}
      >
        <mesh>
          <primitive object={gltf.scene} />
        </mesh>
      </RigidBody>

    </>
  );
}
