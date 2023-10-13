import { create } from 'zustand'
import { MeepleEnum, PlayerEnum, GameBoardElementKeyEnum, GamePhaseEnum } from '~/utils/enums'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'


interface BeutomelloGameState {
  currentPlayer: PlayerEnum
  currentMeeple: MeepleEnum | undefined
  currentOpponent: PlayerEnum | undefined
  setCurrentOpponent: Function
  allowMoveMeeple: boolean
  beutomelloGameState: { [key in PlayerEnum]: { [key in MeepleEnum]: GameBoardElementKeyEnum } }
  setAllowMoveMeeple: Function
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
  // moveMeepleOneStep: Function
  moveMeepleCurve: THREE.CatmullRomCurve3
  setMoveMeepleCurve: Function
  numberOfPlayers: 2 | 3 | 4
}

const playerInitState = {
  [MeepleEnum.meeple1]: GameBoardElementKeyEnum.Start,
  [MeepleEnum.meeple2]: GameBoardElementKeyEnum.Start,
  [MeepleEnum.meeple3]: GameBoardElementKeyEnum.Start,
  [MeepleEnum.meeple4]: GameBoardElementKeyEnum.Start,
}

const cameraPositions = {
  [PlayerEnum.player1]: new THREE.Vector3(-12, 12, 12),
  [PlayerEnum.player2]: new THREE.Vector3(-12, 12, -12),
  [PlayerEnum.player3]: new THREE.Vector3(12, 12, -12),
  [PlayerEnum.player4]: new THREE.Vector3(12, 12, 12),
}

const dicePositions = {
  [PlayerEnum.player1]: new THREE.Vector3(-6, 0, 9),
  [PlayerEnum.player2]: new THREE.Vector3(-9, 0, -6),
  [PlayerEnum.player3]: new THREE.Vector3(6, 0, -9),
  [PlayerEnum.player4]: new THREE.Vector3(9, 0, 6),
}

const coinPositions = {
  [PlayerEnum.player1]: new THREE.Vector3(-9, 0, 6),
  [PlayerEnum.player2]: new THREE.Vector3(-6, 0, -9),
  [PlayerEnum.player3]: new THREE.Vector3(9, 0, -6),
  [PlayerEnum.player4]: new THREE.Vector3(6, 0, 9),
}

const playerOrder: {[key in BeutomelloGameState["numberOfPlayers"]]: {[key in PlayerEnum]: PlayerEnum | undefined}} = {
  2: {
    [PlayerEnum.player1]: PlayerEnum.player2,
    [PlayerEnum.player2]: PlayerEnum.player1,
    [PlayerEnum.player3]: undefined,
    [PlayerEnum.player4]: undefined,
  },
  3: {
    [PlayerEnum.player1]: PlayerEnum.player2,
    [PlayerEnum.player2]: PlayerEnum.player3,
    [PlayerEnum.player3]: PlayerEnum.player1,
    [PlayerEnum.player4]: undefined,
  },
  4: {
    [PlayerEnum.player1]: PlayerEnum.player2,
    [PlayerEnum.player2]: PlayerEnum.player3,
    [PlayerEnum.player3]: PlayerEnum.player4,
    [PlayerEnum.player4]: PlayerEnum.player1,
  }
}


export default create<BeutomelloGameState>((set) => {
  return {
    currentPlayer: PlayerEnum.player1,
    currentMeeple: undefined,
    currentOpponent: PlayerEnum.player1,
    allowMoveMeeple: false,
    cameraPosition: new THREE.Vector3(-11, 9, 11),
    dicePosition: new THREE.Vector3(-6, 0, 9),
    coinPosition: new THREE.Vector3(-9, 0, 6),
    gamePhase: GamePhaseEnum.init,
    displayTextInInterface: '',
    numberOfPlayers: 2,
    moveMeepleCurve: new THREE.CatmullRomCurve3(),
    beutomelloGameState: {
      [PlayerEnum.player1]: { ...playerInitState },
      [PlayerEnum.player2]: { ...playerInitState },
      [PlayerEnum.player3]: { ...playerInitState },
      [PlayerEnum.player4]: { ...playerInitState },
    },
    playerDisplayNames: {
      [PlayerEnum.player1]: 'Beutomello',
      [PlayerEnum.player2]: 'Konchord',
      [PlayerEnum.player3]: 'Player 3',
      [PlayerEnum.player4]: 'Player 4',
    },
    setAllowMoveMeeple: (
      allowMoveMeeple: boolean,
    ) => {
      set((state) => {
        return { allowMoveMeeple: allowMoveMeeple }
      })
    },
    moveCurrentMeeple: (
      steps: number | 'Zahl' | 'Kopf',
      threeState: any
    ) => {
      set((state) => {
        /**
         * Only take action if the dice was thrown
         */
        if (state.allowMoveMeeple && steps !== 'Kopf') {
          /**
           * Only take action if the currentMeeple has been set
           */
          if (!state.currentMeeple) {
            return {}
          }

          /**
         * Get gameBoardElementTarget
         */
          const beutomelloGameState = state.beutomelloGameState
          const currentGaemBoardElement = beutomelloGameState[state.currentPlayer][state.currentMeeple]
          let target;
          if (steps === 'Zahl') {
            target = currentGaemBoardElement * 2
          } else {
            if (currentGaemBoardElement > 11) {
              target = currentGaemBoardElement - steps
            } else {
              target = currentGaemBoardElement + steps
            }
          }

          let gameBoardElementName
          if (target > 11) {
            const currentOpponent = playerOrder[state.numberOfPlayers][state.currentPlayer]
            // await state.setCurrentOpponent(undefined)
            // while (state.currentOpponent === undefined) {
            //   console.log('do nothing')
            // }
            gameBoardElementName = `${currentOpponent}_gameBoardElement${target}`
          } else {
            gameBoardElementName = `${state.currentPlayer}_gameBoardElement${target}`
          }

          beutomelloGameState[state.currentPlayer][state.currentMeeple] = target

          /**
           * Get Mesh Objects
           */
          const gameBoardElement = threeState.scene.getObjectByName(gameBoardElementName)
          const gameBoardElementPosition = new THREE.Vector3(
            gameBoardElement.position.x,
            gameBoardElement.position.y + 0.4,
            gameBoardElement.position.z
          )
          const meepleObjectName = `${state.currentPlayer}_${state.currentMeeple}`
          const meepleObject = threeState.scene.getObjectByName(meepleObjectName)

          const midpoint = new THREE.Vector3();
          midpoint.addVectors(meepleObject.position, gameBoardElementPosition).divideScalar(2);
          midpoint.y = 2

          // Create a CatmullRomCurve3
          const moveMeepleCurve = new THREE.CatmullRomCurve3([
            new THREE.Vector3().copy(meepleObject.position), // Start point
            new THREE.Vector3().copy(midpoint), // Middle point
            new THREE.Vector3().copy(gameBoardElementPosition)  // End point
          ]);

          setTimeout(() => {
            state.nextPlayer()
          }, 2500)

          return { beutomelloGameState, moveMeepleCurve }
        }

        if (steps === 'Kopf') {
          setTimeout(() => {
            state.nextPlayer()
          }, 100)
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
        
        state.selectPlayer(playerOrder[state.numberOfPlayers][currentPlayer])
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
    setMoveMeepleCurve: (
      moveMeepleCurve: THREE.CatmullRomCurve3
    ) => {
      set((state) => {
        return { moveMeepleCurve }
      })
    },
    setCurrentOpponent: (
      currentOpponent: PlayerEnum
    ) => {
      set((state) => {
        return { currentOpponent }
      })
    }
  }
})