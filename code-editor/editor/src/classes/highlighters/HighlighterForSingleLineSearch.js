import HighlightLineBuilder from "./HighlightLineBuilder.js"
export default class HighlightForSingleLineSearch {

    constructor(text, line, contentToSearchFor) {
        this.text = text
        this.content = contentToSearchFor
        this.index = 0
        this.indexOf = 0
        this.line = line
    }

    highlightAppearencesOnLine() {
        const text = this.text.toLowerCase()
        if (String(text).includes(this.content)) {
            this._restyleLine(text)
        }
    }

    _restyleLine(text) {
        this.line.replaceChildren()
        while (this.indexOf !== -1) {
            this._pickTextFromLine(text)
        }
        this._addEnding(text)
    }

    _pickTextFromLine(text) {
        this.indexOf = String(text).indexOf(this.content, this.index)
        if (this.indexOf !== -1) {
            const starting = String(text).substring(this.index, this.indexOf)
            this._updateIndexAndAppendElements(starting)
        }
    }

    _updateIndexAndAppendElements(starting) {
        const replaceText = new HighlightLineBuilder().buildReplaceTextElement(this.content)
        const startingHTML = new HighlightLineBuilder().buildNomralTextElement(starting)
        this.line.appendChild(startingHTML)
        this.line.appendChild(replaceText)
        this.index = this.indexOf + this.content.length
    }

    _addEnding(text) {
        const ending = String(text).substring(this.index, text.length)
        const endingHTML = new HighlightLineBuilder().buildNomralTextElement(ending)
        this.line.appendChild(endingHTML)
    }
}