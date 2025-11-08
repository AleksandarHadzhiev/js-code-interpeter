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
            return `<span style="font-sieze: 24px; color: gray; white-space: pre;">${word}</span>`
        }
        else {
            this.color = colorDefiner.defineColorForWordAtIndex(word, index)
            return `<span style="font-sieze: 24px; color: ${this.color}; white-space: pre;">${word}</span>`
        }
    }
}
