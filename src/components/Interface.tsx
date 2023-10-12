import useBeutomelloGame from "~/stores/useBeutomelloGame"

export default function Interface() {
  const playerDisplayNames = useBeutomelloGame((state) => state.playerDisplayNames)
  const currentPlayer = useBeutomelloGame((state) => state.currentPlayer)
  const currentMeeple = useBeutomelloGame((state) => state.currentMeeple)
  const gamePhase = useBeutomelloGame((state) => state.gamePhase)
  const displayTextInInterface = useBeutomelloGame((state) => state.displayTextInInterface)

  return <div className="interface">
  <div className="currentPlayer">
    <p>Current Player: {playerDisplayNames[currentPlayer]}</p>
    {/* <p>Current Meeple: {currentMeeple}</p>
    <p>Game Phase: {gamePhase}</p> */}
    <p>{displayTextInInterface}</p>
  </div>
</div>
}