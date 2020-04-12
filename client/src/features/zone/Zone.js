import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import {
    fetchZone,
    selectZone,
    leftClick,
    rightClick,
    pushAnswer,
} from './zoneSlice';
import styles from './Zone.module.css';
import { range, getRelativeCoordinates } from '../../utils';
import { getLoopSolution, getNumberColor  } from './zoneUtils';


const BASE_CONFIG = {
   BORDER: 10, // Border every sides
   BOX_SIZE: 10, // View box multiplication
   CIRCLE_SIZE: 4, // circle size
}



export function Zone(props) {
   const dispatch = useDispatch();
   let {zoneId} = useParams();
   const content = useSelector(selectZone(zoneId));
   const contentPresent = !!content;

   useEffect(()=>{
        if(!contentPresent){
            dispatch(fetchZone(zoneId));
        }
   }, [zoneId, dispatch, contentPresent]);

   if(!content){
        return <div>Empty for now</div>;
   }

   let {height, width, problem, solution, solved} = content;

   let isFull = !solution.some(line => line.some((cell) => cell === ' '));

   let loopSolution = getLoopSolution(solution);

   if(isFull){
        dispatch(pushAnswer({zoneId, solution}));
   }

   const B = 10; // Border every sides
   const M = 10; // View box multiplication
   const CS = 4; // circle size

   let viewBoxWidth =  ((width)*M)+B+B;
   let viewBoxHeight = ((height)*M) + B + B;

   const viewBox = `0 0 ${viewBoxWidth} ${viewBoxHeight}`;


   let onMouseClickEvent = (e, left) => {

      e.preventDefault();

      let posDiv = getRelativeCoordinates(e, e.target);

      let rect = e.target.getBoundingClientRect();

      // Changing to the viewbox view, removing the borders
      let posViewBox = {
        x: (posDiv.x * viewBoxWidth / (rect.right-rect.left)),
        y: (posDiv.y * viewBoxHeight / (rect.bottom-rect.top)),
      }

      let posInField = {
        x: posViewBox.x - B,
        y: posViewBox.y - B,
      }

      //Removing events outside the field
      if(posInField.x < 0 || posInField.y < 0 || posInField.x > (width *M) || posInField.y > (height * M)){
        return true;
      }

      let posAbs = {
        x: Math.floor(posInField.x / M),
        y: Math.floor(posInField.y / M),
      }

      if(left){
          dispatch(leftClick({...posAbs, zoneId}))
      } else (
          dispatch(rightClick({...posAbs, zoneId}))
      )

      return false;
   }

   let onClickEvent = (e) => onMouseClickEvent(e, true);
   let onContextMenuEvent = (e) => onMouseClickEvent(e, false);

    let divClassNames = [styles.wrappingDiv];

    if (solved){
        divClassNames.push(styles.div_succeed);
        setTimeout(
            ()=>props.history.push('/main_map')
        ,4000);
    }

    divClassNames = divClassNames.join(' ')


  return (
    <div >
        Zone {"" + zoneId} here

    <div className={divClassNames} onClick={onClickEvent} onContextMenu={onContextMenuEvent}>
        <svg viewBox={viewBox} >

             <rect x="0" y="0" width={viewBoxWidth} height={viewBoxHeight} className={styles.rectBackground} />
             <g>

             {
                 range(width).map((_, x) => {
                    return range(height).map((_, y) => {
                         let pos = `${x},${y}`;

                         return <rect x={(x*M)+B} y={(y*M)+B} width={M} height={M}
                          className={styles.rectFloor}
                          key={pos}/>;
                    }).flat()
                 })
             }
             </g>


            <g>
             {
                 range(width).map((_, x) => {
                    return range(height).map((_, y) => {
                         let pos = `${x},${y}`;

                         let curStyle = loopSolution[y][x] ? styles.lineError : styles.line;
                         let sol_content = solution[y][x];

                         if(sol_content === '/'){
                            return <line x1={(x*M)+B+M} y1={(y*M)+B} x2={(x*M)+B} y2={(y*M)+B+M} className={curStyle} key={pos}/>;
                         }

                         if(sol_content === '\\'){
                            return <line x1={(x*M)+B} y1={(y*M)+B} x2={(x*M)+B+M} y2={(y*M)+B+M} className={curStyle} key={pos}/>;
                         }

                         return null;
                    }).flat()
                 }).flat()
             }
             </g>


            <g>
             {
                 range(width+1).map((_, x) => {
                    return range(height+1).map((_, y) => {
                         let pos = `${x},${y}`;
                          if(problem[y][x] === ' '){
                                return null;
                          }

                          let numberColor = getNumberColor(problem, solution, x, y);

                          return <circle cx={(x*M)+B} cy={(y*M)+B} r={CS/1.5} stroke={numberColor} strokeWidth="1" fill="grey" key={pos}/>

                    }).flat()
                 })
             }
             </g>


            <g>
             {
                 range(width+1).map((_, x) => {
                    return range(height+1).map((_, y) => {
                         let pos = `${x},${y}`;
                          if(problem[y][x] === ' '){
                                return null;
                          }

                          let numberColor = getNumberColor(problem, solution, x, y);

                          return <text x={(x*M)+B-(CS/2)+1-0.25} y={(y*M)+B+(CS/2)-1+.5} className={styles.small_text} key={pos} draggable="false" fill={numberColor}>
                              {problem[y][x]}
                          </text>;

                    }).flat()
                 })
             }
             </g>


        </svg>
        </div>

    </div>
  );
}
