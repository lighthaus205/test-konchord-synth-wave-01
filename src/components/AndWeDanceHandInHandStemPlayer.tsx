import { useState } from 'react'
import * as Tone from 'tone'

const transport = Tone.Transport;
transport.bpm.value = 113
const drumsPlayer = new Tone.Player("/audio/stemplayer/and_we_dance_hand_in_hand/v0/Drums.ogg").toDestination()
const bassPlayer = new Tone.Player("/audio/stemplayer/and_we_dance_hand_in_hand/v0/Bass.ogg").toDestination()
const guitarPlayer = new Tone.Player("/audio/stemplayer/and_we_dance_hand_in_hand/v0/Guitar.ogg").toDestination()
const synthPlayer = new Tone.Player("/audio/stemplayer/and_we_dance_hand_in_hand/v0/Synth.ogg").toDestination()
drumsPlayer.loop = true
bassPlayer.loop = true
guitarPlayer.loop = true
synthPlayer.loop = true
const loopLength = "2m"
const drumsId: string = 'drum_stems'
const bassId: string = 'bass_stems'
const guitarId: string = 'guitar_stems'
const synthId: string = 'synth_stems'

const drumsLoop = new Tone.Loop((time) => {
  drumsPlayer.start(time);
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

const stopDrums = () => {
  drumsLoop.stop();
  drumsPlayer.stop();
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
  const [play, setPlay] = useState(false);
  const playStem = (e: React.MouseEvent<HTMLElement>) => {
    console.log('playStem', e.currentTarget.id)
    if (e.currentTarget.id === drumsId) {
      Tone.start()
      if (drumsLoop.state === 'stopped') {
        playDrums()
        setPlay(true)
      } else if (drumsLoop.state === 'started') {
        stopDrums()
        setPlay(false)
      }
      
    } else if (e.currentTarget.id === bassId) {
      Tone.start()
      if (bassLoop.state === 'stopped') {
        playBass()
        setPlay(true)
      } else if (drumsLoop.state === 'started') {
        stopBass()
        setPlay(false)
      }
    } else if (e.currentTarget.id === synthId) {
      Tone.start()
      if (synthLoop.state === 'stopped') {
        playSynth()
        setPlay(true)
      } else if (drumsLoop.state === 'started') {
        stopSynth()
        setPlay(false)
      }
    } else if (e.currentTarget.id === guitarId) {
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
    // drumsPlayer.start()
    // bassPlayer.start()
    // guitarPlayer.start()
    // synthPlayer.start()
    setPlay(true)
  }

  const mute = () => {
    console.log('unmute')
    transport.stop()
    setPlay(false)
  }

  return <>
    <div className="flex flex-col items-center justify-center w-full h-screen">
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
    </div>
  </>;
}