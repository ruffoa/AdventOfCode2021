import { readFileSync, writeFileSync } from "fs";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const input = readFileSync(__dirname + "/input.txt", "utf-8");

const mapOpenToClose = {
  "(": ")",
  "{": "}",
  "[": "]",
  "<": ">",
};

const scoreMap = {
  ")": 3,
  "]": 57,
  "}": 1197,
  ">": 25137,
};

const scoreMap2 = {
  ")": 1,
  "]": 2,
  "}": 3,
  ">": 4,
};

function test() {
  const inTest = `[({(<(())[]>[[{[]{<()<>>
    [(()[<>])]({[<{<<[]>>(
    {([(<{}[<>[]}>{[]{[(<()>
    (((({<>}<{<{<>}{[]{[]{}
    [[<[([]))<([[{}[[()]]]
    [{[{({}]{}}([{[{{{}}([]
    {<[[]]>}<{[{[{[]{()[[[]
    [<(<(<(<{}))><([]([]()
    <{([([[(<>()){}]>(<<{{
    <{([{{}}[<[[[<>{}]]]>[]]`;

  const lines = inTest.split("\n").map((l) => l.trim());

  let expectedClosing = [];
  let score = 0;

  for (const line of lines) {
    const chars = line.split("");

    for (const char of chars) {
      // @ts-ignore
      const closingChar = mapOpenToClose[char] || null;

      if (closingChar) {
        expectedClosing.push(closingChar);
      } else {
        const expectedChar = expectedClosing.pop();
        if (expectedChar !== char) {
          console.log(
            `Corrupted line found: expected '${expectedChar}', but got '${char}'`
          );

          // @ts-ignore
          score += scoreMap[char] || 0;
        }
      }
    }
  }

  console.log(`Overall Score: ${score}`);
}

// test();

function test2() {
  const inTest = `[({(<(())[]>[[{[]{<()<>>
    [(()[<>])]({[<{<<[]>>(
    {([(<{}[<>[]}>{[]{[(<()>
    (((({<>}<{<{<>}{[]{[]{}
    [[<[([]))<([[{}[[()]]]
    [{[{({}]{}}([{[{{{}}([]
    {<[[]]>}<{[{[{[]{()[[[]
    [<(<(<(<{}))><([]([]()
    <{([([[(<>()){}]>(<<{{
    <{([{{}}[<[[[<>{}]]]>[]]`;

  const lines = inTest.split("\n").map((l) => l.trim());

  for (const line of lines) {
    const chars = line.split("");

    let expectedClosing = [];

    let score = 0;
    let skip = false;

    for (const char of chars) {
      // @ts-ignore
      const closingChar = mapOpenToClose[char] || null;

      if (closingChar) {
        expectedClosing.push(closingChar);
      } else {
        const expectedChar = expectedClosing.pop();
        if (expectedChar !== char) {
          console.log(
            `Corrupted line found: expected '${expectedChar}', but got '${char}'. Skipping line...`
          );
          skip = true;
          continue;
        }
      }
    }

    if (skip) {
      continue;
    }

    console.log("Expected closing brackets: ", expectedClosing);

    while (expectedClosing.length > 0) {
      score *= 5;

      // @ts-ignore
      score += scoreMap2[expectedClosing.pop()] || 0;
    }
    console.log(`Score: ${score}`);
  }
}

// test2();

function part1() {
  const lines = input.split("\n").map((l) => l.trim());

  let expectedClosing = [];
  let score = 0;

  for (const line of lines) {
    const chars = line.split("");

    for (const char of chars) {
      // @ts-ignore
      const closingChar = mapOpenToClose[char] || null;

      if (closingChar) {
        expectedClosing.push(closingChar);
      } else {
        const expectedChar = expectedClosing.pop();
        if (expectedChar !== char) {
          console.log(
            `Corrupted line found: expected '${expectedChar}', but got '${char}'`
          );

          // @ts-ignore
          score += scoreMap[char] || 0;
        }
      }
    }
  }

  console.log(`Overall Score: ${score}`);
}

// part1();

function part2() {
  const lines = input.split("\n").map((l) => l.trim());

  let scores = [];

  for (const line of lines) {
    const chars = line.split("");

    let expectedClosing = [];

    let score = 0;
    let skip = false;

    for (const char of chars) {
      // @ts-ignore
      const closingChar = mapOpenToClose[char] || null;

      if (closingChar) {
        expectedClosing.push(closingChar);
      } else {
        const expectedChar = expectedClosing.pop();
        if (expectedChar !== char) {
          console.log(
            `Corrupted line found: expected '${expectedChar}', but got '${char}'. Skipping line...`
          );
          skip = true;
          continue;
        }
      }
    }

    if (skip) {
      continue;
    }

    console.log("Expected closing brackets: ", expectedClosing);

    while (expectedClosing.length > 0) {
      score *= 5;

      // @ts-ignore
      score += scoreMap2[expectedClosing.pop()] || 0;
    }
    console.log(`Score: ${score}`);
    scores.push(score);
  }

  scores = scores.sort((a, b) => a - b);
  console.log(scores);

  const median = (scores.length - 1) / 2;

  console.log("Median score: ", scores[median], "median:", median, "length:", scores.length, (scores.length - 1) / 2);
}

part2();