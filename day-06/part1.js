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

function getNearest(gridCoord) {
  let nearest = coords
    .map(coord => ({distance: manhattanDistance(coord, gridCoord), coord}))
    .sort((a, b) => a.distance - b.distance);

  if (nearest[0].distance === nearest[1].distance) {
    return null;
  } else {
    return nearest[0].coord;
  }
}

function* getCoordinates(topLeft, bottomRight) {
  for (let i=0; i < bottomRight.x+2; i++) {
    for (let j=0; j < bottomRight.y+2; j++) {
     yield [i,j];
    }
  }
}


rl.on('close', function() {
  // points on convex hull generate infinite areas
  const [topLeft, bottomRight] = coords.reduce((memo, coord) => [{x: Math.min(memo[0].x, coord[0]), y: Math.min(memo[0].y, coord[1])}, {x: Math.max(memo[1].x, coord[0]), y: Math.max(memo[1].y, coord[1])}], [{x: Number.MAX_SAFE_INTEGER, y: Number.MAX_SAFE_INTEGER}, {x: 0, y: 0}])
  
  const gridWithNearest = [...getCoordinates(topLeft, bottomRight)].map(coord => ({coord, nearest: getNearest(coord)}));

  const result = Math.max(...gridWithNearest
    .reduce((memo, pair) => {
      if (pair.coord[0] == 0 || pair.coord[1] == 0 || pair.coord[0] == bottomRight.x || pair.coord[1] == bottomRight.y) {
        // This nearest has hit the infinity bounds. Make sure it can't count anymore
        memo.set(pair.nearest, Number.NEGATIVE_INFINITY);
      } else {
        memo.set(pair.nearest, (memo.get(pair.nearest) || 0) + 1)
      }
      return memo;
    }, new Map()).values());

    console.log(result);
})
