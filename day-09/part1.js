var readline = require('readline');

var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

let endConditionRegex = /(\d+) players; last marble is worth (\d+) points/

rl.on('line', function (line) {
  let [_, players, maxMarble] = endConditionRegex.exec(line);

  let chain = [0];
  let playerScores = Array.from({length: players}, () => 0);
  let currentMarbleId = 0;
  for (let marbleToAdd = 1; marbleToAdd <= maxMarble; marbleToAdd++) {
    if (!(marbleToAdd % 23)) {
      const currentPlayer = marbleToAdd % players; 
      let deletionId = (currentMarbleId + chain.length - 7) % chain.length;
      let [removedMarble] = chain.splice(deletionId, 1);
      currentMarbleId = deletionId;
      playerScores[currentPlayer] += marbleToAdd + removedMarble;
    } else {
      let insertionPoint = (currentMarbleId + 1) % chain.length;
      chain.splice(insertionPoint + 1, 0, marbleToAdd);
      currentMarbleId = insertionPoint + 1;
    }
  }
  console.log(Math.max(...playerScores));
});
