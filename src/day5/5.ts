const file = Deno.readTextFileSync('src/day5/input5.txt');
const input = file.split('\n\n');
const conditions = input[0].split('\n').map((line) => line.split('|') as [string, string]);
const lists = input[1].split('\n').map((line) => line.split(','));

function getMiddleNumber(list: string[]): number {
  const index = Math.floor(list.length / 2);
  return +list.at(index)!;
}

function getListIsValid(list: string[], conditions: [string, string][]): boolean {
  const isValid = conditions.every(([first, second]) => {
    const valid = list.indexOf(first) < 0 || list.indexOf(second) < 0 || list.indexOf(first) < list.indexOf(second);
    return valid;
  });
  return isValid;
}

function sortListToMakeItValid(list: string[], conditions: [string, string][]): string[] {
  const conditionsWithinTheList = conditions.filter(
    ([num1, num2]) => list.indexOf(num1) >= 0 && list.indexOf(num2) >= 0
  );
  const sortedList = list.toSorted((a, b) => {
    const condition = conditionsWithinTheList.find(
      (condition) => condition.indexOf(a) >= 0 && condition.indexOf(b) >= 0
    );
    if (!condition) {
      return 0;
    }
    if (condition[0] === a) {
      return -1;
    }
    return 1;
  });
  return sortedList;
}

function parseListsAndGetValidMiddleNumbersSum(lists: string[][], conditions: [string, string][]): number {
  const validLists = lists.filter((list) => getListIsValid(list, conditions));
  const sum = validLists.map(getMiddleNumber).reduce((acc, num) => acc + +num, 0);
  return sum;
}

function parseListsAndGetInvalidSortedMiddleNumbersSum(lists: string[][], conditions: [string, string][]): number {
  const validLists = lists.filter((list) => !getListIsValid(list, conditions));
  const sum = validLists
    .map((list) => sortListToMakeItValid(list, conditions))
    .map(getMiddleNumber)
    .reduce((acc, num) => acc + +num, 0);
  return sum;
}

const resultA = parseListsAndGetValidMiddleNumbersSum(lists, conditions);
const resultB = parseListsAndGetInvalidSortedMiddleNumbersSum(lists, conditions);

console.log('5A: ', resultA);
console.log('5B: ', resultB);
