import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { message } from '../../../assets/translation/messages';
import {
  selectArrangeShipsMode,
  selectBFCoord,
  selectCompBF,
  selectCompShips,
  selectLanguage,
  selectPlayerBF,
  selectPlayerShips,
  setArrangeShipsMode,
  setCompBF,
  setCompShips,
  setPlayerBF,
  setPlayerShips,
  setShipsArranged,
} from '../../redux/reducers/globalReducer';
import { ShipType } from '../../redux/reducers/types';
import { getRnd } from '../../utils/helpers';
import Ship from '../Ship/Ship';
import { CheckProps } from './types';
import styles from './ArrangeShips.module.css';

export default function ArrangeShips() {
  const dispatch = useDispatch();
  const language = useSelector(selectLanguage);
  const playerShips = useSelector(selectPlayerShips);
  const compShips = useSelector(selectCompShips);
  const playerBF = useSelector(selectPlayerBF);
  const compBF = useSelector(selectCompBF);
  const arrangeShipsMode = useSelector(selectArrangeShipsMode);
  const bfCoord = useSelector(selectBFCoord);
  const [orientY, setOrientY] = useState<boolean[]>(Array(10).fill(false));

  const handleKeyPress = (event: KeyboardEvent) => {
    if (event.key === '1') {
      dispatch(setArrangeShipsMode('manual'));
    } else if (event.key === '2') {
      dispatch(setArrangeShipsMode('auto'));
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress);

    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, []);

  const checkSetShip = ({ shipCol, shipRow, comp, orientY, num, length }: CheckProps) => {
    let putOk = true;
    for (let i = 0; i < length; i++) {
      try {
        let BF = JSON.parse(JSON.stringify(comp ? compBF : playerBF));
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
      let newBF = JSON.parse(JSON.stringify(comp ? compBF : playerBF));

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
    } else if ((!comp && arrangeShipsMode === 'auto') || comp) {
      // retry to set ship if bad position (auto set & comp bf)
      checkSetShip(options(comp, { num, length }));
    }
  };

  const setShip = (trg: HTMLDivElement, num: number, length: number) => {
    const rect = trg.getBoundingClientRect();
    let shipCol, shipRow;

    for (let i = 0; i < bfCoord.gridCol.length - 1; i++) {
      // get ship's start position Col & Row
      if (rect.x >= bfCoord.gridCol[i] && rect.x <= bfCoord.gridCol[i + 1]) shipCol = i + 1;
      if (rect.y >= bfCoord.gridRow[i] && rect.y <= bfCoord.gridRow[i + 1]) shipRow = i + 1;
    }

    if (shipCol === undefined || shipRow === undefined || shipCol < 1 || shipRow < 1) return;

    if (arrangeShipsMode !== 'auto') {
      checkSetShip({ shipCol, shipRow, comp: false, orientY: orientY[num], num, length });
      document.onmousemove = null;
    }
  };

  useEffect(() => {
    if (playerShips && playerShips.length === 0) {
      dispatch(setArrangeShipsMode('playerReady'));
      dispatch(setShipsArranged(true));
    }
  }, [playerShips]);

  const options = (comp: boolean, { num, length }: ShipType) => ({
    shipCol: getRnd(),
    shipRow: getRnd(),
    orientY: getRnd() > 5,
    comp,
    num,
    length,
  });

  useEffect(() => {
    // auto set ships for Player
    if (arrangeShipsMode === 'auto' && playerShips && playerShips.length) {
      checkSetShip(options(false, playerShips[0]));
    }
  }, [arrangeShipsMode, playerShips]);

  useEffect(() => {
    // auto set ships for PC
    if (compShips && compShips.length) {
      checkSetShip(options(true, compShips[0]));
    }
  }, [compShips]);

  return (
    <div className={styles.menu}>
      {(arrangeShipsMode === 'begin' ||
        arrangeShipsMode === 'manual' ||
        arrangeShipsMode === 'auto') && (
        <p className={styles.title}>
          {message[language].arrangeShips}:&nbsp;
          {language === 'en' && arrangeShipsMode !== 'begin' && <span>{arrangeShipsMode}</span>}
          {language === 'ru' && arrangeShipsMode === 'manual' && <span>вручную</span>}
          {language === 'ru' && arrangeShipsMode === 'auto' && <span>авто</span>}
        </p>
      )}

      {arrangeShipsMode === 'manual' && (
        <div className={styles.remark}>
          <p>{message[language].remarkLBtn}</p>
          <p>{message[language].remarkRBtn}</p>
        </div>
      )}

      {arrangeShipsMode === 'begin' && (
        <ul className={styles.list}>
          <li onClick={() => dispatch(setArrangeShipsMode('manual'))}>
            1) {message[language].arrangeShipsManual}
          </li>
          <li onClick={() => dispatch(setArrangeShipsMode('auto'))}>
            2) {message[language].arrangeShipsAuto}
          </li>
        </ul>
      )}

      {(arrangeShipsMode === 'manual' || arrangeShipsMode === 'auto') && playerShips && (
        <div className={styles.menuShips}>
          {playerShips.map(({ length, num }: ShipType, i: number) => (
            <Ship
              key={i}
              data={{ length, num }}
              orientY={orientY}
              setOrientY={setOrientY}
              setShip={setShip}
            />
          ))}
        </div>
      )}
    </div>
  );
}
