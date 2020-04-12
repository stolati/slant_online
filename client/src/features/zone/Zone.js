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

// Calculation simplification

//const CONFIG = { //C is for constants
//    border: 10, // Every sides
//    box_width: 10,
//    box_height: 10,
//    circle: 4,
//};


const NUMBER_STATE = {
    INVALID: 'red',
    SOLVED: 'green',
    DEFAULT: 'black',
}

let getNumberColor = (problem, solution, posX, posY) => {

    let num = parseInt(problem[posY][posX]);

    let getSol = (y, x, inverted)=>{
        let solY = solution[y];
        if(solY === undefined){
            return undefined;
        }
        let solYX = solY[x];
        if(solYX === undefined){
            return undefined;
        }

        if(solYX === ' ')
            return null;
        if(solYX === '/')
            return !inverted;
        if(solYX === '\\')
            return inverted;

        throw new Error();
    }

    let around = [
        getSol(posY-1, posX-1, true),
        getSol(posY-1, posX, false),
        getSol(posY, posX-1, false),
        getSol(posY, posX, true),
    ].filter(e=>e!==undefined);

    let numConnection = around.filter(e=>e===true).length;
    let numNonConnection = around.filter(e=>e===false).length;
    let numTotal = around.length;

    let allowedNumNonConnection = numTotal - num;

    if(numConnection > num || numNonConnection > allowedNumNonConnection)
        return NUMBER_STATE.INVALID;

    if(numConnection === num && numNonConnection === allowedNumNonConnection){
        return NUMBER_STATE.SOLVED;
    }

    return NUMBER_STATE.DEFAULT;
}


let getLoopSolution = (solution) => {

    //Generate a result from the solution, with content being false or null;
   let res = solution.map((line, y) => {
      return line.map((cell, x) => {
        return solution[y][x] !== ' ';
      })
   });

   let getPos = (x, y) => {
        let solY = solution[y];
        if(solY === undefined)
            return ' ';
        let solYX = solution[y][x];
        if(solYX === undefined)
            return ' ';

        if(res[y][x] === false){
            return ' ';
        }
        return solYX;
    }

    let getLinked = (x, y) => {
        //Pos:
        // 1 2 3
        // 4 5 6
        // 7 8 9

        let v1p = {x: x-1, y: y-1}; let v2p = {x: x  , y: y-1}; let v3p = {x: x+1, y: y-1};
        let v4p = {x: x-1, y: y  };                           let v6p = {x: x+1, y: y  };
        let v7p = {x: x-1, y: y+1}; let v8p = {x: x  , y: y+1}; let v9p = {x: x+1, y: y+1};

        let v1 = getPos(x-1, y-1); let v2 = getPos(x  , y-1); let v3 = getPos(x+1, y-1);
        let v4 = getPos(x-1, y  ); let v5 = getPos(x  , y  ); let v6 = getPos(x+1, y  );
        let v7 = getPos(x-1, y+1); let v8 = getPos(x  , y+1); let v9 = getPos(x+1, y+1);

        if(v5 === '/') {
            return [
                [
                    v2 === '\\' ? v2p : null, // 2
                    v3 === '/' ? v3p : null, // 3
                    v6 === '\\' ? v6p : null, //6
                ].filter(e=>e !==null),
                [
                    v4 === '\\' ? v4p : null, // 4
                    v7 === '/' ? v7p : null, // 7
                    v8 === '\\' ? v8p : null, // 8
                ].filter(e=>e !==null)
            ].filter(e=>e.length !== 0);
        }

        if(v5 === '\\'){
            return [
                [
                    v1 === '\\' ? v1p : null, // 1
                    v2 === '/' ? v2p : null, // 2
                    v4 === '/' ? v4p : null, //4
                ].filter(e=>e !==null),
                [
                    v6 === '/' ? v6p : null, // 6
                    v8 === '/' ? v8p : null, // 8
                    v9 === '\\' ? v9p : null, // 9
                ].filter(e=>e !==null)
            ].filter(e=>e.length !== 0);
        }

    }

    let processElem = (x, y)=>{
        let e = getPos(x, y);
        if(e === ' ') return;
        let linked = getLinked(x, y);

        if(linked.length === 2){
            return;
        }

        res[y][x] = false;

        if(linked.length === 0){
            return;
        }

        let nexts = linked[0];
        if(nexts.length === 1){
            processElem(nexts[0].x, nexts[0].y);
        }
    }

   solution.forEach((line, y) => {
      line.forEach((_, x) => processElem(x, y))
   });

   return res;

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

                         let antislash =
                         <line x1={(x*M)+B} y1={(y*M)+B} x2={(x*M)+B+M} y2={(y*M)+B+M} className={curStyle} key={"/"+ pos}/>;

                         let slash =
                         <line x1={(x*M)+B+M} y1={(y*M)+B} x2={(x*M)+B} y2={(y*M)+B+M} className={curStyle} key={'\\' +pos}/>;

                         let sol_content = solution[y][x];

                         if(sol_content === '/'){
                            return slash;
                         }

                         if(sol_content === '\\'){
                            return antislash;
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
