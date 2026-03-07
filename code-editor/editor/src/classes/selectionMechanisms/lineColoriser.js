import MarkedLineCoordinates from "./markedLineCoordinates.js"
import calculateTotalLeftOffsetOfCaretInTheLine from "../calculators/caretLeftOffsetCalculator.js"
import { CaretLeftOffsetDTO } from "../dtos/caretDTOs.js"

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
            if (endingLineOfEndingPoint == lineOfStartingPoint) {
                this._colorsieForLeftWhenMouseIsOnSameLineAsStartingPoint(lineOfStartingPoint)
            }
            else if (endingLineOfEndingPoint < lineOfStartingPoint) {

            }
            else if (endingLineOfEndingPoint > lineOfStartingPoint) {

            }
        }

        else if (startingLineOfEndingPoint > lineOfStartingPoint) {

        }

        else if (startingLineOfEndingPoint < lineOfStartingPoint)
            console.log("SOMETHING")
        return this.coordinatesToHighlight
    }

    _colorsieForLeftWhenMouseIsOnSameLineAsStartingPoint(lineOfStartingPoint) {
        const coordinates = this._defineCoordinatesForStartingPointWithoutLeftOffset()
        this.coordinatesToHighlight.set(lineOfStartingPoint, coordinates)
        this.startingMarkedPoint = new MarkedPoint(coordinates.top, coordinates.left, 0, lineOfStartingPoint)
        this._defineEndingMarkedPointBasedOncoordinatesAndLineId(coordinates, lineOfStartingPoint)
    }

    _defineCoordinatesForStartingPointWithoutLeftOffset() {
        const widthOfTextToSelect = calculateTotalLeftOffsetOfCaretInTheLine(
            new CaretLeftOffsetDTO(
                this.startingPoint.startContainer,
                this.startingPoint.startContainerOffset,
                this.startingPoint.startOffset
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
}