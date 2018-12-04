var readline = require('readline');

var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

let freq = 0;
rl.on('line', function (line) {
  freq += parseInt(line, 10);
});

rl.on('close', function() {
	console.log(freq);
})
