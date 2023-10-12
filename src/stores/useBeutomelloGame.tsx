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
  displayTextInInterface: string
  setDisplayTextInInterface: Function
  playerDisplayNames: { [key in PlayerEnum]: string }
}

const playerInitState = {
  [MeepleEnum.meeple1]: GameBoardElementKeyEnum.Start,
  [MeepleEnum.meeple2]: GameBoardElementKeyEnum.Start,
  [MeepleEnum.meeple3]: GameBoardElementKeyEnum.Start,
  [MeepleEnum.meeple4]: GameBoardElementKeyEnum.Start,
}

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


export default create<BeutomelloGameState>((set) => {
  return {
    currentPlayer: PlayerEnum.player1,
    currentMeeple: undefined,
    diceWasThrown: false,
    cameraPosition: new THREE.Vector3(-11, 11, 11),
    dicePosition: new THREE.Vector3(4, 0, -12),
    coinPosition: new THREE.Vector3(12, 0, -4),
    gamePhase: GamePhaseEnum.init,
    displayTextInInterface: '',
    beutomelloGameState: {
      [PlayerEnum.player1]: {...playerInitState},
      [PlayerEnum.player2]: {...playerInitState},
      [PlayerEnum.player3]: {...playerInitState},
      [PlayerEnum.player4]: {...playerInitState},
    },
    playerDisplayNames: {
      [PlayerEnum.player1]: 'Heiko',
      [PlayerEnum.player2]: 'Konchord',
      [PlayerEnum.player3]: 'Player 3',
      [PlayerEnum.player4]: 'Player 4',
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
        setTimeout(() => {
          state.setGamePhase(GamePhaseEnum.selectMeeple)
        }, 1000)
        
        return { currentMeeple: undefined }
      })
    },
    selectMeeple: (
      meeple: MeepleEnum
    ) => {
      set((state) => {
        return { currentMeeple: meeple }
      })
    },
    setGamePhase: (
      gamePhase: GamePhaseEnum
    ) => {
      set((state) => {
        return { gamePhase }
      })
    },
    setDisplayTextInInterface: (
      displayTextInInterface: string
    ) => {
      set((state) => {
        return { displayTextInInterface }
      })
    },
  }
})