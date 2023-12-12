import { useState } from 'react'
import * as Tone from 'tone'

const player = new Tone.Player("/audio/Down_The_Rabbit_Hole_v3.mp3").toDestination();

export default function AudioPlayer() {
  console.log('render AudioPlayer...')
  const [play, setPlay] = useState(false);

  const startMusic = () => {
    player.start();
    setPlay(true);

  }
  const muteMusic = () => {
    player.stop();
    setPlay(false);
  }

  return (
    <div className='audioInterface'>
      <div className='playMusicWrapper'>
        <div className='playMusic' onClick={play === true ? muteMusic : startMusic}>
          {play === true ? "Stop music" : "Play music"}
        </div>
      </div>
    </div>
  );
}