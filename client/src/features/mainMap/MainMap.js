import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
    fetchMainMap,
    selectMainMap,
} from './mainMapSlice.js';
import {Link } from 'react-router-dom';
//import {
//  decrement,
//  increment,
//  incrementByAmount,
//  incrementAsync,
//  selectCount,
//} from './counterSlice';
//import styles from './Counter.module.css';
//
//import {NavLink} from 'react-router-dom';

import styles from './MainMap.module.css';

const positionToZoneId = (x, y) => `${x}-${y}`;

export function MainMap() {

  const {content} = useSelector(selectMainMap);

  const dispatch = useDispatch();

   useEffect(()=>{
        dispatch(fetchMainMap());
   }, []);


   const cellFct = (isfree, x, y) =>
       <Link to={"/zone/" + positionToZoneId(x, y)} key={x}>
           <div className={isfree ? styles.cell_free: styles.cell_not_free}>

           </div>
       </Link>

   const lineFct = (line, y) =>
       <div className={styles.line} key={y}>
           {
               line.map((e, x) => cellFct(e, x, y))
           }
       </div>

  return (
    <div className={styles.main}>
        <h1>Global map </h1>

        <div className={styles.content}>
            { content.map(lineFct) }
        </div>

    </div>
  );
}
