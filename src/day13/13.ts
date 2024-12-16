const file = Deno.readTextFileSync('src/day13/input13.txt');
const input = file.split('\n\n');

type Input = {
  A: { x: number; y: number };
  B: { x: number; y: number };
  prize: { x: number; y: number };
};

const valueA = 3;
const valueB = 1;
const extraValue = 10_000_000_000_000;

function formatInput(input: string[], offset = 0): Input[] {
  return input.map((inputBlock) => {
    let aX = 0;
    let aY = 0;
    const aMatch = inputBlock.match(/Button A: X([+-]\d+), Y([+-]\d+)/);
    if (aMatch) {
      aX = +aMatch.at(1)!;
      aY = +aMatch.at(2)!;
    }
    let bX = 0;
    let bY = 0;
    const bMatch = inputBlock.match(/Button B: X([+-]\d+), Y([+-]\d+)/);
    if (bMatch) {
      bX = +bMatch.at(1)!;
      bY = +bMatch.at(2)!;
    }
    let pX = 0;
    let pY = 0;
    const pMatch = inputBlock.match(/Prize: X=(\d+), Y=(\d+)/);
    if (pMatch) {
      pX = +pMatch.at(1)! + offset;
      pY = +pMatch.at(2)! + offset;
    }

    return {
      A: { x: aX, y: aY },
      B: { x: bX, y: bY },
      prize: { x: pX, y: pY },
    };
  });
}

function getMinMovements(input: Input) {
  const b = (input.prize.x * input.A.y - input.prize.y * input.A.x) / (input.A.y * input.B.x - input.A.x * input.B.y);
  if (b === Math.floor(b)) {
    const a = (input.prize.x - input.B.x * b) / input.A.x;
    if (a === Math.floor(a)) {
      return { a, b };
    }
  }

  return null;
}

function getMinimumTokens(input: string[], offset = 0) {
  const formattedInput = formatInput(input, offset);
  const minMovements = formattedInput.map((singleInput) => {
    return getMinMovements(singleInput);
  });

  const values = minMovements
    .filter((option) => option != null)
    .map(({ a, b }) => {
      return a * valueA + b * valueB;
    });

  return values.reduce((acc, val) => acc + val, 0);
}

const resultA = getMinimumTokens(input);
const resultB = getMinimumTokens(input, extraValue);

console.log('13A: ', resultA);
console.log('13B: ', resultB);
