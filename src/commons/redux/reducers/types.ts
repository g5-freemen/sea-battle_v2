export type ActionType = {
  type?: string;
  payload?: any;
};

export type Language = 'en' | 'ru';
export type ArrangeShipsMode = 'begin' | 'manual' | 'auto' | 'playerReady';
export type ShipType = { num: number; length: number };
export type Turn = 'begin' | 'player' | 'comp' | 'winComp' | 'winPlayer';
export type BF = Array<Array<string>>;

export type BFCoord = {
  top: number;
  bottom: number;
  left: number;
  right: number;
  width: number;
  height: number;
  gridCol: number[];
  gridRow: number[];
};

export type State = {
  language: Language;
  shipsArranged: boolean;
  arrangeShipsMode: ArrangeShipsMode;
  compBF: BF;
  playerBF: Array<Array<string>>;
  bfCoord: BFCoord | null;
  bfCoordPC: BFCoord | null;
  playerShips: Array<ShipType> | null;
  compShips: Array<ShipType> | null;
  shipsList: Array<ShipType> | null;
  turn: Turn;
  turnNum: number;
  history: {
    [key: string]: {
      compBF: BF;
      playerBF: BF;
      shipsList: Array<ShipType> | null;
    };
  };
};
