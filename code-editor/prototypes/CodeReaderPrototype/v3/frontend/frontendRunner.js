import TextChangesTracker from "./textChangesTracker.js"
import LineBuilder from "./lineBuilder.js";

export default class FrontendRunner {
    constructor(viewToAddTo) {
        this.numberOfOldLines = 0;
        this.changesTracker = new TextChangesTracker()
        this.lineBuilder = new LineBuilder(viewToAddTo)
    }

    buildCodeForLines(lines) {
        if (this.numberOfOldLines == 0)
            this.lineBuilder.buildLines(lines)
        else
            this._updateOldLinesWithNewLines(lines)
        this.numberOfOldLines = lines.length
    }

    _updateOldLinesWithNewLines(newLines) {
        const differenceInSize = newLines.length - this.numberOfOldLines
        if (differenceInSize == 0) this._updateWhenNumbersOfLiensStaysTheSame(newLines)
        else if (differenceInSize < 0) this._updateWhenNumbersOfLinesIsDecreased(newLines, differenceInSize)
        else if (differenceInSize > 0) this._updateWheNumbersOfLinesIsIncreased(newLines, differenceInSize)
    }

    _updateWhenNumbersOfLiensStaysTheSame(newLines) {
        if (this.changesTracker.firstLineOfChange == this.changesTracker.lastLineOfChange) this._handleEdgeCases(newLines)
        else this.lineBuilder.updateLinesBetweenStartingAndEndingLine(
            this.changesTracker.firstLineOfChange - 1,
            newLines.length - 1, newLines)
    }

    _handleEdgeCases(newLines) {
        const line = this.changesTracker.firstLineOfChange != this.changesTracker.newFirstLineOfChange ?
            this.changesTracker.newFirstLineOfChange : this.changesTracker.firstLineOfChange
        const index = line - 1;
        this.lineBuilder.updateLineAtIndexWithNewContent(index, newLines[index])
    }

    _updateWhenNumbersOfLinesIsDecreased(newLines, differenceInSize) {
        differenceInSize = differenceInSize * -1;
        this.lineBuilder.bringToSameSize(differenceInSize, this.changesTracker)
        if (this.changesTracker.lastLineOfChange - 1 >= newLines.length)
            this.lineBuilder.updateLinesBetweenStartingAndEndingLine(
                this.changesTracker.firstLineOfChange - 1, newLines.length - 1, newLines
            )
        else this.lineBuilder.updateLinesBetweenStartingAndEndingLine(
            this.changesTracker.newFirstLineOfChange - 1,
            this.changesTracker.lastLineOfChange - 1, newLines
        )
    }

    _updateWheNumbersOfLinesIsIncreased(newLines, differenceInSize) {
        if (this.changesTracker.firstLineOfChange == this.numberOfOldLines)
            this.lineBuilder.updateLinesBetweenStartingAndEndingLine(
                this.changesTracker.firstLineOfChange - 1, newLines.length - 1, newLines
            )
        else if (differenceInSize == 1) this.lineBuilder.updatePreviousAndCurrent(newLines, this.changesTracker)
        else if (this.changesTracker.firstLineOfChange == 1 && this.changesTracker.lastLineOfChange == this.numberOfOldLines) this.lineBuilder.refresh(newLines)
        else if (this.changesTracker.firstLineOfChange == this.changesTracker.lastLineOfChange && this.changesTracker.lastLineOfChange <= this.numberOfOldLines)
            this.lineBuilder.updateWhenNewContentIsMoreLinesAndItIsDirectInsertion(differenceInSize, newLines, this.changesTracker)
        else if (this.changesTracker.firstLineOfChange < this.changesTracker.lastLineOfChange && this.changesTracker.lastLineOfChange <= this.numberOfOldLines)
            this.lineBuilder.updateWhenNewContentIsMoreLinesAndItIsInsertionBetweenLines(differenceInSize, newLines, this.changesTracker)
    }
}

/**
 * I need to colorise the words now and then what?
 *   - Start building the scopeTracker - so that i can redirect.
 *   - Or build the search function? (within a file)
 *   - Or build the replace function? (within a file)
 * Then what?
 *   - The Sidebar?
 *   - The terminal? - limit the commands that i can do with it, because it wont be a real terminal
 */