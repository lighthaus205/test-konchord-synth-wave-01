export enum PlayerEnum {
  player1 = 'player1',
  player2 = 'player2',
  player3 = 'player3',
  player4 = 'player4'
}

export enum MeepleEnum {
  meeple1 = 'meeple1',
  meeple2 = 'meeple2',
  meeple3 = 'meeple3',
  meeple4 = 'meeple4',
}

export enum GameBoardElementKeyEnum {
  Start = 0,
  One = 1,
  Two = 2,
  Three = 3,
  Four = 4,
  Five = 5,
  Six = 6,
  Seven = 7,
  Eight = 8,
  Nine = 9,
  Ten = 10,
  Eleven = 11,
}

export enum GamePhaseEnum {
  init = 'init',
  selectMeeple = 'selectMeeple',
  throwDice = 'throwDice',
  throwCoin = 'throwCoin',
  moveMeeple = 'moveMeeple',
  switchPlayer = 'switchPlayer',
}