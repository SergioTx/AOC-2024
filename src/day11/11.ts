const file = Deno.readTextFileSync('src/day11/input11.txt');
const input = file.split(' ');

const branches = [] as number[];

function blinkRecursive(stone: string, blinks: number, branch = 0): number {
  if (blinks <= 0) {
    if (!branches.includes(branch)) {
      const date = new Date().toLocaleTimeString('es');
      console.log({ blinks, branch, date });
      branches.push(branch);
    }
    return 1;
  }

  if (stone === '0') {
    return blinkRecursive('1', blinks - 1, branch);
  }
  if (stone.length % 2 === 0) {
    const firstDigit = String(+stone.substring(0, stone.length / 2));
    const secondDigit = String(+stone.substring(stone.length / 2));
    return blinkRecursive(firstDigit, blinks - 1, branch) + blinkRecursive(secondDigit, blinks - 1, branch + 1);
  }
  return blinkRecursive(String(+stone * 2024), blinks - 1, branch);
}

function getNumStonesAfterBlinking(input: string[], blinks: number) {
  const result = input.reduce((acc, stone, index) => {
    console.log({ stone });
    const blinkSum = blinkRecursive(stone, blinks);
    console.log({ stone, index, blinkSum });
    // Temporary store data just in case
    Deno.writeTextFileSync(`src/day11/temp/${stone}_sum.txt`, String(blinkSum));
    return acc + blinkSum;
  }, 0);
  return result;
}

const resultA = 'DONE'; //getNumStonesAfterBlinking(input, 25);
const resultB = '-'; // getNumStonesAfterBlinking(input, 75);

console.log('11A: ', resultA);
console.log('11B: ', resultB);
