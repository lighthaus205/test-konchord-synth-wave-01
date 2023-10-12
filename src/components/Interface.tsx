import useBeutomelloGame from "~/stores/useBeutomelloGame"

export default function Interface() {
  const currentPlayer = useBeutomelloGame((state) => state.currentPlayer)

  return <div className="interface">
  {/* Time */}
  <div className="currentPlayer">Current Player: {currentPlayer}</div>
</div>
}