var readline = require('readline');

var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

const LINE_REGEX = /Step (.) must be finished before step (.) can begin/


const steps = new Map();
const letters = new Set();
const processingTimes = new Map(Array.from({length: 26}, (_, i) => [String.fromCharCode(65 + i), 61+i]));

function getAvailableActions(sequence, availableActions, activeActions) {
  const result = [];
  const activatedLetters = [...sequence, ...availableActions, ...activeActions];
  [...steps.keys()].filter(step => !activatedLetters.includes(step)).forEach(step => {
    const preconditions = steps.get(step);
    if (!preconditions.filter(precondition => !sequence.includes(precondition)).length) {
      result.push(step);
    }
  })
  return result;
}

rl.on('line', function (line) {
  const [_, precondition, step] = LINE_REGEX.exec(line);
  letters.add(precondition)
  steps.set(step, [...(steps.get(step) || []), precondition])
});

rl.on('close', function() {
  let availableActions = [...letters.values()].filter(letter => !steps.get(letter))
  let sequence = [];
  let activeActions = [];
  let t=0;

  let workerAvailable = [0,0,0,0,0];
  while (availableActions.length || activeActions.length) {
    // check which actions complete and push them into sequence
    const done = activeActions.filter(action => action.t === t).map(action => action.letter);
    sequence = [...sequence, ...done];
    activeActions = [...activeActions.filter(action => action.t !== t)]

    
    // hand out available actions to available workers
    // update available workers accordingly
    
    availableActions = [...availableActions, ...getAvailableActions(sequence, availableActions, activeActions.map(action => action.letter))];
    // prepare next available actions
    availableActions.sort();

    workerAvailable.forEach((workerReadyTime, i) => {
      if (workerReadyTime <= t && availableActions.length) {
        // worker ready
        let letter;
        [letter, ...availableActions] = availableActions;
        let completion = t + processingTimes.get(letter);
        activeActions.push({letter: letter, t: completion})
        workerAvailable[i] = completion;
      }
    });

    // now find the minimum time to scroll forward
    let prevT = t;
    t = [...workerAvailable].sort((a,b) => a-b).find(time => time > t);
    if (!t) {
      // no more workers will complete in the future, we're done
      console.log(prevT);
      break;
    }
  }
})
