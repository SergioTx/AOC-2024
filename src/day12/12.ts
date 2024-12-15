const file = Deno.readTextFileSync('src/day12/input12.txt');
const input = file.split('\n').map((line) => line.split(''));

let alreadyConsidered: Record<number, number[]> = {};

function getSharedBorders(x: number, y: number): number {
  let sharedBorders = 0;
  if (alreadyConsidered[x]?.includes(y - 1)) {
    sharedBorders++;
  }
  if (alreadyConsidered[x]?.includes(y + 1)) {
    sharedBorders++;
  }
  if (alreadyConsidered[x - 1]?.includes(y)) {
    sharedBorders++;
  }
  if (alreadyConsidered[x + 1]?.includes(y)) {
    sharedBorders++;
  }

  return sharedBorders;
}

function getCorners(x: number, y: number): number {
  let sharedBorders = 0;

  let isValidTop = false;
  let isValidLeft = false;
  let isValidBottom = false;
  let isValidRight = false;
  if (alreadyConsidered[x - 1]?.includes(y)) {
    sharedBorders++;
    isValidTop = true;
  }
  if (alreadyConsidered[x]?.includes(y - 1)) {
    sharedBorders++;
    isValidLeft = true;
  }
  if (alreadyConsidered[x]?.includes(y + 1)) {
    sharedBorders++;
    isValidRight = true;
  }
  if (alreadyConsidered[x + 1]?.includes(y)) {
    sharedBorders++;
    isValidBottom = true;
  }

  if (sharedBorders === 0) {
    return 4;
  }

  if (sharedBorders === 1) {
    return 2;
  }

  let sum = 0;

  if (sharedBorders === 2) {
    if (isValidTop && isValidBottom) return 0;
    if (isValidLeft && isValidRight) return 0;
    sum++;
  }

  // check that they are connected to + axis
  if (isValidLeft && isValidTop && alreadyConsidered[x - 1]) {
    if (!alreadyConsidered[x - 1].includes(y - 1)) {
      sum++;
    }
  }
  if (isValidRight && isValidTop && alreadyConsidered[x - 1]) {
    if (!alreadyConsidered[x - 1].includes(y + 1)) {
      sum++;
    }
  }
  if (isValidLeft && isValidBottom && alreadyConsidered[x + 1]) {
    if (!alreadyConsidered[x + 1].includes(y - 1)) {
      sum++;
    }
  }
  if (isValidRight && isValidBottom && alreadyConsidered[x + 1]) {
    if (!alreadyConsidered[x + 1].includes(y + 1)) {
      sum++;
    }
  }

  return sum;
}

function getSides() {
  let sum = 0;
  Object.keys(alreadyConsidered)
    .map(Number)
    .forEach((x) => {
      alreadyConsidered[x].forEach((y) => {
        const corners = getCorners(x, y);
        sum += corners;
      });
    });
  return sum;
}

function getPerimeterAndArea(
  farm: string[][],
  x: number,
  y: number,
  perimeter = 4,
  area = 1
): { area: number; perimeter: number } {
  if (alreadyConsidered[x]?.includes(y)) {
    return { perimeter, area };
  }
  if (!alreadyConsidered[x]) {
    alreadyConsidered[x] = [y];
  } else {
    alreadyConsidered[x].push(y);
  }

  const crop = farm[x][y];

  if (farm[x][y - 1] === crop && !alreadyConsidered[x]?.includes(y - 1)) {
    const sharedBorders = getSharedBorders(x, y - 1);

    const { area: nextArea, perimeter: nextPerimeter } = getPerimeterAndArea(
      farm,
      x,
      y - 1,
      perimeter + 4 - 2 * sharedBorders,
      area + 1
    );

    area = nextArea;
    perimeter = nextPerimeter;
  }
  if (farm[x][y + 1] === crop && !alreadyConsidered[x]?.includes(y + 1)) {
    const sharedBorders = getSharedBorders(x, y + 1);

    const { area: nextArea, perimeter: nextPerimeter } = getPerimeterAndArea(
      farm,
      x,
      y + 1,
      perimeter + 4 - 2 * sharedBorders,
      area + 1
    );

    area = nextArea;
    perimeter = nextPerimeter;
  }
  if (farm[x - 1]?.[y] === crop && !alreadyConsidered[x - 1]?.includes(y)) {
    const sharedBorders = getSharedBorders(x - 1, y);

    const { area: nextArea, perimeter: nextPerimeter } = getPerimeterAndArea(
      farm,
      x - 1,
      y,
      perimeter + 4 - 2 * sharedBorders,
      area + 1
    );

    area = nextArea;
    perimeter = nextPerimeter;
  }
  if (farm[x + 1]?.[y] === crop && !alreadyConsidered[x + 1]?.includes(y)) {
    const sharedBorders = getSharedBorders(x + 1, y);

    const { area: nextArea, perimeter: nextPerimeter } = getPerimeterAndArea(
      farm,
      x + 1,
      y,
      perimeter + 4 - 2 * sharedBorders,
      area + 1
    );

    area = nextArea;
    perimeter = nextPerimeter;
  }

  return {
    perimeter,
    area,
  };
}

function getTotalPrice(farm: string[][], type: 'perimeter' | 'sides') {
  let sum = 0;
  const regionsFenced = {} as Record<number, number[]>;

  for (let x = 0; x < farm.length; x++) {
    forY: for (let y = 0; y < farm[x].length; y++) {
      if (regionsFenced[x]?.includes(y)) {
        continue forY;
      }
      const { perimeter, area } = getPerimeterAndArea(farm, x, y);
      if (type === 'perimeter') {
        sum += perimeter * area;
      } else {
        const sides = getSides();
        sum += sides * area;
      }

      Object.entries(alreadyConsidered).forEach(([takenX, takenYs]) => {
        regionsFenced[+takenX] = [...(regionsFenced[+takenX] ?? []), ...takenYs];
      });
      alreadyConsidered = {};
    }
  }

  return sum;
}

const resultA = getTotalPrice(input, 'perimeter');
const resultB = getTotalPrice(input, 'sides');

console.log('12A: ', resultA);
console.log('12B: ', resultB);
