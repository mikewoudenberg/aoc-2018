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

function processNode(gen) {
  const { childCount, metadataCount } = processHeader(gen);
  let children = [];
  for (let i=0; i< childCount; i++) {
     children.push(processNode(gen));
  }
  let metaData = [];
  for (let i=0; i<metadataCount; i++) {
     metaData.push(gen.next().value);
  }
  
  // now process the values;
  if (!childCount) {
    return metaData.reduce((memo, value) => memo + value, 0);
  }

  return metaData
    .map(metaDataItem => children[metaDataItem - 1] || 0) // Argh arrays start at 0!
    .reduce((memo, value) => memo + value, 0)
}

rl.on('line', function (line) {
  let gen = tokenizer(line);
  console.log(processNode(gen));
});
