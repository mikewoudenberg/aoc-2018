var readline = require('readline');

var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

let coords = {};

let REGEX = /@ (\d+),(\d+): (\d+)x(\d+)/
function genCoordinates(line) {
  let coordinates = [];
  let [_, left, top, width, height] = REGEX.exec(line);
  for (let i = +left; i< +left + +width; i++) {
    for (let j = +top; j< +top + +height; j++) {
      coordinates.push(`${i}-${j}`);
    }
  }
  return coordinates;
}

rl.on('line', function (line) {
  for (coordinate of genCoordinates(line)) {
    coords[coordinate] = (coords[coordinate] || 0) + 1; 
  }
});

rl.on('close', function() {
  console.log(Object.values(coords).reduce((memo, value) => value > 1 ? ++memo:memo, 0));
})
