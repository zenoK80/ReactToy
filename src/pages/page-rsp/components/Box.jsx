import React from 'react';
import styles from '../rsp.module.css';

const Box = (props) => {

  let result;
  if (props.title === "Computer" && props.result !== "DRAW" && props.result !== "") {
    result = props.result === "WIN" ? "LOSE" : "WIN";
  } else {
    result = props.result;
  }

  const boxClass = [
    styles.box,
    result ? styles[result.toLowerCase()] : '',
    props.isRolling ? styles.rolling : ''
  ].join(' ');

  return (
    <div className={boxClass}>

      <div className={styles['box-header']}>
        <span className={styles['player-tag']}>{props.title}</span>
        <span className={styles['status-dot']}></span>
      </div>

      <div className={styles['img-wrap']}>
        {props.item
          ? <span className={styles['item-emoji']}>{props.item.emoji}</span>
          : <div className={styles.placeholder}>?</div>
        }
      </div>

      <h2 className={styles['item-name']}>
        {props.item ? props.item.name : '---'}
      </h2>

      <h2 className={styles['result-label']}>{result || ' '}</h2>

    </div>
  );
};

export default Box;
