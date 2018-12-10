var readline = require('readline');

var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

let pointRegex = /position=< ?(-?\d+),  ?(-?\d+)> velocity=< ?(-?\d+),  ?(-?\d+)>/


let points = []
function getBoundingBox() {
  return points.reduce((memo, value) => [{
      x: Math.min(memo[0].x, value.x), 
      y: Math.min(memo[0].y, value.y),  
    }, {
      x: Math.max(memo[1].x, value.x), 
      y: Math.max(memo[1].y, value.y), 
    }]
  , [{x: Number.MAX_SAFE_INTEGER, y: Number.MAX_SAFE_INTEGER}, {x: Number.MIN_SAFE_INTEGER, y: Number.MIN_SAFE_INTEGER}] )  
}

function step(steps = 1) {
  points = points.map(point => ({
    ...point,
    x: point.x + steps * point.dx,
    y: point.y + steps * point.dy
  }))
}

function logGrid(bottom, top) {
  let locations = new Set(points.map(point => `${point.x}-${point.y}`));
  for (let i=bottom.x; i <= top.x; i++) {
    let line = [];
    for (let j=bottom.y; j <= top.y; j++) {
      line.push(locations.has(`${i}-${j}`) ? 'X' : '.');
    }
    console.log(line.join(''));
  }
}

rl.on('line', function (line) {
  let [_, x, y, dx, dy] = pointRegex.exec(line);
  points.push({x: +x, y: +y, dx: +dx, dy: +dy})
});

rl.on('close', function() {
  step(10942);
  const [top, bottom] = getBoundingBox();
  console.log(bottom.y - top.y, bottom.x - top.x);  
  logGrid(top, bottom);
})
