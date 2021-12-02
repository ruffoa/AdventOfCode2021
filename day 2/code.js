import { readFileSync } from "fs";
import { dirname } from "path"
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const input = readFileSync(__dirname + "/input.txt", "utf-8");

function part1() {
  let distance = {
    hor: 0,
    depth: 0,
  };

  for (const line of input.split('\n')) {
    const parts = line.split(' ');
    const value =  parseInt(parts[1]);
    
    switch(parts[0]) {
      case "forward":
        distance.hor += value;
        break;
      case "up":
        distance.depth -= value;
        break;
      case "down": 
        distance.depth += value;
        break;
      default:
        throw new Error(`Oh no! Distance: ${JSON.stringify(distance)} Dir: ${parts[0]} Val: ${value}`)
    }

    console.log(line, parts, value, distance);
  }

  console.log(distance);

  console.log(`Total distance: ${distance.depth * distance.hor}`);
}

// part1();

// In addition to horizontal position and depth, you'll also need to track a third value, aim, which also starts at 0. The commands 
// also mean something entirely different than you first thought:

// down X increases your aim by X units.
// up X decreases your aim by X units.
// forward X does two things:
// It increases your horizontal position by X units.
// It increases your depth by your aim multiplied by X.

function part2() {
  let distance = {
    hor: 0,
    depth: 0,
    aim: 0,
  };

  for (const line of input.split('\n')) {
    const parts = line.split(' ');
    const value =  parseInt(parts[1]);
    
    switch(parts[0]) {
      case "forward":
        distance.hor += value;
        distance.depth += (distance.aim * value);
        break;
      case "up":
        distance.aim -= value;
        break;
      case "down": 
        distance.aim += value;
        break;
      default:
        throw new Error(`Oh no! Distance: ${JSON.stringify(distance)} Dir: ${parts[0]} Val: ${value}`)
    }

    console.log(line, parts, value, distance);
  }

  console.log(distance);

  console.log(`Total distance: ${distance.depth * distance.hor}`);
}

part2();