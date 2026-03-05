import CustomRangeElement from "./CustomRangeElement.js";
import MarkedLineCoordinates from "./MarkedLineCoordinates.js";
import calculateTotalLeftOffsetOfCaretInTheLine from "./Caclulators/CaretLeftOffsetCalculator.js";
import { CaretLeftOffsetDTO, SelectedTextDTO } from "./DTOs/caretDTO.js";
import calculateWidthOfSelectedText from "./Caclulators/SelectedTextWidthCalculator.js";
import SelectionPosition from "./SelectionPosition.js";
import { calculateCoordinatesOfFirstSelectedLine, calculateCoordinatesOfLastSelectedLine, calculateCoordinatesOfLineInBetweenFirstAndLast } from "./Caclulators/MultilineTextSelectionCalculator.js";

class Position {
    /**
     * 
     * @param {CustomRangeElement} range 
     */
    constructor(range) {
        this.container = range.startContainer
        this.line = range.lineOfStartContainer
        this.leftOffset = range.startContainerOffset
        this.caretOffset = range.startOffset
    }
}

export default class MultilineCodeSelectorScrolling {
    /**
     * 
     * @param {CustomRangeElement} startingRange 
     * @param {CustomRangeElement} releasingRange 
     */
    constructor(startingRange, releasingRange) {
        this.startingRange = startingRange
        this.releasingRange = releasingRange
        this.startingPosition = null
        this.releasingPosititon = null
        this.coordinatesForSelectedLines = new Map()
    }

    /**
     * @param {Number} firstVisibleLine
     * @param {Number} lastVisibleLine 
     * @returns {Map} the coordinates for each line in the selection
     */
    displayMarker(firstVisibleLine, lastVisibleLine) {
        const idOfStartingPOsition = Number(this.startingPosition.line.id)
        const idOfReleasingPosition = Number(this.releasingPosititon.line.id)
        const bothLinesAreVisible = this._bothPositionsAreOnTheScreen(firstVisibleLine, lastVisibleLine)
        if (bothLinesAreVisible) {
            console.log("BOTH LINES ARE VISIBLE")
            this._calculateCoordinatesForFirstLine()
            this._calculateTheCoordinatesOfAllLinesInBetween(
                Number(this.startingPosition.line.id) + 1,
                Number(this.releasingPosititon.line.id) - 1)
            this._calculateTheCoordinatesForLastLine()
        }
        else if (idOfStartingPOsition >= firstVisibleLine && idOfStartingPOsition <= lastVisibleLine) {
            console.log("ONLY FIRST LINE IS VISIBLE")
            this._calculateCoordinatesForFirstLine()
            this._calculateTheCoordinatesOfAllLinesInBetween(
                Number(this.startingPosition.line.id) + 1,
                lastVisibleLine - 1)
        }
        else if (idOfReleasingPosition >= firstVisibleLine && idOfReleasingPosition <= lastVisibleLine) {
            console.log("ONLY LAST LINE IS VISIBLE")
            this._calculateTheCoordinatesOfAllLinesInBetween(
                firstVisibleLine,
                Number(this.releasingPosititon.line.id) - 1)
            this._calculateTheCoordinatesForLastLine()
        }
        else if (lastVisibleLine < idOfReleasingPosition) {
            console.log("NEITHER LINE IS VISIBLE")
            this._calculateTheCoordinatesOfAllLinesInBetween(
                firstVisibleLine,
                lastVisibleLine - 1)
        }
        return this.coordinatesForSelectedLines
    }

    /**
     * @param {Number} firstVisibleLine
     * @param {Number} lastVisibleLine 
     * @returns {Boolean} true if both positions are visible, false otherwise
     */
    _bothPositionsAreOnTheScreen(firstVisibleLine, lastVisibleLine) {
        const idOfStartingPOsition = Number(this.startingPosition.line.id)
        const idOfReleasingPosition = Number(this.releasingPosititon.line.id)
        if (firstVisibleLine <= idOfStartingPOsition && firstVisibleLine < idOfReleasingPosition && idOfStartingPOsition < lastVisibleLine && idOfReleasingPosition <= lastVisibleLine) {
            return true
        }
        return false
    }

    /**
     * @param {Number} firstVisibleLine
     * @param {Number} lastVisibleLine 
     * @returns {Map} the coordinates for each line in the selection
     */
    markContent(firstVisibleLine, lastVisibleLine) {
        console.log(firstVisibleLine, lastVisibleLine)
        // First I need to know whether my startingRange position is still visible on the screen
        // I will need both the first visible and the last visible line on the screen to be present
        this._defineStartingPositionBasedONVisibleLinesOnTheScreen(firstVisibleLine, lastVisibleLine)
        return this.coordinatesForSelectedLines
    }

    /**
     * @param {Number} firstVisibleLine
     * @param {Number} lastVisibleLine 
    */
    _defineStartingPositionBasedONVisibleLinesOnTheScreen(firstVisibleLine, lastVisibleLine) {
        // MOUSE MOVE EVENT WILL BE USED FOR THE EDGE CASES WHICH NEED TO BE COVERED
        const idOfStartingLine = Number(this.startingRange.lineOfStartContainer.id)
        if (firstVisibleLine <= idOfStartingLine && idOfStartingLine <= lastVisibleLine) {
            //------- ** IMPORTANT ** ----- NEEDS TO BE CLEANED UP A LOT, THIS IS COMPLETELY WRONG IN A SENSE OF CLEAN AND READEABLE AND MAINTAINABLE CODE
            // this.startingPosition = new Position(this.startingRange) // can be either the sarting range or the end of the release range
            // depends on what direction the selection is taking.
            // ** IMPORTANT ** -> may have the same edge cases as the single line selection where the end container and start container are breaking depending on the direction of the flow
            // if the firs container of the release range is equal to the starting range -> starting range is first line/release range end container == last line
            // else if the last container of the release range is equal to the starting range -> starting ranse if last line/ release range start container == first line
            console.log(this.releasingRange.lineOfEndContainer)
            console.log(this.releasingRange.lineOfStartContainer)
            const idOfLastLineOfReleaseRange = Number(this.releasingRange.lineOfEndContainer.id)
            const idOfFirstLineOfReleaseRange = Number(this.releasingRange.lineOfStartContainer.id)
            if (idOfStartingLine == idOfLastLineOfReleaseRange) {
                // additional checks for whether the idOfStartingLine should be before or after
                console.log("idOfStartingLine == idOfLastLineOfReleaseRange")
                console.log(this.releasingRange)
                if (idOfStartingLine > idOfFirstLineOfReleaseRange) {
                    this.startingPosition = new SelectionPosition(
                        this.releasingRange.startOffset, this.releasingRange.startContainer,
                        this.releasingRange.startContainerOffset, this.releasingRange.offsetTopForStartingLine
                    )
                    this.releasingPosititon = new SelectionPosition(
                        this.startingRange.startOffset, this.startingRange.startContainer,
                        this.startingRange.startContainerOffset, this.startingRange.offsetTopForStartingLine)
                }
                else {
                    this.releasingPosititon = new SelectionPosition(
                        this.releasingRange.startOffset, this.releasingRange.startContainer,
                        this.releasingRange.startContainerOffset, this.releasingRange.offsetTopForStartingLine
                    )
                    this.startingPosition = new SelectionPosition(
                        this.startingRange.startOffset, this.startingRange.startContainer,
                        this.startingRange.startContainerOffset, this.startingRange.offsetTopForStartingLine)
                }
                this._calculateCoordinatesForFirstLine()
                this._calculateTheCoordinatesOfAllLinesInBetween(
                    Number(this.startingPosition.line.id) + 1,
                    Number(this.releasingPosititon.line.id) - 1)
                this._calculateTheCoordinatesForLastLine()
            }
            else {
                console.log("idOfStartingLine == idOfFirstLineOfReleaseRange")
                console.log(this.releasingRange)
                const idOfFirstLineOfReleaseRange = Number(this.releasingRange.startContainer.id)
                console.log(`
                    ID OF FRIST LINE OF RELEASE RANGE: ${idOfFirstLineOfReleaseRange}
                    ID OF LAST LINE OF RELEASE RANGE: ${idOfLastLineOfReleaseRange}
                    ID OF LINE OF STARTING RANGE: ${idOfStartingLine}
                    `
                )
                if (idOfFirstLineOfReleaseRange == 0) {
                    console.log("WORK ONLY WITH THE LAST LINE OF RANGE")
                    if (idOfLastLineOfReleaseRange < idOfStartingLine) {
                        console.log("idOfLastLineOfReleaseRange < idOfStartingLine")
                        this.startingPosition = new SelectionPosition(
                            this.releasingRange.endOffset, this.releasingRange.endContainer,
                            this.releasingRange.endContainerOffset, this.releasingRange.offsetTopForEndingLine
                        )
                        this.releasingPosititon = new SelectionPosition(
                            this.startingRange.startOffset, this.startingRange.startContainer,
                            this.startingRange.startContainerOffset, this.startingRange.offsetTopForStartingLine)
                        console.log(this.startingPosition)
                        console.log(this.releasingPosititon)
                        this._calculateCoordinatesForFirstLine()
                        this._calculateTheCoordinatesOfAllLinesInBetween(
                            Number(this.startingPosition.line.id) + 1,
                            Number(this.releasingPosititon.line.id) - 1)
                        this._calculateTheCoordinatesForLastLine()
                    }
                    else {
                        console.log("idOfLastLineOfReleaseRange > idOfStartingLine")
                        this.startingPosition = new SelectionPosition(
                            this.startingRange.startOffset, this.startingRange.startContainer,
                            this.startingRange.startContainerOffset, this.startingRange.offsetTopForStartingLine
                        )
                        this.releasingPosititon = new SelectionPosition(
                            this.releasingRange.endOffset, this.releasingRange.endContainer,
                            this.releasingRange.endContainerOffset, this.releasingRange.offsetTopForEndingLine)
                        this._calculateCoordinatesForFirstLine()
                        this._calculateTheCoordinatesOfAllLinesInBetween(
                            Number(this.startingPosition.line.id) + 1,
                            Number(this.releasingPosititon.line.id) - 1)
                        this._calculateTheCoordinatesForLastLine()
                    }
                }
            }
        }
        else if (firstVisibleLine > idOfStartingLine) {
            // This flow has two possibilities
            // the the last line becomes the one with the mouse on itself - partially colorised
            // the firs line becomes the first visible line - fully colorised
            const lastLine = {
                container: this.releasingRange.endContainer,
                caretOffset: this.releasingRange.endOffset,
                containerOffset: this.releasingRange.endContainerOffset,
                topOffset: this.releasingRange.offsetTopForEndingLine
            }
            this.startingPosition = new SelectionPosition(
                this.startingRange.startOffset, this.startingRange.startContainer,
                this.startingRange.startContainerOffset, this.startingRange.offsetTopForStartingLine
            )
            this.releasingPosititon = new SelectionPosition(
                lastLine.caretOffset, lastLine.container,
                lastLine.containerOffset, lastLine.topOffset)
            this._calculateCoordinatesForLineAtIndex(firstVisibleLine)
            this._calculateTheCoordinatesOfAllLinesInBetween(
                firstVisibleLine + 1,
                Number(this.releasingPosititon.line.id) - 1)
            this._calculateTheCoordinatesForLastLine()
            console.log(this.coordinatesForSelectedLines)
            console.log(lastLine)
        }
        else if (lastVisibleLine < idOfStartingLine) {
            // THis flow also has two possibilities
            // the last visible line becomes the last line will full coloring - fully colorised
            // the firs line becomes the one which has the mouse on itself - partially colorised
            console.log(this.releasingRange)
            console.log(this.releasingRange.endContainer.parentElement)
            const firstLine = {
                container: this.releasingRange.endContainer,
                caretOffset: this.releasingRange.endOffset,
                containerOffset: this.releasingRange.endContainerOffset,
                topOffset: this.releasingRange.offsetTopForEndingLine
            }
            this.startingPosition = new SelectionPosition(
                firstLine.caretOffset, firstLine.container,
                firstLine.containerOffset, firstLine.topOffset
            )
            this.releasingPosititon = new SelectionPosition(
                this.startingRange.startOffset, this.startingRange.startContainer,
                this.startingRange.startContainerOffset, this.startingRange.offsetTopForStartingLine)
            this._calculateCoordinatesForFirstLine()
            this._calculateTheCoordinatesOfAllLinesInBetween(
                Number(this.startingPosition.line.id) + 1,
                lastVisibleLine - 1)
            console.log(lastVisibleLine)
            this._calculateCoordinatesForLineAtIndex(lastVisibleLine - 1)
        }
    }

    _calculateCoordinatesForFirstLine() {
        const coordiantesForFirstLine = calculateCoordinatesOfFirstSelectedLine(this.startingPosition)
        this.coordinatesForSelectedLines.set(this.startingPosition.line.id, coordiantesForFirstLine)
    }


    _calculateTheCoordinatesForLastLine() {
        const coordiantesForLastLine = calculateCoordinatesOfLastSelectedLine(this.releasingPosititon)
        console.log(coordiantesForLastLine)
        this.coordinatesForSelectedLines.set(this.releasingPosititon.line.id, coordiantesForLastLine)
    }
    /**
     * 
     * @param {Number} index 
     */
    _calculateCoordinatesForLineAtIndex(index) {
        const line = document.getElementById(String(index))
        const coordinatesForLine = calculateCoordinatesOfLineInBetweenFirstAndLast(line)
        this.coordinatesForSelectedLines.set(line.id, coordinatesForLine)

    }

    /**
     * 
     * @param {Number} firstLineId 
     * @param {Number} lastLineId 
     */
    _calculateTheCoordinatesOfAllLinesInBetween(firstLineId, lastLineId) {
        for (let index = firstLineId; index <= lastLineId; index++) {
            this._calculateCoordinatesForLineAtIndex(index)
        }
    }

}