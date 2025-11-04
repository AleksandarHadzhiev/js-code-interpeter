import HintTracker from "./Hints/HintTracker.js"
import HintBuilder from "./Hints/HitBuilder.js"
import LineNumberTracker from "./Line/LineNumberTracker.js"
import CodeBuilder from "./Scope/CodeBuilder.js"
import WordTracker from "./Word/WordTracker.js"
import FirstAppearance from "./Line/FirstAppearance.js"
import { WordColorDefiner } from "./Word/WordColorDefiner.js"
import LineTracker from "./Line/LineTracker.js"
import ScopeTracker from "./Scope/ScopeTracker.js"

export default class ProgramRunnder {
    constructor(reader, writer) {
        this.hintsTracker = new HintTracker()
        this.lineTracker = new LineTracker();
        this.hintBuilder = new HintBuilder(this.hintsTracker, reader)
        this.scopeTracker = new ScopeTracker(this.hintsTracker, this.lineTracker);
        this.codeBuilder = new CodeBuilder(this.hintsTracker, this.lineTracker, this.scopeTracker)
        this.wordsTracker = new WordTracker()
        this.reader = reader
        this.writer = writer
    }

    refreshProgram(event) {
        event.preventDefault()
        this.wordsTracker.clean()
        this.reader.innerHTML = ''
    }

    writeLine(line) {
        this.codeBuilder.buildLine(line)
    }

    writeAllLines(content) {
        // this.wordsTracker = this.codeBuilder.buildCodeForContent(content, this.wordsTracker)
        const lines = String(content).split('\n')
        this.codeBuilder.buildMultipleLines(lines)
    }

    buildProgramForContentWithDefinedLineNumber(content) {
        this.wordsTracker = this.codeBuilder.buildCodeForContent(content, this.wordsTracker)
        this._buildLines()
        this.hintBuilder.buildHints()
        new LineNumberTracker();
    }

    _buildLines() {
        const lines = this.codeBuilder.lineTracker.trackedLines;
        lines.forEach(line => {
            this._addLineToReader(line)
        });
    }

    _addLineToReader(line) {
        let lineElement = this._buildLine(line)
        lineElement = this._buildWordsForLineAndAppendToElement(line, lineElement)
        this.reader.appendChild(lineElement)
    }

    _buildLine(line) {
        const lineElement = document.createElement('p')
        this._addStyleToLine(lineElement, line)
        return lineElement
    }

    _addStyleToLine(lineElement, line) {
        lineElement.setAttribute('id', line.id)
        lineElement.setAttribute('name', 'line')
        lineElement.style = `
            color: gray;
            font-size: ${this.writer.style.fontSize};
            width:fit-content;
            height: fit-content;
            line-height:${this.writer.style.lineHeight};
        `
    }

    _buildWordsForLineAndAppendToElement(line, lineElement) {
        line.words.forEach((word, index) => {
            const color = new WordColorDefiner().defineColor(word, index, line.wordElements)
            const element = this._buildWordElement(word, color)
            lineElement.appendChild(element)
        });
        return lineElement
    }

    _buildWordElement(word, color) {
        const wordElement = document.createElement('span')
        word.updateRedirectToElementInCode(wordElement)
        this._addStyle(wordElement, word, color)
        this._handleRedirectAction(wordElement, word)
        return wordElement
    }

    _addStyle(wordElement, word, color) {
        wordElement.textContent = word.value
        wordElement.setAttribute('id', word.id)
        wordElement.style = `
            color: ${color}; 
            font-size: ${this.writer.style.fontSize}; 
            line-height:${this.writer.style.lineHeight};
            `
    }

    _handleRedirectAction(wordElement, word) {
        wordElement.addEventListener('click', (event) => {
            if (event.ctrlKey) {
                this._redirect(word)
            }
        })
    }

    _redirect(word) {
        const wordElement = this._getTheElementToRedirectTo(word)
        wordElement.scrollIntoView()
        wordElement.style.background = 'lightyellow';

    }

    _getTheElementToRedirectTo(word) {
        const firstAppearance = new FirstAppearance();
        const first = firstAppearance.findFirstAppearanceForWordInWordsTracker(word, this.wordsTracker)
        const elementToRedirectTo = first.redirectToElementInCode;
        return document.getElementById(elementToRedirectTo.id)
    }
}
