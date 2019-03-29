(function() {
  const SETTINGS = {
    rows: 10,
    cols: 10,
    cellState: {
      free: 0,
      wall: 1,
      start: 2,
      finish: 3,
      visited: 4
    },
    cellClass: ['cell', 'wall', 'start', 'finish']
  };

  const startCell = [1, 2];
  let $cellElements = [];

  let matrix = [
    [0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
    [0, 2, 0, 1, 0, 0, 0, 1, 0, 0],
    [0, 0, 0, 1, 1, 1, 1, 1, 0, 0],
    [0, 0, 0, 0, 0, 1, 0, 0, 0, 0],
    [0, 0, 1, 0, 0, 1, 0, 1, 0, 0],
    [0, 0, 1, 0, 0, 1, 0, 1, 0, 0],
    [0, 0, 1, 1, 1, 1, 0, 1, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 1, 3, 0],
    [0, 0, 0, 0, 0, 0, 0, 1, 0, 0]
  ];

  window.addEventListener('load', init);

  function init() {
    let matrixCopy = matrix.slice();

    buildMaze(matrixCopy);
    findExit(matrixCopy);
  }

  function buildMaze(matrix) {
    let $container = document.getElementById('gameTable');

    for (let i = 0; i < SETTINGS.rows; i++) {
      for (let j = 0; j < SETTINGS.cols; j++) {
        let cell = matrix[i][j];
        let $cellEl = document.createElement('div');

        $cellEl.classList.add(SETTINGS.cellClass[0], SETTINGS.cellClass[cell]);
        $container.appendChild($cellEl);
        $cellElements.push($cellEl);
      }
    }
  }

  function findExit(matrix) {
    let move = 1;
    let nextCells = [startCell];

    while (nextCells.length) {
      nextCells = nextCells
        .map(cell => {
          return moveToNeighbours(cell, matrix, move);
        })
        .flat();

      move++;
    }
  }

  function moveToNeighbours(cell, matrix, move) {
    let cells = [
      moveUp(cell[0], cell[1], matrix, move),
      moveDown(cell[0], cell[1], matrix, move),
      moveLeft(cell[0], cell[1], matrix, move),
      moveRight(cell[0], cell[1], matrix, move)
    ];

    return cells.filter(cell => cell !== null);
  }

  function moveUp(x, y, matrix, move) {
    return moveTo(x, y - 1, matrix, move);
  }

  function moveDown(x, y, matrix, move) {
    return moveTo(x, y + 1, matrix, move);
  }

  function moveLeft(x, y, matrix, move) {
    return moveTo(x - 1, y, matrix, move);
  }

  function moveRight(x, y, matrix, move) {
    return moveTo(x + 1, y, matrix, move);
  }

  function moveTo(x, y, matrix, move) {
    let cell = matrix[y] && matrix[y][x];

    if (cell === SETTINGS.cellState.finish) {
      console.log('finish');

      return null;
    }

    if (cell === SETTINGS.cellState.free) {
      $cellElements[y * SETTINGS.rows + x].innerHTML = move;
      matrix[y][x] = SETTINGS.cellState.visited;

      return [x, y];
    }

    return null;
  }
})();
