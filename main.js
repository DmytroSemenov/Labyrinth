'use strict';
const INIT_SETTINGS = { xSize: 10, ySize: 10, startX: 1, startY: 1 };
const LEGEND = {
  s: 'cell__start',
  f: 'cell__finish',
  w: 'cell__wall',
  r: 'cell__route'
};

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
let changeSell = function() {};

window.addEventListener('load', init);

function init() {
  create_field();
}

function create_field() {
  createMaze();
  createButtons();
}

function createMaze() {
  const mazePlace = document.getElementById('gameTable');
  const table = document.createElement('table');
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
      }
      tr.append(td);
    }
    table.append(tr);
  }
  mazePlace.append(table);
  table.addEventListener('mousedown', event => {
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
}

function changeWall(event) {
  const $el = event.target;
  let x = $el.cellIndex;
  let y = $el.parentElement.rowIndex;
  if (maze[y][x] !== 0 && maze[y][x] !== 'w') {
    return;
  }
  $el.classList.toggle(LEGEND.w);
  if (maze[y][x] === 0) {
    maze[y][x] = 'w';
    $el.innerHTML = 'w';
  } else {
    maze[y][x] = 0;
    $el.innerHTML = 0;
  }
}

function changeStart(event) {
  const $el = event.target;
  let x = $el.cellIndex;
  let y = $el.parentElement.rowIndex;
  if (maze[y][x] !== 0) {
    return;
  }
  $el.classList.toggle(LEGEND.s);
  $el.innerHTML = 's';
  maze[y][x] = 's';

  maze[startCell.y][startCell.x] = 0;
  startCell.element.innerHTML = 0;
  startCell.element.classList.toggle(LEGEND.s);

  startCell.element = $el;
  startCell.y = y;
  startCell.x = x;
}

function changeFinish(event) {
  const $el = event.target;
  let x = $el.cellIndex;
  let y = $el.parentElement.rowIndex;
  if (maze[y][x] !== 0) {
    return;
  }
  $el.classList.toggle(LEGEND.f);
  $el.innerHTML = 'f';
  maze[y][x] = 'f';

  maze[finishCell.y][finishCell.x] = 0;
  finishCell.element.innerHTML = 0;
  finishCell.element.classList.toggle(LEGEND.f);

  finishCell.element = $el;
  finishCell.y = y;
  finishCell.x = x;
}
