import WordsSplitter from "./wordsSplitter.js";
import WordColorDefiner from "./WordColorDefiner.js";

export default class WordBuilder {
    constructor() {
        this.splitter = new WordsSplitter();
        this.colorDefiner = new WordColorDefiner()
    }

    buildWordsForContentAsHTML(content) {
        const words = this.splitter.splitLineIntoWords(content)
        const innterHTML = this._generateWordsAsHTMLElements(words)
        return innterHTML
    }

    _generateWordsAsHTMLElements(words) {
        if (words.length == 1 && words[0].trim() == "") return `<span style="font-sieze: 24px">&nbsp;</span>`
        else return this._generateForMultiple(words)
    }

    _generateForMultiple(words) {
        let innerHTML = ''
        let color = "transparent"
        let initComment = 0;
        words.forEach((content, index) => {
            if (content == "/")
                initComment += 1;
            if (content == " ") {
                innerHTML += `<span style="font-sieze: 24px">&nbsp;</span>`
            }
            else if (initComment >= 2) {
                innerHTML += `<span style="font-sieze: 24px; color: gray">${content}</span>`
            }
            else if (content == '\t') {
                innerHTML += `<span style="font-sieze: 24px">&emsp;</span>`
            }
            else {
                color = this.colorDefiner.defineColor(content, index, words)
                innerHTML += `<span style="font-sieze: 24px; color: ${color}">${content}</span>`
            }
        });
        return innerHTML
    }
}
