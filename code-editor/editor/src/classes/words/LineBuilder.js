import WordsSplitter from "./WordsSplitter.js"
import WordBuilder from "./WordBuilder.js";

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
        this.words.forEach((word, index) => {
            innerHTML += builder.buildWordAtIndexInWordsAsHTML(word, index, this.words)
        });
        return innerHTML
    }
}