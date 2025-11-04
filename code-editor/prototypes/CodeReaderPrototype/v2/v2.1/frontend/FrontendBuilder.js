import Line from "./Line.js"
import LinesTracker from "./LinesTracker.js"


export default class FrontendBuilder {
    constructor() {
        // The frontend contains its oldContent and its newContent;
        // It should find the differences between the two and change only the places where change is needed
        this.content = new LinesTracker()
        this.oldContentLength = this.content.size
    }

    buildContentKnowingLineOfChanges(content, lineId) {
        const lines = String(content).split('\n')
        const length = lines.length
        if (this.oldContentLength == 0 && length > 0)
            this._insertAllLines(lines)
        else if (this.oldContentLength == length)
            this._updateAtSpecificLine(lines, lineId)
        else if (this.oldContentLength < length) {

        }
        console.log(this.content)
    }

    _insertAllLines(lines) {
        lines.forEach((content, id) => {
            const line = new Line(id, content)
            this.content.addLineToTheEnd(line)
        });
        this.oldContentLength = this.content.size
    }

    _updateAtSpecificLine(lines, lineId) {
        const content = lines[lineId]
        const line = new Line(lineId, content)
        this.content.updateLineAtExistignLocation(line)
    }

    _updateLinesWithNewLinesStartingFromTheLastThatExists
}