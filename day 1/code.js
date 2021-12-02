import { depths } from "./input.js";

async function main() {
  let diffs = [];

  let lastDepth = null;

  for (const depth of depths) {
    if (!lastDepth) {
      lastDepth = depth;
      continue;
    }

    if (depth > lastDepth) {
      diffs.push("increased");
    } else if (depth < lastDepth) {
      diffs.push("decreased");
    } else {
      diffs.push("same");
    }

    lastDepth = depth;
  }

  let totalIncreased = 0;
  for (const diff of diffs) {
    if (diff === "increased") {
      totalIncreased++;
    }
  }

  // console.log(`Depth: ${depths[0]}`);

  // for (let i = 0; i < depths.length; i++) {
  //   console.log(`Depth: ${depths[i+1]} Diff: ${diffs[i]}`);

  // }
  console.log("Total increases: ", totalIncreased);

  console.log(`\n\n-------------------------------\nPart B\n`);
  await partB();
}

main().then(() => {}).catch((err) => console.log(err));

async function partB() {
  let diffs = [];

  let start = null;
  let windows = [];

  const windowSize = 3;

  for (let i = 0; i < depths.length; i++) {
    const depth = depths[i];

    windows[i] = depth;
    if (i > 0) {
      windows[i-1] += depth;
    }
    if (i > 1) {
      windows[i - 2] += depth;
    }

    console.log(windows);
    
    // await sleep(200);
  }

  // return;
  console.log(windows)

  let lastDepth = null;

  for (const window of windows) {
    if (!lastDepth) {
      lastDepth = window;
      continue;
    }

    if (window > lastDepth) {
      diffs.push("increased");
    } else if (window < lastDepth) {
      diffs.push("decreased");
    } else {
      diffs.push("same");
    }

    lastDepth = window;
  }

  let totalIncreased = 0;
  for (const diff of diffs) {
    if (diff === "increased") {
      totalIncreased++;
    }
  }

  console.log(`Depth: ${windows[0]}`);

  for (let i = 0; i < windows.length; i++) {
    console.log(`Depth: ${windows[i]} Diff: ${diffs[i]}`);

  }
  console.log("Total increases: ", totalIncreased)
}

function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
}
