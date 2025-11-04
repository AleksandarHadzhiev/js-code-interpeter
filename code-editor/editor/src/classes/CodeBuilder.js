import LineBUilder from "./LineBuilder.js";

export default class CodeBuilder {
    constructor(viewBlock) {
        this.viewBlock = viewBlock
    }

    buildLines(lines) {
        for (let index = 0; index < lines.length; index++) {
            this._buildLineAndAppend(lines, index)
        }
    }

    _buildLineAndAppend(lines, index) {
        const content = lines[index];
        this._updateLineWithNewContent(content)
    }

    _updateLineWithNewContent(content) {
        const lineElement = this._constructLineForContent(content)
        this.viewBlock.appendChild(lineElement)
    }

    _constructLineForContent(content) {
        const lineBuilder = new LineBUilder(content)
        const lineElement = lineBuilder.buildLine()
        return lineElement
    }

    updateLinesBetweenStartingAndEndingLine(startingLine, endingLine, lines) {
        for (let index = startingLine; index <= endingLine; index++) {
            const content = lines[index];
            this._updateOrBuildNewOne(index, content)
        }
    }

    _updateOrBuildNewOne(index, content) {
        let line = this.viewBlock.childNodes[index]
        if (line) this.updateLineAtIndexWithNewContent(index, content)
        else this._updateLineWithNewContent(content)
    }

    updateLineAtIndexWithNewContent(index, content) {
        const line = this.viewBlock.childNodes[index]
        const lineElement = new LineBUilder(content).buildLine()
        this.viewBlock.replaceChild(lineElement, line)
    }

    bringToSameSize(differenceInSize, changesTracker) {
        while (differenceInSize > 0) {
            this.viewBlock.childNodes[changesTracker.newFirstLineOfChange].remove()
            differenceInSize--;
        }
    }

    updateWhenNewContentIsMoreLinesAndItIsDirectInsertion(differenceInSize, contentAsLines, changesTracker) {
        for (let index = changesTracker.firstLineOfChange - 1; index < changesTracker.firstLineOfChange + differenceInSize; index++) {
            const content = contentAsLines[index];
            if (index == changesTracker.lastLineOfChange - 1) { this.updateLineAtIndexWithNewContent(index, content) }
            else {
                const lineElement = this._constructLineForContent(content)
                const child = this.viewBlock.childNodes[index]
                this.viewBlock.insertBefore(lineElement, child)
            }
        }
    }

    updateWhenNewContentIsMoreLinesAndItIsInsertionBetweenLines(differenceInSize, contentAsLines, changesTracker) {
        for (let index = changesTracker.firstLineOfChange - 1; index <= changesTracker.lastLineOfChange - 1 + differenceInSize; index++) {
            const content = contentAsLines[index];
            if (index >= changesTracker.lastLineOfChange) {
                const lineElement = this._constructLineForContent(content)
                const child = this.viewBlock.childNodes[index]
                this.viewBlock.insertBefore(lineElement, child)
            }
            else this.updateLineAtIndexWithNewContent(index, content)
        }
    }

    updatePreviousAndCurrent(newLines, changesTracker) {
        const indexOfPreviousLine = changesTracker.newFirstLineOfChange - 2 // - 2 because we talk about indexes not number of lines
        const contentOfPreviousLine = newLines[indexOfPreviousLine]
        this.updateLineAtIndexWithNewContent(indexOfPreviousLine, contentOfPreviousLine)
        const indexOfline = changesTracker.newFirstLineOfChange - 1
        const content = newLines[indexOfline]
        const line = this._constructLineForContent(content)
        const child = this.viewBlock.childNodes[indexOfline]
        this.viewBlock.insertBefore(line, child)
    }

    refreshWithNewLines(newLines) {
        this.viewBlock.replaceChildren()
        this.buildLines(newLines)
    }

}