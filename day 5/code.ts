import { readFileSync, writeFileSync } from "fs";
import { dirname } from "path";
import { fileURLToPath } from "url";
import chalk from "chalk";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const input = readFileSync(__dirname + "/input.txt", "utf-8");

interface Coordinates {
  x: number;
  y: number;
}

interface Line {
  start: Coordinates;
  end: Coordinates;
}

function part1() {
  let numbers = [];

  const lines = input.split("\n");
  // const parts = lines[0].split("->").map((s) => s.trim());
  // console.log(parts)

  let coordinates: Array<Line> = [];

  for (const inLine of lines) {
    const parts = inLine.split("->").map((s) => s.trim());

    let coords = [];

    for (const part of parts) {
      const lineCoords = part.split(",").map((p) => parseInt(p.trim()));

      for (const coordinate of lineCoords) {
        coords.push(coordinate);
      }
    }

    const line: Line = {
      start: {
        x: coords[0],
        y: coords[1],
      },
      end: {
        x: coords[2],
        y: coords[3],
      },
    };
    coordinates.push(line);
  }

  console.log(`Number of lines found: ${coordinates.length}`);

  // filter out any lines which are not horizontal or vertical
  const straightLines = coordinates.filter(
    (coordinate) =>
      coordinate.start.x === coordinate.end.x ||
      coordinate.start.y === coordinate.end.y
  );

  console.log(`Number of straight lines found: ${straightLines.length}`);
  console.log(straightLines);

  const overlaps = checkLines(straightLines);
  console.log(`Overlapping points: ${overlaps}`);

  // previous guesses
  const wrongAnswers = [{ val: 7638, high: true }];
  checkAnswer(wrongAnswers, overlaps);

  drawBoard(straightLines);

  console.log(
    "\n--------------------------------------------------------\nPart 2"
  );
  const res = checkLines(coordinates, true);
  console.log(`Part 2: Overlapping points: ${res}`);

  // previous guesses
  const part2WrongAnswers = [{ val: 21389, high: false }];
  checkAnswer(part2WrongAnswers, res);
}

function pointToString(point: Coordinates) {
  return `x${point.x}y${point.y}`;
}

function checkAnswer(
  wrongAnswers: Array<{ val: number; high: boolean }>,
  result: number
) {
  for (const answer of wrongAnswers) {
    if (answer.val === result) {
      console.warn("This is a known wrong answer! ⚠️");
      return;
    }

    if (answer.high && result > answer.val) {
      console.error(
        `Got ${result}, but we know it's not greater than ${answer.val} ⚠️`
      );
      return;
    } else if (!answer.high && result < answer.val) {
      console.error(
        `Got ${result}, but we know it's not less than ${answer.val} ⚠️`
      );
      return;
    }
  }
}

function checkLines(lines: Line[], allowDiagonal: boolean = false): number {
  let geysers = new Set<string>();
  let alreadyFound = new Set<string>();
  let overlaps = 0;

  for (const line of lines) {
    console.log(
      line.start.x !== line.end.x ? "horizontal line" : "vertical line",
      line
    );
    if (line.start.x !== line.end.x && line.start.y === line.end.y) {
      // deal with horizontal lines;
      const direction = line.start.x < line.end.x ? 1 : -1;

      console.log(
        "direction",
        direction,
        "start",
        line.start.x,
        "end",
        line.end.x,
        "diff",
        line.end.x - line.start.x
      );
      for (let i = line.start.x; i !== line.end.x + direction; i += direction) {
        // console.log("currentPos - x:", i, "y", line.start.y, "y2", line.end.y)
        const point = {
          x: i,
          y: line.start.y,
        };
        const stringPoint = pointToString(point);

        if (geysers.has(stringPoint)) {
          if (!alreadyFound.has(stringPoint)) {
            overlaps++;
            alreadyFound.add(stringPoint);
            // console.log(
            //   "This is the second find, adding it so we don't double count this point!"
            // );
          }
        } else {
          geysers.add(stringPoint);
        }
      }
    } else if (line.start.y !== line.end.y && line.start.x === line.end.x) {
      // deal with horizontal lines;
      const direction = line.start.y < line.end.y ? 1 : -1;

      for (let i = line.start.y; i !== line.end.y + direction; i += direction) {
        const point = {
          x: line.start.x,
          y: i,
        };
        const stringPoint = pointToString(point);

        if (geysers.has(stringPoint)) {
          if (!alreadyFound.has(stringPoint)) {
            overlaps++;
            alreadyFound.add(stringPoint);
            // console.log(
            //   "This is the second find, adding it so we don't double count this point!"
            // );
          }
        } else {
          geysers.add(stringPoint);
        }
      }
    } else if (allowDiagonal) {
      console.log("Handling a diagonal line!", line);

      const xDir = line.start.x < line.end.x ? 1 : -1;
      const yDir = line.start.y < line.end.y ? 1 : -1;
      const distance = Math.abs(line.start.y - line.end.y);
      
      console.log("Handling a diagonal line!", line, "distance", distance, "xDir", xDir, "yDir", yDir);

      for (let i = 0; i < (distance + 1); i++) {
        const point = {
          x: line.start.x + i * xDir,
          y: line.start.y + i * yDir,
        };
        console.log(point, i)
        const stringPoint = pointToString(point);

        if (geysers.has(stringPoint)) {
          if (!alreadyFound.has(stringPoint)) {
            overlaps++;
            alreadyFound.add(stringPoint);
            // console.log(
            //   "This is the second find, adding it so we don't double count this point!"
            // );
          }
        } else {
          geysers.add(stringPoint);
        }
      }

      // throw new Error("FOOO")
    }

    // console.log(geysers)
  }

  return overlaps;
}

function drawBoard(lines: Line[]) {
  const minX = 0;
  let maxX = 0;

  const minY = 0;
  let maxY = 0;

  let points = {
    x: [],
    y: [],
  };

  for (const line of lines) {
    if (line.start.x !== line.end.x) {
      // deal with horizontal lines;
      const direction = line.start.x < line.end.x ? 1 : -1;

      const highestX = direction === 1 ? line.end.x : line.start.x;
      if (highestX > maxX) {
        maxX = highestX;
      }
    } else {
      // deal with horizontal lines;
      const direction = line.start.y < line.end.y ? 1 : -1;
      const highestY = direction === 1 ? line.end.y : line.start.y;
      if (highestY > maxY) {
        maxY = highestY;
      }
    }
  }

  let output = "";

  for (let x = minX; x < maxX; x++) {
    let line = "";

    for (let y = minY; y < maxY; y++) {
      line += ". ";
    }
    output += line + "\n";
  }
  writeFileSync(__dirname + "/output.txt", output);
}

part1();
