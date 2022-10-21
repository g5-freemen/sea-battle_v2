import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectCompShips,
  selectPlayerShips,
  setCompShips,
  setPlayerShips,
  setShipsList,
} from './commons/redux/reducers/globalReducer';
import Battlefield from './commons/components/Battlefield/Battlefield';
import { createShips } from './commons/utils/helpers';

export default function App() {
  const dispatch = useDispatch();
  const playerShips = useSelector(selectPlayerShips);
  const compShips = useSelector(selectCompShips);

  useEffect(() => {
    if (!compShips && !playerShips) {
      const ships = createShips();
      dispatch(setPlayerShips(ships));
      dispatch(setCompShips(ships));
      dispatch(setShipsList(ships));
    }
  }, [playerShips, compShips]);

  return <Battlefield />;
}
