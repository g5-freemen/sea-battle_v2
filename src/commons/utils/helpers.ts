import { shipsData } from './constants';
import hit from '../../assets/sounds/hit.mp3';
import miss from '../../assets/sounds/miss.mp3';
import fight from '../../assets/sounds/fight.mp3';
import winComp from '../../assets/sounds/winComp.mp3';
import winPlayer from '../../assets/sounds/winPlayer.mp3';

export function createShips() {
  let n = 0,
    ships = [];
  for (let item of shipsData) {
    for (let i = 0; i < item[0]; i++) {
      const newShip = { num: n++, length: item[1] };
      ships.push(newShip);
    }
  }
  return ships;
}

export function getRnd(i = 0) {
  while (i < 1 || i > 10) {
    i = Math.ceil(Math.random() * 10);
  }
  return i;
}

export const getBFcoord = (box: DOMRect) => ({
  top: box.top,
  bottom: box.bottom,
  left: box.left,
  right: box.right,
  width: box.width,
  height: box.height,
  gridCol: new Array(11).fill(0).map((_, i) => box.left + (i * box.width) / 10),
  gridRow: new Array(11).fill(0).map((_, i) => box.top + (i * box.height) / 10),
});

export const play = (file: string) => {
  const sources = { hit, miss, fight, winComp, winPlayer };
  try {
    const audio = new Audio(sources[file as keyof typeof sources]);
    if (audio) {
      audio.currentTime = 0;
      audio.play();
    }
  } catch (e) {
    console.log(e);
  }
};
