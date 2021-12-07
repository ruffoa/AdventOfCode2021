import { readFileSync, writeFileSync } from "fs";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const input = readFileSync(__dirname + "/input.txt", "utf-8");

function test() {
  const testInput = "16,1,2,0,4,2,7,1,2,14".split(',').map((n) => parseInt(n.trim()));

  let totalPos = 0;
  testInput.forEach((n) => totalPos += n)
  const avg = Math.round(totalPos/testInput.length);

  const sortedInput = new Int32Array(testInput).sort();

  const medianPos = Math.floor((sortedInput.length - 1) / 2);

  const median = sortedInput[medianPos]

  console.log("total: ", totalPos, "avg", avg, "sorted", sortedInput, "median", median, "medianPos", medianPos, "length", sortedInput.length)

  let diffMedian = 0;

  for (const n of sortedInput) {
    diffMedian += Math.abs(n - median);
  }

  console.log("Test result: ", diffMedian);
  console.log("Expected result:", 37)

  console.log("Test 2 -----------");

  let diffAvg = 0;

  for (const n of sortedInput) {
    const steps = Math.abs(n - avg);

    for (let i = 1; i < steps + 1; i++) {
      diffAvg += i;
    }
  }

  console.log("Test result: ", diffAvg);
  console.log("Expected result:", 168)
}

// test();

function part1() {
  const positions = input.split(',').map((n) => parseInt(n.trim()));

  let totalPos = 0;
  positions.forEach((n) => totalPos += n)
  const avg = Math.round(totalPos/positions.length);

  const sortedInput = new Int32Array(positions).sort();

  const medianPos = Math.floor((sortedInput.length - 1) / 2);

  const median = sortedInput[medianPos]

  console.log("total: ", totalPos, "avg", avg, "sorted", sortedInput, "median", median, "medianPos", medianPos, "length", sortedInput.length)

  let diffMedian = 0;

  for (const n of sortedInput) {
    diffMedian += Math.abs(n - median);
  }

  console.log("Result: ", diffMedian);

  console.log("\n-------------------------\nPart 2");

  let minFuel = undefined;
  let bestAvg = 0;

  for (let almostAvg = avg - 5; almostAvg < avg + 6; almostAvg++) {
    let diffAvg = 0;

    for (const n of sortedInput) {
      const steps = Math.abs(n - almostAvg);
      let costToMove = 0;
      for (let i = 1; i < steps + 1; i++) {
        costToMove += i;
      }
  
      diffAvg += costToMove
      // console.log(`Moving ${steps} positions for ${costToMove} fuel. Total fuel spent: ${diffAvg}`)
    }
  
    if (!minFuel || minFuel > diffAvg) {
      minFuel = diffAvg;
      bestAvg = almostAvg
    }
    console.log("Result: ", diffAvg, "Number used", avg - almostAvg);
    if (diffAvg >= 85015849) {
      console.warn("Too high!!");
    }  
  }

  console.log("Result: ", minFuel, "Number used", bestAvg);
}

part1();