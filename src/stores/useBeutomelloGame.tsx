import { create } from 'zustand'
import { MeepleEnum, PlayerEnum, GameBoardElementKeyEnum, GamePhaseEnum } from '~/utils/enums'
import * as THREE from 'three'

interface BeutomelloGameState {
  currentPlayer: PlayerEnum
  currentMeeple: MeepleEnum | undefined
  diceWasThrown: boolean
  beutomelloGameState: { [key in PlayerEnum]: { [key in MeepleEnum]: GameBoardElementKeyEnum } }
  setDiceWasThrown: Function
  moveCurrentMeeple: Function
  selectPlayer: Function
  cameraPosition: THREE.Vector3
  dicePosition: THREE.Vector3
  coinPosition: THREE.Vector3
  nextPlayer: Function
  selectMeeple: Function
  gamePhase: GamePhaseEnum
  setGamePhase: Function
}


export default create<BeutomelloGameState>((set) => {
  return {
    currentPlayer: PlayerEnum.player1,
    currentMeeple: undefined,
    diceWasThrown: false,
    cameraPosition: new THREE.Vector3(-11, 11, 11),
    dicePosition: new THREE.Vector3(4, 0, -12),
    coinPosition: new THREE.Vector3(12, 0, -4),
    gamePhase: GamePhaseEnum.init,
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
          if (!state.currentMeeple) {
            return {}
          }

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

        const dicePositions = {
          [PlayerEnum.player1]: new THREE.Vector3(4, 0, -12),
          [PlayerEnum.player2]: new THREE.Vector3(12, 0, 4),
          [PlayerEnum.player3]: new THREE.Vector3(-4, 0, 12),
          [PlayerEnum.player4]: new THREE.Vector3(-12, 0, -4),
        }

        const coinPositions = {
          [PlayerEnum.player1]: new THREE.Vector3(12, 0, -4),
          [PlayerEnum.player2]: new THREE.Vector3(4, 0, 12),
          [PlayerEnum.player3]: new THREE.Vector3(-12, 0, 4),
          [PlayerEnum.player4]: new THREE.Vector3(-4, 0, -12),
        }
        return {
          cameraPosition: cameraPositions[player],
          dicePosition: dicePositions[player],
          coinPosition: coinPositions[player],
          currentPlayer: player
        }
      })
    },
    nextPlayer: () => {
      set((state) => {
        state.setGamePhase(GamePhaseEnum.switchPlayer)
        const currentPlayer = state.currentPlayer
        const playerOrder = {
          [PlayerEnum.player1]: PlayerEnum.player2,
          [PlayerEnum.player2]: PlayerEnum.player3,
          [PlayerEnum.player3]: PlayerEnum.player4,
          [PlayerEnum.player4]: PlayerEnum.player1,
        }
        state.selectPlayer(playerOrder[currentPlayer])
        state.setGamePhase(GamePhaseEnum.throwCoin)
        return {}
      })
    },
    selectMeeple: (
      meeple: MeepleEnum
    ) => {
      set((state) => {
        return { currentMeeple: meeple}
      })
    },
    setGamePhase: (
      gamePhase: GamePhaseEnum
    ) => {
      set((state) => {
        return { gamePhase }
      })
    }
  }
})