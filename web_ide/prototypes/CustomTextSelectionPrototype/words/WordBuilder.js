export default class WordBuilder {
    constructor() {
        this.color = "transparent"
        this.colorDefiner = null;
        this.commentInit = 0;
        this.isComment = false;
    }

    buildWordAtIndexInWordsAsHTML(word, index, colorDefiner) {
        this._trackCommentSection(word)
        return this._buildWordElementForWordAtIndex(word, index, colorDefiner)
    }

    _trackCommentSection(word) {
        if (word == "/") {
            this.commentInit += 1
        }
        if (this.commentInit >= 2) this.isComment = true
        if (word != "/") {
            this.commentInit = 0
        }
    }

    _buildWordElementForWordAtIndex(word, index, colorDefiner) {
        if (this.isComment) {
            return `<span style="margin:0%; padding: 0%; font-size: 24px; color: gray; white-space: pre; background-color: transparent;">${word}</span>`
        }
        else {
            this.color = colorDefiner.defineColorForWordAtIndex(word, index)
            return `<span style="margin:0%; padding: 0%; font-size: 24px; min-height:27.6px; color: ${this.color}; white-space: pre; background-color: transparent;">${word}</span>`
        }
    }
}
