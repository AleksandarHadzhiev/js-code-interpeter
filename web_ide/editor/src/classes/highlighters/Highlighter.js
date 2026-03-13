import HighlightProvider from "./HighlightProvider.js";

export default class Highlighter {
    constructor() {
        this.lowered = ""
        this.matchedTextPositions = []
        this.highlighter = document.getElementById('highlighter')
        this.highlightedLines = []
    }

    getHighlightedElementsAfterHighlightingContent(content) {
        this.lowered = String(content).toLowerCase();
        this._highlight()
        return this.highlightedLines
    }

    _highlight() {
        if (this.lowered.trim() !== "") {
            this.highlightedLines = new HighlightProvider(this.lowered).getHighlightedElementsAfterHighlightingThem()
        }
    }
}
