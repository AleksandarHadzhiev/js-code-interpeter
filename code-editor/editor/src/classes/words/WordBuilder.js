import WordColorDefiner from "./WordColorDefiner.js";

export default class WordBuilder {
    constructor() {
        this.color = "transparent"
        this.colorDefiner = null;
        this.commentInit = 0;
    }

    buildWordAtIndexInWordsAsHTML(word, index, words) {
        this._trackCommentSection(word)
        this.colorDefiner = new WordColorDefiner(words)
        return this._buildWordElementForWordAtIndex(word, index)
    }

    _trackCommentSection(word) {
        if (word == "/")
            this.commentInit += 1
        else this.commentInit = 0
    }

    _buildWordElementForWordAtIndex(word, index) {
        if (word == " ") {
            return `<span style="font-sieze: 24px">&nbsp;</span>`
        }
        else if (this.commentInit >= 2) {
            return `<span style="font-sieze: 24px; color: gray">${word}</span>`
        }
        else if (word == '\t') {
            return `<span style="font-sieze: 24px">&emsp;</span>`
        }
        else {
            this.color = this.colorDefiner.defineColorForWordAtIndex(word, index)
            return `<span style="font-sieze: 24px; color: ${this.color}">${word}</span>`
        }
    }
}
