const file = Deno.readTextFileSync('src/day10/input10.txt');
const input = file.split('\n').map((line) => line.split('').map(Number));

const TRAILHEAD = 0;
type Coordinate = { x: number; y: number };

function getNextTiles(input: number[][], { x, y }: Coordinate) {
  const currentValue = input[x][y];
  const nextValue = currentValue + 1;
  const nextTiles = [] as Coordinate[];

  if (input[x + 1]?.[y] === nextValue) {
    nextTiles.push({ x: x + 1, y });
  }
  if (input[x - 1]?.[y] === nextValue) {
    nextTiles.push({ x: x - 1, y });
  }
  if (input[x][y - 1] === nextValue) {
    nextTiles.push({ x: x, y: y - 1 });
  }
  if (input[x][y + 1] === nextValue) {
    nextTiles.push({ x: x, y: y + 1 });
  }
  return nextTiles;
}

function getTrackRoutes(input: number[][], startingPosition: Coordinate, distinct = false) {
  let coordinates = [startingPosition];
  while (coordinates.length && input[coordinates.at(0)!.x][coordinates.at(0)!.y] !== 9) {
    coordinates = coordinates.flatMap((coordinate) => getNextTiles(input, coordinate));

    if (!distinct)
      coordinates = coordinates.filter(
        ({ x, y }, index, nextTiles) =>
          !nextTiles.some(({ x: x2, y: y2 }, index2) => x === x2 && y === y2 && index < index2)
      );
  }
  return coordinates.length;
}

function getTrailSum(input: number[][], distinct = false) {
  let sum = 0;
  for (let x = 0; x < input.length; x++) {
    for (let y = 0; y < input[x].length; y++) {
      const element = input[x][y];
      if (element === TRAILHEAD) {
        sum += getTrackRoutes(input, { x, y }, distinct);
      }
    }
  }
  return sum;
}

const resultA = getTrailSum(input);
const resultB = getTrailSum(input, true);

console.log('10A: ', resultA);
console.log('10B: ', resultB);
