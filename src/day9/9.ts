const file = Deno.readTextFileSync('src/day9/input9.txt');
const input = file;

const EMPTY = '.';

function getFileBlocks(diskMapSplit: string[]): string[] {
  return diskMapSplit.flatMap((num, index) => {
    const isFile = index % 2 === 0;
    if (isFile) {
      return Array.from({ length: +num }).fill(String(index / 2)) as string[];
    }
    return Array.from({ length: +num }).fill(EMPTY) as string[];
  });
}

function sortFileBlocks(blocks: string[]): string[] {
  const sortedArr = structuredClone(blocks);

  for (let i = sortedArr.length - 1; i >= 0; i--) {
    const element = sortedArr[i];
    if (element !== EMPTY) {
      const firstEmptySpace = sortedArr.indexOf(EMPTY);
      if (i > firstEmptySpace) {
        sortedArr[firstEmptySpace] = element;
        sortedArr[i] = EMPTY;
      }
    }
  }
  return sortedArr;
}

function getChecksum(blocks: string[]): number {
  return blocks.reduce((sum, el, index) => {
    if (el !== EMPTY) {
      return sum + +el * index;
    }
    return sum;
  }, 0);
}

function sortFullFileBlocks(blocks: string[]): string[] {
  const sortedArr = structuredClone(blocks);

  let prevElement = EMPTY;
  for (let i = sortedArr.length - 1; i >= 0; i--) {
    const element = sortedArr[i];
    if (element !== EMPTY && element !== prevElement) {
      const firstElementIndex = sortedArr.indexOf(element); // indexes don't repeat
      const numElements = i - firstElementIndex + 1;
      const firstEmptySpaceIndex = sortedArr.findIndex(
        (el, index) => el === EMPTY && sortedArr.slice(index, index + numElements).every((el) => el === EMPTY)
      );

      if (firstEmptySpaceIndex >= 0 && i > firstEmptySpaceIndex) {
        for (let j = 0; j < numElements; j++) {
          sortedArr[firstEmptySpaceIndex + j] = element;
        }
        for (let j = 0; j < numElements; j++) {
          sortedArr[i - j] = EMPTY;
        }
      }
    }
    prevElement = element;
  }
  return sortedArr;
}

function getFilesystemChecksum(diskMap: string) {
  const diskMapSplit = diskMap.split('');
  const blocks = getFileBlocks(diskMapSplit);
  const sortedBlocks = sortFileBlocks(blocks);
  const checksum = getChecksum(sortedBlocks);
  return checksum;
}

function getFullBlockFilesystemChecksum(diskMap: string) {
  const diskMapSplit = diskMap.split('');
  const blocks = getFileBlocks(diskMapSplit);
  const sortedBlocks = sortFullFileBlocks(blocks);
  const checksum = getChecksum(sortedBlocks);
  return checksum;
}

const resultA = 'DONE'; // getFilesystemChecksum(input);
const resultB = 'DONE'; // getFullBlockFilesystemChecksum(input);

console.log('9A: ', resultA);
console.log('9B: ', resultB);
