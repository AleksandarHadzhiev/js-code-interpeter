
export default class WordTracker {
    constructor() {
        this.words = new Map()
    }

    addWordToWords(word) {
        if (this.words.size == 0)
            this._buildNewWordsForWord(word)
        else
            this._addWordToWords(word)
    }

    _buildNewWordsForWord(word) {
        const words = []
        this._pushTheWords(words, word)
    }

    _pushTheWords(words, word) {
        words.push(word)
        this.words.set(word.value, words)
    }

    _addWordToWords(word) {
        const words = this.words.get(word.value)
        if (words)
            this._pushTheWords(words, word)
        else
            this._pushTheWords([], word)
    }

    clean() {
        this.words = new Map()
    }
}
