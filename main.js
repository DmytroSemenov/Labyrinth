'use strict';

window.addEventListener('load', init);

function init() {
  const CELLS = {
    EMPTY: 0,
    WALL: 'w',
    START: 's',
    FINISH: 'f'
  };

  const LEGEND = {
    [CELLS.START]: 'cell__start',
    [CELLS.FINISH]: 'cell__finish',
    [CELLS.WALL]: 'cell__wall',
    [CELLS.ROUTE]: 'cell__route'
  };

  const INIT_SETTINGS = { xSize: 10, ySize: 10 };
  const INIT_MAZE = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ['s', 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 'w', 'w', 'w', 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 'f', 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  ];
  const maze = INIT_MAZE.slice();
  const startCell = { x: 0, y: 2 };
  const finishCell = { x: 7, y: 7 };

  let activeType = CELLS.WALL;
  let canReach = false;

  createMaze();
  createButtons();

  function createMaze() {
    const mazePlace = document.getElementById('gameTable');
    mazePlace.innerHTML = ``;
    const table = document.createElement('table');

    for (let y = 0; y < INIT_SETTINGS.ySize; y++) {
      const tr = document.createElement('tr');

      for (let x = 0; x < INIT_SETTINGS.xSize; x++) {
        const td = document.createElement('td');
        td.dataset.x = x;
        td.dataset.y = y;
        td.className = LEGEND[maze[y][x]];
        td.innerHTML = maze[y][x] || '';
        tr.append(td);
      }

      table.append(tr);
    }

    mazePlace.append(table);
    table.addEventListener('mousedown', event => activeType(event)); //
  }

  function createButtons() {
    const menu = document.querySelector('.menu');
    const setStart = document.createElement('button');
    setStart.innerHTML = 'Set start';
    menu.append(setStart);
    setStart.addEventListener('click', () => {
      activeType = CELLS.START;
    });

    const setFinish = document.createElement('button');
    setFinish.innerHTML = 'Set finish';
    menu.append(setFinish);
    setFinish.addEventListener('click', () => {
      activeType = CELLS.FINISH;
    });

    const setWall = document.createElement('button');
    setWall.innerHTML = 'Set wall';
    menu.append(setWall);
    setWall.addEventListener('click', () => {
      activeType = CELLS.WALL;
    });

    const startSearh = document.createElement('button');
    startSearh.innerHTML = 'Find way';
    menu.append(startSearh);
    startSearh.addEventListener('click', findBestWay);
  }

  function changeWall({target: $el}) {
    let { x, y } = $el.dataset;
    if (activeType === CELLS.WALL) {
      
    }
    if (maze[y][x] !== CELLS.EMPTY) {
      return;
    }

    if 
    $el.classList.toggle(LEGEND.w);

    if (maze[y][x] === 0) {
      maze[y][x] = 'w';
    } else {
      maze[y][x] = 0;
    }
  }

  

  function getElement({ x, y }) {
    return table.rows[y].cells[x];
  }

  
  function findBestWay() {
    const table = document.getElementById('gameTable').firstChild;
    let { x, y } = startCell;

    let cellsInTurn = [[x, y]];
    let turn = 1;

    while (cellsInTurn.length) {
      let workArray = [];
      cellsInTurn.forEach(cell => {
        let x = cell[0];
        let y = cell[1];
        let turnResult = oneMove(table, x, y, turn);
        workArray.push(...turnResult);
      });
      turn++;
      cellsInTurn = workArray;
    }

    if (canReach) {
      drawBackWay(table);
    } else {
      alert('no way');
    }
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
    let bestNumber;
    let nextX;
    let nextY;

    while (bestNumber !== 1) {
      if (maze[y - 1] && typeof maze[y - 1][x] === 'number') {
        bestNumber = maze[y - 1][x];
        nextX = x;
        nextY = y - 1;
      }

      if (maze[y + 1] && typeof maze[y + 1][x] === 'number') {
        if (bestNumber > maze[y + 1][x]) {
          bestNumber = maze[y + 1][x];
          nextX = x;
          nextY = y + 1;
        }
      }

      if (maze[y] && typeof maze[y][x - 1] === 'number') {
        if (bestNumber > maze[y][x - 1]) {
          bestNumber = maze[y][x - 1];
          nextX = x - 1;
          nextY = y;
        }
      }

      if (maze[y] && typeof maze[y][x + 1] === 'number') {
        if (bestNumber > maze[y][x + 1]) {
          bestNumber = maze[y][x + 1];
          nextX = x + 1;
          nextY = y;
        }
      }

      table.rows[nextY].cells[nextX].classList.toggle('cell__route');
      x = nextX;
      y = nextY;
    }
  }
}
