const file = Deno.readTextFileSync('src/day11/input11.txt');
const input = file.split(' ');

const dictionary = new Map();

function blinkRecursive(stone: string, blinks: number, branch = stone): number {
  if (blinks <= 0) {
    return 1;
  }

  if (dictionary.has(`${blinks}---${stone}`)) {
    return dictionary.get(`${blinks}---${stone}`);
  }

  const blinksLeft = blinks - 1;
  if (stone === '0') {
    const response = blinkRecursive('1', blinksLeft, branch);
    dictionary.set(`${blinksLeft}---1`, response);
    return response;
  }
  if (stone.length % 2 === 0) {
    const firstDigit = String(+stone.substring(0, stone.length / 2));
    const secondDigit = String(+stone.substring(stone.length / 2));

    const firstResponse = blinkRecursive(firstDigit, blinksLeft, branch);
    const secondResponse = blinkRecursive(secondDigit, blinksLeft, branch + '-' + secondDigit);

    dictionary.set(`${blinksLeft}---${firstDigit}`, firstResponse);
    dictionary.set(`${blinksLeft}---${secondDigit}`, secondResponse);
    return firstResponse + secondResponse;
  }
  const nextStone = String(+stone * 2024);
  const response = blinkRecursive(nextStone, blinksLeft, branch);
  dictionary.set(`${blinksLeft}---${nextStone}`, response);
  return response;
}

function getNumStonesAfterBlinking(input: string[], blinks: number) {
  const result = input.reduce((acc, stone) => {
    const blinkSum = blinkRecursive(stone, blinks);
    return acc + blinkSum;
  }, 0);
  return result;
}

const resultA = getNumStonesAfterBlinking(input, 25);
const resultB = getNumStonesAfterBlinking(input, 75);

console.log('11A: ', resultA);
console.log('11B: ', resultB);
