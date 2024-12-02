const file = Deno.readTextFileSync('src/day1/input1.txt');
const input = file.split('\n').reduce(
  (acc, line) => {
    const [num1, num2] = line.trim().split(/\s+/).map(Number);
    acc.list1.push(num1);
    acc.list2.push(num2);
    return acc;
  },
  { list1: [] as number[], list2: [] as number[] }
);

function distanceBetweenLists(list1: number[], list2: number[]): number {
  const sortedList1 = list1.toSorted((a, b) => a - b);
  const sortedList2 = list2.toSorted((a, b) => a - b);

  return sortedList1.reduce((acc, num, index) => {
    const num2 = sortedList2.at(index)!;
    return acc + Math.abs(num - num2);
  }, 0);
}

function listSimilarity(list1: number[], list2: number[]): number {
  return list1.reduce((acc, num) => {
    const timesInList2 = list2.reduce((acc, num2) => {
      if (num === num2) {
        return acc + 1;
      }
      return acc;
    }, 0);
    return acc + num * timesInList2;
  }, 0);
}

const day1Part1 = distanceBetweenLists(input.list1, input.list2);
const day1Part2 = listSimilarity(input.list1, input.list2);

console.log('1A: ', day1Part1);
console.log('1B: ', day1Part2);
