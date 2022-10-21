export type ActionType = {
  type?: string;
  payload?: any;
};

export type Language = 'en' | 'ru';
export type ArrangeShipsMode = 'begin' | 'manual' | 'auto' | 'playerReady';
export type ShipType = { num: number; length: number };
export type Turn = 'begin' | 'player' | 'comp' | 'winComp' | 'winPlayer';

export type State = {
  language: Language;
  shipsArranged: boolean;
  arrangeShipsMode: ArrangeShipsMode;
  compBF: Array<Array<string>>;
  playerBF: Array<Array<string>>;
  bfCoord: any;
  bfCoordPC: any;
  playerShips: Array<ShipType> | null;
  compShips: Array<ShipType> | null;
  shipsList: Array<ShipType> | null;
  turn: Turn;
  turnNum: number;
  history: any;
};
