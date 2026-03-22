import WordBuilder from "../Word/WordBuilder.js";
import Line from "./Line.js";
import LineSplitter from "./LineSplitter.js";

export default class LineBuilder {

    constructor(hintTracker, wordTracker) {
        this.hintTracker = hintTracker;
        this.wordTracker = wordTracker;
        this.lineSplitter = new LineSplitter()
    }

    buildLine(content, id) {
        const line = new Line(content, id)
        return line
    }

    buildWords(line) {
        const builder = new WordBuilder(this.wordTracker);
        const words = this.lineSplitter.splitLineIntoWords(line.content)
        line.wordElements = words
        const wordsAsObjects = builder.trasnformWords(words, line, this.hintTracker)
        line.updateWords(wordsAsObjects, this.wordTracker)
    }
}
