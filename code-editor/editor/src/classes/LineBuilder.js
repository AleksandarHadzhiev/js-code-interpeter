import WordsSplitter from "./words/WordsSplitter.js"
import WordBuilder from "./words/WordBuilder.js";
import WordColorDefiner from "./words/WordColorDefiner.js";

export default class LineBUilder {
    constructor(content) {
        this.words = new WordsSplitter().splitLineIntoWords(content)
    }

    buildLine() {
        const lineElement = document.createElement('div')
        lineElement.innerHTML = this._buildWordsForLine()
        lineElement.classList.add('line')
        return lineElement
    }

    _buildWordsForLine() {
        const builder = new WordBuilder()
        let innerHTML = ''
        const colorDefiner = new WordColorDefiner(this.words)
        this.words.forEach((word, index) => {
            innerHTML += builder.buildWordAtIndexInWordsAsHTML(word, index, colorDefiner)
        });

        return innerHTML
    }
}