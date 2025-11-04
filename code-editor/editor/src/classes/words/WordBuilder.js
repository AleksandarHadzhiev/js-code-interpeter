import WordsSplitter from "./WordsSplitter.js";
import WordColorDefiner from "./WordColorDefiner.js";

// WordBuilder Does More than one thing
// He splits the line into words
// He creates the words
// He combines them into one whole line and returns them to the line...
// SPLIT THE RESPONSIBILITIES
export default class WordBuilder {
    constructor() {
        this.splitter = new WordsSplitter();
        this.color = "transparent"
        this.colorDefiner = null;
    }

    buildWordsForLineAsHTML(line) {
        const words = this.splitter.splitLineIntoWords(line)
        const innterHTML = this._generateWordsAsHTMLElements(words)
        return innterHTML
    }

    _generateWordsAsHTMLElements(words) {
        if (words.length == 1 && words[0].trim() == "") return `<span style="font-sieze: 24px">&nbsp;</span>`
        else return this._generateForMultiple(words)
    }

    _generateForMultiple(words) {
        let innerHTML = ''
        let initComment = 0;
        this.colorDefiner = new WordColorDefiner(words)
        words.forEach((word, index) => {
            if (word == "/")
                initComment += 1;
            if (word == " ") {
                innerHTML += `<span style="font-sieze: 24px">&nbsp;</span>`
            }
            else if (initComment >= 2) {
                innerHTML += `<span style="font-sieze: 24px; color: gray">${word}</span>`
            }
            else if (word == '\t') {
                innerHTML += `<span style="font-sieze: 24px">&emsp;</span>`
            }
            else {
                this.color = this.colorDefiner.defineColorForWordAtIndex(word, index)
                innerHTML += `<span style="font-sieze: 24px; color: ${this.color}">${word}</span>`
            }
        });
        return innerHTML
    }
}
