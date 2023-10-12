import { create } from 'zustand'
import { MeepleEnum, PlayerEnum, GameBoardElementKeyEnum } from '~/utils/enums'
import * as THREE from 'three'

interface BeutomelloGameState {
  currentPlayer: PlayerEnum
  currentMeeple: MeepleEnum
  diceWasThrown: boolean
  beutomelloGameState: { [key in PlayerEnum]: { [key in MeepleEnum]: GameBoardElementKeyEnum } }
  setDiceWasThrown: Function
  moveCurrentMeeple: Function
  selectPlayer: Function
  cameraPosition: THREE.Vector3
  nextPlayer: Function
}


export default create<BeutomelloGameState>((set) => {
  return {
    currentPlayer: PlayerEnum.player1,
    currentMeeple: MeepleEnum.meeple1,
    diceWasThrown: false,
    cameraPosition: new THREE.Vector3(-11, 11, 11),
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
          /**
           * Get gameBoardElementTarget
           */
          const beutomelloGameState = state.beutomelloGameState
          const target = beutomelloGameState[state.currentPlayer][state.currentMeeple] + steps
          beutomelloGameState[state.currentPlayer][state.currentMeeple] = target

          /**
           * Get Mesh Objects
           */
          const gameBoardElementName = `${state.currentPlayer}_gameBoardElement${target}`
          const gameBoardElement = threeState.scene.getObjectByName(gameBoardElementName)
          const meepleObjectName = `${state.currentPlayer}_${state.currentMeeple}`
          const meepleObject = threeState.scene.getObjectByName(meepleObjectName)
          
          /**
           * Move meeple
           */
          if (gameBoardElement?.position) {
            meepleObject.position.set(
              gameBoardElement?.position.x,
              0.4,
              gameBoardElement?.position.z
            )
          }
          state.nextPlayer()
          return { beutomelloGameState }
        }
        return {}
      })
    },
    selectPlayer: (
      player: PlayerEnum
    ) => {
      set((state) => {
        const cameraPositions = {
          [PlayerEnum.player1]: new THREE.Vector3(-11, 11, 11),
          [PlayerEnum.player2]: new THREE.Vector3(-11, 11, -11),
          [PlayerEnum.player3]: new THREE.Vector3(11, 11, -11),
          [PlayerEnum.player4]: new THREE.Vector3(11, 11, 11),
        }
        return {
          cameraPosition: cameraPositions[player],
          currentPlayer: player
        }
      })
    },
    nextPlayer: () => {
      set((state) => {
        const currentPlayer = state.currentPlayer
        const playerOrder = {
          [PlayerEnum.player1]: PlayerEnum.player2,
          [PlayerEnum.player2]: PlayerEnum.player3,
          [PlayerEnum.player3]: PlayerEnum.player4,
          [PlayerEnum.player4]: PlayerEnum.player1,
        }
        state.selectPlayer(playerOrder[currentPlayer])
        return {}
      })
    }
  }
})