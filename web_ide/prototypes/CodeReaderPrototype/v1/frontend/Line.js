import LineSplitter from "./LineSplitter.js";

export default class Line {
    constructor(index, content) {
        this.id = index;
        this.content = content;
        this.words = []
    }

    updateContent(content) {
        this.content = content
        this.buildWordsBasedOnCurrentContent()
    }

    buildWordsBasedOnCurrentContent() {
        const splitter = new LineSplitter() // Find a way to no depend on LineSplitter
        this.words = splitter.splitLineIntoWords(this.content)
    }
}