var readline = require('readline');

var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

function* getCoordinates(max) {
  for (let i=1; i <= max.x; i++) {
    for (let j=1; j <= max.y; j++) {
     yield [i,j];
    }
  }
}

function powerLevel([x, y], serial) {
  const rackId = x + 10;
  let powerLevel = rackId * y;
  powerLevel += serial;
  powerLevel *= rackId;
  powerLevel = Math.floor(powerLevel / 100) - 10 * Math.floor(powerLevel / 1000)
  powerLevel -= 5;
  return powerLevel;
}

rl.on('line', function (line) {
  const serial = +line;
  let grid = {};
  let totalPower = {};
  for (let [x,y] of getCoordinates({x: 298, y: 298})) {
    const key = `${x}-${y}`;
    let sum = 0;
    for (let i=0; i<3; i++) {
      for (let j=0; j<3; j++) {
        let currentCell = `${x + i}-${y + j}`;
        grid[currentCell] = grid[currentCell] || powerLevel([x + i, y + j], serial);
        sum += grid[currentCell];
        
      }
    }
    totalPower[key] = sum;
  }
  let max = Math.max(...Object.values(totalPower));
  console.log((Object.entries(totalPower).find(([key, value]) => max === value)))
});

