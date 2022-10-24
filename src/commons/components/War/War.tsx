import React, { useEffect, useState } from 'react';
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import uuid from 'react-uuid';
import { message } from '../../../assets/translation/messages';
import {
  reset,
  saveHistory,
  selectCompBF,
  selectHistory,
  selectLanguage,
  selectPlayerBF,
  selectShipsList,
  selectTurn,
  selectTurnNum,
  setBFCoordPC,
  setCompBF,
  setPlayerBF,
  setShipsList,
  setTurn,
  setTurnNum,
} from '../../redux/reducers/globalReducer';
import { getBFcoord, getRnd, play } from '../../utils/helpers';
import useWindowDimensions from '../../utils/hooks';
import styles from './War.module.css';

type Shooting = [number, number] | [];

type Props = {
  shooting: Shooting;
  setShooting: (arr: Shooting) => void;
  setTimeMachineWorks: (val: boolean) => void;
};

const War = React.forwardRef((props: Props, ref) => {
  const { shooting, setShooting, setTimeMachineWorks } = props;
  const { current: elCompBF }: any = ref;
  const { width, height } = useWindowDimensions();
  const dispatch = useDispatch();
  const language = useSelector(selectLanguage);
  const playerBF = useSelector(selectPlayerBF);
  const compBF = useSelector(selectCompBF);
  const shipsList = useSelector(selectShipsList);
  const history = useSelector(selectHistory);
  const turnNum = useSelector(selectTurnNum);
  const turn = useSelector(selectTurn);
  const isPlayer = turn === 'player';
  const isComp = turn.startsWith('comp');

  const [alarm, setAlarm] = useState<string>('');
  const [compLastHit, setCompLastHit] = useState('');

  const turnBack = useCallback(() => {
    const newTurnNum = turnNum - 1;

    if (newTurnNum) {
      setTimeMachineWorks(true);
      dispatch(setPlayerBF(history[newTurnNum].playerBF));
      dispatch(setCompBF(history[newTurnNum].compBF));
      dispatch(setShipsList(history[newTurnNum].shipsList));
      dispatch(setTurnNum(newTurnNum));
      setTimeout(() => {
        setTimeMachineWorks(false);
      }, 1000);
    }
  }, [turnNum]);

  const checkWinner = useCallback(() => {
    if (isComp || isPlayer) {
      const BF = isComp ? playerBF : compBF;
      if (BF.flat().filter((el: string) => Number.isFinite(+el)).length === 0) {
        dispatch(setTurn(isComp ? 'winComp' : 'winPlayer'));
        return true;
      }
    }
    return false;
  }, [isComp, isPlayer, playerBF, compBF]);

  function shootCheck(x: number, y: number) {
    if (checkWinner()) return;

    if (isComp && compLastHit) {
      // comp shoot second time the same ship
      const playerBFstate = JSON.parse(JSON.stringify(playerBF));

      if (playerBFstate.flat().includes(compLastHit)) {
        if (Math.random() < 0.4) {
          // chance < 40%
          let stop = false;
          for (let i = 0; i < playerBFstate.length; i++) {
            for (let j = 0; j < playerBFstate[i].length; j++) {
              if (playerBFstate[i][j] === compLastHit && !stop) {
                play('hit');
                playerBFstate[i][j] = 'X' + playerBFstate[i][j];
                stop = true;
                dispatch(setPlayerBF(playerBFstate));
                dispatch(setTurn(turn + uuid()));
              }
            }
          }
          setCompLastHit('');
          dispatch(setPlayerBF(playerBFstate));
          return;
        } else setCompLastHit('');
      }
    }

    let newBF = JSON.parse(JSON.stringify(isPlayer ? compBF : playerBF));
    const el = newBF[y - 1][x - 1];
    // hit the target
    if (Number.isFinite(+el)) {
      if (isComp) setCompLastHit(el);
      newBF[y - 1][x - 1] = 'X' + el;
      play('hit');
      dispatch(isPlayer ? setCompBF(newBF) : setPlayerBF(newBF));
      setAlarm(isPlayer ? 'playerHits' : 'compHits');

      if (isComp) {
        const newState = turn + uuid();
        setTimeout(() => {
          dispatch(setTurn(newState));
        }, getRnd() * 100);
      }
      setShooting([]);
      if (isPlayer) dispatch(setTurnNum(turnNum + 1));
    } else if (el.includes('X') || el.includes('*')) {
      // shoot second time the same point
      if (isComp) {
        dispatch(setTurn(turn + uuid()));
      }
      setShooting([]);
      return;
    } else {
      // miss the target
      if (isPlayer) dispatch(setTurnNum(turnNum + 1));

      newBF[y - 1][x - 1] = el === 'D' ? '*D' : '*';
      play('miss');
      dispatch(isPlayer ? setCompBF(newBF) : setPlayerBF(newBF));
      setAlarm(isPlayer ? 'playerMissed' : 'compMissed');
      setTimeout(() => {
        setShooting([]);
        if (isPlayer) {
          dispatch(setTurn('comp'));
        } else if (isComp) {
          dispatch(setTurn('player'));
        }
      }, getRnd() * (turnNum > 40 ? turnNum : 99));
    }
  }

  useEffect(() => {
    if (shooting.length) {
      shootCheck(shooting[0], shooting[1]);
    }
  }, [shooting]);

  useEffect(() => {
    if (elCompBF) {
      const rect = elCompBF.getBoundingClientRect();
      const data = getBFcoord(rect);
      dispatch(setBFCoordPC(data));
    }
  }, [elCompBF, width, height]);

  useEffect(() => {
    if (elCompBF) {
      if (turn === 'player') {
        elCompBF.style.cursor = 'pointer';
      } else if (turn.startsWith('comp')) {
        elCompBF.style.cursor = 'wait';
      } else {
        elCompBF.style.cursor = 'auto';
      }
    }

    if (turn === 'winPlayer' || turn === 'winComp') {
      play(turn);
    }
  }, [turn]);

  useEffect(() => {
    if (turn === 'begin') {
      play('fight');
      setTimeout(() => {
        dispatch(setTurn('player'));
      }, 1000);
      return;
    }

    if (turn.startsWith('comp')) {
      setTimeout(() => {
        shootCheck(getRnd(), getRnd());
      }, getRnd() * 100);
    }
  }, [turn]);

  useEffect(() => {
    if (alarm) setTimeout(() => setAlarm(''), 2500);
  }, [alarm]);

  useEffect(() => {
    dispatch(saveHistory());
  }, [turnNum]);

  useEffect(() => {
    checkWinner();
  }, [compBF, playerBF]);

  useEffect(() => {
    if (shipsList) {
      const newList = shipsList.filter(({ num }) => compBF.flat().includes(`${num}`));
      dispatch(setShipsList(newList));
    }
  }, [compBF]);

  return (
    <>
      <div className={styles.timeMachine}>
        {turnNum > 1 && (
          <button className={styles.backBtn} onClick={turnBack} disabled={turn !== 'player'}>
            &#10094;
          </button>
        )}
        <div className={styles.turnCounter}>{turnNum}</div>
      </div>
      <div className={styles.info}>
        <p>
          {turn === 'begin' && message[language].begin}
          {turn === 'player' && message[language].playerTurn}
          {turn.startsWith('comp') && message[language].compTurn}
          {turn === 'winComp' && message[language].winComp.toUpperCase()}
          {turn === 'winPlayer' && message[language].winPlayer.toUpperCase()}
          {turn.startsWith('win') && (
            <button
              type="button"
              className={styles.restartBtn}
              onClick={() => {
                dispatch(reset());
              }}
            />
          )}
        </p>
        <p>
          {alarm === 'playerHits' && message[language].playerHits}
          {alarm === 'playerMissed' && message[language].playerMissed}
          {alarm === 'compHits' && message[language].compHits}
          {alarm === 'compMissed' && message[language].compMissed}
        </p>
      </div>
    </>
  );
});

export default War;
