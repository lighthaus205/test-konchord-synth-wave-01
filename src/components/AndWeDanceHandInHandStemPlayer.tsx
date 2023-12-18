import { useState } from 'react'
import * as Tone from 'tone'
import { ThreeEvent, useFrame } from '@react-three/fiber';

/**
 * Transport
 */
const transport = Tone.Transport;
transport.bpm.value = 113
const loopLength = "2m"
const drumsId: string = 'drum_stems'
const bassId: string = 'bass_stems'
const guitarId: string = 'guitar_stems'
const synthId: string = 'synth_stems'

/**
 * Players
 */
const drumPlayer = new Tone.Player("/audio/stemplayer/and_we_dance_hand_in_hand/v0/Drums.ogg").toDestination()
const bassPlayer = new Tone.Player("/audio/stemplayer/and_we_dance_hand_in_hand/v0/Bass.ogg").toDestination()
const guitarPlayer = new Tone.Player("/audio/stemplayer/and_we_dance_hand_in_hand/v0/Guitar.ogg").toDestination()
const synthPlayer = new Tone.Player("/audio/stemplayer/and_we_dance_hand_in_hand/v0/Synth.ogg").toDestination()

/**
 * Meters
 */
const drumMeter = new Tone.Meter();
drumPlayer.connect(drumMeter);
const bassMeter = new Tone.Meter();
bassPlayer.connect(bassMeter);
const guitarMeter = new Tone.Meter();
guitarPlayer.connect(guitarMeter);
const synthMeter = new Tone.Meter();
synthPlayer.connect(synthMeter);

/**
 * Loopers
 */
const drumsLoop = new Tone.Loop((time) => {
  drumPlayer.start(time);
}, loopLength);

const bassLoop = new Tone.Loop((time) => {
  bassPlayer.start(time);
}, loopLength);

const synthLoop = new Tone.Loop((time) => {
  synthPlayer.start(time);
}, loopLength);

const guitarLoop = new Tone.Loop((time) => {
  guitarPlayer.start(time);
}, loopLength);

/**
 * Play functions
 */
const playDrums = () => {
  transport.start();
  drumsLoop.start(0);
}

const playBass = () => {
  transport.start();
  bassLoop.start(0);
}

const playSynth = () => {
  transport.start();
  synthLoop.start(0);
}

const playGuitar = () => {
  transport.start();
  guitarLoop.start(0);
}

/**
 * Stop functions
 */
const stopDrums = () => {
  drumsLoop.stop();
  drumPlayer.stop();
}

const stopBass = () => {
  bassLoop.stop();
  bassPlayer.stop();
}

const stopSynth = () => {
  synthLoop.stop();
  synthPlayer.stop();
}

const stopGuitar = () => {
  guitarLoop.stop();
  guitarPlayer.stop();
}

export default function AndWeDanceHandInHandStemPlayer() {
  useFrame(() => {
    console.log('drumMeter Value', drumMeter.smoothing)
  })
  const [play, setPlay] = useState(false);
  const playStem = (e: ThreeEvent<MouseEvent>) => {
    console.log('playStem', e)
    const target = e.object.name
    if (target === drumsId) {
      Tone.start()
      if (drumsLoop.state === 'stopped') {
        playDrums()
        setPlay(true)
      } else if (drumsLoop.state === 'started') {
        stopDrums()
        setPlay(false)
      }
    } else if (target === bassId) {
      Tone.start()
      if (bassLoop.state === 'stopped') {
        playBass()
        setPlay(true)
      } else if (drumsLoop.state === 'started') {
        stopBass()
        setPlay(false)
      }
    } else if (target === synthId) {
      Tone.start()
      if (synthLoop.state === 'stopped') {
        playSynth()
        setPlay(true)
      } else if (drumsLoop.state === 'started') {
        stopSynth()
        setPlay(false)
      }
    } else if (target === guitarId) {
      Tone.start()
      if (guitarLoop.state === 'stopped') {
        playGuitar()
        setPlay(true)
      } else if (drumsLoop.state === 'started') {
        stopGuitar()
        setPlay(false)
      }
    }
  }
  const unmute = () => {
    console.log('unmute')
    Tone.start()
    playDrums()
    playBass()
    playSynth()
    playGuitar()
    setPlay(true)
  }

  const mute = () => {
    console.log('unmute')
    stopDrums()
    stopBass()
    stopGuitar()
    stopSynth()
    transport.stop()
    setPlay(false)
  }

  const distance = 15
  const cubeSize = 5

  return <>
    <mesh
      position={[distance, 0, distance]}
      onClick={playStem}
      name={drumsId}
    >
      <boxGeometry args={[cubeSize, cubeSize, cubeSize]} />
      <meshBasicMaterial color={"red"} />
    </mesh>
    <mesh
      position={[-distance, 0, distance]}
      onClick={playStem}
      name={bassId}
    >
      <boxGeometry args={[cubeSize, cubeSize, cubeSize]} />
      <meshBasicMaterial color={"blue"} />
    </mesh>
    <mesh
      position={[distance, 0, -distance]}
      onClick={playStem}
      name={guitarId}
    >
      <boxGeometry args={[cubeSize, cubeSize, cubeSize]} />
      <meshBasicMaterial color={"green"} />
    </mesh>
    <mesh
      position={[-distance, 0, -distance]}
      onClick={playStem}
      name={synthId}
    >
      <boxGeometry args={[cubeSize, cubeSize, cubeSize]} />
      <meshBasicMaterial color={"yellow"} />
    </mesh>
    {/* <div className="flex flex-col items-center justify-center w-full h-screen">
      <div className="mb-8">
        <button id="unmute_button" className="text-white" onClick={play ? mute : unmute}>
          {play === true ? "Mute" : "Unmute"}
        </button>
      </div>

      <div className="stemsWrapper flex items-center justify-center w-full">
        <div className="stem flex m-2 items-center justify-center w-32 h-32 bg-cyan-500 border-solid border-2" id={drumsId} onClick={playStem}>Drums</div>
        <div className="stem flex m-2 items-center justify-center w-32 h-32 bg-cyan-500 border-solid border-2" id={bassId} onClick={playStem}>Bass</div>
        <div className="stem flex m-2 items-center justify-center w-32 h-32 bg-cyan-500 border-solid border-2" id={synthId} onClick={playStem}>Synth</div>
        <div className="stem flex m-2 items-center justify-center w-32 h-32 bg-cyan-500 border-solid border-2" id={guitarId} onClick={playStem}>Guitar</div>
      </div>
    </div> */}
  </>;
}