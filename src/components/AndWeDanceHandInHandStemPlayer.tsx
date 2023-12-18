import { useRef, useState } from 'react'
import * as Tone from 'tone'
import { ThreeEvent, useFrame } from '@react-three/fiber';
import * as THREE from 'three'

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
const smoothing = 0.98

const drumMeter = new Tone.Meter()
drumMeter.normalRange = true
drumMeter.smoothing = smoothing
drumPlayer.connect(drumMeter)

const bassMeter = new Tone.Meter()
bassMeter.normalRange = true
bassMeter.smoothing = smoothing
bassPlayer.connect(bassMeter)

const guitarMeter = new Tone.Meter()
guitarMeter.normalRange = true
guitarMeter.smoothing = smoothing
guitarPlayer.connect(guitarMeter)

const synthMeter = new Tone.Meter()
synthMeter.normalRange = true
synthMeter.smoothing = smoothing
synthPlayer.connect(synthMeter)


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
  const drumRef = useRef<THREE.Mesh>(null!)
  const bassRef = useRef<THREE.Mesh>(null!)
  const guitarRef = useRef<THREE.Mesh>(null!)
  const synthRef = useRef<THREE.Mesh>(null!)
  useFrame(() => {
    /**
     * Drum animation
     */
    const drumMeterValue = drumMeter.getValue()
    let drumScaleFactor
    if (typeof drumMeterValue === 'number') {
      drumScaleFactor = 1 + drumMeterValue
    } else {
      drumScaleFactor = 1
    }
    drumRef.current?.scale.set(drumScaleFactor, drumScaleFactor, drumScaleFactor)

    /**
     * Bass animation
     */
    const bassMeterValue = bassMeter.getValue()
    let bassScaleFactor
    if (typeof bassMeterValue === 'number') {
      bassScaleFactor = 1 + bassMeterValue * 1.5
    } else {
      bassScaleFactor = 1
    }
    bassRef.current?.scale.set(bassScaleFactor, bassScaleFactor, bassScaleFactor)

    /**
     * Guitar animation
     */
    const guitarMeterValue = guitarMeter.getValue()
    let guitarScaleFactor
    if (typeof guitarMeterValue === 'number') {
      guitarScaleFactor = 1 + guitarMeterValue * 2
    } else {
      guitarScaleFactor = 1
    }
    guitarRef.current?.scale.set(guitarScaleFactor, guitarScaleFactor, guitarScaleFactor)

    /**
     * Synth animation
     */
    const synthMeterValue = synthMeter.getValue()
    let synthScaleFactor
    if (typeof synthMeterValue === 'number') {
      synthScaleFactor = 1 + synthMeterValue * 2
    } else {
      synthScaleFactor = 1
    }
    synthRef.current?.scale.set(synthScaleFactor, synthScaleFactor, synthScaleFactor)
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

  const distance = 6
  const cubeSize = 3

  return <>
    <mesh
      ref={drumRef}
      position={[distance, 0, distance]}
      onClick={playStem}
      name={drumsId}
    >
      <boxGeometry args={[cubeSize, cubeSize, cubeSize]} />
      <meshBasicMaterial color={"red"} />
    </mesh>
    <mesh
      ref={bassRef}
      position={[-distance, 0, distance]}
      onClick={playStem}
      name={bassId}
    >
      <boxGeometry args={[cubeSize, cubeSize, cubeSize]} />
      <meshBasicMaterial color={"blue"} />
    </mesh>
    <mesh
      ref={guitarRef}
      position={[distance, 0, -distance]}
      onClick={playStem}
      name={guitarId}
    >
      <boxGeometry args={[cubeSize, cubeSize, cubeSize]} />
      <meshBasicMaterial color={"green"} />
    </mesh>
    <mesh
      ref={synthRef}
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