import { useDispatch, useSelector } from 'react-redux';
import {
  selectArrangeShipsMode,
  selectCompBF,
  selectCompShips,
  selectPlayerBF,
  selectPlayerShips,
  setCompBF,
  setCompShips,
  setPlayerBF,
  setPlayerShips,
} from '../../redux/reducers/globalReducer';
import { getRnd } from '../../utils/helpers';

const dispatch = useDispatch();
const arrangeShipsMode = useSelector(selectArrangeShipsMode);
const playerBF = useSelector(selectPlayerBF);
const playerShips = useSelector(selectPlayerShips);
const compBF = useSelector(selectCompBF);
const compShips = useSelector(selectCompShips);

type Props = { shipCol: number; shipRow: number; comp: boolean; orientY: boolean; num: number };

export const checkSetShip = ({ shipCol, shipRow, comp, orientY, num }: Props) => {
  let putOk = true;
  for (let i = 0; i < length; i++) {
    try {
      const BF = comp ? compBF : playerBF;
      if (
        (!orientY && BF[shipRow - 1][shipCol - 1 + i] !== '-') ||
        (orientY && BF[shipRow - 1 + i][shipCol - 1] !== '-')
      ) {
        putOk = false;
      }
    } catch (e) {
      putOk = false;
    }
  }

  if (putOk) {
    const newBF = JSON.parse(JSON.stringify(comp ? compBF : playerBF));

    // set ship in array BF
    for (let i = 0; i < length; i++) {
      if (!orientY) {
        newBF[shipRow - 1][shipCol - 1 + i] = num.toString();
      } else {
        newBF[shipRow - 1 + i][shipCol - 1] = num.toString();
      }
    }

    // set ship's deadarea in array BF
    for (let a = 0; a < 3; a++) {
      for (let i = 0; i < length + 2; i++) {
        let coordY, coordX;
        if (!orientY) {
          coordY = shipRow - 2 + a;
          coordX = shipCol - 2 + i;
        } else {
          coordY = shipRow - 2 + i;
          coordX = shipCol - 2 + a;
        }

        if (coordY < 0 || coordX < 0 || coordY > 9 || coordX > 9) continue;

        let el = newBF[coordY][coordX];
        if (el === undefined) continue;

        if (!Number.isFinite(+el) && el !== 'D') {
          newBF[coordY][coordX] = 'D';
        }
      }
    }

    if (!comp && playerShips) {
      dispatch(setPlayerBF(newBF));
      dispatch(setPlayerShips(playerShips.filter((el: { num: number }) => el.num !== num)));
    } else if (compShips) {
      dispatch(setCompBF(newBF));
      dispatch(setCompShips(compShips.filter((el: { num: number }) => el.num !== num)));
    }
    document.onmousemove = null;
    // if (trg) trg.onmouseup = null;
  } else {
    // retry to set ship if bad position (auto set & comp bf)
    if ((!comp && arrangeShipsMode === 'auto') || comp) {
      checkSetShip({
        shipCol: getRnd(),
        shipRow: getRnd(),
        comp,
        orientY: getRnd() > 5,
        num,
      });
    }
  }
};
