import { create } from 'zustand'
import { MeepleEnum, PlayerEnum, GameBoardElementKeyEnum, GamePhaseEnum } from '~/utils/enums'
import * as THREE from 'three'
import { gameBoardElementOffsets, meepleAlreadyOnFieldOffsets } from '~/utils/positions'

interface BeutomelloGameState {
  currentPlayer: PlayerEnum
  currentMeeple: MeepleEnum | undefined
  currentOpponent: PlayerEnum | undefined
  setCurrentOpponent: Function
  allowMoveMeeple: boolean
  beutomelloGameState: { [key in PlayerEnum]: { [key in MeepleEnum]: {currentGameBoardElement: GameBoardElementKeyEnum, opponent: PlayerEnum | undefined} } }
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
  numberOfPlayers: 1 | 2 | 3 | 4
}

const playerInitState = {
  [MeepleEnum.meeple1]: {currentGameBoardElement: GameBoardElementKeyEnum.Start, opponent: undefined},
  [MeepleEnum.meeple2]: {currentGameBoardElement: GameBoardElementKeyEnum.Start, opponent: undefined},
  [MeepleEnum.meeple3]: {currentGameBoardElement: GameBoardElementKeyEnum.Start, opponent: undefined},
  [MeepleEnum.meeple4]: {currentGameBoardElement: GameBoardElementKeyEnum.Start, opponent: undefined},
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
  1: {
    [PlayerEnum.player1]: PlayerEnum.player1,
    [PlayerEnum.player2]: undefined,
    [PlayerEnum.player3]: undefined,
    [PlayerEnum.player4]: undefined,
  },
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
      [PlayerEnum.player1]: JSON.parse(JSON.stringify(playerInitState)),
      [PlayerEnum.player2]: JSON.parse(JSON.stringify(playerInitState)),
      [PlayerEnum.player3]: JSON.parse(JSON.stringify(playerInitState)),
      [PlayerEnum.player4]: JSON.parse(JSON.stringify(playerInitState)),
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
        // console.log('steps', steps)
        // console.log('state.allowMoveMeeple', state.allowMoveMeeple)
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
          const currentGameBoardElement = beutomelloGameState[state.currentPlayer][state.currentMeeple].currentGameBoardElement
          let target
          if (steps === 'Zahl') {
            target = currentGameBoardElement * 2
          } else {
            if (currentGameBoardElement > 11) {
              target = currentGameBoardElement - steps
            } else {
              target = currentGameBoardElement + steps
            }
          }
          beutomelloGameState[state.currentPlayer][state.currentMeeple].currentGameBoardElement = target

          /**
           * Get Name of gameBoardElement to move to
           */
          let gameBoardElementName
          if (target > 11) {
            let targetMapping: {[key: number]: number} = {
              12: 10,
              13: 9,
              14: 8,
              15: 7,
              16: 6,
              17: 5,
              18: 4,
              19: 3,
              20: 2,
              21: 1,
            }
            const currentOpponent = playerOrder[state.numberOfPlayers][state.currentPlayer]
            gameBoardElementName = `${currentOpponent}_gameBoardElement${targetMapping[target]}`
          } else {
            gameBoardElementName = `${state.currentPlayer}_gameBoardElement${target}`
          }

          /**
           * Get Mesh Objects
           */
          const gameBoardElement = threeState.scene.getObjectByName(gameBoardElementName)
          const meepleObjectName = `${state.currentPlayer}_${state.currentMeeple}`
          const meepleObject = threeState.scene.getObjectByName(meepleObjectName)
          
          /**
           * Handle Offsets
           */
          let meeplesOnGameBoardElement = 0
          for (const meepleKey of Object.keys(MeepleEnum)) {
            if (meepleKey === state.currentMeeple) {
              continue
            }
            if (beutomelloGameState[state.currentPlayer][meepleKey as MeepleEnum].currentGameBoardElement === target) {
              meeplesOnGameBoardElement += 1
            }
          }

          let offsetX1 = gameBoardElementOffsets[state.currentPlayer][target]?.x ? gameBoardElementOffsets[state.currentPlayer][target]?.x : 0
          let offsetZ1 = gameBoardElementOffsets[state.currentPlayer][target]?.z ? gameBoardElementOffsets[state.currentPlayer][target]?.z : 0
          let offsetX2 = meepleAlreadyOnFieldOffsets[state.currentPlayer][target]?.x
          let offsetZ2 = meepleAlreadyOnFieldOffsets[state.currentPlayer][target]?.z

          let playerOffsetFactorX = 1
          let playerOffsetFactorZ = 1
          let playerOffsetFactorOpponentSideX = 1
          let playerOffsetFactorOpponentSideZ = 1
          if (state.currentPlayer === PlayerEnum.player1) {
            playerOffsetFactorOpponentSideZ = -1
          }
          if (state.currentPlayer === PlayerEnum.player2) {
            playerOffsetFactorX = -1
            if (state.numberOfPlayers === 2) {
              playerOffsetFactorOpponentSideX = -1
              playerOffsetFactorOpponentSideZ = -1
            }
          }
          if (state.currentPlayer === PlayerEnum.player3) {
            playerOffsetFactorX = -1
            playerOffsetFactorZ = -1
            if (state.numberOfPlayers === 3) {
              playerOffsetFactorOpponentSideX = -1
              playerOffsetFactorOpponentSideZ = -1
            } else {
              playerOffsetFactorOpponentSideX = -1
            }
          }
          if (state.currentPlayer === PlayerEnum.player4) {
            playerOffsetFactorZ = -1
            playerOffsetFactorOpponentSideX = -1
            playerOffsetFactorOpponentSideZ = -1
          }

          /**
           * Offsets - handle opponent Side
           */
          if (offsetX1 && offsetZ1 && offsetX2 && offsetZ2) {
            if (target < 11) {
              offsetX1 = offsetX1 * playerOffsetFactorX
              offsetZ1 = offsetZ1 * playerOffsetFactorZ
              offsetX2 = offsetX2 * playerOffsetFactorX
              offsetZ2 = offsetZ2 * playerOffsetFactorZ
            } else {
              offsetX1 = offsetX1 * playerOffsetFactorOpponentSideX
              offsetZ1 = offsetZ1 * playerOffsetFactorOpponentSideZ
              offsetX2 = offsetX2 * playerOffsetFactorOpponentSideX
              offsetZ2 = offsetZ2 * playerOffsetFactorOpponentSideZ
            }
          }

          /**
           * Offsets - Handle Special Case offset if target is 11
           */
          if (target === 11 && offsetX1 && offsetZ1) {
            let targetSelector = 11
            if (meeplesOnGameBoardElement === 1) {
              targetSelector = 111
            } else if (meeplesOnGameBoardElement === 2) {
              targetSelector = 1111
            } else if (meeplesOnGameBoardElement === 3) {
              targetSelector = 11111
            }
            offsetX1 = gameBoardElementOffsets[state.currentPlayer][targetSelector]?.x ? gameBoardElementOffsets[state.currentPlayer][targetSelector]?.x : 0
            offsetZ1 = gameBoardElementOffsets[state.currentPlayer][targetSelector]?.z ? gameBoardElementOffsets[state.currentPlayer][targetSelector]?.z : 0
          }

          // console.log('offsetX1', offsetX1)
          // console.log('offsetZ1', offsetZ1)
          // console.log('offsetX2', meeplesOnGameBoardElement * (offsetX2 ? offsetX2 : 0))
          // console.log('offsetZ2', meeplesOnGameBoardElement * (offsetZ2 ? offsetZ2 : 0))
          // console.log('target', target)

          /**
           * Get Positions Vector to move meeple to
           */
          const gameBoardElementPosition = new THREE.Vector3(
            gameBoardElement.position.x + offsetX1 + meeplesOnGameBoardElement * (offsetX2 ? offsetX2 : 0),
            gameBoardElement.position.y + 0.4,
            gameBoardElement.position.z + offsetZ1 + meeplesOnGameBoardElement * (offsetZ2 ? offsetZ2 : 0),
          )
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