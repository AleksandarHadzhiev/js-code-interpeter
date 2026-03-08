import MarkedLineCoordinates from "./markedLineCoordinates.js"
import calculateTotalLeftOffsetOfCaretInTheLine from "../calculators/caretLeftOffsetCalculator.js"
import { CaretLeftOffsetDTO } from "../dtos/caretDTOs.js"
import calculateWidthForText from "../calculators/widthOfTextCalculator.js"

class MarkedPoint {
    /**
 * 
 * @param {Number} top 
 * @param {Number} left 
 * @param {Number} width 
 * @param {Number} lineId 
 */
    constructor(top, left, width, lineId) {
        this.top = top
        this.left = left
        this.lineId = lineId
        this.width = width
    }
}

export default class LineColoriser {
    /**
     * 
     * @param {CustomRangeElement} startingPoint 
     * @param {CustomRangeElement} endingPoint 
     * @param {HTMLElement} contentElement 
     */
    constructor(startingPoint, endingPoint, contentElement) {
        this.startingPoint = startingPoint
        this.endingPoint = endingPoint
        this.coordinatesToHighlight = new Map()
        this.startingMarkedPoint = null
        this.endingMarkedPoint = null
        this.contentElement = contentElement
    }

    /**
     * 
     * @param {Number} firstVisibleLine 
     * @param {Number} lastVisibleLine 
     */
    coloriseLinesforLeftBetweenFirstAndLastVisibleLine(firstVisibleLine, lastVisibleLine) {
        this.coordinatesToHighlight.clear()
        const lineOfStartingPoint = Number(this.startingPoint.lineOfStartContainer.id)
        const startingLineOfEndingPoint = Number(this.endingPoint.lineOfStartContainer.id)
        const endingLineOfEndingPoint = Number(this.endingPoint.lineOfEndContainer.id)

        if (lineOfStartingPoint >= firstVisibleLine && lineOfStartingPoint <= lastVisibleLine) {
            this._coloriseLeftForStartingPointStillVisible(endingLineOfEndingPoint, lineOfStartingPoint)
        }
        else if (startingLineOfEndingPoint > lineOfStartingPoint) {
            console.log("NEEDS TO BE ABLE TO SCROLL FIRST")
        }
        else if (startingLineOfEndingPoint < lineOfStartingPoint)
            console.log("NEEDS TO BE ABLE TO SCROLL FIRST")
        return this.coordinatesToHighlight
    }

    _coloriseLeftForStartingPointStillVisible(endingLineOfEndingPoint, lineOfStartingPoint) {
        if (endingLineOfEndingPoint == lineOfStartingPoint) {
            this._colorsieForLeftWhenMouseIsOnSameLineAsStartingPoint(lineOfStartingPoint)
        }
        else if (endingLineOfEndingPoint < lineOfStartingPoint) {
            this._colorsieForLeftWhenMouseIsOnearlinerLineThanStartingPoint(endingLineOfEndingPoint, lineOfStartingPoint)
        }
        else if (endingLineOfEndingPoint > lineOfStartingPoint) {
            this._colorsieForLeftWhenMouseIsOnLaterLineThanStartingPoint(lineOfStartingPoint, endingLineOfEndingPoint)
        }
    }

    _colorsieForLeftWhenMouseIsOnSameLineAsStartingPoint(lineOfStartingPoint) {
        const coordinates = this._defineCoordinatesForStartingPointWithoutLeftOffset()
        this.coordinatesToHighlight.set(lineOfStartingPoint, coordinates)
        this.startingMarkedPoint = new MarkedPoint(coordinates.top, coordinates.left, 0, lineOfStartingPoint)
        this._defineEndingMarkedPointBasedOncoordinatesAndLineId(coordinates, lineOfStartingPoint)
    }

    _defineCoordinatesForStartingPointWithoutLeftOffset() {
        console.log(this.startingPoint)
        const widthOfTextToSelect = calculateTotalLeftOffsetOfCaretInTheLine(
            new CaretLeftOffsetDTO(
                this.startingPoint.endContainer,
                this.startingPoint.endContainerOffset,
                this.startingPoint.endOffset
            ),
            this.contentElement
        )
        const topOffset = this.startingPoint.offsetTopForStartingLine
        return new MarkedLineCoordinates(0, topOffset, widthOfTextToSelect)
    }

    _defineEndingMarkedPointBasedOncoordinatesAndLineId(coordinates, lineId) {
        this.endingMarkedPoint = new MarkedPoint(
            coordinates.top, coordinates.left, coordinates.width, lineId
        )
    }

    _colorsieForLeftWhenMouseIsOnearlinerLineThanStartingPoint(endingLineOfEndingPoint, lineOfStartingPoint) {
        this._fullyColoriselinesBetweenTwoLines(endingLineOfEndingPoint, lineOfStartingPoint - 1)
        let coordinates = this._calculateCoordinatesForLineAtIndex(endingLineOfEndingPoint)
        this._defineStartingMarkedPointBasedOnCoordinatesAndLineId(coordinates, endingLineOfEndingPoint)
        coordinates = this._defineCoordinatesForStartingPointWithoutLeftOffset()
        this.coordinatesToHighlight.set(lineOfStartingPoint, coordinates)
        this._defineEndingMarkedPointBasedOncoordinatesAndLineId(coordinates, lineOfStartingPoint)
    }

    /**
     * 
     * @param {Number} firstLine 
     * @param {Number} lastLine 
     */
    _fullyColoriselinesBetweenTwoLines(firstLine, lastLine) {
        for (let index = firstLine; index <= lastLine; index++) {
            const coordinates = this._calculateCoordinatesForLineAtIndex(index)
            this.coordinatesToHighlight.set(index, coordinates)
        }
    }

    /**
     * 
     * @param {Number} index 
     * @param {Number} firstLine
     */
    _calculateCoordinatesForLineAtIndex(index) {
        const lineElement = document.getElementById(String(index));
        const textContentOfLine = lineElement.textContent
        const widthOfTextContent = calculateWidthForText(this.contentElement, textContentOfLine)
        const topOffset = lineElement.offsetTop
        const coordinates = new MarkedLineCoordinates(0, topOffset, widthOfTextContent)
        return coordinates
    }

    /**
    * 
    * @param {MarkedLineCoordinates} coordinates 
    * @param {Number} lineId 
    */
    _defineStartingMarkedPointBasedOnCoordinatesAndLineId(coordinates, lineId) {
        this.startingMarkedPoint = new MarkedPoint(
            coordinates.top, coordinates.left, coordinates.width, lineId
        )
    }

    _colorsieForLeftWhenMouseIsOnLaterLineThanStartingPoint(lineOfStartingPoint, endingLineOfEndingPoint) {
        this._fullyColoriselinesBetweenTwoLines(lineOfStartingPoint + 1, endingLineOfEndingPoint - 1)
        let coordinates = this._defineCoordinatesForStartingPointWithLeftOffset()
        this.coordinatesToHighlight.set(lineOfStartingPoint, coordinates)
        this._defineStartingMarkedPointBasedOnCoordinatesAndLineId(coordinates, lineOfStartingPoint)
        coordinates = this._calculateCoordinatesForLineAtIndex(endingLineOfEndingPoint)
        this._defineEndingMarkedPointBasedOncoordinatesAndLineId(coordinates, endingLineOfEndingPoint)
    }

    /**
     * 
     * @returns {MarkedLineCoordinates} coordinates to select
     */
    _defineCoordinatesForStartingPointWithLeftOffset() {
        const widthOfTextToSelect = calculateTotalLeftOffsetOfCaretInTheLine(
            new CaretLeftOffsetDTO(
                this.startingPoint.endContainer,
                this.startingPoint.endContainerOffset,
                this.startingPoint.endOffset
            ), this.contentElement
        )
        const topOffset = this.startingPoint.offsetTopForStartingLine
        const textContentOfLine = this.startingPoint.lineOfStartContainer.textContent
        const widthOfTextContent = calculateWidthForText(this.contentElement, textContentOfLine)
        const textToSelect = widthOfTextContent - widthOfTextToSelect
        return new MarkedLineCoordinates(widthOfTextToSelect, topOffset, textToSelect)
    }
}