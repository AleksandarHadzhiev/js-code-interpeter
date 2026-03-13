import WordBuilder from "./Words/WordBuilder.js";
import LineNumberTracker from "./LineNumberTracker.js";

export default class FrontendBuilder {
    constructor() {
        this.reader = document.getElementById('reader-container')
        this.writer = document.getElementById('writer')
        this.linesOnScreen = 34;
        this.lineHeight = 24;
        this.firstLine = 0
        this.allLines = 0 // Needs further investigation for further improvement of how the code is displayed and stored
    }

    buildLinesForContent(content) {
        this.reader.replaceChildren()
        const lines = String(content).split('\n')
        new LineNumberTracker(lines) // BUILDS LINE NUMBERS
        const startingLine = this._defineStartingLineToDisplay()
        this._buildLines(lines, startingLine)
    }

    _defineStartingLineToDisplay() {
        const startingPoint = this.writer.scrollTop
        if (startingPoint / this.lineHeight !== undefined) return Math.ceil(startingPoint / this.lineHeight)
        else if (startingPoint > this.lineHeight) return 1
    }

    _buildLines(lines, startingLine) {
        let startingIndex = startingLine == 0 ? startingLine : (lines.length > 29 && lines.length < this.linesOnScreen ? 0 : startingLine - 5)
        const numberOfLines = lines.length > this.linesOnScreen ? this.linesOnScreen + startingIndex : lines.length
        for (let index = startingIndex; index < numberOfLines; index++) {
            console.log(startingIndex, index, lines.length)
            const content = lines[index];
            console.log(content, index)
            if (content != undefined)
                this._buildLine(content, index)
        }
    }

    _buildLine(newContent, index) {
        console.log(index, newContent)
        // let lineElement = document.getElementById(`${index}`)

        const wordBuilder = new WordBuilder(newContent)
        const lineElement = this._buildDiv(newContent, index)
        wordBuilder.buildWordsAndAttachToLine(lineElement)

        // if (lineElement) {
        //     lineElement.replaceChildren('')
        //     wordBuilder.buildWordsAndAttachToLine(lineElement)
        // }
        // else {
        //     lineElement = this._buildDiv(newContent, index)
        // }
        this.reader.appendChild(lineElement)
    }

    _buildDiv(content, index) {
        const line = document.createElement('p')
        line.setAttribute('id', index)
        line.textContent = content
        line.style = `
            height: 28.8px;
            font-size: 24px;
            line-height: 1.2;
            color: gray;
            `
        return line
    }
}