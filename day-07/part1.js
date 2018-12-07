var readline = require('readline');

var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

const LINE_REGEX = /Step (.) must be finished before step (.) can begin/


const steps = new Map();
const letters = new Set();

function getAvailableActions(sequence, availableActions) {
  const result = [];
  const activatedLetters = [...sequence, ...availableActions];
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
  while (availableActions.length) {
    [first, ...availableActions] = availableActions.sort();
    sequence.push(first);
    availableActions = [...availableActions, ...getAvailableActions(sequence, availableActions)];
  }

  console.log(sequence.join(''));
})
