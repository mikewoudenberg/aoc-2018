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
  let guardSleepMinutes = {};
  let state = {activeGuard: undefined, lastTime: undefined};
  
  lines.sort().forEach(line => {
    const [_, day, time, action] = logRegex.exec(line);
    const guardChanged = guardChange.exec(action)
    if (guardChanged) {
      state.activeGuard = guardChanged[1];
      guardSleepMinutes[state.activeGuard] = guardSleepMinutes[state.activeGuard] || new Array(60).fill(0);
    } else if (action === 'wakes up') {
      for (let i = +state.lastTime; i < +time; i++) {
        guardSleepMinutes[state.activeGuard][i]++;
      }
    }
    state.lastTime = time;
  });

  let maxSnoozesPerMinute = 0;
  let mostSleepyGuard;
  let sleepiestMinute;
  Object.entries(guardSleepMinutes).forEach(([guardId, sleepMinutes]) => {
    const maxMinutesSlept = Math.max(...sleepMinutes);
    if (maxMinutesSlept > maxSnoozesPerMinute) {
      maxSnoozesPerMinute = maxMinutesSlept;
      mostSleepyGuard = guardId
      sleepiestMinute = sleepMinutes.indexOf(maxMinutesSlept);
    }
  });
  console.log(mostSleepyGuard.substr(1) * sleepiestMinute);    
})
