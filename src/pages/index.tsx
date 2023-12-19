import Head from "next/head";
import { Canvas } from '@react-three/fiber'
import { OrbitControls, KeyboardControls } from '@react-three/drei'
import KonchordExperience from "~/components/KonchordExperience";
import KeInterface from "~/components/interfaces/KeInterface";
import dynamic from 'next/dynamic'
import { Perf } from 'r3f-perf'
import { useEffect, useState } from "react";
import IsTouchDeviceContext from "~/contexts/IsTouchDeviceContext";


const MobileJoystick = dynamic(
  () => import("~/components/interfaces/MobileJoystick"),
  { ssr: false }
)

const IsTouchDevice = dynamic(
  () => import("~/components/IsTouchDevice"),
  { ssr: false }
)

const AudioPlayer = dynamic(
  () => import("~/components/AudioPlayer"),
  { ssr: false }
)


export default function Home() {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  // Watch for fullscreenchange
  useEffect(() => {
    function onFullscreenChange() {
      setIsFullscreen(Boolean(document.fullscreenElement));
    }

    document.addEventListener('fullscreenchange', onFullscreenChange);

    return () => document.removeEventListener('fullscreenchange', onFullscreenChange);
  }, []);

  return (
    <>
      <IsTouchDeviceContext.Provider value={{ isTouchDevice, setIsTouchDevice }}>
        <Head>
          <title>Test 01 - Konchord Synth Wave</title>
          <meta name="description" content="Generated by create-t3-app" />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta name="apple-touch-fullscreen" content="yes" />
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <main id="main">
          <IsTouchDevice />
          {isTouchDevice ? <>
            <div className="joystick_zone" id="joystick_zone_1"></div>
            <div className="joystick_zone" id="joystick_zone_2"></div>
            <MobileJoystick />
          </> : null}

          <AudioPlayer
            isFullscreen={isFullscreen}
          />

          <KeInterface />

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
              {/* <Perf /> */}
              {/* <axesHelper args={[12]} /> */}

              {/* <OrbitControls
              makeDefault
              // maxPolarAngle={Math.PI / 2 - Math.PI / 8}
            /> */}

              <KonchordExperience />
            </Canvas>
          </KeyboardControls>
        </main>
      </IsTouchDeviceContext.Provider>
    </>
  );
}