import CustomRangeElement from "./CustomRangeElement.js";
import MarkedLineCoordinates from "./MarkedLineCoordinates.js";
import calculateTotalLeftOffsetOfCaretInTheLine from "./Caclulators/CaretLeftOffsetCalculator.js";
import { CaretLeftOffsetDTO, SelectedTextDTO } from "./DTOs/caretDTO.js";
import calculateWidthOfSelectedText from "./Caclulators/SelectedTextWidthCalculator.js";
import SelectionPosition from "./SelectionPosition.js";
import { calculateCoordinatesOfFirstSelectedLine, calculateCoordinatesOfLastSelectedLine, calculateCoordinatesOfLineInBetweenFirstAndLast } from "./Caclulators/MultilineTextSelectionCalculator.js";


export default class MultilineCodeSelector {
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

    markContent() {
        this._definePositionsOfTheSelection()
        this._findTheCoordinatesForTheSelection()
        return this.coordinatesForSelectedLines
    }

    _definePositionsOfTheSelection() {
        const lineOfStartingRange = Number(this.startingRange.lineOfStartContainer.id)
        const startingPositionOfReleaseRange = this._getStartingPositionOfReleaseRange()
        const lineOfStartingPositionOfReleaseRange = Number(startingPositionOfReleaseRange.container.parentElement.id)
        if (lineOfStartingRange <= lineOfStartingPositionOfReleaseRange) {
            this.startingPosition = new SelectionPosition(this.startingRange.startOffset, this.startingRange.startContainer)
            this.releasingPosititon = new SelectionPosition(this.releasingRange.endOffset, this.releasingRange.endContainer)
        }
        else {
            this.startingPosition = startingPositionOfReleaseRange
            this.releasingPosititon = new SelectionPosition(this.startingRange.endOffset, this.startingRange.endContainer)
        }
    }

    _getStartingPositionOfReleaseRange() {
        const idOfLastLineInRangeAsANumber = Number(this.releasingRange.lineOfEndContainer.id)
        const idOfFirstLineInrangeAsANumber = Number(this.releasingRange.lineOfStartContainer.id)
        if (idOfFirstLineInrangeAsANumber < idOfLastLineInRangeAsANumber)
            return new SelectionPosition(this.releasingRange.startOffset, this.releasingRange.startContainer)
        return new SelectionPosition(this.releasingRange.endOffset, this.releasingRange.endContainer)
    }

    _findTheCoordinatesForTheSelection() {
        this._findTheCoordinatesForFirstLine()
        this._findTheCoordinatesOfAllLinesInBetween()
        this._findTheCoordinatesForLastLine()
    }

    _findTheCoordinatesForFirstLine() {
        const coordiantesForFirstLine = calculateCoordinatesOfFirstSelectedLine(this.startingPosition)
        this.coordinatesForSelectedLines.set(this.startingPosition.line.id, coordiantesForFirstLine)
    }

    _findTheCoordinatesOfAllLinesInBetween() {
        const firstLineInBetween = Number(this.startingPosition.line.id) + 1
        const lastLineInBetween = Number(this.releasingPosititon.line.id) - 1
        for (let index = firstLineInBetween; index <= lastLineInBetween; index++) {
            this._findTheCoordinatesForLineAtIndex(index)
        }
    }

    /**
     * 
     * @param {Number} index the index of the line 
     */
    _findTheCoordinatesForLineAtIndex(index) {
        const line = document.getElementById(`${index}`);
        if (line) {
            const coordiantesForLineInBetween = calculateCoordinatesOfLineInBetweenFirstAndLast(line)
            this.coordinatesForSelectedLines.set(line.id, coordiantesForLineInBetween)
        }
    }

    _findTheCoordinatesForLastLine() {
        const coordiantesForLastLine = calculateCoordinatesOfLastSelectedLine(this.releasingPosititon)
        this.coordinatesForSelectedLines.set(this.releasingPosititon.line.id, coordiantesForLastLine)
    }
}