const file = Deno.readTextFileSync('src/day8/input8.txt');
const input = file.split('\n').map((line) => line.split(''));

function getOtherAntennasAfterThat(input: string[][], letterAntenna: string, xAntenna: number, yAntenna: number) {
  const antennas = [] as { x: number; y: number }[];
  for (let x = 0; x < input.length; x++) {
    for (let y = 0; y < input[x].length; y++) {
      if ((x === xAntenna && y > yAntenna) || x > xAntenna) {
        const letter = input[x][y];
        if (letter === letterAntenna) {
          antennas.push({ x, y });
        }
      }
    }
  }
  return antennas;
}

function getAntinodesCount(input: string[][]) {
  const antinodes = {} as { [x: number]: Set<number> };

  for (let x = 0; x < input.length; x++) {
    for (let y = 0; y < input[x].length; y++) {
      const letter = input[x][y];
      if (letter !== '.') {
        const otherAntennas = getOtherAntennasAfterThat(input, letter, x, y);

        for (const coordinates of otherAntennas) {
          const xDiff = coordinates.x - x;
          const yDiff = coordinates.y - y;
          const antinode1x = x - xDiff;
          const antinode1y = y - yDiff;
          if (antinode1x >= 0 && antinode1x < input.length && antinode1y >= 0 && antinode1y < input[0].length) {
            if (!antinodes[antinode1x]) {
              antinodes[antinode1x] = new Set();
            }
            antinodes[antinode1x].add(antinode1y);
          }
          const antinode2x = coordinates.x + xDiff;
          const antinode2y = coordinates.y + yDiff;
          if (antinode2x >= 0 && antinode2x < input.length && antinode2y >= 0 && antinode2y < input[0].length) {
            if (!antinodes[antinode2x]) {
              antinodes[antinode2x] = new Set();
            }
            antinodes[antinode2x].add(antinode2y);
          }
        }
      }
    }
  }

  const numAntinodes = Object.keys(antinodes).reduce((sum, key) => sum + antinodes[+key]!.size, 0);
  return numAntinodes;
}

function getAntinodesCountWithResonance(input: string[][]) {
  const antinodes = {} as { [x: number]: Set<number> };

  for (let x = 0; x < input.length; x++) {
    for (let y = 0; y < input[x].length; y++) {
      const letter = input[x][y];
      if (letter !== '.') {
        // consider antenna itself in this case
        if (!antinodes[x]) {
          antinodes[x] = new Set();
        }
        antinodes[x].add(y);

        const otherAntennas = getOtherAntennasAfterThat(input, letter, x, y);

        for (const coordinates of otherAntennas) {
          const xDiff = coordinates.x - x;
          const yDiff = coordinates.y - y;
          let antinode1x = x - xDiff;
          let antinode1y = y - yDiff;
          while (antinode1x >= 0 && antinode1x < input.length && antinode1y >= 0 && antinode1y < input[0].length) {
            if (!antinodes[antinode1x]) {
              antinodes[antinode1x] = new Set();
            }
            antinodes[antinode1x].add(antinode1y);

            antinode1x = antinode1x - xDiff;
            antinode1y = antinode1y - yDiff;
          }

          let antinode2x = coordinates.x + xDiff;
          let antinode2y = coordinates.y + yDiff;
          while (antinode2x >= 0 && antinode2x < input.length && antinode2y >= 0 && antinode2y < input[0].length) {
            if (!antinodes[antinode2x]) {
              antinodes[antinode2x] = new Set();
            }
            antinodes[antinode2x].add(antinode2y);

            antinode2x = antinode2x + xDiff;
            antinode2y = antinode2y + yDiff;
          }
        }
      }
    }
  }

  const numAntinodes = Object.keys(antinodes).reduce((sum, key) => sum + antinodes[+key]!.size, 0);
  return numAntinodes;
}

const resultA = getAntinodesCount(input);
const resultB = getAntinodesCountWithResonance(input);

console.log('8A: ', resultA);
console.log('8B: ', resultB);
