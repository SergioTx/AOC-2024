const file = Deno.readTextFileSync('src/day7/input7.txt');
const input = file.split('\n').map((line) => line.split(': '));

function getSumMultiplyAllOperatorCombinations(numOperators: number): string[][] {
  const totalOperators = 2 ** numOperators;
  let operators = [['*'], ['+']];

  while (operators.length < totalOperators) {
    operators = operators.flatMap((el) => [
      [...el, '+'],
      [...el, '*'],
    ]);
  }

  return operators;
}

function isValidSumMultiplyLine(total: number, values: number[]): boolean {
  const numOperators = values.length - 1;
  const operatorCombinations = getSumMultiplyAllOperatorCombinations(numOperators);

  return operatorCombinations.some((operators) => {
    const combinationTotal = values.reduce((acc, curr, index) => {
      const operator = operators[index - 1];
      if (operator === '*') return acc * curr;
      return acc + curr;
    });
    return combinationTotal === total;
  });
}

function getValidSumMultiplySum(input: string[][]) {
  const filtered = input.filter((line) => {
    const total = +line.at(0)!;
    const values = line.at(1)!.trim().split(' ').map(Number);

    return isValidSumMultiplyLine(total, values);
  });

  const sum = filtered.reduce((acc, line) => acc + +line.at(0)!, 0);
  return sum;
}

function getSumMultiplyConcatAllOperatorCombinations(numOperators: number): string[][] {
  const totalOperators = 3 ** numOperators;
  let operators = [['*'], ['+'], ['||']];

  while (operators.length < totalOperators) {
    operators = operators.flatMap((el) => [
      [...el, '+'],
      [...el, '*'],
      [...el, '||'],
    ]);
  }

  return operators;
}

function isValidSumMultiplyConcatLine(total: number, values: number[]): boolean {
  const numOperators = values.length - 1;
  const operatorCombinations = getSumMultiplyConcatAllOperatorCombinations(numOperators);

  return operatorCombinations.some((operators) => {
    const combinationTotal = values.reduce((acc, curr, index) => {
      const operator = operators[index - 1];
      if (operator === '*') return acc * curr;
      if (operator === '+') return acc + curr;
      return +(String(acc) + String(curr));
    });
    return combinationTotal === total;
  });
}

function getValidSumMultiplyConcatSum(input: string[][]) {
  const filtered = input.filter((line) => {
    const total = +line.at(0)!;
    const values = line.at(1)!.trim().split(' ').map(Number);

    return isValidSumMultiplyConcatLine(total, values);
  });

  const sum = filtered.reduce((acc, line) => acc + +line.at(0)!, 0);
  return sum;
}

const resultA = 'DONE'; // getValidSumMultiplySum(input);
const resultB = 'DONE'; // getValidSumMultiplyConcatSum(input);

console.log('7A: ', resultA);
console.log('7B: ', resultB);
