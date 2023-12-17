import Head from "next/head";
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, KeyboardControls } from '@react-three/drei'
import BeutomelloExperience from "~/components/BeutomelloExperience";
import useBeutomelloGame from "~/stores/useBeutomelloGame";
import { useState } from "react";
import * as THREE from 'three'
import Interface from "~/components/Interface";
import { GamePhaseEnum } from "~/utils/enums";


function CameraReactsToStateChanges() {
  const [smoothedCameraPosition] = useState(() => new THREE.Vector3(-12, 12, 12))
  const cameraPosition = useBeutomelloGame(state => state.cameraPosition)
  const gamePhase = useBeutomelloGame(state => state.gamePhase)

  useFrame((state, delta) => {
    if ([GamePhaseEnum.switchPlayer].includes(gamePhase)) {
      // if (true) {
      smoothedCameraPosition.lerp(cameraPosition, 7 * delta)
      state.camera.position.copy(smoothedCameraPosition)
      state.camera.lookAt(0, 0, 0)
    }
  })
  return <></>
}

export default function Jinks() {
  return (
    <>
      <main id="main">
        <Canvas
          shadows
          camera={{
            fov: 75,
            near: 0.01,
            far: 200,
            position: [-12, 12, 12]
          }}
        >
          <CameraReactsToStateChanges />
          <OrbitControls
            // minPolarAngle={Math.PI / 6}
            // minPolarAngle={Math.PI / 2 - Math.PI / 3}
            maxPolarAngle={Math.PI / 2 - Math.PI / 8}
          />
          <BeutomelloExperience />
        </Canvas>
        <Interface />
      </main>
    </>
  );
}