const MarkovGen = require('./index');
debugger;
let markov = new MarkovGen({
  input: ['array of sentences to base chains on', 'I really like to base my chains on things', 'But base things is sad sometimes'],
  minLength: 1,
  probabilityForFirstWord: true
});

let sentence = markov.makeChain();
console.log(sentence);
