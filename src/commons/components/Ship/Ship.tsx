import React, { useState, useRef, MouseEvent } from 'react';
import { ShipType } from '../../redux/reducers/types';
import styles from './Ship.module.css';

type Props = {
  data: ShipType;
  orientY: boolean[];
  setOrientY?: any;
  setShip?: (trg: HTMLDivElement, num: number, length: number) => void;
};

export default function Ship({ data, orientY, setOrientY, setShip }: Props) {
  const { length, num } = data;
  const shipRef = useRef<HTMLDivElement | null>(null);

  const [movingShip, setMovingShip] = useState(false);

  const handleClick = (e: MouseEvent) => {
    const trg = shipRef.current;
    if (e.button !== 0 || !trg) return;

    if (movingShip) {
      if (setShip) setShip(trg, num, length);
      setMovingShip(false);
    }

    setMovingShip(true);

    function moveAt(e: globalThis.MouseEvent) {
      if (!trg) return;
      trg.style.position = 'absolute';
      trg.style.left = e.pageX + 'px';
      trg.style.top = e.pageY + 'px';
    }

    document.onmousemove = (e) => moveAt(e);
  };

  function handleRotate(ev: MouseEvent) {
    ev.preventDefault();
    if (!setOrientY) return;
    setOrientY((prev: boolean[]) => {
      const arr = [...prev];
      arr[num] = !arr[num];
      return arr;
    });
  }

  return (
    <div
      ref={shipRef}
      className={styles.ship}
      style={{
        width: 33 * (orientY[num] ? 1 : length),
        height: (orientY[num] ? length : 1) * 33,
      }}
      onDragStart={() => false}
      onClick={setShip && handleClick}
      onContextMenu={setOrientY && handleRotate}
    />
  );
}
