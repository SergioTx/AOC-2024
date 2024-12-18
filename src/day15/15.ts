const file = Deno.readTextFileSync('src/day15/input15.txt');
const input = file.split('\n\n');

const ROBOT = '@';
const WALL = '#';
const BOX = 'O';
const LEFTBOX = '[';
const RIGHTBOX = ']';
const EMPTY = '.';
const TOP = '^';
const BOTTOM = 'v';
const LEFT = '<';
const RIGHT = '>';

type Direction = typeof TOP | typeof BOTTOM | typeof LEFT | typeof RIGHT;

function getPuzzleAndInstructions(input: string[], scaleUp = false) {
  let puzzle = input[0].split('\n').map((line) => line.split(''));
  if (scaleUp) {
    puzzle = puzzle.map((line) => {
      const scaledUpLine = line.flatMap((el) => {
        if (el === BOX) return [LEFTBOX, RIGHTBOX];
        if (el === ROBOT) return [ROBOT, EMPTY];
        return [el, el];
      });
      return scaledUpLine;
    });
  }

  const instructions = input[1].replaceAll('\n', '').split('');
  console.log({ instructions });

  return {
    puzzle,
    instructions,
  };
}

function getNextDoubleBoxes(puzzle: string[][], leftX: number, y: number, direction: Direction) {
  const boxes = [{ leftX, y }];

  if (direction === TOP || direction === BOTTOM) {
    const diffY = direction === TOP ? -1 : 1;
    const nextBlockLeft = puzzle.at(y + diffY)?.at(leftX);
    const nextBlockRight = puzzle.at(y + diffY)?.at(leftX + 1);
    if (nextBlockLeft === WALL || nextBlockRight === WALL) {
      return null;
    }

    if (nextBlockLeft === EMPTY && nextBlockRight === EMPTY) {
      return boxes;
    }

    if (nextBlockLeft === LEFTBOX) {
      const nextBoxes = getNextDoubleBoxes(puzzle, leftX, y + diffY, direction);
      if (!nextBoxes) return null;
      boxes.push(...nextBoxes);
    } else {
      // both can happen at the same time
      if (nextBlockLeft === RIGHTBOX) {
        const nextBoxes = getNextDoubleBoxes(puzzle, leftX - 1, y + diffY, direction);
        if (!nextBoxes) return null;
        boxes.push(...nextBoxes);
      }
      if (nextBlockRight === LEFTBOX) {
        const nextBoxes = getNextDoubleBoxes(puzzle, leftX + 1, y + diffY, direction);
        if (!nextBoxes) return null;
        boxes.push(...nextBoxes);
      }
    }

    return boxes;
  }

  if (direction === LEFT) {
    const nextBlock = puzzle.at(y)?.at(leftX - 1);
    if (nextBlock === WALL) {
      return null;
    }

    if (nextBlock === RIGHTBOX) {
      const nextBoxes = getNextDoubleBoxes(puzzle, leftX - 2, y, LEFT);
      if (!nextBoxes) return null;
      boxes.push(...nextBoxes);
    }
    return boxes;
  }

  if (direction === RIGHT) {
    const nextBlock = puzzle.at(y)?.at(leftX + 2);
    if (nextBlock === WALL) {
      return null;
    }

    if (nextBlock === LEFTBOX) {
      const nextBoxes = getNextDoubleBoxes(puzzle, leftX + 2, y, RIGHT);
      if (!nextBoxes) return null;
      boxes.push(...nextBoxes);
    }

    return boxes;
  }

  direction satisfies never;
}

function moveDoubleBoxes(
  puzzle: string[][],
  boxes: NonNullable<ReturnType<typeof getNextDoubleBoxes>>,
  direction: Direction
) {
  // remove duplicates
  const filteredBoxes = boxes.filter((el, index, arr) => {
    return index === arr.findIndex((el2) => el2.leftX === el.leftX && el2.y === el.y);
  });
  if (direction === TOP || direction === BOTTOM) {
    const diffY = direction === TOP ? -1 : 1;
    filteredBoxes
      .toSorted((a, b) => {
        if (b.y - a.y !== 0) {
          return (b.y - a.y) * diffY;
        }
        return (b.leftX - a.leftX) * diffY;
      })
      .forEach((leftBox) => {
        puzzle[leftBox.y][leftBox.leftX] = EMPTY;
        puzzle[leftBox.y][leftBox.leftX + 1] = EMPTY;
        puzzle[leftBox.y + diffY][leftBox.leftX] = LEFTBOX;
        puzzle[leftBox.y + diffY][leftBox.leftX + 1] = RIGHTBOX;
      });
    return;
  }

  if (direction === LEFT || direction === RIGHT) {
    const diffX = direction === LEFT ? -1 : 1;
    filteredBoxes.toReversed().forEach((leftBox) => {
      puzzle[leftBox.y][leftBox.leftX] = EMPTY;
      puzzle[leftBox.y][leftBox.leftX + 1] = EMPTY;
      puzzle[leftBox.y][leftBox.leftX + diffX] = LEFTBOX;
      puzzle[leftBox.y][leftBox.leftX + diffX + 1] = RIGHTBOX;
    });
    return;
  }

  direction satisfies never;
}

function performAllInstructions(puzzle: string[][], instructions: string[]): string[][] {
  const puzzleClone = structuredClone(puzzle);
  let robotPositionY = puzzleClone.findIndex((line) => line.some((cell) => cell === ROBOT));
  let robotPositionX = puzzleClone[robotPositionY].findIndex((cell) => cell === ROBOT);

  instructions.forEach((instruction, index) => {
    if (instruction === TOP) {
      const nextBlock = puzzleClone.at(robotPositionY - 1)?.at(robotPositionX);
      if (nextBlock === EMPTY) {
        puzzleClone[robotPositionY][robotPositionX] = EMPTY;
        puzzleClone[robotPositionY - 1][robotPositionX] = ROBOT;

        robotPositionY -= 1;
        return;
      }
      if (nextBlock === WALL) {
        return;
      }

      // single boxes
      if (nextBlock === BOX) {
        let diff = 1;
        while (puzzleClone.at(robotPositionY - diff)?.at(robotPositionX) === BOX) {
          diff++;
        }
        if (puzzleClone.at(robotPositionY - diff)?.at(robotPositionX) === WALL) {
          return;
        }
        if (puzzleClone.at(robotPositionY - diff)?.at(robotPositionX) === EMPTY) {
          puzzleClone[robotPositionY][robotPositionX] = EMPTY;
          puzzleClone[robotPositionY - 1][robotPositionX] = ROBOT;
          puzzleClone[robotPositionY - diff][robotPositionX] = BOX;

          robotPositionY -= 1;
          return;
        }
      }

      // double boxes
      if (nextBlock === LEFTBOX || nextBlock === RIGHTBOX) {
        const leftX = nextBlock === LEFTBOX ? robotPositionX : robotPositionX - 1;
        const boxes = getNextDoubleBoxes(puzzleClone, leftX, robotPositionY - 1, instruction);
        if (boxes?.length) {
          moveDoubleBoxes(puzzleClone, boxes, instruction);
          puzzleClone[robotPositionY][robotPositionX] = EMPTY;
          puzzleClone[robotPositionY - 1][robotPositionX] = ROBOT;
          robotPositionY -= 1;
        }
      }
    }
    if (instruction === BOTTOM) {
      const nextBlock = puzzleClone.at(robotPositionY + 1)?.at(robotPositionX);
      if (nextBlock === EMPTY) {
        puzzleClone[robotPositionY][robotPositionX] = EMPTY;
        puzzleClone[robotPositionY + 1][robotPositionX] = ROBOT;

        robotPositionY += 1;
        return;
      }
      if (nextBlock === WALL) {
        return;
      }
      if (nextBlock === BOX) {
        let diff = 1;
        while (puzzleClone.at(robotPositionY + diff)?.at(robotPositionX) === BOX) {
          diff++;
        }
        if (puzzleClone.at(robotPositionY + diff)?.at(robotPositionX) === WALL) {
          return;
        }
        if (puzzleClone.at(robotPositionY + diff)?.at(robotPositionX) === EMPTY) {
          puzzleClone[robotPositionY][robotPositionX] = EMPTY;
          puzzleClone[robotPositionY + 1][robotPositionX] = ROBOT;
          puzzleClone[robotPositionY + diff][robotPositionX] = BOX;

          robotPositionY += 1;
          return;
        }
      }
      // double boxes
      if (nextBlock === LEFTBOX || nextBlock === RIGHTBOX) {
        const leftX = nextBlock === LEFTBOX ? robotPositionX : robotPositionX - 1;
        const boxes = getNextDoubleBoxes(puzzleClone, leftX, robotPositionY + 1, BOTTOM);
        if (boxes?.length) {
          moveDoubleBoxes(puzzleClone, boxes, instruction);
          puzzleClone[robotPositionY][robotPositionX] = EMPTY;
          puzzleClone[robotPositionY + 1][robotPositionX] = ROBOT;
          robotPositionY += 1;
        }
      }
    }
    if (instruction === LEFT) {
      const nextBlock = puzzleClone.at(robotPositionY)?.at(robotPositionX - 1);
      if (nextBlock === EMPTY) {
        puzzleClone[robotPositionY][robotPositionX] = EMPTY;
        puzzleClone[robotPositionY][robotPositionX - 1] = ROBOT;

        robotPositionX -= 1;
        return;
      }
      if (nextBlock === WALL) {
        return;
      }
      if (nextBlock === BOX) {
        let diff = 1;
        while (puzzleClone.at(robotPositionY)?.at(robotPositionX - diff) === BOX) {
          diff++;
        }
        if (puzzleClone.at(robotPositionY)?.at(robotPositionX - diff) === WALL) {
          return;
        }
        if (puzzleClone.at(robotPositionY)?.at(robotPositionX - diff) === EMPTY) {
          puzzleClone[robotPositionY][robotPositionX] = EMPTY;
          puzzleClone[robotPositionY][robotPositionX - 1] = ROBOT;
          puzzleClone[robotPositionY][robotPositionX - diff] = BOX;

          robotPositionX -= 1;
          return;
        }
      }
      if (nextBlock === RIGHTBOX) {
        const boxes = getNextDoubleBoxes(puzzleClone, robotPositionX - 1 - 1, robotPositionY, LEFT);
        if (boxes?.length) {
          moveDoubleBoxes(puzzleClone, boxes, instruction);
          puzzleClone[robotPositionY][robotPositionX] = EMPTY;
          puzzleClone[robotPositionY][robotPositionX - 1] = ROBOT;
          robotPositionX -= 1;
        }
      }
    }
    if (instruction === RIGHT) {
      const nextBlock = puzzleClone.at(robotPositionY)?.at(robotPositionX + 1);
      if (nextBlock === EMPTY) {
        puzzleClone[robotPositionY][robotPositionX] = EMPTY;
        puzzleClone[robotPositionY][robotPositionX + 1] = ROBOT;

        robotPositionX += 1;
        return;
      }
      if (nextBlock === WALL) {
        return;
      }
      if (nextBlock === BOX) {
        let diff = 1;
        while (puzzleClone.at(robotPositionY)?.at(robotPositionX + diff) === BOX) {
          diff++;
        }
        if (puzzleClone.at(robotPositionY)?.at(robotPositionX + diff) === WALL) {
          return;
        }
        if (puzzleClone.at(robotPositionY)?.at(robotPositionX + diff) === EMPTY) {
          puzzleClone[robotPositionY][robotPositionX] = EMPTY;
          puzzleClone[robotPositionY][robotPositionX + 1] = ROBOT;
          puzzleClone[robotPositionY][robotPositionX + diff] = BOX;

          robotPositionX += 1;
          return;
        }
      }
      if (nextBlock === LEFTBOX) {
        const boxes = getNextDoubleBoxes(puzzleClone, robotPositionX + 1, robotPositionY, RIGHT);
        if (boxes?.length) {
          moveDoubleBoxes(puzzleClone, boxes, instruction);
          puzzleClone[robotPositionY][robotPositionX] = EMPTY;
          puzzleClone[robotPositionY][robotPositionX + 1] = ROBOT;
          robotPositionX += 1;
        }
      }
    }
  });

  return puzzleClone;
}

function sumBoxesCoordinates(input: string[], scaleUp = false): number {
  const { puzzle, instructions } = getPuzzleAndInstructions(input, scaleUp);
  const puzzleEnd = performAllInstructions(puzzle, instructions);

  console.log(showMap(puzzleEnd));

  const sumBoxCoordinates = puzzleEnd.reduce((acc, line, topIndex) => {
    return (
      acc +
      line.reduce((acc, element, leftIndex) => {
        if (element === BOX || element === LEFTBOX) {
          return acc + (100 * topIndex + leftIndex);
        }
        return acc;
      }, 0)
    );
  }, 0);

  return sumBoxCoordinates;
}

function showMap(puzzle: string[][]) {
  const txtPuzzle = puzzle.map((line) => line.join('')).join('\n');
  return '\u001b[1;32m' + txtPuzzle.replace('@', '\u001b[1;31m@\u001b[1;32m');
}

const resultA = sumBoxesCoordinates(input);
const resultB = sumBoxesCoordinates(input, true);

console.log('15A: ', resultA);
console.log('15B: ', resultB);
