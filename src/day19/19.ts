const file = Deno.readTextFileSync('src/day19/input19.txt');
const input = file.split('\n\n');

const validDictionary: Record<string, number> = {};

function testPattern(str: string, patterns: string[]): number {
  if (str.length === 0) return 1;
  if (validDictionary[str] != null) return validDictionary[str];

  const matches = patterns.filter((pattern) => str.startsWith(pattern));
  if (matches.length === 0) return 0;

  return matches.reduce((sum, validMatch) => {
    const nextStr = str.substring(validMatch.length);
    const validCount = testPattern(str.substring(validMatch.length), patterns);

    validDictionary[nextStr] = validCount;

    return sum + validCount;
  }, 0);
}

function countTowels(input: string[]) {
  const possibleTowels = input[0].split(', ');
  const towelPatternsToCheck = input[1].split('\n');
  const validTowelsOptions = towelPatternsToCheck
    .map((pattern) => {
      const result = testPattern(pattern, possibleTowels);
      return result;
    })
    .filter((result) => result > 0);

  const amountValid = validTowelsOptions.length;
  const sumValidOptions = validTowelsOptions.reduce((sum, el) => sum + el);

  return { resultA: amountValid, resultB: sumValidOptions };
}

const { resultA, resultB } = countTowels(input);

console.log('19A: ', resultA);
console.log('19B: ', resultB);
