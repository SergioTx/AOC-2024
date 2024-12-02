const file = Deno.readTextFileSync('src/day2/input2.txt');
const input = file.split('\n').map((report) => report.split(/\s+/).map(Number));

function isValidRecord(levels: number[]): boolean {
  const isDecreasing = levels.at(0) != null && levels.at(1) != null && levels.at(0)! > levels.at(1)!;
  for (let index = 1; index < levels.length; index++) {
    const diff = levels.at(index)! - levels.at(index - 1)!;
    if (isDecreasing) {
      if (diff >= 0 || diff < -3) {
        return false;
      }
    } else {
      if (diff <= 0 || diff > 3) {
        return false;
      }
    }
  }
  return true;
}

const result2A = input.reduce((acc, levels) => {
  const isValid = isValidRecord(levels);
  const sum = isValid ? 1 : 0;
  return acc + sum;
}, 0);

const result2B = input.reduce((acc, levels) => {
  let isValid = isValidRecord(levels);
  if (!isValid) {
    isValid = levels.some((_, index) => {
      return isValidRecord(levels.toSpliced(index, 1));
    });
  }
  const sum = isValid ? 1 : 0;
  return acc + sum;
}, 0);

console.log('2A: ', result2A);
console.log('2B: ', result2B);
