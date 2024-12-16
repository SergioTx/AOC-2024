const file = Deno.readTextFileSync('src/day14/input14.txt');
const input = file.split('\n');

type Position = { x: number; y: number };
type Robot = { position: Position; speed: Position };

const gridX = 101;
const gridY = 103;
const halfX = Math.floor(gridX / 2);
const halfY = Math.floor(gridY / 2);
const maxVersions = gridX * gridY;

function getRobots(robot: string): Robot | null {
  const matcher = robot.match(/p=(-?\d+),(-?\d+) v=(-?\d+),(-?\d+)/);
  if (!matcher) return null;
  const [, posX, posY, vX, vY] = matcher;

  return {
    position: {
      x: +posX,
      y: +posY,
    },
    speed: {
      x: +vX,
      y: +vY,
    },
  };
}

function moveRobot(robot: Robot, seconds: number) {
  const tempRobot = structuredClone(robot);

  for (let i = 0; i < seconds; i++) {
    tempRobot.position.x += tempRobot.speed.x;
    tempRobot.position.y += tempRobot.speed.y;
  }

  tempRobot.position.x %= gridX;
  tempRobot.position.y %= gridY;

  if (tempRobot.position.x < 0) {
    tempRobot.position.x += gridX;
  }
  if (tempRobot.position.y < 0) {
    tempRobot.position.y += gridY;
  }

  return tempRobot.position;
}

function getRobotQuadrant({ x, y }: Position): 0 | 1 | 2 | 3 | 4 {
  if (x === halfX || y === halfY) {
    return 0;
  }

  if (x > halfX) {
    if (y > halfY) {
      return 2;
    }
    return 4;
  }

  if (y > halfY) {
    return 1;
  }
  return 3;
}

function printRobots(robots: Position[]) {
  const canvas = Array.from({ length: gridY }).map((y) => Array.from({ length: gridX }).fill(' '));
  robots.forEach(({ x, y }) => {
    canvas[y][x] = '*';
  });

  console.log(canvas.map((line) => line.join('')).join('\n'));
}

function getSafetyFactor(robots: Robot[], seconds: number) {
  const robotsLastPosition = robots.map((robot) => moveRobot(robot, seconds));

  // printRobots(robotsLastPosition);

  const quadrants = robotsLastPosition.reduce(
    (acc, position) => {
      const quadrant = getRobotQuadrant(position);
      acc[quadrant - 1]++;
      return acc;
    },
    [0, 0, 0, 0] as [number, number, number, number]
  );

  return quadrants.reduce((a, b) => a * b);
}

function getPatternSeconds(robots: Robot[]) {
  let minFactor = Number.MAX_SAFE_INTEGER;
  let seconds = 0;
  for (let i = 1; i < maxVersions; i++) {
    const safety = getSafetyFactor(robots, i);
    if (safety < minFactor) {
      minFactor = safety;
      seconds = i;
    }
  }

  return seconds;
}

const robots = input.map(getRobots).filter((robot) => robot != null);
const resultA = getSafetyFactor(robots, 100);
const resultB = 'DONE'; // getPatternSeconds(robots);

console.log('14A: ', resultA);
console.log('14B: ', resultB);
