export default class LineTracker {
    constructor() {
        this.trackedLines = new Map();
    }

    addLine(line) {
        this.trackedLines.set(line.id, line)
        // line.words.forEach(word => {
        //     wordsTracker.addWordToWords(word)
        // });
        // return wordsTracker
    }

    removeLine(line) {
        this.trackedLines.delete(line.id)
    }

    getLineForId(id) {
        return this.trackedLines.get(id)
    }

    cleanTracker() {
        this.trackedLines = new Map()
    }
}
