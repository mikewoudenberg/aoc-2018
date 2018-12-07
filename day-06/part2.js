var readline = require('readline');

var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

function manhattanDistance(coord1, coord2) {
  return Math.abs(coord1[0] - coord2[0]) + Math.abs(coord1[1] - coord2[1]);
}

let coords = [];
let POINT = /(\d+), (\d+)/

rl.on('line', function (line) {
  const [_, x, y] = POINT.exec(line);
  coords.push([x,y]);
});

function* getCoordinates(topLeft, bottomRight) {
  for (let i=0; i < bottomRight.x+2; i++) {
    for (let j=0; j < bottomRight.y+2; j++) {
     yield [i,j];
    }
  }
}

function totalDistances(gridCoord) {
  return coords.reduce((memo, coord) => memo + manhattanDistance(gridCoord, coord), 0);
}

rl.on('close', function() {
  const [topLeft, bottomRight] = coords.reduce((memo, coord) => [{x: Math.min(memo[0].x, coord[0]), y: Math.min(memo[0].y, coord[1])}, {x: Math.max(memo[1].x, coord[0]), y: Math.max(memo[1].y, coord[1])}], [{x: Number.MAX_SAFE_INTEGER, y: Number.MAX_SAFE_INTEGER}, {x: 0, y: 0}])
  
  const gridWithSums = [...getCoordinates(topLeft, bottomRight)].map(coord => ({coord, distance: totalDistances(coord)}));
  console.log(gridWithSums.filter(pair => pair.distance < 10000).length);
})
