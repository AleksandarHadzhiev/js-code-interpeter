import HighlightLineBuilder from "./HighlightLineBuilder.js"

export default class MultiLineHighlighter {
    /**
     * 
     * @param {String} contentToSearchFor 
     * @param {String} wholeText 
     */
    constructor(contentToSearchFor, wholeText) {
        this.lowered = contentToSearchFor
        this.wholeText = wholeText.toLowerCase()
        this.loweredAsLines = this.lowered.split('\n')
        this.highlighter = document.getElementById('highlighter')
        this.highlightedLines = []
        this.index = 0
        this.indexOf = 0
        this.highlights = []
    }

    getHighlightedLines() {
        return this.highlights
    }

    highlight() {
        this.indexOf = 0
        this.index = 0
        this._revisit(this.wholeText)
    }

    _revisit(wholeText) {
        this.indexOf = String(wholeText).indexOf(this.lowered, this.index)
        this.index = this.indexOf + 1
        if (this.indexOf != -1) {
            this._coloriseLines(wholeText)
        }
    }

    _coloriseLines(wholeText) {
        const line = String(wholeText).substring(0, this.indexOf).split('\n').length - 1
        this._highlightLinesBasedOnStartingLine(line)
        this.highlights.push(this.highlightedLines)
        this.highlightedLines = []
        this._revisit(wholeText)
    }

    _highlightLinesBasedOnStartingLine(startingLine) {
        const children = this.highlighter.children
        for (let index = 0; index < this.loweredAsLines.length; index++) {
            this._getElementFromChildrenAtLocationAndHighlightContent(children, startingLine, index)
        }
    }

    _getElementFromChildrenAtLocationAndHighlightContent(children, startingLine, index) {
        const lineElement = children[startingLine + index]
        this._highlightLines(index, lineElement)
    }

    _highlightLines(index, lineElement) {
        if (index < this.loweredAsLines.length - 1)
            this._highlightLinesBeforeLast(lineElement, index)
        else
            this._highlightLastLine(lineElement, index)
    }

    _highlightLinesBeforeLast(lineElement, index) {
        this._generatePositionsOfNormalTextInLineForLineBeforeLast(lineElement, index)
        const replaceText = new HighlightLineBuilder().buildReplaceTextElement(this.loweredAsLines[index])
        this.highlightedLines.push(replaceText)
        const startingHTML = this._generateNormal(lineElement)
        this._reformLineElements(lineElement, startingHTML, replaceText)
    }

    _generatePositionsOfNormalTextInLineForLineBeforeLast(lineElement, index) {
        const text = String(lineElement.textContent).toLowerCase()
        this.startingPositionOfLine = 0
        this.endingPositionOfLine = text.indexOf(this.loweredAsLines[index])
    }

    _generateNormal(lineElement) {
        const normalText = lineElement.textContent.substring(this.startingPositionOfLine, this.endingPositionOfLine)
        const normalHTML = new HighlightLineBuilder().buildNomralTextElement(normalText)
        return normalHTML
    }

    _reformLineElements(lineElement, firstToAdd, secondToAdd) {
        lineElement.replaceChildren()
        lineElement.appendChild(firstToAdd)
        lineElement.appendChild(secondToAdd)
    }

    _highlightLastLine(lineElement, index) {
        this._generatePositionsOfNormalTextInLineForLastLine(lineElement, index)
        const replaceText = new HighlightLineBuilder().buildReplaceTextElement(this.loweredAsLines[index])
        this.highlightedLines.push(replaceText)
        const endingHTML = this._generateNormal(lineElement)
        this._reformLineElements(lineElement, replaceText, endingHTML)
    }

    _generatePositionsOfNormalTextInLineForLastLine(lineElement, index) {
        const text = String(lineElement.textContent).toLowerCase()
        this.startingPositionOfLine = text.indexOf(this.loweredAsLines[index]) + this.loweredAsLines[index].length
        this.endingPositionOfLine = text.length
    }
}
