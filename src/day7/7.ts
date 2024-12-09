const file = Deno.readTextFileSync('src/day7/input7.txt');
const input = file.split('\n').map((line) => line.split(': '));

const SUM = '+';
const MULTIPLY = '*';
const CONCAT = '||';
const OPERATORS_A = [[MULTIPLY], [SUM]];
const OPERATORS_B = [[MULTIPLY], [SUM], [CONCAT]];

function getAllOperatorCombinations(numOperators: number, operatorOptions: string[][]): string[][] {
  const totalOperators = operatorOptions.length ** numOperators;
  let operators = structuredClone(operatorOptions);

  while (operators.length < totalOperators) {
    operators = operators.flatMap((el) => operatorOptions.map((op) => [...el, ...op]));
  }

  return operators;
}

function isValidLine(total: number, values: number[], operatorOptions: string[][]): boolean {
  const numOperators = values.length - 1;
  const operatorCombinations = getAllOperatorCombinations(numOperators, operatorOptions);

  return operatorCombinations.some((operators) => {
    const combinationTotal = values.reduce((acc, curr, index) => {
      const operator = operators[index - 1];
      if (operator === MULTIPLY) return acc * curr;
      if (operator === SUM) return acc + curr;
      if (operator === CONCAT) return +(String(acc) + String(curr));
      return acc;
    });
    return combinationTotal === total;
  });
}

function getValidSum(input: string[][], operatorOptions: string[][]) {
  const filtered = input.filter((line) => {
    const total = +line.at(0)!;
    const values = line.at(1)!.trim().split(' ').map(Number);

    return isValidLine(total, values, operatorOptions);
  });

  const sum = filtered.reduce((acc, line) => acc + +line.at(0)!, 0);
  return sum;
}

const resultA = 'DONE'; // getValidSum(input, OPERATORS_A);
const resultB = 'DONE'; // getValidSum(input, OPERATORS_B);

console.log('7A: ', resultA);
console.log('7B: ', resultB);
