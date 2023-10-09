import { create } from 'zustand'
import { MeepleEnum, PlayerEnum, GameBoardElementKeyEnum } from '~/utils/enums'

interface BeutomelloGameState {
  beutomelloGameState: { [key in PlayerEnum]: { [key in MeepleEnum]: GameBoardElementKeyEnum | undefined } }
  updateBeutomelloGameState: Function
}

export default create<BeutomelloGameState>((set) => {
  return {
    beutomelloGameState: {
      [PlayerEnum.player1]: {
        [MeepleEnum.meeple1]: undefined,
        [MeepleEnum.meeple2]: undefined,
        [MeepleEnum.meeple3]: undefined,
        [MeepleEnum.meeple4]: undefined
      },
      [PlayerEnum.player2]: {
        [MeepleEnum.meeple1]: undefined,
        [MeepleEnum.meeple2]: undefined,
        [MeepleEnum.meeple3]: undefined,
        [MeepleEnum.meeple4]: undefined
      },
      [PlayerEnum.player3]: {
        [MeepleEnum.meeple1]: undefined,
        [MeepleEnum.meeple2]: undefined,
        [MeepleEnum.meeple3]: undefined,
        [MeepleEnum.meeple4]: undefined
      },
      [PlayerEnum.player4]: {
        [MeepleEnum.meeple1]: undefined,
        [MeepleEnum.meeple2]: undefined,
        [MeepleEnum.meeple3]: undefined,
        [MeepleEnum.meeple4]: undefined
      },
    },
    updateBeutomelloGameState: (
      player: PlayerEnum,
      meeple: MeepleEnum,
      gameBoardElementKey: GameBoardElementKeyEnum
    ) => {
      set((state) => {
        const beutomelloGameState = state.beutomelloGameState
        beutomelloGameState[player][meeple] = gameBoardElementKey
        return {beutomelloGameState}
      })
    },
  }
})