export default class WordTracker {
    constructor() {
        this.words = new Map()
    }

    addWordToWords(word) {
        this.words.set(word.content, word)
    }

    getMatchingWords(content) {
        return this.words.get(content)
    }
}