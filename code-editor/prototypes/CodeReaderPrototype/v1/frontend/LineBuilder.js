import Line from "./Line.js"
import LineTrackerForFrontend from "./LineTracker.js"

export default class LineBuilder {
    constructor() {
        this.tracker = new LineTrackerForFrontend()
    }

    writeLineWithIdAndContentAndGetRefactoredLines(id, content) {
        const existingLine = this._getLineForId(id)
        if (existingLine) existingLine.updateContent(content)
        else this._createLineAndAppendToLineTracker(id, content)
        return this.tracker.getAllLines()
    }

    _getLineForId(id) {
        if (this.tracker.getLineForId(id))
            return this.tracker.getLineForId(id)
        return null
    }

    _createLineAndAppendToLineTracker(id, content) {
        const line = new Line(id, content)
        this.tracker.addLine(line)
    }

    writeMultipleLinesAndGetRefactoredLines(lines) {
        console.log(lines)
        lines.forEach((content, index) => {
            this.writeLineWithIdAndContentAndGetRefactoredLines(index, content)
        });
        return this.tracker.getAllLines()
    }
}