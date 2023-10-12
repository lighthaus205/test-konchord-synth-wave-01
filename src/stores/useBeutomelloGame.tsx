import { create } from 'zustand'
import { MeepleEnum, PlayerEnum, GameBoardElementKeyEnum } from '~/utils/enums'
import * as THREE from 'three'
import { useThree } from '@react-three/fiber'


interface BeutomelloGameState {
  currentPlayer: PlayerEnum
  currentMeeple: MeepleEnum
  diceWasThrown: boolean
  beutomelloGameState: { [key in PlayerEnum]: { [key in MeepleEnum]: GameBoardElementKeyEnum } }
  setDiceWasThrown: Function
  moveCurrentMeeple: Function
}


export default create<BeutomelloGameState>((set) => {
  return {
    currentPlayer: PlayerEnum.player1,
    currentMeeple: MeepleEnum.meeple1,
    diceWasThrown: false,
    beutomelloGameState: {
      [PlayerEnum.player1]: {
        [MeepleEnum.meeple1]: GameBoardElementKeyEnum.Start,
        [MeepleEnum.meeple2]: GameBoardElementKeyEnum.Start,
        [MeepleEnum.meeple3]: GameBoardElementKeyEnum.Start,
        [MeepleEnum.meeple4]: GameBoardElementKeyEnum.Start,
      },
      [PlayerEnum.player2]: {
        [MeepleEnum.meeple1]: GameBoardElementKeyEnum.Start,
        [MeepleEnum.meeple2]: GameBoardElementKeyEnum.Start,
        [MeepleEnum.meeple3]: GameBoardElementKeyEnum.Start,
        [MeepleEnum.meeple4]: GameBoardElementKeyEnum.Start,
      },
      [PlayerEnum.player3]: {
        [MeepleEnum.meeple1]: GameBoardElementKeyEnum.Start,
        [MeepleEnum.meeple2]: GameBoardElementKeyEnum.Start,
        [MeepleEnum.meeple3]: GameBoardElementKeyEnum.Start,
        [MeepleEnum.meeple4]: GameBoardElementKeyEnum.Start,
      },
      [PlayerEnum.player4]: {
        [MeepleEnum.meeple1]: GameBoardElementKeyEnum.Start,
        [MeepleEnum.meeple2]: GameBoardElementKeyEnum.Start,
        [MeepleEnum.meeple3]: GameBoardElementKeyEnum.Start,
        [MeepleEnum.meeple4]: GameBoardElementKeyEnum.Start,
      },
    },
    setDiceWasThrown: (
      wasThrown: boolean,
    ) => {
      set((state) => {
        return { diceWasThrown: wasThrown }
      })
    },
    moveCurrentMeeple: (
      steps: number,
      threeState: any
    ) => {
      set((state) => {
        if (state.diceWasThrown) {
          const beutomelloGameState = state.beutomelloGameState
          console.log(beutomelloGameState[state.currentPlayer][state.currentMeeple])
          const target = beutomelloGameState[state.currentPlayer][state.currentMeeple] + steps
          beutomelloGameState[state.currentPlayer][state.currentMeeple] = target

          /**
           * Get Mesh Objects
           */
          const gameBoardElementName = `${state.currentPlayer}_gameBoardElement${target}`
          const gameBoardElement = threeState.scene.getObjectByName(gameBoardElementName)
          const meepleObjectName = `${state.currentPlayer}_${state.currentMeeple}`
          const meepleObject = threeState.scene.getObjectByName(meepleObjectName)
          if (gameBoardElement?.position) {
            meepleObject.position.set(
              gameBoardElement?.position.x,
              gameBoardElement?.position.y,
              gameBoardElement?.position.z
            )
          }
          
          return { beutomelloGameState }
        }
        return {}
      })
    }
  }
})