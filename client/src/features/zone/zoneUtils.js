

/**
* Generate a map with the same size of the solution
* Containing true or false. True means this is part of a loop.
**/
export const getLoopSolution = (solution) => {

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


const NUMBER_STATE = {
    INVALID: 'red',
    SOLVED: 'green',
    DEFAULT: 'black',
}

export const getNumberColor = (problem, solution, posX, posY) => {

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