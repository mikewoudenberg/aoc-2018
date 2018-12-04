var readline = require('readline');

var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});


let lines = [];

rl.on('line', function (line) {
  lines.push(parseInt(line, 10));
});

rl.on('close', function () {
  let freq = 0;
  let freqs = new Map([[freq, 1]]);

  for (let i =0;;i++) {
    freq += lines[i%lines.length];
    
    if (freqs.get(freq)) {
      console.log(freq);
      break;
    } else {
      freqs.set(freq, 1);
    }
  }
  
})
