import { useEffect, useState } from 'react'
import * as Tone from 'tone'

const player = new Tone.Player("/audio/Down_The_Rabbit_Hole_v3.mp3").toDestination();

export default function AudioPlayer({
  isFullscreen
}: {
  isFullscreen: Boolean
}) {
  console.log('render AudioPlayer...')
  const [play, setPlay] = useState(false);

  const enterFullscreen = () => {
    try {
      document.body.requestFullscreen()
    } catch {
      console.error('Cannot enter fullscreen')
    }
  }
  const exitFullscreen = () => {
    try {
      document.exitFullscreen()
    } catch {
      console.error('Cannot enter fullscreen')
    }
    
  }

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
        <div className='toggleFullscreen' onClick={isFullscreen === true ? exitFullscreen : enterFullscreen}>
          {isFullscreen === true ? "Exit fullscreen" : "Enter fullscreen"}
        </div>
      </div>
    </div>
  );
}