const file = Deno.readTextFileSync('src/day3/input3.txt');
const input = file.replaceAll('\n', '');

const multiplicationRegex = /mul\([0-9]{1,3},[0-9]{1,3}\)/g;
function getAllMultiplications(input: string): string[] | null {
  const multiplications = input.match(multiplicationRegex);
  return multiplications;
}

const digitsRegex = /[0-9]{1,3},[0-9]{1,3}/g;
function getDigits(multiplication: string): [number, number] {
  return multiplication.match(digitsRegex)![0].split(',').map(Number) as [number, number];
}

function getMultiplicationResults(input: string) {
  const multiplications = getAllMultiplications(input);
  if (multiplications != null) {
    const multiplied = multiplications.map((multi) => {
      const [a, b] = getDigits(multi);
      return a * b;
    });

    return multiplied.reduce((acc, sum) => acc + sum);
  }
}

function getMultiplicationResultsWithDoAndDont(input: string) {
  let inputWithoutDonts = input;
  // remove all the code between don't() and do()
  while (inputWithoutDonts.indexOf("don't()") >= 0) {
    const dontIndex = inputWithoutDonts.indexOf("don't()");
    const nextDoIndex = inputWithoutDonts.indexOf('do()', dontIndex) ?? inputWithoutDonts.length - 1;

    inputWithoutDonts = inputWithoutDonts.substring(0, dontIndex) + inputWithoutDonts.substring(nextDoIndex);
  }

  return getMultiplicationResults(inputWithoutDonts);
}

const resultA = getMultiplicationResults(input);
const resultB = getMultiplicationResultsWithDoAndDont(input);

console.log('3A: ', resultA);
console.log('3B: ', resultB);
