import HighlightLineBuilder from "./HighlightLineBuilder.js"

export default class SingleLineHighlighter {
    constructor(content) {
        this.contentToSearchFor = content
        this.highlighter = document.getElementById('highlighter')
        this.highlightedLines = []
        this.index = 0
        this.indexOf = 0
    }

    getHighlightedLines() {
        return this.highlightedLines
    }

    highlight() {
        const children = this.highlighter.children
        for (let index = 0; index < children.length; index++) {
            const line = children[index]
            this._refreshStartingPoints()
            this._highlightAppearencesOnLine(line)
        }
    }

    _refreshStartingPoints() {
        this.indexOf = 0
        this.index = 0
    }

    _highlightAppearencesOnLine(line) {
        const text = line.textContent.toLowerCase()
        if (String(text).includes(this.contentToSearchFor)) {
            this._restyleLine(line, text)
        }
    }

    _restyleLine(line, text) {
        line.replaceChildren()
        while (this.indexOf !== -1) {
            this._pickTextFromLine(text, line)
        }
        this._addEnding(line, text)
    }

    _pickTextFromLine(text, line) {
        this.indexOf = String(text).indexOf(this.contentToSearchFor, this.index)
        if (this.indexOf !== -1) {
            const starting = String(text).substring(this.index, this.indexOf)
            this._updateIndexAndAppendElements(starting, line)
        }
    }

    _updateIndexAndAppendElements(starting, line) {
        const replaceText = new HighlightLineBuilder().buildReplaceTextElement(this.contentToSearchFor)
        this.highlightedLines.push([replaceText])
        const startingHTML = new HighlightLineBuilder().buildNomralTextElement(starting)
        line.appendChild(startingHTML)
        line.appendChild(replaceText)
        this.index = this.indexOf + this.contentToSearchFor.length
    }

    _addEnding(line, text) {
        const ending = String(text).substring(this.index, text.length)
        const endingHTML = new HighlightLineBuilder().buildNomralTextElement(ending)
        line.appendChild(endingHTML)
    }
}