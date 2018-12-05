var readline = require('readline');

var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

function processLine(line) {
  let result = [line[0]];
  for (let i=1; i < line.length; i++) {
    if (Math.abs(line.charCodeAt(i-1) - line.charCodeAt(i)) === 32) { // 32 = distance between lowercase letter and its uppercase variant
      result.pop();
      i++
    }
    result.push(line[i]);
  }
  return result.join('');
}

function reduceLine(line) {
  let processedLine = line;
  let previous;
  do {
    previous = processedLine; 
    processedLine = processLine(processedLine);
  } while (processedLine !== previous)
  return  processedLine.length;
}

rl.on('line', function (line) {
  const letters = new Set(line.toLowerCase());
  let result = [...letters]
    .reduce((memo, letter) => [...memo, [letter, reduceLine(line.replace(new RegExp(letter, 'ig'), ''))]], [])
    .sort((a,b) => a[1] - b[1]);
  console.log(result[0][1]);
});

rl.on('close', function() {
})
