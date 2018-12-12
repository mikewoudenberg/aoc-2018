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
  powerLevel = Math.floor(powerLevel / 100) % 10
  powerLevel -= 5;
  return powerLevel;
}

rl.on('line', function (line) {
  const serial = +line;
  let grid = {};
  let totalPower = {};  

  for (let [x,y] of getCoordinates({x: 300, y: 300})) {
    let key = `${x}-${y}`;
    grid[key] =  powerLevel([x, y], serial);
  }

  let prevGen = {...grid};
  for (let i=2; i<300; i++) {
    // TODO use results of previous stepsize
    let newGen = {};
    for (let [x, y] of getCoordinates({x: 300 - i, y: 300 - i})) {
      let sum = prevGen[`${x}-${y}`];

      for (let j=0; j<i; j++) {
        sum += grid[`${x + i - 1}-${y + j}`];
        sum += grid[`${x + j}-${y + i - 1}`];
      }
      sum -= grid[`${x + i - 1}-${y + i - 1}`];
      newGen[`${x}-${y}`] = sum;
    }
    let max = Math.max(...Object.values(newGen));
    let maxEntry = Object.entries(newGen).find(([key, value]) => max === value);
    totalPower[`${maxEntry[0]}-${i}`] = maxEntry[1];
    prevGen = newGen;
    console.log(i, maxEntry);
  }
  let max = Math.max(...Object.values(totalPower));
  console.log(Object.entries(totalPower).find(([key, value]) => max === value));
});

