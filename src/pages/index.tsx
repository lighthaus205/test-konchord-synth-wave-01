import Head from "next/head";
import { Canvas } from '@react-three/fiber'
import Experience from "~/components/Experience";

export default function Home() {
  return (
    <>
      <Head>
        <title>Test 01 - Konchord Synth Wave</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main id="main">
        <Canvas
          shadows
        >
          <Experience/>
        </Canvas>
      </main>
    </>
  );
}