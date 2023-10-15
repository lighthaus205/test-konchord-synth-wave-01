import { PlayerEnum, GameBoardElementKeyEnum } from "./enums"


const initialGameBoardPositions = {
  0: { x: 6, z: 6 },
  1: { x: 5.05, z: 5.05 },
  2: { x: 4.55, z: 4.55 },
  3: { x: 4.1, z: 4.1 },
  4: { x: 3.65, z: 3.65 },
  5: { x: 3.15, z: 3.15 },
  6: { x: 2.7, z: 2.7 },
  7: { x: 2.25, z: 2.25 },
  8: { x: 1.8, z: 1.8 },
  9: { x: 1.4, z: 1.4 },
  10: { x: 0.95, z: 0.95 },
  11: { x: 0, z: 0 },
  12: { x: 0.95, z: 0.95 },
  13: { x: 1.4, z: 1.4 },
  14: { x: 1.8, z: 1.8 },
  15: { x: 2.25, z: 2.25 },
  16: { x: 2.7, z: 2.7 },
  17: { x: 3.15, z: 3.15 },
  18: { x: 3.65, z: 3.65 },
  19: { x: 4.1, z: 4.1 },
  20: { x: 4.55, z: 4.55 },
  21: { x: 5.05, z: 5.05 },
}

export const gameBoardProps: { [key in PlayerEnum]: { [key in GameBoardElementKeyEnum]: { x: number, z: number } } } = {
  [PlayerEnum.player1]: initialGameBoardPositions,
  [PlayerEnum.player2]: initialGameBoardPositions,
  [PlayerEnum.player3]: initialGameBoardPositions,
  [PlayerEnum.player4]: initialGameBoardPositions
}

const gameBoardElementOffsetPositions = {
  1: { x: 0.2, z: 0.2 },
  2: { x: 0.3, z: 0.3 },
  3: { x: 0.4, z: 0.3 },
  4: { x: 0.5, z: 0.4 },
  5: { x: 0.5, z: 0.4 },
  6: { x: 0.55, z: 0.45 },
  7: { x: 0.45, z: 0.35 },
  8: { x: 0.3, z: 0.3 },
  9: { x: 0.2, z: 0.2 },
  10: { x: 0.1, z: 0.1 },
  11: { x: -0.1, z: 0.1 }, // position for the first meeple in the center
  111: { x: -0.5, z: 0.5 }, // position for the second meeple in the center
  1111: { x: -0.1, z: 0.5 }, // position for the third meeple in the center
  11111: { x: -0.5, z: 0.1 }, // position for the fourth meeple in the center
  12: { x: 0.2, z: 0.2 },
  13: { x: 0.3, z: 0.3 },
  14: { x: 0.4, z: 0.4 },
  15: { x: 0.45, z: 0.45 },
  16: { x: 0.55, z: 0.5 },
  17: { x: 0.55, z: 0.5 },
  18: { x: 0.5, z: 0.4 },
  19: { x: 0.3, z: 0.3 },
  20: { x: 0.3, z: 0.35 },
  21: { x: 0.25, z: 0.25 },
}

export const gameBoardElementOffsets: {
  [key in PlayerEnum]: { [key: number]: { x: number, z: number } }
} = {
  [PlayerEnum.player1]: gameBoardElementOffsetPositions,
  [PlayerEnum.player2]: gameBoardElementOffsetPositions,
  [PlayerEnum.player3]: gameBoardElementOffsetPositions,
  [PlayerEnum.player4]: gameBoardElementOffsetPositions,
}

const meepleAlreadyOnFieldOffsetPositions = {
  1: { x: 0.3, z: 0.3 },
  2: { x: 0.3, z: 0.3 },
  3: { x: 0.3, z: 0.3 },
  4: { x: 0.3, z: 0.3 },
  5: { x: 0.3, z: 0.3 },
  6: { x: 0.3, z: 0.3 },
  7: { x: 0.3, z: 0.3 },
  8: { x: 0.3, z: 0.3 },
  9: { x: 0.3, z: 0.3 },
  10: { x: 0.3, z: 0.3 },
  11: { x: 0, z: 0 },
  12: { x: 0.3, z: 0.3 },
  13: { x: 0.3, z: 0.3 },
  14: { x: 0.3, z: 0.3 },
  15: { x: 0.3, z: 0.3 },
  16: { x: 0.3, z: 0.3 },
  17: { x: 0.3, z: 0.3 },
  18: { x: 0.3, z: 0.3 },
  19: { x: 0.3, z: 0.3 },
  20: { x: 0.3, z: 0.3 },
  21: { x: 0.3, z: 0.3 },
}

export const meepleAlreadyOnFieldOffsets: {
  [key in PlayerEnum]: { [key: number]: { x: number, z: number } }
} = {
  [PlayerEnum.player1]: meepleAlreadyOnFieldOffsetPositions,
  [PlayerEnum.player2]: meepleAlreadyOnFieldOffsetPositions,
  [PlayerEnum.player3]: meepleAlreadyOnFieldOffsetPositions,
  [PlayerEnum.player4]: meepleAlreadyOnFieldOffsetPositions,
}

export const targetOpponentMapping: {[key: number]: number} = {
  1: 21,
  2: 20,
  3: 19,
  4: 18,
  5: 17,
  6: 16,
  7: 15,
  8: 14,
  9: 13,
  10: 12,
  11: 11,
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