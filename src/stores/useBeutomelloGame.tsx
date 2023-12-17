import { create } from 'zustand'
import { MeepleEnum, PlayerEnum, GameBoardElementKeyEnum, GamePhaseEnum } from '~/utils/enums'
import * as THREE from 'three'
import { gameBoardElementOffsets, initialMeeplePositions, meepleAlreadyOnFieldOffsets, targetOpponentMapping } from '~/utils/positions'

interface BeutomelloGameStateInterface {
  currentPlayer: PlayerEnum
  currentMeeple: MeepleEnum | undefined
  currentOpponent: PlayerEnum | undefined
  setCurrentOpponent: Function
  allowMoveMeeple: boolean
  beutomelloGameState: { [key in PlayerEnum]: { [key in MeepleEnum]: { currentGameBoardElement: GameBoardElementKeyEnum, opponent: PlayerEnum | undefined } } }
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
  throwMeeples: Function
}

type throwOpponentMeeplesType = {
  [key in PlayerEnum]: Array<MeepleEnum>
}

const playerInitState = {
  [MeepleEnum.meeple1]: { currentGameBoardElement: GameBoardElementKeyEnum.Start, opponent: undefined },
  [MeepleEnum.meeple2]: { currentGameBoardElement: GameBoardElementKeyEnum.Start, opponent: undefined },
  [MeepleEnum.meeple3]: { currentGameBoardElement: GameBoardElementKeyEnum.Start, opponent: undefined },
  [MeepleEnum.meeple4]: { currentGameBoardElement: GameBoardElementKeyEnum.Start, opponent: undefined },
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

const playerOrder: { [key in BeutomelloGameStateInterface["numberOfPlayers"]]: { [key in PlayerEnum]: PlayerEnum | undefined } } = {
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


export default create<BeutomelloGameStateInterface>((set) => {
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
          const beutomelloGameStateCopy = JSON.parse(JSON.stringify(state.beutomelloGameState))
          const currentGameBoardElement = beutomelloGameStateCopy[state.currentPlayer][state.currentMeeple].currentGameBoardElement
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
          const currentOpponent = target > 11 ? playerOrder[state.numberOfPlayers][state.currentPlayer] : undefined
          beutomelloGameStateCopy[state.currentPlayer][state.currentMeeple].currentGameBoardElement = target
          beutomelloGameStateCopy[state.currentPlayer][state.currentMeeple].opponent = currentOpponent

          /**
           * Get Name of gameBoardElement to move to
           */
          const gameBoardElementName = `${currentOpponent ? currentOpponent : state.currentPlayer}_gameBoardElement${currentOpponent ? targetOpponentMapping[target] : target}`

          /**
           * Get Mesh Objects
           */
          const gameBoardElement = threeState.scene.getObjectByName(gameBoardElementName)
          const meepleObjectName = `${state.currentPlayer}_${state.currentMeeple}`
          const meepleObject = threeState.scene.getObjectByName(meepleObjectName)


          /**
           * Check if there are other meeples to throw off the board
           */
          const throwOpponentMeeples: throwOpponentMeeplesType = {
            [PlayerEnum.player1]: [],
            [PlayerEnum.player2]: [],
            [PlayerEnum.player3]: [],
            [PlayerEnum.player4]: [],
          }
          for (const playerKey of Object.keys(PlayerEnum)) {
            if (playerKey === state.currentPlayer) {
              continue
            }
            for (const meepleKey of Object.keys(MeepleEnum)) {
              const meepleOpponentPlayer = beutomelloGameStateCopy[playerKey as PlayerEnum][meepleKey as MeepleEnum].opponent
              const opponentGameBoardElement = beutomelloGameStateCopy[playerKey as PlayerEnum][meepleKey as MeepleEnum].currentGameBoardElement
              // console.log('meepleKey', meepleKey)
              // console.log('playerKey', playerKey)
              // console.log('meepleOpponentPlayer', meepleOpponentPlayer)
              // console.log('state.currentPlayer', state.currentPlayer)
              // console.log('currentOpponent', currentOpponent)
              // console.log('opponentGameBoardElement', opponentGameBoardElement)
              // console.log('target', target)
              // console.log('(opponentGameBoardElement > 11 ? targetOpponentMapping[target] : target)', (opponentGameBoardElement > 11 ? targetOpponentMapping[target] : target))
              // console.log('---')

              /**
               * Handle case that currentMeeple will move to the currentPlayer's side
               */
              if (meepleOpponentPlayer === state.currentPlayer
                && opponentGameBoardElement === (opponentGameBoardElement > 11 ? targetOpponentMapping[target] : target)
                ) {
                throwOpponentMeeples[playerKey as PlayerEnum].push(meepleKey as MeepleEnum)
              }

              /**
               * Handle case that currentMeeple will move to the currentOpponent's side
               */
              if (playerKey === currentOpponent
                && opponentGameBoardElement === (target > 11 ? targetOpponentMapping[target] : target)
                ) {
                throwOpponentMeeples[playerKey as PlayerEnum].push(meepleKey as MeepleEnum)
              }
            }
          }
          console.log('throwOpponentMeeples', throwOpponentMeeples)
          setTimeout(() => {
            state.throwMeeples(throwOpponentMeeples, threeState)
          }, 2200)
          

          
          /**
           * Handle Offsets
           */
          let meeplesOnGameBoardElement = 0
          for (const meepleKey of Object.keys(MeepleEnum)) {
            if (meepleKey === state.currentMeeple) {
              continue
            }
            if (beutomelloGameStateCopy[state.currentPlayer][meepleKey as MeepleEnum].currentGameBoardElement === target) {
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
            state.nextPlayer(beutomelloGameStateCopy)
          }, 2500)

          return { moveMeepleCurve }
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
          currentPlayer: player,
          currentMeeple: undefined,
        }
      })
    },
    nextPlayer: (
      beutomelloGameState: BeutomelloGameStateInterface["beutomelloGameState"]
    ) => {
      set((state) => {
        state.setGamePhase(GamePhaseEnum.switchPlayer)
        const currentPlayer = state.currentPlayer
        
        state.selectPlayer(playerOrder[state.numberOfPlayers][currentPlayer])
        setTimeout(() => {
          state.setGamePhase(GamePhaseEnum.selectMeeple)
        }, 1000)

        if (beutomelloGameState) {
          return { beutomelloGameState }
        }
        return {}
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
    },
    throwMeeples: (
      throwOpponentMeeples: throwOpponentMeeplesType,
      threeState: any
    ) => {
      set((state) => {
        const beutomelloGameStateCopy = JSON.parse(JSON.stringify(state.beutomelloGameState))
        for (const playerKey of Object.keys(throwOpponentMeeples)) {
          for (const meepleKey of throwOpponentMeeples[playerKey as PlayerEnum]) {
            const meepleObjectName = `${playerKey}_${meepleKey}`
            const meepleObject = threeState.scene.getObjectByName(meepleObjectName)
            const positionX = initialMeeplePositions[meepleKey as MeepleEnum].x
            const positionZ = initialMeeplePositions[meepleKey as MeepleEnum].z
            const positionVector = new THREE.Vector3(
              playerKey === PlayerEnum.player2 || playerKey === PlayerEnum.player1 ? -positionX : positionX,
              0.4,
              playerKey === PlayerEnum.player3 || playerKey === PlayerEnum.player2 ? -positionZ : positionZ,
            )

            meepleObject.position.set(positionVector.x, positionVector.y, positionVector.z)
            
            beutomelloGameStateCopy[playerKey as PlayerEnum][meepleKey as MeepleEnum].currentGameBoardElement = GameBoardElementKeyEnum.Start
            beutomelloGameStateCopy[playerKey as PlayerEnum][meepleKey as MeepleEnum].opponent = undefined
          }
        }

        return { beutomelloGameState: beutomelloGameStateCopy }
      })
    }
  }
})