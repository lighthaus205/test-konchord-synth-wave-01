import Lights from "./Lights"
import { Physics } from '@react-three/rapier'
import KonchordSpaceship from "./KonchordSpaceship"
import KonchordGrid from "./KonchordGrid"
import Planet from "./planets/Planet"
import * as THREE from 'three'


export default function KonchordExperience() {
  console.log('render KonchordExperience')
  return <>
    <Physics >
      <Lights />
      <KonchordGrid />
      <KonchordSpaceship />
      <Planet
        texture_path="/planet_textures/2k_ceres_fictional.jpeg"
        planet_key="start_again"
        planet_name="Start Again"
        redirect_url="/planets/start-again"
        position={new THREE.Vector3(30, 10, -100)}
        rotation={new THREE.Vector3(0, 0.2, 0)}
        scale={10}
      />
      <Planet
        texture_path="/planet_textures/2k_eris_fictional.jpeg"
        planet_key="we_keep_falling_we_keep_rising"
        planet_name="We keep falling we keep rising"
        redirect_url="/planets/we-keep-falling-we-keep-rising"
        position={new THREE.Vector3(500, 10, -150)}
        rotation={new THREE.Vector3(0, 0, 0.2)}
        scale={10}
      />
      <Planet
        texture_path="/planet_textures/2k_haumea_fictional.jpeg"
        planet_key="let_theses_leaves_fall"
        planet_name="Let theses leaves fall"
        redirect_url="/planets/let-theses-leaves-fall"
        position={new THREE.Vector3(-300, 10, -300)}
        rotation={new THREE.Vector3(0, -0.2, 0)}
        scale={10}
      />
      <Planet
        texture_path="/planet_textures/2k_makemake_fictional.jpeg"
        planet_key="i_am_with_you_in_this_pain"
        planet_name="I am with you in this pain"
        redirect_url="/planets/i-am-with-you-in-this-pain"
        position={new THREE.Vector3(200, 10, 200)}
        rotation={new THREE.Vector3(0.2, 0, 0)}
        scale={10}
      />
    </Physics>
  </>
}