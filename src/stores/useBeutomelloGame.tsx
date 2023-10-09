import { create } from 'zustand'
import { MeepleEnum, PlayerEnum, GameBoardElementKeyEnum } from '~/utils/enums'

interface BeutomelloGameState {
  beutomelloGameState: { [key in PlayerEnum]: { [key in MeepleEnum]: GameBoardElementKeyEnum | undefined } }
  blocksCount: number
  blocksSeed: number
  startTime: number
  phase: string
  updateBeutomelloGameState: Function
  restart: Function
  end: Function
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
    blocksCount: 10,
    blocksSeed: 0,
    /**
     * Time
     */
    startTime: 0,
    endTime: 0,
    /**
     * Phases
     */
    phase: 'ready',
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
    restart: () => {
      set((state) => {
        if (state.phase === 'playing' || state.phase === 'ended') {
          return { phase: 'ready', blockSeed: Math.random() }
        }
        return {}
      })
    },
    end: () => {
      set((state) => {
        if (state.phase === 'playing') {
          return { phase: 'ended', endTime: Date.now() }
        }
        return {}
      })
    }
  }
})