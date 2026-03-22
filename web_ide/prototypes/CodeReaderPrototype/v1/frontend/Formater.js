import WordColorDefiner from "./WordColorDefiner.js"
import LineSplitter from "./LineSplitter.js"


export default class Formater {
    constructor(reader) {
        this.reader = reader
        this.writer = document.getElementById('code-writer')
        this.splitter = new LineSplitter()
        this.colorDefiner = new WordColorDefiner()
    }

    buildWords(words) {
        this.reader.replaceChildren('')
        console.log(words)
        words.forEach((content, index) => {
            const wordElement = this._buildWord(content, index, words)
            this.reader.appendChild(wordElement)
        });
    }

    buildLine(line) {
        const lineElement = this._buildLineElement(line)
        const words = this.splitter.splitLineIntoWords(line.content)
        console.log(words)
        this._buildWordsAndAttachToLine(words, lineElement)
        this.reader.appendChild(lineElement)
    }

    _buildLineElement(line) {
        let lineElement = document.getElementById(line.id)
        if (!lineElement) {
            lineElement = document.createElement('p')
            lineElement.setAttribute('id', line.id)
        }
        else lineElement.replaceChildren('')
        this._applyStyleToLine(lineElement)
        return lineElement
    }

    _applyStyleToLine(lineElement) {
        lineElement.setAttribute('name', 'line')
        lineElement.style = `
            color: gray;
            font-size: ${this.writer.style.fontSize};
            width:fit-content;
            height: fit-content;
            line-height:${this.writer.style.lineHeight};
        `
    }

    _buildWordsAndAttachToLine(words, lineElement) {
        words.forEach((word, index) => {
            const content = word === "" ? '\n' : word
            const wordElement = this._buildWord(content, index, words)
            lineElement.appendChild(wordElement)
        });
    }

    _buildWord(word, index, words) {
        const wordElement = document.createElement('span')
        const color = this.colorDefiner.defineColor(word, index, words)
        this._applyStyleToWord(wordElement, word, color)
        return wordElement
    }

    _applyStyleToWord(wordElement, word, color) {
        wordElement.textContent = word // will also be changed when more advanced
        // wordElement.setAttribute('id', ) will be added back When code is more advanced for the frontend. That means there will be more Advanced word object
        wordElement.style = `
            color: ${color}; 
            font-size: ${this.writer.style.fontSize}; 
            line-height:${this.writer.style.lineHeight};
            `
    }
}