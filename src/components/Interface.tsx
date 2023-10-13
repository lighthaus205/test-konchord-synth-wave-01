import { useState } from "react"
import useBeutomelloGame from "~/stores/useBeutomelloGame"
import { PlayerEnum } from "~/utils/enums"


export default function Interface() {
  const [formSelectedOpponent, setFormSelectedOpponent] = useState<string | null>(null)
  const setCurrentOpponent = useBeutomelloGame((state) => state.setCurrentOpponent)
  const currentOpponent = useBeutomelloGame((state) => state.currentOpponent)
  const numberOfPlayers = useBeutomelloGame((state) => state.numberOfPlayers)
  const playerDisplayNames = useBeutomelloGame((state) => state.playerDisplayNames)
  const currentPlayer = useBeutomelloGame((state) => state.currentPlayer)
  const currentMeeple = useBeutomelloGame((state) => state.currentMeeple)
  const gamePhase = useBeutomelloGame((state) => state.gamePhase)
  const displayTextInInterface = useBeutomelloGame((state) => state.displayTextInInterface)

  const handleSelectOpponent = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormSelectedOpponent(event.target.value);
  };

  const onSubmitCurrentOpponent = (e: React.FormEvent) => {
    e.preventDefault()
    setCurrentOpponent(formSelectedOpponent)
  }

  return <div className="interface">
    <div className="currentPlayer">
      <p>Current Player: {playerDisplayNames[currentPlayer]}</p>
      {/* <p>Current Meeple: {currentMeeple}</p>
    <p>Game Phase: {gamePhase}</p> */}
      <p>{displayTextInInterface}</p>
      {currentOpponent ? (<></>) : (<>
        <div>Select current opponent:</div>
        <form id="quizForm" onSubmit={onSubmitCurrentOpponent}>
          {Array(numberOfPlayers).fill('player').map((player, playerIndex) => {
            const playerId = player + (playerIndex + 1) as PlayerEnum
            if (playerId === currentPlayer) {
              return <></>
            }
            return <>
              <div>
                <input
                  type="radio"
                  id={playerId}
                  name={player}
                  value={playerId}
                  onChange={handleSelectOpponent}
                />
                <label
                  htmlFor={playerId}
                  style={{ margin: "0px 8px" }}
                >
                  {playerDisplayNames[playerId]}
                </label>
              </div>
            </>
          })}
          <input type="submit" value="Submit" />
        </form>
      </>)}
    </div>
  </div>
}