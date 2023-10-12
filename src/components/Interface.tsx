import useBeutomelloGame from "~/stores/useBeutomelloGame"

export default function Interface() {
  const currentPlayer = useBeutomelloGame((state) => state.currentPlayer)
  const currentMeeple = useBeutomelloGame((state) => state.currentMeeple)

  return <div className="interface">
  <div className="currentPlayer">
    <p>Current Player: {currentPlayer}</p>
    <p>Current Meeple: {currentMeeple}</p>
  </div>
</div>
}