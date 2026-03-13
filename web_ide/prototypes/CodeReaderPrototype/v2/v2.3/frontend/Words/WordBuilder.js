import LineSplitter from "./LineSplitter.js"
import WordColorDefiner from "./WordColorDefiner.js"

export default class WordBuilder {
    constructor(content) {
        this.writer = document.getElementById('code-writer')
        this.words = new LineSplitter().splitLineIntoWords(content)
        this.colorDefiner = new WordColorDefiner()

    }

    buildWordsAndAttachToLine(lineElement) {
        let innertTEXT = ""
        if (this.words.length == 1 && this.words[0] == "") {
            lineElement.innerHTML = `<span style="font-sieze: 24px">&nbsp;</span>`
        }
        else {
            this.words.forEach((content, index) => {
                if (content == " ") {
                    innertTEXT += `<span style="font-sieze: 24px">&nbsp;</span>`
                }
                else {
                    const color = this.colorDefiner.defineColor(content, index, this.words)
                    innertTEXT += `<span style="font-sieze: 24px; color: ${color}">${content}</span>`
                }
            });
            lineElement.innerHTML = innertTEXT
        }
    }
}