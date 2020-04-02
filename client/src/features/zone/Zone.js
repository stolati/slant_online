import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import {
    fetchZone,
    selectZone,
} from './zoneSlice';
import styles from './Zone.module.css';

// From https://dev.to/ycmjason/how-to-create-range-in-javascript-539i
function range(end) {
    return [...Array(end).keys()]
}

export function Zone() {
  const dispatch = useDispatch();
  let {zoneId} = useParams();
  const content = useSelector(selectZone(zoneId));

   useEffect(()=>{
        if(!content){
            dispatch(fetchZone(zoneId));
        }
   });

   if(!content){
        return <div>Empty for now</div>;
   }

   let {height, width, problem} = content;

   const B = 10; // Border every sides
   const M = 10; // View box multiplicator
   const CS = 4; // circle size
   const viewBox = `0 0 ${((width+1)*M)+B+B} ${((height+1)*M) + B + B}`


    console.log(problem);


  return (
    <div>
        Zone {"" + zoneId} here

        <svg viewBox={viewBox} width="90%" height="90%">

             <rect x="0" y="0" width="100%" height="100%" stroke="black" fill="green"/>
             <g>

             {
                 range(width).map((_, x) => {
                    return range(height).map((_, y) => {
                         let pos = `rect_${x},${y}`;
                         return <rect x={(x*M)+B} y={(y*M)+B} width={M} height={M} stroke="black" fill="grey" key={pos}/>;
                    }).flat()
                 })
                 }
                 </g>

            <g>
             {
                 range(width+1).map((_, x) => {
                    return range(height+1).map((_, y) => {
                         let pos = `${x},${y}`;
                         console.log(y, x);
                          if(problem[y][x] === ' '){
                                return null;
                          }
                          console.log(problem[y][x])
//                         return <rect x={(x*M)+B-(CS/2)} y={(y*M)+B-(CS/2)} width={CS} height={CS} stroke="black" fill="red" key={pos}/>;

                          return <circle cx={(x*M)+B} cy={(y*M)+B} r={CS/1.5} stroke="black" strokeWidth="1" fill="grey" key={pos}/>

                    }).flat()
                 })
             }
             </g>


            <g>
             {
                 range(width+1).map((_, x) => {
                    return range(height+1).map((_, y) => {
                         let pos = `${x},${y}`;
                         console.log(y, x);
                          if(problem[y][x] === ' '){
                                return null;
                          }

                          return <text x={(x*M)+B-(CS/2)+1-0.25} y={(y*M)+B+(CS/2)-1+.5} className={styles.small}>
                              {problem[y][x]}
                          </text>;

                    }).flat()
                 })
             }
             </g>






{ /*
             <rect x="0" y="0" width="100%" height="100%" stroke="black" fill="grey"/>
             <circle cx="50" cy="50" r="40" stroke="green" stroke-width="4" fill="yellow" />
             */}

        </svg>

    </div>
  );
}
