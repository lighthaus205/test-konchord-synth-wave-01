import { useRef } from "react";
import { useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { Mesh } from "three";

export function BossPedal() {
  const fileUrl = "/boss_ch-1/scene.gltf";
  const bossPedalRef = useRef<Mesh>(null!);
  const gltf = useLoader(GLTFLoader, fileUrl);
  
  return (
    <>
      <mesh
        ref={bossPedalRef}
        scale={0.2}
        rotation={[Math.PI / 8, - Math.PI / 2, 0]}
        position={[0, -1, 2]}
      >
        <primitive object={gltf.scene} />
      </mesh>
    </>
  );
}
