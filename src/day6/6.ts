const file = Deno.readTextFileSync('src/day6/input6.txt');
const input = file.split('\n').map((line) => line.split(''));

const UP = '^';
const DOWN = 'v';
const LEFT = '<';
const RIGHT = '>';
const OBSTACLE = '#';
const PATH = 'X';

function findGuard(input: string[][]): { x: number; y: number; direction: 'up' | 'down' | 'left' | 'right' } | null {
  for (let x = 0; x < input.length; x++) {
    const row = input[x];

    if (row.indexOf(UP) >= 0) {
      return { x, y: row.indexOf(UP), direction: 'up' };
    }
    if (row.indexOf(DOWN) >= 0) {
      return { x, y: row.indexOf(DOWN), direction: 'down' };
    }
    if (row.indexOf(LEFT) >= 0) {
      return { x, y: row.indexOf(LEFT), direction: 'left' };
    }
    if (row.indexOf(RIGHT) >= 0) {
      return { x, y: row.indexOf(RIGHT), direction: 'right' };
    }
  }
  return null;
}

function moveUp(input: string[][], x: number, y: number) {
  if (input[x]?.[y] !== UP) {
    return input;
  }

  let isBlocked = false;
  let movingX = x;
  while (!isBlocked) {
    if (input[movingX - 1]?.[y] == null) {
      input[movingX][y] = PATH;
      return input;
    } else if (input[movingX - 1][y] === OBSTACLE) {
      isBlocked = true;
      input[movingX][y] = RIGHT;
    } else {
      input[movingX][y] = PATH;
      movingX--;
      input[movingX][y] = UP;
    }
  }
  return input;
}

function moveDown(input: string[][], x: number, y: number) {
  if (input[x]?.[y] !== DOWN) {
    return input;
  }

  let isBlocked = false;
  let movingX = x;
  while (!isBlocked) {
    if (input[movingX + 1]?.[y] == null) {
      input[movingX][y] = PATH;
      return input;
    } else if (input[movingX + 1][y] === OBSTACLE) {
      isBlocked = true;
      input[movingX][y] = LEFT;
    } else {
      input[movingX][y] = PATH;
      movingX++;
      input[movingX][y] = DOWN;
    }
  }
  return input;
}

function moveRight(input: string[][], x: number, y: number) {
  if (input[x]?.[y] !== RIGHT) {
    return input;
  }

  let isBlocked = false;
  let movingY = y;
  while (!isBlocked) {
    if (input[x][movingY + 1] == null) {
      input[x][movingY] = PATH;
      return input;
    } else if (input[x][movingY + 1] === OBSTACLE) {
      isBlocked = true;
      input[x][movingY] = DOWN;
    } else {
      input[x][movingY] = PATH;
      movingY++;
      input[x][movingY] = RIGHT;
    }
  }
  return input;
}

function moveLeft(input: string[][], x: number, y: number) {
  if (input[x]?.[y] !== LEFT) {
    return input;
  }

  let isBlocked = false;
  let movingY = y;
  while (!isBlocked) {
    if (input[x][movingY - 1] == null) {
      input[x][movingY] = PATH;
      return input;
    } else if (input[x][movingY - 1] === OBSTACLE) {
      isBlocked = true;
      input[x][movingY] = UP;
    } else {
      input[x][movingY] = PATH;
      movingY--;
      input[x][movingY] = LEFT;
    }
  }
  return input;
}

function moveGuard(input: string[][], x: number, y: number): string[][] {
  return moveLeft(moveDown(moveRight(moveUp(input, x, y), x, y), x, y), x, y);
}

function getGuardPath(input: string[][]) {
  let inputCloned = structuredClone(input);

  let position = findGuard(inputCloned);
  while (position != null) {
    inputCloned = moveGuard(inputCloned, position?.x, position?.y);
    position = findGuard(inputCloned);
  }

  return inputCloned;
}

function getGuardPathTileNumber(input: string[][]): number {
  return getGuardPath(input)
    .flat()
    .reduce((acc, cell) => {
      if (cell === PATH) {
        return acc + 1;
      }
      return acc;
    }, 0);
}

// Slow answer, even after doing it only for the Path
function getObstacles(input: string[][]) {
  const inputPath = getGuardPath(input);
  let loopObstacles = 0;
  for (let x = 0; x < input.length; x++) {
    for (let y = 0; y < input[x].length; y++) {
      if (inputPath[x][y] === PATH) {
        let inputCloned = structuredClone(input);
        inputCloned[x][y] = OBSTACLE;

        const positions: string[] = [];
        let position = findGuard(inputCloned);
        while (position != null && !positions.includes(position.direction + position.x + position.y)) {
          inputCloned = moveGuard(inputCloned, position?.x, position?.y);
          positions.push(position.direction + position.x + position.y);
          position = findGuard(inputCloned);
        }

        if (position != null) {
          loopObstacles++;
        }
      }
    }
  }

  return loopObstacles;
}

const resultA = getGuardPathTileNumber(input);
const resultB = 'DONE'; // getObstacles(input); // Commented because it's too slow, but works

console.log('6A: ', resultA);
console.log('6B: ', resultB);
