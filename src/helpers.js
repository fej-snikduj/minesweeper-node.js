function promptForBoardSize(rl, nextFun, startGameFun) {
  rl.question(`How big of board would you like to play with?  Please` +
    `input a whole number (5 through 25)\n`, answer => {
      if (answer >= 5 && answer <= 25) {
        console.log(`Playing with board size ${answer}\n`);
        nextFun(rl, startGameFun.bind(null, answer));
      } else {
        console.log(`Invalid input, prompting again...\n`);
        promptForBoardSize(rl, nextFun, startGameFun);
      }
    });


}

function promptForDifficultyLevel(rl, startGameFun) {
  rl.question(`What difficulty level would you like to play at? 1, 2 or 3?\n`,
    answer => {
      if (answer === '1' || answer === '2' || answer === '3') {
        console.log(`Playing at difficulty level ${answer}\n`);
        startGameFun(answer);
      } else {
        console.log(`Invalid input, prompting again....\n`);
        promptForDifficultyLevel(rl, startGameFun);
      }
    });
}


function promptUserForInputs(rl, startGameFun) {
  promptForBoardSize(rl, promptForDifficultyLevel, startGameFun);
}


module.exports = {
  promptForBoardSize,
  promptForDifficultyLevel,
  promptUserForInputs
};
