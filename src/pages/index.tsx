import Head from "next/head";
import { Canvas } from '@react-three/fiber'
import { OrbitControls, KeyboardControls } from '@react-three/drei'
import KonchordExperience from "~/components/KonchordExperience";


export default function Home() {
  return (
    <>
      <Head>
        <title>Test 01 - Konchord Synth Wave</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main id="main">
        <KeyboardControls
          map={[
            { name: 'forward', keys: ['ArrowUp', 'KeyW'] },
            { name: 'backward', keys: ['ArrowDown', 'KeyS'] },
            { name: 'leftward', keys: ['ArrowLeft', 'KeyA'] },
            { name: 'rightward', keys: ['ArrowRight', 'KeyD'] },
            { name: 'jump', keys: ['Space'] },
          ]}
        >
          <Canvas
            shadows
            camera={{
              fov: 75,
              near: 0.01,
              far: 1000,
              position: [0, 12, -12]
            }}
          >
            <axesHelper args={[12]} />


            {/* <OrbitControls
              // maxPolarAngle={Math.PI / 2 - Math.PI / 8}
            /> */}

            <KonchordExperience />
          </Canvas>
        </KeyboardControls>
      </main>
    </>
  );
}