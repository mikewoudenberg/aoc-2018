var readline = require('readline');

var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});


let initialState;
let rules = [];

let stateRegex = /initial state: (.+)/
let ruleRegex = /(.+) => (.)/
rl.on('line', function (line) {
  let state = stateRegex.exec(line);
  if (state) {
    initialState = state[1];
    return;
  }
  let rule = ruleRegex.exec(line);
  if (rule) {
    rules.push({in: rule[1], out: rule[2]})
    return;
  }
});

function applyRules(line) {
  let result = line.replace(/./g, '.');
  rules.forEach(rule => {
    let index = -1;
    for (;;) {
      index = line.indexOf(rule.in, index + 1);
      if (index === -1) {
        break;
      }
      result = result.substring(0, index + 2) + rule.out + result.substring(index + 3);
    } 
  })
  return result;
}

rl.on('close', function() {
  let result = initialState;
  for (let i=0; i<1000; i++) {
    result = applyRules(`..${result}..`);
  }
  let gen1000 = [...result].reduce((memo, value, id) => memo + (value === '#' ? id - 2000: 0) , 0); 
  
  for (let i=0; i<1000; i++) {
    result = applyRules(`..${result}..`);
  }
  gen2000 = [...result].reduce((memo, value, id) => memo + (value === '#' ? id - 4000: 0) , 0);  
  console.log((50000000000 - 1000) / 1000  * (gen2000 - gen1000) + gen1000);
})
