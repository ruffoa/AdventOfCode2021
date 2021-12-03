import { readFileSync } from "fs";
import { dirname } from "path"
import { fileURLToPath } from 'url';

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
  let co2NVals = o2NVals;

  let oxygenVals = new Set(lines);
  let co2Vals = new Set(lines);

  const nChars = input.split('\n')[0].split("").length;

  for (let i = 0; i < nChars; i++) {
    for (const line of input.split('\n')) {
      const charArr = line.split("");
      
      if (charArr[i] != o2NVals[i]) {
        if (oxygenVals.size > 1) {
          oxygenVals.delete(line);
        }
      } 
      if (charArr[i] == co2NVals[i] && co2Vals.size > 1) {
          co2Vals.delete(line);
      }
      // console.log(line, charArr, vals);
    }

    // determine most common bits
    for (let i = 0; i < nChars; i++) {
      o2NVals[i] = 0;
      co2NVals[i] = 0;
    }
  
    for (const val of Array.from(oxygenVals)) {
      const charArr = val.split("");

      for (let i = 0; i < charArr.length; i++) {
        o2NVals[i] += parseInt(charArr[i]);
      } 
    }

    for (const val of Array.from(co2Vals)) {
      const charArr = val.split("");

      for (let i = 0; i < charArr.length; i++) {
        co2NVals[i] += parseInt(charArr[i]);
      } 
    }

    console.log(`DEBUG`, o2NVals, co2NVals, oxygenVals, co2Vals, oxygenVals.size, co2Vals.size)
    o2NVals = o2NVals.map((val) => { 
      const avg = val / oxygenVals.size;
      if (avg >= 0.5) 
        return "1";
      return "0";
    });

    co2NVals = co2NVals.map((val) => { 
      const avg = val / co2Vals.size;
      if (avg > 0.5) 
        return "1";
      return "0";
    });
  
    console.log(`o2`, oxygenVals, `co2`, co2Vals, i, `o2 avg: `, o2NVals[i], `co2 avg`, co2NVals[i]);
  }

  console.log("O2 Vals")
  console.log(oxygenVals)
  
  console.log("\nC02 Vals")
  console.log(co2Vals)

  const o2 = parseInt(Array.from(oxygenVals)[0].toString(), 2);
  const c02 = parseInt(Array.from(co2Vals)[0].toString(), 2);

  console.log(`o2`, o2, `co2`, c02, `res`, c02 * o2);
}

part1();
