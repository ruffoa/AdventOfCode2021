import { readFileSync, writeFileSync } from "fs";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const input = readFileSync(__dirname + "/input.txt", "utf-8");

const specialNumDigits = [2, 3, 4, 7];
let mapDigits = {
  2: 1,
  3: 7,
  4: 4,
  7: 8,
};

//  dddd
// e    a
// e    a
//  ffff
// g    b
// g    b
//  cccc
//
// where d=1, e=2, a=3, f=4, g=5, b=6, c=7
let mapSegmentsToDigits: { [num: number]: Array<number> } = {
  0: [1, 2, 3, 5, 6, 7],
  1: [3, 6],
  2: [1, 3, 4, 5, 7],
  3: [1, 3, 4, 6, 7],
  4: [2, 3, 4, 6],
  5: [1, 2, 4, 6, 7],
  6: [1, 2, 4, 5, 6, 7],
  7: [1, 3, 6],
  8: [1, 2, 3, 4, 5, 6, 7],
  9: [1, 2, 3, 4, 6, 7],
};

function test() {
  // const ex = `be cfbegad cbdgef fgaecd cgeb fdcge agebfd fecdb fabcd edb | fdgacbe cefdb cefbgd gcbe
  // edbfga begcd cbg gc gcadebf fbgde acbgfd abcde gfcbed gfec | fcgedb cgb dgebacf gc
  // fgaebd cg bdaec gdafb agbcfd gdcbef bgcad gfac gcb cdgabef | cg cg fdcagb cbg
  // fbegcd cbd adcefb dageb afcb bc aefdc ecdab fgdeca fcdbega | efabcd cedba gadfec cb
  // aecbfdg fbg gf bafeg dbefa fcge gcbea fcaegb dgceab fcbdga | gecf egdcabf bgf bfgea
  // fgeab ca afcebg bdacfeg cfaedg gcfdb baec bfadeg bafgc acf | gebdcfa ecba ca fadegcb
  // dbcfg fgd bdegcaf fgec aegbdf ecdfab fbedc dacgb gdcebf gf | cefg dcbef fcge gbcadfe
  // bdfegc cbegaf gecbf dfcage bdacg ed bedf ced adcbefg gebcd | ed bcgafe cdgba cbgef
  // egadfb cdbfeg cegd fecab cgb gbdefca cg fgcdab egfdb bfceg | gbdfcae bgc cg cgb
  // gcafb gcf dcaebfg ecagb gf abcdeg gaef cafbge fdbac fegbdc | fgae cfgab fg bagce
  // acedgfb cdfbe gcdfa fbcad dab cefabd cdfgeb eafb cagedb ab | cdfeb fcadb cdfeb cdbaf`;

  // const lines = ex.split("\n").map((l) => l.trim());
  const lines = input.split("\n").map((l) => l.trim());

  let countSpecialNums = 0;
  let total = 0;

  for (const line of lines) {
    const inPatterns = line.split("|")[0].trim().split(" ");
    const response = line.split("|")[1].trim().split(" ");
    let segmentMap: { [num: number]: Array<string> } = {
      1: [],
      2: [],
      3: [],
      4: [],
      5: [],
      6: [],
      7: [],
    };

    let isKnown: { [num: number]: boolean } = {
      1: false,
      2: false,
      3: false,
      4: false,
      5: false,
      6: false,
      7: false,
    };

    console.log("Attempting to match digits");

    for (const num of specialNumDigits) {
      const pattern = inPatterns.filter((p) => p.length === num)[0];
      // @ts-ignore
      const number = mapDigits[num];

      // @ts-ignore
      const segmentsUsed: Array<number> = mapSegmentsToDigits[number];
      console.log(
        `Pattern for ${number} is ${pattern} | Segments used: ${segmentsUsed}`
      );
      for (const segment of segmentsUsed) {
        if (!isKnown[segment]) {
          segmentMap[segment].push(pattern);
        }
      }

      if (number === 7) {
        // figure out which segment coresponds to the top, since we should know what the right sides are
        console.log(
          "At '7'",
          segmentMap,
          "segments used",
          mapSegmentsToDigits[7]
        );

        let diffSegment: Array<string> = [];
        for (const segment of mapSegmentsToDigits[7]) {
          let letters = segmentMap[segment];
          if (letters.length > 1) {
            diffSegment = letters;
            break;
          }
        }

        const res = filterOutChars(diffSegment[0], diffSegment[1]);
        console.log(res);
        segmentMap[1] = [res];
        isKnown[1] = true;

        // clean up the segments for `1`
        for (const segment of mapSegmentsToDigits[7]) {
          if (!isKnown[segment]) {
            segmentMap[segment] = segmentMap[segment].filter(
              (s) => !s.includes(segmentMap[1][0])
            );

            console.log(
              `Cleaning up`,
              segmentMap[segment],
              segmentMap[segment].filter((s) => !s.includes(segmentMap[1][0])),
              segment
            );
          }
        }
      } else if (number === 4) {
        console.log(
          "At '4'",
          segmentMap,
          "segments used",
          mapSegmentsToDigits[4]
        );

        let diffSegment: Array<string> = [];
        for (const segment of mapSegmentsToDigits[number]) {
          let letters = segmentMap[segment];
          if (letters.length > 1) {
            diffSegment = letters;
            break;
          }
        }

        const res = filterOutChars(diffSegment[0], diffSegment[1]);
        console.log(res);
        segmentMap[2] = [res];
        segmentMap[4] = [res];

        // clean up
        for (const segment of mapSegmentsToDigits[4]) {
          if (!isKnown[segment]) {
            segmentMap[segment] = segmentMap[segment].filter(
              (s) => s !== pattern
            );

            console.log(
              `Cleaning up`,
              segmentMap[segment],
              segmentMap[segment].filter((s) => !s.includes(segmentMap[1][0])),
              segment
            );
          }
        }
      } else if (number === 8) {
        console.log(
          "At '8'",
          segmentMap,
          "segments used",
          mapSegmentsToDigits[8]
        );

        let res = pattern;
        for (const segment of mapSegmentsToDigits[number]) {
          let letters = segmentMap[segment];
          if (letters.length > 1 || isKnown[segment]) {
            res = filterOutChars(letters[0], res);
            console.log("letters", letters, "res", res);
          }
        }

        console.log(res);
        segmentMap[5] = [res];
        segmentMap[7] = [res];

        // clean up
        for (const segment of mapSegmentsToDigits[8]) {
          if (!isKnown[segment]) {
            segmentMap[segment] = segmentMap[segment].filter(
              (s) => s !== pattern
            );

            console.log(
              `Cleaning up`,
              segmentMap[segment],
              segmentMap[segment].filter((s) => !s.includes(segmentMap[1][0])),
              segment
            );
          }
        }
      }
    }

    console.log("At '9'", segmentMap);
    // find `9` which is 4 + 1 on the display!
    for (const pattern of inPatterns) {
      if (specialNumDigits.includes(pattern.length) || pattern.length !== 6) {
        continue;
      }
      const num4 = inPatterns.filter((p) => p.length === 4)[0];
      const num7 = inPatterns.filter((p) => p.length === 3)[0];
      console.log(num7, num4, pattern);
      let res = removeChars(pattern, num4);
      console.log(`pattern`, pattern, `Leftover`, res, "4", num4, "7", num7);
      res = removeChars(res, num7);
      console.log(`pattern`, pattern, `Leftover2`, res);

      if (res.length === 1) {
        isKnown[7] = true;
        segmentMap[7] = [res];

        // fix #8
        for (let i = 1; i < 8; i++) {
          if (!isKnown[i]) {
            console.log(segmentMap[i], i);
            if (segmentMap[i][0].includes(res)) {
              segmentMap[i][0] = removeChars(segmentMap[i][0], res);
              if (segmentMap[i][0].length === 1) {
                isKnown[i] = true;
              }
            }
          }
        }

        break;
      }
    }

    console.log("At '6'", segmentMap);
    // find `6` which is 4 + 1 on the display!
    for (const pattern of inPatterns) {
      if (specialNumDigits.includes(pattern.length) || pattern.length !== 6) {
        continue;
      }
      const num4 = inPatterns.filter((p) => p.length === 4)[0];
      const num7 = inPatterns.filter((p) => p.length === 3)[0];
      console.log(num7, num4, pattern);
      let res = removeChars(pattern, num4);
      // console.log(`pattern`, pattern, `Leftover`, res, "4", num4, "7", num7);
      res = removeChars(res, num7);
      // console.log(`pattern`, pattern, `Leftover2`, res);

      if (res.length === 1) {
        isKnown[7] = true;
        segmentMap[7] = [res];
      }

      // fix #8
      for (let i = 1; i < 8; i++) {
        if (!isKnown[i]) {
          console.log(segmentMap[i], i);
          if (segmentMap[i][0].includes(res)) {
            segmentMap[i][0] = removeChars(segmentMap[i][0], res);
            if (segmentMap[i][0].length === 1) {
              isKnown[i] = true;
            }
          }
        }
      }
    }

    // find `3` to figure out the middle segment
    console.log("Trying to find 3", segmentMap);

    for (const pattern of inPatterns) {
      if (specialNumDigits.includes(pattern.length) || pattern.length !== 5) {
        continue;
      }
      const num1 = inPatterns.filter((p) => p.length === 2)[0];
      console.log(num1, pattern);
      let res = removeChars(pattern, num1);

      // now if we remove the known ones, we should be left with just the middle character
      for (let i = 1; i < 8; i++) {
        if (isKnown[i]) {
          res = removeChars(res, segmentMap[i][0]);
        }
      }

      if (res.length === 1) {
        isKnown[4] = true;
        segmentMap[4] = [res];

        // console.log(`found it!`, pattern, `Leftover2`, res);

        // fix
        for (let i = 1; i < 8; i++) {
          if (!isKnown[i]) {
            console.log(segmentMap[i], i);
            if (segmentMap[i][0].includes(res)) {
              segmentMap[i][0] = removeChars(segmentMap[i][0], res);
              if (segmentMap[i][0].length === 1) {
                isKnown[i] = true;
              }
            }
          }
        }
        break;
      }
    }

    // find `5` to figure out the digits of `1`
    console.log("Trying to find 5", segmentMap);
    // console.log(`known`, isKnown)
    for (const pattern of inPatterns) {
      if (specialNumDigits.includes(pattern.length) || pattern.length !== 6) {
        continue;
      }

      let res = pattern;
      const num1 = inPatterns.filter((p) => p.length === 2)[0];

      for (const segment of mapSegmentsToDigits[5]) {
        if (!isKnown[segment]) {
          continue;
        }
        // console.log(`before: res`, res, segmentMap[segment][0], segment);
        res = removeChars(res, segmentMap[segment][0]);
        // console.log(`res`, res, segmentMap[segment][0]);
      }
      // console.log(`pattern`, pattern, `Leftover`, res);

      res = removeChars(num1, res);

      if (res.length === 1 && num1.includes(res)) {
        isKnown[3] = true;
        segmentMap[3] = [res];

        // fix #1
        for (let i = 1; i < 8; i++) {
          if (!isKnown[i]) {
            console.log(segmentMap[i], i);
            if (segmentMap[i][0].includes(res)) {
              segmentMap[i][0] = removeChars(segmentMap[i][0], res);
              isKnown[i] = true;
            }
          }
        }
        break;
      }
    }

    console.log("After finding special numbers: ", segmentMap);
    drawSegmentDisplay(segmentMap);

    let lookupSegment: { [char: string]: number } = {};

    for (let i = 1; i < 8; i++) {
      lookupSegment[segmentMap[i][0]] = i;
    }

    let outputNumber = "";
    console.log("Line: ", line, "response:", response);

    for (const num of response) {
      if (specialNumDigits.includes(num.length)) {
        console
          .log
          // @ts-ignore
          // `Found a special num: ${num}, which is ${mapDigits[num.length] ?? ""}`
          ();
        countSpecialNums++;
        // @ts-ignore
        outputNumber += mapDigits[num.length].toString();
      } else {
        outputNumber += convertToNumber(lookupSegment, num).toString();
      }
    }

    console.log(`The response should be: '${outputNumber}'`);
    total += parseInt(outputNumber);
  }

  console.log(`Res: ${countSpecialNums}`);
  console.log(`Total value: ${total}`)
}

function convertToNumber(
  lookupSegment: { [char: string]: number },
  num: string
): number {
  const segments: Array<number> = [];

  for (const char of num.split("")) {
    segments.push(lookupSegment[char]);
  }

  let segString = segments
    .filter((s) => s !== undefined)
    .sort()
    .toString();

  // console.log("found segments: ", segments, "for", num);

  for (let i = 0; i < 10; i++) {
    // console.log(`lookup`, mapSegmentsToDigits[i].sort().toString(), " | ", segString)
    if (mapSegmentsToDigits[i].sort().toString() === segString) {
      return i;
    }
  }

  throw new Error(
    `Could not find any number matching segments '${segString}': ${JSON.stringify(
      mapSegmentsToDigits,
      undefined,
      2
    )}`
  );
}

function removeChars(pattern: string, str1: string): string {
  let res = pattern;

  for (const char of str1.split("")) {
    res = res.replace(char, "");
  }

  return res;
}

function filterOutChars(str1: string, str2: string): string {
  let longerSeg = str1.length > str2.length ? str1 : str2;
  const shorterSeg = str1.length > str2.length ? str2 : str1;

  for (const char of shorterSeg.split("")) {
    longerSeg = longerSeg.replace(char, "");
  }

  return longerSeg;
}

function drawSegmentDisplay(segmentMap: { [num: number]: Array<string> }) {
  console.log(
    `\n${segmentMap[1]}${segmentMap[1]}${segmentMap[1]}${segmentMap[1]}${segmentMap[1]}`
  );
  console.log(`${segmentMap[2]}   ${segmentMap[3]}`);
  console.log(
    `${segmentMap[4]}${segmentMap[4]}${segmentMap[4]}${segmentMap[4]}${segmentMap[4]}`
  );
  console.log(`${segmentMap[5]}   ${segmentMap[6]}`);
  console.log(
    `${segmentMap[7]}${segmentMap[7]}${segmentMap[7]}${segmentMap[7]}${segmentMap[7]}${segmentMap[7]}\n`
  );
}

test();

function part1() {
  const lines = input.split("\n").map((l) => l.trim());

  let countSpecialNums = 0;

  for (const line of lines) {
    const response = line.split("|")[1].trim().split(" ");

    // console.log("Line: ", line, "response:", response)
    for (const num of response) {
      if (specialNumDigits.includes(num.length)) {
        // @ts-ignore
        // console.log(`Found a special num: ${num}, which is ${mapDigits[num.length] ?? ""}`);
        countSpecialNums++;
      }
    }
  }

  console.log(`Res: ${countSpecialNums}`);
}
// part1();
