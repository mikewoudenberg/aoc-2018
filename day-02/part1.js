var readline = require('readline');

var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

let counts = {
  twos: 0,
  threes: 0
}

rl.on('line', function (line) {
  const letters = [...line];

  const letterCounts = Object.entries(letters.reduce((memo, letter) => {
    memo[letter] = (memo[letter] || 0) + 1;
    return memo
   } , {})).reduce((memo, [letter, count]) => {
     memo[count] = letter;
     return memo;
   }, [])

   if (letterCounts[2]) {
     counts.twos++;
   }
   if (letterCounts[3]) {
     counts.threes++;
   }
});

rl.on('close', function() {
	console.log(counts.twos * counts.threes);
})
