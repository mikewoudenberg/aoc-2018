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

rl.on('line', function (line) {
  let processedLine = line;
  let previous;
  do {
    previous = processedLine; 
    processedLine = processLine(processedLine);
  } while (processedLine !== previous)
  console.log(processedLine.length);
});

rl.on('close', function() {
})
