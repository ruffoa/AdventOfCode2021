import { readFileSync } from "fs";
import { dirname } from "path"
import { fileURLToPath } from 'url';
import chalk from "chalk";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const input = readFileSync(__dirname + "/input.txt", "utf-8");

function part1() {
  let vals = [];

  const nlines = input.split('\n').length;

  const nChars = input.split('\n')[0].split("").length;
  for (let i = 0; i < nChars; i++) {
    vals.push(0);
  }

  for (const line of input.split('\n')) {
    const charArr = line.split("");
    
    for (let i = 0; i < charArr.length; i++) {
      vals[i] += parseInt(charArr[i]);
    }

    console.log(line, charArr, vals);
  }

  console.log(`\n\nFinal values`);
  console.log(vals)
  let binGamma = vals.map((val) => { 
    const avg = val / nlines;
    console.log(avg)
    if (avg > 0.5) 
      return "1";
    return "0";
  }).join("");

  const gamma = parseInt(binGamma, 2)
  console.log(`Gamma: `, binGamma, gamma);

  let binEpsilon = binGamma.split("").map((bit) => (1 - bit).toString()).join("");
  const epsilon = parseInt(binEpsilon, 2)
  console.log(`Epsilon `, binEpsilon, epsilon);


  console.log(`Result: `, epsilon * gamma )

  console.log('\n\n------------------------------------------------------\n');

  part2(vals);
  // console.log(distance);

  // console.log(`Total distance: ${distance.depth * distance.hor}`);
}

function part2(ogVals) {
  const lines = input.split('\n');
  const nLines = lines.length;

  let o2NVals = ogVals.map((val) => { 
    const avg = val / nLines;
    console.log(avg)
    if (avg > 0.5) 
      return "1";
    return "0";
  });
  let co2NVals = JSON.parse(JSON.stringify(o2NVals));
  console.log('starting', o2NVals);

  let oxygenVals = deepClone(lines);
  let co2Vals = deepClone(lines);

  let o2Match = o2NVals[0];
  let coMatch = 1 - parseInt(o2Match);

  const nChars = input.split('\n')[0].split("").length;

  for (let i = 0; i < nChars; i++) {
    for (let p = 0; p < oxygenVals.length; p++) {
      const charArr = oxygenVals[p].split("");
      
      if (charArr[i] != o2Match) {
        if (oxygenVals.length > 1) {
          oxygenVals[p] = null;
        }
      }
      // console.log(oxygenVals[p], charArr, o2NVals);
    }

    // let numRemaining = co2Vals.length;
    for (let p = 0; p < co2Vals.length; p++) {
      // console.log(co2Vals[p], co2NVals, p, co2Vals);
      const charArr = co2Vals[p].split("");
      
      if (charArr[i] != coMatch) {
        if (co2Vals.length > 1) {
          // numRemaining--;
          co2Vals[p] = null;
        } else {
          console.log("We are done with CO2, there is only 1 val left!", co2Vals);
        }
      }
      // console.log(line, charArr, vals);
    }

    oxygenVals = oxygenVals.filter((val) => val);
    co2Vals = co2Vals.filter((val) => val);

    let o2Zeroes = 0;
    let co2Zeroes = 0;

    let o2Ones = 0;
    let co2Ones = 0;

    // determine most common bits
    for (const val of oxygenVals) {
      const charArr = val.split("");

      if (charArr[i+1] == 0) {
        o2Zeroes ++;
      } else {
        o2Ones ++;
      }
    }

    for (const val of co2Vals) {
      const charArr = val.split("");

      if (charArr[i+1] == 0) {
        co2Zeroes ++;
      } else {
        co2Ones ++;
      }
    }

    o2Match = o2Ones >= o2Zeroes ? 1 : 0;
    coMatch = co2Ones >= co2Zeroes ? 0 : 1;

    console.log(`o2`, oxygenVals.length, `co2`, co2Vals.length, 'next char #', i + 1, `o2 next: `, o2Match, `co2 next`, coMatch, `o2 vals`, oxygenVals.map((val) => {
      return val.split("").map((ch, n) => n == (i+1) ? ` ${ch} ` : ch).join('')
    }),
    `co2 vals`, co2Vals.map((val) => {
      return val.split("").map((ch, n) => n == (i+1) ? ` ${ch} ` : ch).join('')
    }));
  }

  console.log("O2 Vals")
  console.log(oxygenVals)
  
  console.log("\nC02 Vals")
  console.log(co2Vals)

  const o2 = parseInt(Array.from(oxygenVals)[0].toString(), 2);
  const c02 = parseInt(Array.from(co2Vals)[0].toString(), 2);

  console.log(`o2`, o2, `co2`, c02, `res`, c02 * o2);
}

function deepClone(input) {
  return JSON.parse(JSON.stringify(input));
}

part1();

