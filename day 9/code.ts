import { readFileSync, writeFileSync } from "fs";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const input = readFileSync(__dirname + "/input.txt", "utf-8");

function test() {
  const inTest = `2199943210
  3987894921
  9856789892
  8767896789
  9899965678`;

  const expectedRes = 15;
  const numArr = createNumberArray(inTest);

  printNumberArray(numArr);

  const lowestNums = findLowestNumbers(numArr) as Array<number>;
  let res = 0;
  lowestNums.forEach((n) => (res += n + 1));
  console.log("result is", res);
  if (res !== expectedRes) {
    console.error("Result does not match expected result:", expectedRes);
  }
}

function printNumberArray(arr: Array<Array<number>>) {
  console.log("Number Array\n");
  for (let y = 0; y < arr.length; y++) {
    console.log(arr[y].join(" "));
  }
  console.log("");
}

function createNumberArray(input: string) {
  const lines = input.split("\n").map((l) => l.trim());

  let numArr = [];

  for (let y = 0; y < lines.length; y++) {
    const numbers = lines[y].split("").map((n) => parseInt(n.trim()));
    numArr.push(numbers);
  }

  return numArr;
}

function findLowestNumbers(
  numArr: Array<Array<number>>,
  returnPos: boolean = false
) {
  let lowestNums = [];
  for (let y = 0; y < numArr.length; y++) {
    for (let x = 0; x < numArr[y].length; x++) {
      const up = y > 0 ? numArr[y - 1][x] : 10;
      const down = y < numArr.length - 1 ? numArr[y + 1][x] : 10;
      const left = x > 0 ? numArr[y][x - 1] : 10;
      const right = x < numArr[y].length - 1 ? numArr[y][x + 1] : 10;

      const number = numArr[y][x];
      if (number < up && number < down && number < left && number < right) {
        console.log(`Found a low number at x: ${x}, y: ${y} - ${number}`);

        if (returnPos) {
          lowestNums.push({
            val: number,
            x,
            y,
          });
        } else {
          lowestNums.push(number);
        }
      }
    }
  }

  return lowestNums;
}
// test();

function part1() {
  const numArr = createNumberArray(input);

  printNumberArray(numArr);

  const lowestNums = findLowestNumbers(numArr) as Array<number>;
  let res = 0;
  lowestNums.forEach((n) => (res += n + 1));
  console.log("result is", res);
}

// part1();

interface Position {
  val: number;
  x: number;
  y: number;
}

function part2() {
  const inTest = `2199943210
  3987894921
  9856789892
  8767896789
  9899965678`;

  const numArr = createNumberArray(inTest);

  printNumberArray(numArr);

  const lowestNums = findLowestNumbers(numArr, true) as Array<Position>;
  let res = 0;
  lowestNums.forEach((n) => {
    res++;

    console.log("starting check for the basin in ", n.x, n.y);

    // const sliceForDrawing = [
    //   numArr[n.y > 4 ? n.y - 4 : n.y],
    //   numArr[n.y > 3 ? n.y - 3 : n.y],
    //   numArr[n.y > 2 ? n.y - 2 : n.y],
    //   numArr[n.y > 1 ? n.y - 1 : n.y],
    //   numArr[n.y],
    //   numArr[n.y < numArr.length - 1 ? n.y + 1 : n.y],
    //   numArr[n.y < numArr.length - 2 ? n.y + 1 : n.y],
    //   numArr[n.y < numArr.length - 3 ? n.y + 1 : n.y],
    // ];
    // printNumberArray(sliceForDrawing);
    const basinSize = recursiveBasinCheck(n, numArr, 1, []);
    console.log("Basin:", basinSize);
    res += basinSize.val;
  });
  console.log("result is", res);
}

function recursiveBasinCheck(
  pos: Position,
  numArr: Array<Array<number>>,
  distance: number,
  visitedPoints: Array<Position>,
  dir?: boolean
): { basinPoints: Array<Position>; val: number } {
  console.log(
    `Attempting to check the basin, x: ${pos.x}, y: ${
      pos.y
    }, distance: ${distance}, posVal: ${
      numArr[pos.y] ? numArr[pos.y][pos.x] : undefined
    }`
  );
  if (
    pos.y < 0 ||
    pos.x < 0 ||
    pos.y >= numArr.length ||
    pos.x >= numArr[pos.y].length ||
    numArr[pos.y][pos.x] === 9
  ) {
    return {
      val: distance - 1,
      basinPoints: visitedPoints,
    };
  }

  if (visitedPoints.filter((point) => point.x === pos.x && point.y === pos.y).length > 0) {
    console.log(`We've already visited this point (x: ${pos.x}, y: ${pos.y}), so returning now. Visited points on this branch: ${JSON.stringify(visitedPoints, undefined, 2)}`);
    return {
      val: distance - 1,
      basinPoints: visitedPoints,
    };
  }

  let left = {
    val: 0,
    basinPoints: Array<Position>(),
  };
  let right = {
    val: 0,
    basinPoints: Array<Position>(),
  };
  let up = {
    val: 0,
    basinPoints: Array<Position>(),
  };
  let down = {
    val: 0,
    basinPoints: Array<Position>(),
  };

  let updatedVisitedPoints = [...visitedPoints, {
    x: pos.x,
    y: pos.y,
    val: -1
  }]

  // if (dir === undefined || dir === false) {
    left = recursiveBasinCheck(
      {
        x: pos.x - 1,
        y: pos.y,
        val: -1,
      },
      numArr,
      distance + 1,
      updatedVisitedPoints,
      false
    );
  // }

  // // if (dir === undefined || dir === true) {
    right = recursiveBasinCheck(
      {
        x: pos.x + 1,
        y: pos.y,
        val: -1,
      },
      numArr,
      distance + 1,
      updatedVisitedPoints,
      true
    );
  // // }

  // // if (dir === undefined || dir === false) {
  //   up = recursiveBasinCheck(
  //     {
  //       x: pos.x,
  //       y: pos.y - 1,
  //       val: -1,
  //     },
  //     numArr,
  //     distance + 1,
  //     visitedPoints,
  //     false
  //   );
  // // }

  // // if (dir === undefined || dir === true) {
  //   down = recursiveBasinCheck(
  //     {
  //       x: pos.x,
  //       y: pos.y + 1,
  //       val: -1,
  //     },
  //     numArr,
  //     distance + 1,
  //     visitedPoints,
  //     true
  //   );
  // }

  let mergedPoints = [
    ...left.basinPoints,
    ...right.basinPoints,
    ...up.basinPoints,
    ...down.basinPoints,
  ]
  mergedPoints = [...new Map(mergedPoints.map(v => [JSON.stringify([v.x,v.y]), v])).values()]

  return {
    val: left.val + right.val + up.val + down.val,
    basinPoints: mergedPoints,
  };
}

part2();
