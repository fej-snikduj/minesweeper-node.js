function promptForBoardSize() {
  rl.question(
        'How big of board would you like to play with?  Please input an' +
        'integer (5 through 15)\n',
        function(answer) {
          if (answer >= 5 && answer <= 15) {
            console.log('playing with board size ', answer);
            return answer;
          } else {
            console.log('invalid input, prompting again....');
            promptForBoardSize();
          }
        });
}


function promptForDifficultyLevel() {
  rl.question(
        'What difficulty level would you like to play at?  1, 2 or 3)\n',
        function(answer) {
          if (answer === '1' || answer === '2' || answer === '3') {
            console.log('playing at difficulty level', answer);
            return answer;
          } else {
            console.log('invalid input, prompting again....');
            promptForDifficultyLevel();
          }
        });
}

module.exports = {
  promptForBoardSize,
  promptForDifficultyLevel
};
