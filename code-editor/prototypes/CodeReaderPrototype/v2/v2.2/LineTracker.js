export default class LinesTracker {
    constructor() {
        this.lines = []
        this.size = 0
        this.currentLine = null
    }

    addNewLineAtTheEnd(line) {
        this.lines.push(line)
        this.currentLine = line
        this.size = this.lines.length
    }

    addLineInBetweenLines(line, lineId) {
        this.lines = this._insertLineInBetweenAndReturnAsNewList(line, lineId)
        this.size = this.lines.length
        this.currentLine = line
    }

    _insertLineInBetweenAndReturnAsNewList(line, lineId) {
        const firstHalf = this.lines.slice(0, lineId)
        const secondHalf = this.lines.slice(lineId, this.size)
        firstHalf.push(line)
        return firstHalf.concat(secondHalf)
    }

    removeLastLine() {
        this.lines.pop()
        this.size = this.lines.length
        this.currentLine = this._get(this.size - 1)
    }

    updateLineAtIndex(line, index) {
        this.currentLine = this._get(index)
        this.currentLine.updateContent(line)
    }

    _get(id) {
        return this.lines[id]
    }
}