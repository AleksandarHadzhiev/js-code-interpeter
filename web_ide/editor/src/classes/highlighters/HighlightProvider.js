import MultiLineHighlighter from "./MultiLineHighlighter.js"
import SingleLineHighlighter from "./SingleLineHighlighter.js"

export default class HighlightProvider {
    constructor(content, wholeText) {
        this.lowered = content
        this.wholeText = wholeText
        this.loweredAsLines = String(content).split('\n')
        this.highlighter = this._defineHighlighter()
    }

    getHighlightedElementsAfterHighlightingThem() {
        this.highlighter.highlight()
        return this.highlighter.getHighlightedLines()
    }

    _defineHighlighter() {
        if (this.loweredAsLines.length == 1)
            return new SingleLineHighlighter(this.lowered, this.wholeText)
        else return new MultiLineHighlighter(this.lowered, this.wholeText)
    }
}