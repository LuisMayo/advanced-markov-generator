/** Class representing a Markov Chain generator */
class Markov {
  /**
   * Builds the generator
   * @param {object} props - The configuration options and input data
   */
  constructor (props) {
    const defaultConfig = {
      minLength: 10,
      /**
       * Defines whether to use probability for the first word. If true more common words on the learning set
       * are more likely to be the first word. If false all words have equal chance
       *  */ 
      probabilityForFirstWord: false
    }

    this.props = Object.assign(defaultConfig, props);
    if (!this.props.input) {
      throw new Error('input was empty!')
    }
    this.startWords = []
    this.wordStats = {}

    this.props.input.forEach((learningElement) => {
      let words = learningElement.split(' ')
      let firstWord = words[0]


      // this function tests to see if this.startWords already contains the first word or not
      // we can't use Array.prototype.includes, because when comparing each element in this.startWords to the first word, we need to compare them as lowercase
      let checkWordNotInStartWords = () =>{
        if (this.props.probabilityForFirstWord) {
          return true;
        }
        this.startWords.forEach((elem) => {
          if (elem.toLowerCase() === firstWord.toLowerCase()) {
            return false;
          }
        });
        return true;
      }

      // if the first word is not a space, and if this.startWords does not already contain the first word, add it
      if (firstWord.length && checkWordNotInStartWords()) {
        this.startWords.push(firstWord)
      }

      // loop through each word in current sentence
      words.forEach((currentWord, it, ar) => {
        const nextWord = ar[it + 1];
        // if this.wordStats already contains the current word in the sentence as a property, push the next word in the sentence to it's array
        // otherwise, create the property on this.startWords and set it to an array containing the next word in the sentence
        // first check to see if there even IS a next word
        // we store all of the keys in this.wordStats as lowercase to make the function makeChain case insensitive
        if (this.wordStats.hasOwnProperty(currentWord.toLowerCase())) {
          this.wordStats[currentWord.toLowerCase()].push(nextWord)
        } else {
          this.wordStats[currentWord.toLowerCase()] = [nextWord]
        }
      })
    })

    delete this.wordStats['']
  }

  /**
   * Choose a random element in a given array
   * @param {array} a - An array to randomly choose an element from
   * @return {string} The selected element of the array
   */
  choice (a) {
    return a[Math.floor(a.length * Math.random())];
  }

  /**
   * Creates a new string via a Markov chain based on the input array from the constructor
   * @param {number} minLength - The minimum number of words in the generated string
   * @return {string} The generated string
   */
  makeChain (minLength = this.props.minLength || 10, deepness = 1) {
    if (deepness >= 4) {
      return "Sorry, I'm not able to generate a chain";
    }
    let word = this.choice(this.startWords);
    let chain = [];

    while (word != null && this.wordStats.hasOwnProperty(word.toLowerCase())) {
      chain.push(word);
      let possibleNextWords = this.wordStats[word.toLowerCase()];
      word = this.choice(possibleNextWords);
    }
    if (this.props.input.includes(chain.join(' '))) {
      return this.makeChain(minLength, deepness + 1);
    }
    if (chain.length < minLength) {
      return this.makeChain(minLength, deepness + 1);
    }
    return chain.join(' ');
  }

}

module.exports = Markov
