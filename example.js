const MarkovGen = require('./index');
let markov = new MarkovGen({
  input: ['array of sentences to base chains on', 'I really like to base my chains on things', 'But base things is sad sometimes', 'to base or not to base'],
  minLength: 1,
  probabilityForFirstWord: true
});

let sentence = markov.makeChain();
console.log(sentence);
