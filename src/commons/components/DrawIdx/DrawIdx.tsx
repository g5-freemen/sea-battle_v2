import React from 'react';
import uuid from 'react-uuid';
import { useSelector } from 'react-redux';
import { selectLanguage } from '../../redux/reducers/globalReducer';
import { letters } from '../../../assets/translation/letters';
import styles from './DrawIdx.module.css';

type Props = {
  type: 'digits' | 'letters';
};

export default function DrawIdx({ type }: Props) {
  const language = useSelector(selectLanguage);
  const isDigits = type === 'digits';
  const fieldType = 'battlefield-' + type;

  return (
    <div className={styles[fieldType]}>
      {letters[language].split('').map((item, i) => (
        <div
          className={styles.idx}
          key={uuid()}
          style={isDigits ? { gridColumn: i + 1 } : { gridRow: i + 1 }}
        >
          {isDigits ? i + 1 : item}
        </div>
      ))}
    </div>
  );
}
