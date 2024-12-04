const file = Deno.readTextFileSync('src/day4/input4.txt');
const input = file.split('\n').map((line) => line.split(''));

function getAllXmas(input: string[][]): number {
  const WORD = 'XMAS';
  const WORD_ARR = WORD.split('');
  let sum = 0;
  for (let i = 0; i < input.length; i++) {
    const line = input[i];
    for (let j = 0; j < input[i].length; j++) {
      const letter = input[i][j];

      if (letter === 'X') {
        const horizontal = line.slice(j, j + WORD.length).join('');
        if (horizontal === WORD) {
          sum++;
        }
        const horizontalReverse = line
          .slice(j - WORD.length + 1, j + 1)
          .toReversed()
          .join('');
        if (horizontalReverse === WORD) {
          sum++;
        }
        const vertical = WORD_ARR.map((_, index) => input[i + index]?.[j]).join('');
        if (vertical === WORD) {
          sum++;
        }
        const verticalReverse = WORD_ARR.map((_, index) => input[i - index]?.[j]).join('');
        if (verticalReverse === WORD) {
          sum++;
        }

        const diagonal1 = WORD_ARR.map((_, index) => input[i + index]?.[j + index]).join('');
        if (diagonal1 === WORD) {
          sum++;
        }
        const diagonal2 = WORD_ARR.map((_, index) => input[i + index]?.[j - index]).join('');
        if (diagonal2 === WORD) {
          sum++;
        }
        const diagonal3 = WORD_ARR.map((_, index) => input[i - index]?.[j + index]).join('');
        if (diagonal3 === WORD) {
          sum++;
        }
        const diagonal4 = WORD_ARR.map((_, index) => input[i - index]?.[j - index]).join('');
        if (diagonal4 === WORD) {
          sum++;
        }
      }
    }
  }

  return sum;
}

function getAllMasXShaped(input: string[][]): number {
  const WORD = 'MAS';
  const WORD_ARR = WORD.split('');
  let sum = 0;
  for (let i = 0; i < input.length; i++) {
    for (let j = 0; j < input[i].length; j++) {
      const letter = input[i][j];

      if (letter === 'A') {
        const diagonal1 = WORD_ARR.map((_, index) => input[i + index - 1]?.[j + index - 1]);
        const diagonal1Word = diagonal1.join('');
        const diagonal1ReverseWord = diagonal1.toReversed().join('');
        const diagonal2 = WORD_ARR.map((_, index) => input[i + index - 1]?.[j - index + 1]);
        const diagonal2Word = diagonal2.join('');
        const diagonal2ReverseWord = diagonal2.toReversed().join('');
        if (
          (diagonal1Word === WORD || diagonal1ReverseWord === WORD) &&
          (diagonal2Word === WORD || diagonal2ReverseWord === WORD)
        ) {
          sum++;
        }
      }
    }
  }

  return sum;
}

const resultA = getAllXmas(input);
const resultB = getAllMasXShaped(input);

console.log('4A: ', resultA);
console.log('4B: ', resultB);
