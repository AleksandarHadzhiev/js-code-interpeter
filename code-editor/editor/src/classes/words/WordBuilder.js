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
        if (word.trim() == "") {
            return `<span style="font-sieze: 24px">&nbsp;</span>`
        }
        else if (this.isComment) {
            return `<span style="font-sieze: 24px; color: gray">${word}</span>`
        }
        else if (word == '\t') {
            return `<span style="font-sieze: 24px">&emsp;</span>`
        }
        else {
            this.color = colorDefiner.defineColorForWordAtIndex(word, index)
            return `<span style="font-sieze: 24px; color: ${this.color}">${word}</span>`
        }
    }
}
