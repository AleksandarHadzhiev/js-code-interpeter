import CodeBuilder from "./CodeBuilder.js";
import PositionChangesTracker from "./PositionChangesTracker.js";

export default class ViewBuilder {
    constructor(viewToAddTo) {
        this.numberOfOldLines = 0;
        this.changesTracker = new PositionChangesTracker()
        this.codeBuilder = new CodeBuilder(viewToAddTo)
    }

    buildCodeForLines(lines) {
        if (this.numberOfOldLines == 0)
            this.codeBuilder.buildLines(lines)
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
        else this.codeBuilder.updateLinesBetweenStartingAndEndingLine(
            this.changesTracker.firstLineOfChange - 1,
            newLines.length - 1, newLines)
    }

    _handleEdgeCases(newLines) {
        const line = this.changesTracker.firstLineOfChange != this.changesTracker.newFirstLineOfChange ?
            this.changesTracker.newFirstLineOfChange : this.changesTracker.firstLineOfChange
        const index = line - 1;
        this.codeBuilder.updateLineAtIndexWithNewContent(index, newLines[index])
    }

    _updateWhenNumbersOfLinesIsDecreased(newLines, differenceInSize) {
        differenceInSize = differenceInSize * -1;
        this.codeBuilder.bringToSameSize(differenceInSize, this.changesTracker)
        if (this.changesTracker.lastLineOfChange - 1 >= newLines.length)
            this.codeBuilder.updateLinesBetweenStartingAndEndingLine(
                this.changesTracker.firstLineOfChange - 1, newLines.length - 1, newLines
            )
        else this.codeBuilder.updateLinesBetweenStartingAndEndingLine(
            this.changesTracker.newFirstLineOfChange - 1,
            this.changesTracker.lastLineOfChange - 1, newLines
        )
    }

    _updateWheNumbersOfLinesIsIncreased(newLines, differenceInSize) {
        if (this.changesTracker.firstLineOfChange == this.numberOfOldLines)
            this.codeBuilder.updateLinesBetweenStartingAndEndingLine(
                this.changesTracker.firstLineOfChange - 1, newLines.length - 1, newLines
            )
        else if (differenceInSize == 1) this.codeBuilder.updatePreviousAndCurrentLines(newLines, this.changesTracker)
        else if (this.changesTracker.firstLineOfChange == 1 && this.changesTracker.lastLineOfChange == this.numberOfOldLines) this.codeBuilder.refreshWithNewLines(newLines)
        else if (this.changesTracker.firstLineOfChange == this.changesTracker.lastLineOfChange && this.changesTracker.lastLineOfChange <= this.numberOfOldLines)
            this.codeBuilder.updateWhenNewContentIsMoreLinesAndItIsDirectInsertion(differenceInSize, newLines, this.changesTracker)
        else if (this.changesTracker.firstLineOfChange < this.changesTracker.lastLineOfChange && this.changesTracker.lastLineOfChange <= this.numberOfOldLines)
            this.codeBuilder.updateWhenNewContentIsMoreLinesAndItIsInsertionBetweenLines(differenceInSize, newLines, this.changesTracker)
    }
}
