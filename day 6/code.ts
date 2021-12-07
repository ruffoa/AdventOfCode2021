import { readFileSync, writeFileSync } from "fs";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const input = readFileSync(__dirname + "/input.txt", "utf-8");

function part1() {
  const spanVal = 8;
  const birthVal = 6;

  const maxDays = 80;

  let fish = input.split(",").map((f) => parseInt(f.trim()));

  for (let i = 1; i < maxDays + 1; i++) {
    let newFish = [];
    for (let f = 0; f < fish.length; f++) {
      if (fish[f] <= 0) {
        newFish.push(spanVal);
        fish[f] = birthVal;
      } else {
        fish[f]--;
      }
    }

    fish.push(...newFish);
    console.log(`Day ${i}, number of fish: ${fish.length}`);
  }

  // `316695` is too low!
  console.log(`After 80 days, number of fish = `, fish.length);

  if (fish.length <= 316695) {
    console.error("Too low!!");
  }
}

// part1();

function part2() {
  const spanVal = 8;
  const birthVal = 6;

  const maxDays = 256;
  const fishPerLine = 1000000; // 1mil

  let startingFish = input.split(",").map((f) => parseInt(f.trim()));
  let fish = new Uint8Array(startingFish);

  for (let i = 1; i < maxDays + 1; i++) {
    let newFish = [];
    for (let page = 0; page < fish.length / fishPerLine; page++) {
      for (let f = 0; f < fish.length; f++) {
        if (fish[f] <= 0) {
          newFish.push(spanVal);
          fish[f] = birthVal;
        } else {
          fish[f]--;
        }
      }

      fish = concatenate(Uint8Array, fish, new Uint8Array(newFish));
      console.log(`Day ${i}, number of fish: ${fish.length}`);
    }
  }

  // `316695` is too low!
  console.log(`After 80 days, number of fish = `, fish.length);

  if (fish.length <= 316695) {
    console.error("Too low!!");
  }
}

function concatenate(resultConstructor: Uint8ArrayConstructor, ...arrays: Uint8Array[]) {
  let totalLength = 0;
  for (const arr of arrays) {
    totalLength += arr.length;
  }
  const result = new resultConstructor(totalLength);
  let offset = 0;
  for (const arr of arrays) {
    result.set(arr, offset);
    offset += arr.length;
  }
  return result;
}

// part2();

function part2v2() {
  const spanVal = 8;
  const birthVal = 6;

  const maxDays = 256;
  let nFish = 0;

  let fish: Array<{
    num: number;
  }> = Array(10);

  for (let i = 0; i < fish.length; i++) {
    // init array
    fish[i] = { num: 0 };
  }

  let startingFish = input.split(",").map((f) => parseInt(f.trim()));
  for (const f of startingFish) {
    fish[f + 1].num++;
  }

  console.log(fish)

  for (let i = 0; i < maxDays + 1; i++) {
    for (let f = 0; f < fish.length; f++) {
      if (f == 0) {
        fish[spanVal + 1].num += fish[f].num;
        fish[birthVal + 1].num += fish[f].num;
        fish[f].num = 0;
      } else {
        fish[f - 1].num = fish[f].num;
        fish[f].num = 0;
      }
    }

    console.log(i, fish)

    nFish = 0
    fish.forEach((f) => nFish += f.num)
    console.log(`Day ${i}, number of fish: ${nFish}`);

    if (i === 2 && nFish !== 381) {
      throw new Error(`Something is wrong, we know at 2 days it's 381, but we got ${nFish}!`)
    } 
    if (i === 10 && nFish !== 727) {
      throw new Error(`Something is wrong, we know at 10 days it's 727, but we got ${nFish}!`)
    }
    if (i === 20 && nFish !== 1955) {
      throw new Error(`Something is wrong, we know at 20 days it's 1955, but we got ${nFish}!`)
    }
    if (i === 30 && nFish !== 4558) {
      throw new Error(`Something is wrong, we know at 30 days it's 4558, but we got ${nFish}!`)
    }
    if (i === 40 && nFish !== 10372) {
      throw new Error(`Something is wrong, we know at 40 days it's 10372, but we got ${nFish}!`)
    }
    if (i === 175 && nFish !== 1364038164) {
      throw new Error(`Something is wrong, we know at 175 days it's 1364038164, but we got ${nFish}!`)
    }
  }

  // `316695` is too low!
  console.log(`After ${maxDays} days, number of fish = `, nFish);

  if (fish.length <= 316695) {
    console.error("Too low!!");
  }
}

part2v2();


// Day 1, number of fish: 300
// Day 2, number of fish: 381
// Day 3, number of fish: 427
// Day 4, number of fish: 487
// Day 5, number of fish: 550
// Day 6, number of fish: 600
// Day 7, number of fish: 600
// Day 8, number of fish: 600
// Day 9, number of fish: 681
// Day 10, number of fish: 727
// Day 11, number of fish: 868 
// Day 12, number of fish: 977
// Day 13, number of fish: 1087
// Day 14, number of fish: 1150
// Day 15, number of fish: 1200
// Day 16, number of fish: 1281
// Day 17, number of fish: 1327
// Day 18, number of fish: 1549
// Day 19, number of fish: 1704
// Day 20, number of fish: 1955
// Day 21, number of fish: 2127
// Day 22, number of fish: 2287
// Day 23, number of fish: 2431
// Day 24, number of fish: 2527
// Day 25, number of fish: 2830
// Day 26, number of fish: 3031
// Day 27, number of fish: 3504
// Day 28, number of fish: 3831
// Day 29, number of fish: 4242
// Day 30, number of fish: 4558
// Day 31, number of fish: 4814

// Day 1, number of fish: 300
// Day 2, number of fish: 381
// Day 3, number of fish: 427
// Day 4, number of fish: 487
// Day 5, number of fish: 550
// Day 6, number of fish: 600
// Day 7, number of fish: 600
// Day 8, number of fish: 681
// Day 9, number of fish: 727
// Day 10, number of fish: 868