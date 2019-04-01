'use strict';

window.addEventListener('load', init);

function init() {
  const LEGEND = {
    s: 'cell__start',
    f: 'cell__finish',
    w: 'cell__wall',
    r: 'cell__route'
  };

  const INIT_SETTINGS = { xSize: 81, ySize: 31 };

  const startCell = { x: 1, y: 1 };
  const finishCell = { x: INIT_SETTINGS.xSize - 2, y: INIT_SETTINGS.ySize - 2 };
  const maze = createMaze(INIT_SETTINGS, startCell, finishCell);

  renderMaze();
  createButtons();

  let changeSell = changeWall;
  let canReach = false;

  function createMaze(settings, startCell, finishCell) {
    const mazeArr = new Array(settings.ySize);
    const mazeRow = new Array(settings.xSize);
    mazeRow.fill('w');

    for (let i = 0; i < mazeArr.length; i++) {
      mazeArr[i] = mazeRow.slice();
    }

    let finMaze = generateWaysInMaze(mazeArr);
    finMaze[startCell.y][startCell.x] = 's';
    finMaze[finishCell.y][finishCell.x] = 'f';

    return finMaze;
  }

  function generateWaysInMaze(mazeArr) {
    let current = startCell;
    let way = [current];

    while (way.length !== 0) {
      digForward();
      current = way.pop();
    }

    return mazeArr;

    function digForward() {
      let probableWays = [];
      do {
        let x = current.x;
        let y = current.y;
        probableWays = [];

        if (mazeArr[y - 2] && mazeArr[y - 2][x] === 'w') {
          probableWays.push({ x, y: y - 2, mid: { x, y: y - 1 } });
        }
        if (mazeArr[y + 2] && mazeArr[y + 2][x] === 'w') {
          probableWays.push({ x, y: y + 2, mid: { x, y: y + 1 } });
        }
        if (mazeArr[y][x - 2] === 'w') {
          probableWays.push({ x: x - 2, y, mid: { x: x - 1, y } });
        }
        if (mazeArr[y][x + 2] === 'w') {
          probableWays.push({ x: x + 2, y, mid: { x: x + 1, y } });
        }
        if (probableWays.length !== 0) {
          current =
            probableWays[Math.round(Math.random() * (probableWays.length - 1))];
          mazeArr[current.y][current.x] = 0;
          mazeArr[current.mid.y][current.mid.x] = 0;
          way.push(current);
        }
      } while (probableWays.length);
    }
  }

  function renderMaze() {
    const mazePlace = document.getElementById('gameTable');
    mazePlace.innerHTML = '';
    const tableMaze = document.createElement('table');

    for (let y = 0; y < INIT_SETTINGS.ySize; y++) {
      const tr = document.createElement('tr');

      for (let x = 0; x < INIT_SETTINGS.xSize; x++) {
        const td = document.createElement('td');

        if (typeof maze[y][x] !== 'number') {
          if (maze[y][x] === 's') {
            startCell.element = td;
          }
          if (maze[y][x] === 'f') {
            finishCell.element = td;
          }
          td.className = LEGEND[maze[y][x]];
        } else {
          if (maze[y][x]) {
            td.innerHTML = maze[y][x];
          }
        }

        tr.append(td);
      }

      tableMaze.append(tr);
    }

    mazePlace.append(tableMaze);
    tableMaze.addEventListener('mousedown', event => {
      changeSell(event);
    }); //
  }

  function createButtons() {
    const menu = document.querySelector('.menu');
    const setStart = document.createElement('button');
    setStart.innerHTML = 'Set start';
    menu.append(setStart);
    setStart.addEventListener('click', () => {
      changeSell = changeStart;
    });

    const setFinish = document.createElement('button');
    setFinish.innerHTML = 'Set finish';
    menu.append(setFinish);
    setFinish.addEventListener('click', () => {
      changeSell = changeFinish;
    });

    const setWall = document.createElement('button');
    setWall.innerHTML = 'Set wall';
    menu.append(setWall);
    setWall.addEventListener('click', () => {
      changeSell = changeWall;
    });

    const startSearh = document.createElement('button');
    startSearh.innerHTML = 'Find way';
    menu.append(startSearh);
    startSearh.addEventListener('click', findBestWay);
  }

  function changeWall(event) {
    const $el = event.target;
    let x = $el.cellIndex;
    let y = $el.parentElement.rowIndex;
    if (isNaN(maze[y][x]) && maze[y][x] !== 'w') {
      return;
    }
    $el.className = LEGEND.w;
    if (!isNaN(maze[y][x])) {
      maze[y][x] = 'w';
    } else {
      maze[y][x] = 0;
      $el.className = '';
    }
  }

  function changeStart(event) {
    const $el = event.target;
    let x = $el.cellIndex;
    let y = $el.parentElement.rowIndex;
   
    $el.className = LEGEND.s;
    maze[y][x] = 's';

    maze[startCell.y][startCell.x] = 0;
    startCell.element.classList.remove(LEGEND.s);

    startCell.element = $el;
    startCell.y = y;
    startCell.x = x;
  }

  function changeFinish(event) {
    const $el = event.target;
    let x = $el.cellIndex;
    let y = $el.parentElement.rowIndex;
    
    $el.className = LEGEND.f;
    maze[y][x] = 'f';

    maze[finishCell.y][finishCell.x] = 0;
    finishCell.element.classList.toggle(LEGEND.f);

    finishCell.element = $el;
    finishCell.y = y;
    finishCell.x = x;
  }

  function findBestWay() {
    for (let y = 0; y < maze.length; y++) {
      for (let x = 0; x < maze[y].length; x++) {
        if (!isNaN(maze[y][x])) {
          maze[y][x] = 0;
        }
      }
    }
    renderMaze();
    const table = document.getElementById('gameTable').firstChild;

    let { x, y } = startCell;

    let cellsInTurn = [[x, y]];
    let turn = 1;

    function doSteps() {
      let workArray = [];
      cellsInTurn.forEach(cell => {
        let x = cell[0];
        let y = cell[1];
        let turnResult = oneMove(table, x, y, turn);
        workArray.push(...turnResult);
      });
      turn++;
      cellsInTurn = workArray;

      if (cellsInTurn.length) {
        setTimeout(doSteps, 20);
      } else {
        if (canReach) {
          drawBackWay(table);
        } else {
          alert('can not reach finish');
        }
      }
    }
    doSteps();
  }

  function oneMove(table, x, y, turn) {
    let currentTurn = [];
    simpleMove(table, x, y - 1, turn, currentTurn);
    simpleMove(table, x, y + 1, turn, currentTurn);
    simpleMove(table, x - 1, y, turn, currentTurn);
    simpleMove(table, x + 1, y, turn, currentTurn);

    return currentTurn;
  }

  function simpleMove(table, xX, yY, turn, currentTurn) {
    if (maze[yY] && maze[yY][xX] === 'f') {
      canReach = true;
    }
    if (maze[yY] && maze[yY][xX] === 0) {
      table.rows[yY].cells[xX].innerHTML = turn;
      maze[yY][xX] = turn;
      currentTurn.push([xX, yY]);
    }
  }

  function drawBackWay(table) {
    let x = finishCell.x;
    let y = finishCell.y;
    const bestNumber = { nextX: x, nextY: y, value: Infinity };

    function drawOneStep() {
      doBackStep(x, y - 1, bestNumber);
      doBackStep(x, y + 1, bestNumber);
      doBackStep(x - 1, y, bestNumber);
      doBackStep(x + 1, y, bestNumber);

      table.rows[bestNumber.nextY].cells[bestNumber.nextX].classList.toggle(
        'cell__route'
      );
      x = bestNumber.nextX;
      y = bestNumber.nextY;

      if (bestNumber.value !== 1) {
        setTimeout(drawOneStep, 20);
      }
    }
    drawOneStep();
  }

  function doBackStep(xX, yY, bestNumber) {
    if (maze[yY] && !isNaN(maze[yY][xX]) && maze[yY][xX] !== 0) {
      if (bestNumber.value > maze[yY][xX]) {
        bestNumber.value = maze[yY][xX];
        bestNumber.nextX = xX;
        bestNumber.nextY = yY;
      }
    }
  }
}
