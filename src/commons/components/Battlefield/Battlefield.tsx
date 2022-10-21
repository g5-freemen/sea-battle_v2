import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectBFCoord,
  selectBFCoordPC,
  selectCompBF,
  selectLanguage,
  selectPlayerBF,
  selectShipsArranged,
  selectShipsList,
  selectTurn,
  setBFCoord,
  setLanguage,
} from '../../redux/reducers/globalReducer';
import uuid from 'react-uuid';
import { message } from '../../../assets/translation/messages';
import LangRuImg from '../../../assets/img/lang_ru.webp';
import LangEnImg from '../../../assets/img/lang_en.webp';
import DrawIdx from '../DrawIdx/DrawIdx';
import ArrangeShips from '../ArrangeShips/ArrangeShips';
import War from '../War/War';
import { getBFcoord } from '../../utils/helpers';
import classNames from 'classnames';
import useWindowDimensions from '../../utils/hooks';
import styles from './Battlefield.module.css';
import Ship from '../Ship/Ship';
import { ShipType } from '../../redux/reducers/types';

export default function Battlefield() {
  const { width, height, isVertical } = useWindowDimensions();
  const dispatch = useDispatch();
  const language = useSelector(selectLanguage);
  const playerBF = useSelector(selectPlayerBF);
  const compBF = useSelector(selectCompBF);
  const bfCoordPC = useSelector(selectBFCoordPC);
  const shipsArranged = useSelector(selectShipsArranged);
  const shipsList = useSelector(selectShipsList);
  const turn = useSelector(selectTurn);
  const refPlayerBF = useRef<HTMLDivElement>(null);
  const refCompBF = useRef<HTMLDivElement>(null);
  const [shooting, setShooting] = useState<[number, number] | []>([]);
  const [timeMachineWorks, setTimeMachineWorks] = useState(false);

  const changeLanguage = () => {
    const newLang = language === 'en' ? 'ru' : 'en';
    dispatch(setLanguage(newLang));
    document.title = message[newLang].gameTitle;
  };

  const languageImg = language === 'ru' ? LangRuImg : LangEnImg;

  const getStyles = (val: string) => {
    if (Number.isFinite(+val)) return styles.shipEl;
    if (val === 'D' || val === '*D') return styles.deadarea;
    if (val === 'X') return styles.hit;
    return styles.empty;
  };

  const shoot = ({ clientX, clientY }: any) => {
    if (!bfCoordPC || !turn.includes('player') || shooting.length) return;

    let x, y;
    for (let i = 0; i < bfCoordPC.gridCol.length - 1; i++) {
      // get player's shoot Col & Row
      if (clientX >= bfCoordPC.gridCol[i] && clientX <= bfCoordPC.gridCol[i + 1]) x = i + 1;
      if (clientY >= bfCoordPC.gridRow[i] && clientY <= bfCoordPC.gridRow[i + 1]) y = i + 1;
    }

    if (x && y) setShooting([x, y]);
  };

  useEffect(() => {
    const el = refPlayerBF.current;
    if (el) {
      const rect = el.getBoundingClientRect();
      const data = getBFcoord(rect);
      dispatch(setBFCoord(data));
    }
  }, [refPlayerBF, bfCoordPC, width, height]);

  return (
    <div className={classNames(styles.wrapper, timeMachineWorks && styles.darken)}>
      {/* {timeMachineWorks && <div className={styles.darken} />} */}
      <button
        type="button"
        className={styles.btnLang}
        style={{ backgroundImage: `url(${languageImg})` }}
        onClick={changeLanguage}
        aria-label="change language button"
      />
      <h1 className={styles.title}>{message[language].gameTitle}</h1>
      <div className={styles.container}>
        <div className={styles.battlefield}>
          <DrawIdx type="digits" />
          <DrawIdx type="letters" />
          <div className={styles.battlefieldPad} ref={refPlayerBF}>
            {playerBF.length === 10 &&
              playerBF.flat().map((el: string) => (
                <span key={uuid()} className={getStyles(el)}>
                  {el.includes('*') && '*'}
                </span>
              ))}
          </div>
        </div>

        {!shipsArranged ? (
          <ArrangeShips />
        ) : (
          <>
            <div className={classNames(styles.battlefield, styles.battlefieldComp)} onClick={shoot}>
              <DrawIdx type="digits" />
              <DrawIdx type="letters" />
              <div className={styles.battlefieldPad} ref={refCompBF}>
                {compBF.length === 10 &&
                  compBF.flat().map((el: string) => (
                    // <span className={el === 'X' ? styles.hit : styles.empty} key={uuid()}>
                    <span className={getStyles(el)} key={uuid()}>
                      {el.includes('*') && '*'}
                    </span>
                  ))}
              </div>
            </div>
            <War
              ref={refCompBF}
              shooting={shooting}
              setShooting={setShooting}
              setTimeMachineWorks={setTimeMachineWorks}
            />

            {shipsList && shipsList.length > 0 && (
              <div className={classNames(styles.list, isVertical && styles.listWide)}>
                <p className={styles.shipsListTitle}>{message[language].shipsList}</p>
                <div className={styles.shipsList}>
                  {shipsList.map(({ length, num }: ShipType, i: number) => (
                    <Ship key={i} data={{ length, num }} orientY={Array(10).fill(false)} />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <footer className={styles.footer}>
        <a className={styles.link} href="https://github.com/g5-freemen">
          Made by Anton Borkovskij, 2022
        </a>
      </footer>
    </div>
  );
}
