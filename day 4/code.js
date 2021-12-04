import { readFileSync } from "fs";
import { dirname } from "path";
import { fileURLToPath } from "url";
import chalk from "chalk";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const input = readFileSync(__dirname + "/input.txt", "utf-8");

function part1() {
  let numbers = [];

  const lines = input.split("\n");
  const nLines = lines.length;

  numbers = lines[0]; // numbers being called;

  let boards = [];
  let currBoard = [];

  for (let i = 2; i < nLines; i++) {
    if (lines[i].trim() == "") {
      console.log("End of board, staring new board:", currBoard);
      boards.push(currBoard);
      currBoard = [];
    } else {
      const numbers = lines[i].split(" ");

      let lineNums = [];
      for (const n of numbers) {
        if (n.trim() != "") {
          lineNums.push(parseInt(n));
        }
      }

      // console.log(lineNums, numbers, lines[i])
      currBoard.push(lineNums);
    }
  }

  console.log("Number of boards:", boards.length);
  console.log(boards[0]);
  console.log(`Size of boards: ${boards[0][0].length} * ${boards[0].length}`);

  // console.log(`Boards:`)
  // console.log(JSON.stringify(boards, undefined, 2));
  console.log("Numbers", numbers);

  // let boardProgress = boards.map((b) => {
  //   const res = [];
  //   for (const row in boards[0]) {
  //     res.push([false, false, false, false, false]);
  //   }
  //   return res;
  // });
  // // console.log(boardProgress, boardProgress.length)

  // for (const number of numbers.split(",")) {
  //   updateBoards(number, boards, boardProgress);
  // }

  console.log("\n\n\n-------------------------------------------------------------------------\n")
  part2(boards, numbers);
}

function checkIfWon(boards, boardStatus, finalNumber, part2 = false) {
  for (let i = 0; i < boards.length; i++) {
    // check if a row has won!
    if (boards[i] === null) {
      continue;
    }

    for (let row = 0; row < boards[i].length; row++) {
      let hasWon = true;

      for (let col = 0; col < boards[i][0].length; col++) {
        if (!boardStatus[i][row][col]) {
          hasWon = false;
          break;
        }
      }

      if (hasWon) {
        console.log(`Board # ${i} has won row ${row}!`);
        calculateScore(boards[i], boardStatus[i], finalNumber);

        if (part2) {
          boards[i] = null;
          boardStatus[i] = null;
          break;
        } else {
          console.log(boards[i], boardStatus[i]);
        }
      }
    }

    if (boards[i] === null) {
      continue;
    }

    // check if a column has won!
    for (let col = 0; col < boards[i].length; col++) {
      let hasWon = true;

      for (let row = 0; row < boards[i][0].length; row++) {
        if (!boardStatus[i][row][col]) {
          hasWon = false;
          break;
        }
      }

      if (hasWon) {
        console.log(`Board # ${i} has won in col ${col}!`);
        calculateScore(boards[i], boardStatus[i], finalNumber);

        if (part2) {
          boards[i] = null;
          boardStatus[i] = null;
          break;
        } else {
          console.log(boards[i], boardStatus[i]);
        }
      }
    }
  }
}

function updateBoards(number, boards, boardStatus) {
  console.log("Got number:", number);

  for (let i = 0; i < boards.length; i++) {
    for (let row = 0; row < boards[0].length; row++) {
      for (let col = 0; col < boards[0][0].length; col++) {
        if (boards[i][row][col] == number) {
          boardStatus[i][row][col] = true;
          console.log(
            `Number was in board ${i}, row ${row}, col: ${col}: ${boards[i]} | ${boardStatus[i]}`
          );
        }
      }
    }
  }

  checkIfWon(boards, boardStatus, number);
}

function updateBoardsPart2(number, boards, boardStatus) {
  console.log("Got number:", number);

  for (let i = 0; i < boards.length; i++) {
    if (boards[i] === null) 
      continue;
    for (let row = 0; row < boards[i].length; row++) {
      for (let col = 0; col < boards[i][0].length; col++) {
        if (boards[i][row][col] == number) {
          boardStatus[i][row][col] = true;
        }
      }
    }
  }

  checkIfWon(boards, boardStatus, number, true);

  const boardsLeft = boards.filter((b) => b);
  console.log("Remaining boards: ", boardsLeft.length);

  if (boardsLeft.length === 1) {
    console.log("Final board: ", boardsLeft[0])
  }
}

function calculateScore(board, numbers, finalNumber) {
  // The score of the winning board can now be calculated. Start by finding the sum of all unmarked numbers on that board;
  // in this case, the sum is 188. Then, multiply that sum by the number that was just called when the board won, 24,
  // to get the final score, 188 * 24 = 4512.
  let sumOfUnmarkedNums = 0;

  for (let row = 0; row < board.length; row++) {
    for (let col = 0; col < board[0].length; col++) {
      if (!numbers[row][col]) {
        sumOfUnmarkedNums += parseInt(board[row][col]);
      }
    }
  }

  let score = finalNumber * sumOfUnmarkedNums;
  console.log("Final Score: ", score);

  // throw new Error("Done!");
}

function part2(boards, numbers) {
  let boardProgress = boards.map((b) => {
    const res = [];
    for (const row in boards[0]) {
      res.push([false, false, false, false, false]);
    }
    return res;
  });
  // console.log(boardProgress, boardProgress.length)

  for (const number of numbers.split(",")) {
    updateBoardsPart2(number, boards, boardProgress);
  }
}

part1();

part2();
