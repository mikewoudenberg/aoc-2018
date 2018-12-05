var readline = require('readline');

var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

let lines = [];

rl.on('line', function (line) {
  lines.push(line);
});

let logRegex = /\[(\d{4}-\d{2}-\d{2}) \d{2}:(\d{2})\] (.+)/
let guardChange = /Guard (#\d+) begins shift/

rl.on('close', function() {
  let guardSleepTime = {};
  let guardSleepMinutes = {};
  let state = {activeGuard: undefined, lastTime: undefined};
  
  lines.sort().forEach(line => {
    const [_, day, time, action] = logRegex.exec(line);
    const guardChanged = guardChange.exec(action)
    if (guardChanged) {
      state.activeGuard = guardChanged[1];
      guardSleepMinutes[state.activeGuard] = guardSleepMinutes[state.activeGuard] || new Array(60).fill(0);
    } else if (action === 'wakes up') {
      guardSleepTime[state.activeGuard] = (guardSleepTime[state.activeGuard] || 0) + (time - state.lastTime)
      for (let i = +state.lastTime; i < +time; i++) {
        guardSleepMinutes[state.activeGuard][i]++;
      }
    }
    state.lastTime = time;
  });

  let [guardId] = Object.entries(guardSleepTime).sort((a,b) => b[1] - a[1])[0];
  let sleepMinutes = guardSleepMinutes[guardId];
  let maxSleepMinutes = Math.max(...sleepMinutes);
  
  console.log(guardId.substr(1) * sleepMinutes.findIndex(value => value === maxSleepMinutes));
})
