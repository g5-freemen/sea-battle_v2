import { RootState } from '../store';
import {
  RESET_STATE,
  SAVE_HISTORY,
  SET_ARRANGE_SHIPS_MODE,
  SET_BF_COORD,
  SET_BF_COORD_PC,
  SET_COMP_BF,
  SET_COMP_SHIPS,
  SET_LANGUAGE,
  SET_PLAYER_BF,
  SET_PLAYER_SHIPS,
  SET_SHIPS_ARRANGED,
  SET_SHIPS_LIST,
  SET_TURN,
  SET_TURN_NUM,
} from './actions/globalActions';
import {
  ActionType,
  ArrangeShipsMode,
  BF,
  BFCoord,
  Language,
  ShipType,
  State,
  Turn,
} from './types';

const initialState: State = {
  language: window.navigator.language.includes('ru') ? 'ru' : 'en',
  shipsArranged: false,
  arrangeShipsMode: 'begin', // begin, manual, auto
  compBF: Array(10)
    .fill('-')
    .map(() => Array(10).fill('-')),
  playerBF: Array(10)
    .fill('-')
    .map(() => Array(10).fill('-')),
  bfCoord: null,
  bfCoordPC: null,
  playerShips: null,
  compShips: null,
  shipsList: null,
  turn: 'begin', // begin, player, comp
  turnNum: 1,
  history: {},
};

export default function globalReducer(state = initialState, action: ActionType = {}) {
  const { type, payload } = action;
  switch (type) {
    case SET_LANGUAGE:
      return { ...state, language: payload };
    case SET_ARRANGE_SHIPS_MODE:
      return { ...state, arrangeShipsMode: payload };
    case SET_SHIPS_ARRANGED:
      return { ...state, shipsArranged: payload };
    case SET_PLAYER_SHIPS:
      return { ...state, playerShips: payload };
    case SET_PLAYER_BF:
      return { ...state, playerBF: payload };
    case SET_COMP_SHIPS:
      return { ...state, compShips: payload };
    case SET_SHIPS_LIST:
      return { ...state, shipsList: payload };
    case SET_COMP_BF:
      return { ...state, compBF: payload };
    case SET_BF_COORD:
      return { ...state, bfCoord: payload };
    case SET_BF_COORD_PC:
      return { ...state, bfCoordPC: payload };
    case SET_TURN:
      return { ...state, turn: payload };
    case SET_TURN_NUM:
      return { ...state, turnNum: payload };
    case SAVE_HISTORY:
      return {
        ...state,
        history: {
          ...state.history,
          [state.turnNum]: {
            compBF: state.compBF,
            playerBF: state.playerBF,
            shipsList: state.shipsList,
          },
        },
      };
    case RESET_STATE:
      return initialState;
    default:
      return state;
  }
}

export const setLanguage = (value: Language) => ({
  type: SET_LANGUAGE,
  payload: value,
});

export const setArrangeShipsMode = (value: ArrangeShipsMode) => ({
  type: SET_ARRANGE_SHIPS_MODE,
  payload: value,
});

export const setShipsArranged = (value: boolean) => ({
  type: SET_SHIPS_ARRANGED,
  payload: value,
});

export const setPlayerShips = (value: Array<ShipType> | null) => ({
  type: SET_PLAYER_SHIPS,
  payload: value,
});

export const setPlayerBF = (value: BF) => ({
  type: SET_PLAYER_BF,
  payload: value,
});

export const setCompShips = (value: Array<ShipType> | null) => ({
  type: SET_COMP_SHIPS,
  payload: value,
});

export const setShipsList = (value: Array<ShipType> | null) => ({
  type: SET_SHIPS_LIST,
  payload: value,
});

export const setCompBF = (value: BF) => ({
  type: SET_COMP_BF,
  payload: value,
});

export const setBFCoord = (value: BFCoord) => ({
  type: SET_BF_COORD,
  payload: value,
});

export const setBFCoordPC = (value: BFCoord) => ({
  type: SET_BF_COORD_PC,
  payload: value,
});

export const setTurn = (value: string) => ({
  type: SET_TURN,
  payload: value,
});

export const setTurnNum = (value: number) => ({
  type: SET_TURN_NUM,
  payload: value,
});

export const reset = () => ({ type: RESET_STATE });

export const saveHistory = () => ({ type: SAVE_HISTORY });

export const selectLanguage = (store: RootState): Language => store.globalReducer.language;
export const selectPlayerShips = (store: RootState): Array<ShipType> | null =>
  store.globalReducer.playerShips;
export const selectCompShips = (store: RootState): Array<ShipType> | null =>
  store.globalReducer.compShips;
export const selectShipsList = (store: RootState): Array<ShipType> | null =>
  store.globalReducer.shipsList;
export const selectPlayerBF = (store: RootState) => store.globalReducer.playerBF;
export const selectCompBF = (store: RootState) => store.globalReducer.compBF;
export const selectShipsArranged = (store: RootState) => store.globalReducer.shipsArranged;
export const selectArrangeShipsMode = (store: RootState) => store.globalReducer.arrangeShipsMode;
export const selectBFCoord = (store: RootState) => store.globalReducer.bfCoord;
export const selectBFCoordPC = (store: RootState) => store.globalReducer.bfCoordPC;
export const selectTurn = (store: RootState): Turn => store.globalReducer.turn;
export const selectTurnNum = (store: RootState) => store.globalReducer.turnNum;
export const selectHistory = (store: RootState) => store.globalReducer.history;
