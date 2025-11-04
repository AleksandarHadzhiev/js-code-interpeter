
export default class LinesTracker {
    constructor() {
        this.size = 0
        this.currentLine = 0;
        this.lines = []
    }

    addLineToTheEnd(line) {
        this.currentLine = line
        this.size = line.id + 1
        this.lines.push(line)
    }

    updateLineAtExistignLocation(line) {
        const existingLine = this._get(line.id)
        existingLine.compareLineContentWithIncomingContentAndUpdateIfNeeded(line)
        this._updateLineWithNewLine(existingLine)
    }

    _get(id) {
        return this.lines[id]
    }

    _updateLineWithNewLine(line) {
        this.lines[line.id] = line
    }
}