var readline = require('readline');

var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});


let lines = [];

function findChangedLetter(line1, line2) {
  let index = -1;
  for (let i=0; i < line1.length; i++) {
    if (Math.abs(line1.charCodeAt(i) - line2.charCodeAt(i))) {
      if (index > -1) {
        return -1;
      }
      index = i;
    }
  }
  return index;
}
rl.on('line', function (line) {
  lines.push(line);
});

rl.on('close', function () {
  let lineCount = lines.length;
  for (let i =0; i < lineCount; i++) {
    for (let j = i+1; j < lineCount; j++) {
      let changedLetterIndex = findChangedLetter(lines[i], lines[j]); 
      if (changedLetterIndex > -1) {
        let letters = [...lines[i]];
        letters.splice(changedLetterIndex, 1)
        console.log(letters.join(''));
      }
    }    
  }
  
})
