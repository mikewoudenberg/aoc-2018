var readline = require('readline');

var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

let TOKEN = /(\d+)/g
function *tokenizer(line) {
  while(true) {
    const match = TOKEN.exec(line);
    if (match) {
      yield +match[1]; 
    } else {
      break;
    }
  }
}

function processHeader(gen) {
  return {
    childCount: gen.next().value,
    metadataCount: gen.next().value
  };
}
let sumOfMetaData=0;

function processNode(gen) {
  const {childCount, metadataCount} = processHeader(gen);
  for (let i=0; i< childCount; i++) {
    processNode(gen);
  }
  for (let i=0; i<metadataCount; i++) {
     sumOfMetaData += gen.next().value;
  }
}

rl.on('line', function (line) {
  let gen = tokenizer(line);
  processNode(gen);
});

rl.on('close', function() {
	console.log(sumOfMetaData);
})
