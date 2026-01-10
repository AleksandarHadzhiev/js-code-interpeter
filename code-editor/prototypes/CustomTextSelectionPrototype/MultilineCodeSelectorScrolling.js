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
     * @param {Event} mouseMoveEvent
     * @returns {Map} the coordinates for each line in the selection
     */
    markContent(firstVisibleLine, lastVisibleLine, mouseMoveEvent) {
        console.log(firstVisibleLine, lastVisibleLine)
        // First I need to know whether my startingRange position is still visible on the screen
        // I will need both the first visible and the last visible line on the screen to be present
        this._defineStartingPositionBasedONVisibleLinesOnTheScreen(firstVisibleLine, lastVisibleLine, mouseMoveEvent)
        return this.coordinatesForSelectedLines
    }

    /**
     * @param {Number} firstVisibleLine
     * @param {Number} lastVisibleLine 
     * @param {Event} mouseMoveEvent 
    */
    _defineStartingPositionBasedONVisibleLinesOnTheScreen(firstVisibleLine, lastVisibleLine, mouseMoveEvent) {
        // I will check if it is within the first Visible line and the last visible line, but what if it is not?
        console.log(mouseMoveEvent)
        // MOUSE MOVE EVENT WILL BE USED FOR THE EDGE CASES WHICH NEED TO BE COVERED
        const idOfStartingLine = Number(this.startingRange.lineOfStartContainer.id)
        if (firstVisibleLine <= idOfStartingLine && idOfStartingLine <= lastVisibleLine) {
            // this.startingPosition = new Position(this.startingRange) // can be either the sarting range or the end of the release range
            // depends on what direction the selection is taking.
            // ** IMPORTANT ** -> may have the same edge cases as the single line selection where the end container and start container are breaking depending on the direction of the flow
            // if the firs container of the release range is equal to the starting range -> starting range is first line/release range end container == last line
            // else if the last container of the release range is equal to the starting range -> starting ranse if last line/ release range start container == first line

        }
        else if (firstVisibleLine > idOfStartingLine) {
            // This flow has two possibilities
            // the the last line becomes the one with the mouse on itself - partially colorised
            // the firs line becomes the first visible line - fully colorised
            const lastLine = {
                container: this.releasingRange.endContainer,
                caretOffset: this.releasingRange.endOffset,
                containerOffset: this.releasingRange.endContainer.offsetLeft,
                topOffset: this.releasingRange.lineOfEndContainer.offsetTop
            }
            this.releasingPosititon = new SelectionPosition(lastLine.caretOffset, lastLine.container)
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
                containerOffset: this.releasingRange.endContainer.offsetLeft,
                topOffset: this.releasingRange.lineOfEndContainer.offsetTop
            }
            this.startingPosition = new SelectionPosition(
                firstLine.caretOffset, firstLine.container
            )
            this._calculateCoordinatesForFirstLine()
            this._calculateTheCoordinatesOfAllLinesInBetween(
                Number(this.startingPosition.line.id) + 1,
                lastVisibleLine - 1)
            this._calculateCoordinatesForLineAtIndex(lastVisibleLine)
        }
    }

    _calculateCoordinatesForFirstLine() {
        const coordiantesForFirstLine = calculateCoordinatesOfFirstSelectedLine(this.startingPosition)
        this.coordinatesForSelectedLines.set(this.startingPosition.line.id, coordiantesForFirstLine)
    }


    _calculateTheCoordinatesForLastLine() {
        const coordiantesForLastLine = calculateCoordinatesOfLastSelectedLine(this.releasingPosititon)
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