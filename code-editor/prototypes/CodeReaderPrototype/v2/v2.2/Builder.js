
import Line from "./Line.js";
import LinesTracker from "./LineTracker.js";

export default class Builder {
    constructor() {
        this.list = new LinesTracker()
    }

    buildContent(content, lineId) {
        const lines = String(content).split('\n')
        /**
         * When the project is started, the initial size is 0 lines; we always start with buildAllLines(lines) 
         * expecting either 1 or more lines to be written. if it is one it is basically O(1) if more it will always be O(n)
         * Then if we are refactorig a single line, we know that 
         * 
         */
        // if (this.list.size == 0) 
        //     this._buildAllLines(lines)
        // else if (this.list.size == lines.length)
        //     this._updateAtSpecifiedPosition(lines, lineId)
        // else if (this.list.size < lines.length)
        //     this._updateAtSpecifiedPositionWithMoreLines(lines, lineId)
        // else if (this.list.size > lines.length)
        //     this._updateAtSpecifiedPositionWithLessLines(lines, lineId)
        console.log(this.list)
    }

    _buildAllLines(lines) {
        lines.forEach((content, id) => {
            const line = new Line(content)
            this.list.addNewLineAtTheEnd(line)
        });
    }

    _updateAtSpecifiedPosition(lines, lineId) {
        const line = new Line(lines[lineId])
        this.list.updateLineAtIndex(line, lineId)
    }

    _updateAtSpecifiedPositionWithMoreLines(lines, lineId) {
        if (lines.length - this.list.size == 1) {
            this._checkWhetherToUpdateLastOrInBetween(lineId, lines)
        }
    }

    _checkWhetherToUpdateLastOrInBetween(lineId, lines) {
        console.log(lineId, lines)
        if (lineId == lines.length - 1) {
            const line = new Line(lines[lineId])
            console.log("HERE")
            this.list.addNewLineAtTheEnd(line)
        }
        else {
            console.log("THERE")
            const line = new Line(lines[lineId])
            this.list.addLineInBetweenLines(line, lineId)
        }
    }

    // _updateAtSpecifiedPositionWithLessLines(lines, lineId) {
    //     console.log(lines)
    //     if (this.list.size - lines.length == 1) {
    //         console.log("HERE")
    //         if (lineId == lines.length - 1) {
    //             console.log("PEOW")
    //             this.list.removeLastLink()
    //         }
    //         else {
    //             console.log("MEOW")
    //             const line = new Line(lines[lineId], lineId)
    //             this.list.removeLinkBetweenLines(line)
    //         }
    //     }
    // }
} 