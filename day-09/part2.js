var readline = require('readline');

var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

let endConditionRegex = /(\d+) players; last marble is worth (\d+) points/

class Listitem {
  constructor(value) {
    this.prev = null;
    this.next = null;
    this.value = value;
  }

  insertAfter(item) {
    item.prev = this;
    item.next = this.next;
    this.next.prev = item;
    this.next = item;
  }

  remove() {
    this.prev.next = this.next;
    this.next.prev = this.prev;
  }
}

rl.on('line', function (line) {
  let [_, players, maxMarble] = endConditionRegex.exec(line);

  let chain = new Listitem(0);
  chain.prev = chain;
  chain.next = chain;
  let playerScores = Array.from({length: players}, () => 0);
  let currentMarbleId = chain;
  const adjustedMaxMarble = 100 * maxMarble;
  for (let marbleToAdd = 1; marbleToAdd <= adjustedMaxMarble; marbleToAdd++) {
    if (!(marbleToAdd % 23)) {
      const currentPlayer = marbleToAdd % players; 
      currentMarbleId = currentMarbleId.prev.prev.prev.prev.prev.prev.prev;
      playerScores[currentPlayer] += marbleToAdd + currentMarbleId.value;
      currentMarbleId = currentMarbleId.next;
      currentMarbleId.prev.remove();
    } else {
      currentMarbleId.next.insertAfter(new Listitem(marbleToAdd));
      currentMarbleId = currentMarbleId.next.next;
    }
  }
  console.log(`Winner scores ${Math.max(...playerScores)}`);
});
