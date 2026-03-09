import MarkedLineCoordinates from "./markedLineCoordinates.js"
import calculateWidthForText from "../calculators/widthOfTextCalculator.js"
import { StartingPoint } from "../dtos/caretDTOs.js"

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
     * @param {StartingPoint} startingPoint 
     * @param {StartingPoint} endingPoint 
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
        const lineOfStartingPoint = Number(this.startingPoint.lineId)
        const lineOfReleasingPoint = Number(this.endingPoint.lineId)

        if (lineOfStartingPoint >= firstVisibleLine && lineOfStartingPoint <= lastVisibleLine)
            this._coloriseLeftForStartingPointStillVisible(lineOfReleasingPoint, lineOfStartingPoint)
        else if (lineOfReleasingPoint > lineOfStartingPoint)
            this._coloriseForLeftWhenMouseIsLaterThanStartingPointNotVisible(firstVisibleLine, lineOfReleasingPoint, lineOfStartingPoint)
        else if (lineOfReleasingPoint < lineOfStartingPoint)
            this._coloriseForLeftWhenMouseIsOnEarlierLineThanStartingPointNotVisible(lineOfReleasingPoint, lastVisibleLine, lineOfStartingPoint)
        return this.coordinatesToHighlight
    }

    _coloriseLeftForStartingPointStillVisible(lineOfReleasingPoint, lineOfStartingPoint) {
        if (lineOfReleasingPoint == lineOfStartingPoint) {
            this._colorsieForLeftWhenMouseIsOnSameLineAsStartingPoint(lineOfStartingPoint)
        }
        else if (lineOfReleasingPoint < lineOfStartingPoint) {
            this._colorsieForLeftWhenMouseIsOnearlinerLineThanStartingPoint(lineOfReleasingPoint, lineOfStartingPoint)
        }
        else if (lineOfReleasingPoint > lineOfStartingPoint) {
            this._colorsieForLeftWhenMouseIsOnLaterLineThanStartingPoint(lineOfStartingPoint, lineOfReleasingPoint)
        }
    }

    _colorsieForLeftWhenMouseIsOnSameLineAsStartingPoint(lineOfStartingPoint) {
        const coordinates = this._defineCoordinatesForStartingPointWithoutLeftOffset()
        this.coordinatesToHighlight.set(lineOfStartingPoint, coordinates)
        this.startingMarkedPoint = new MarkedPoint(coordinates.top, coordinates.left, 0, lineOfStartingPoint)
        this._defineEndingMarkedPointBasedOncoordinatesAndLineId(coordinates, lineOfStartingPoint)
    }

    _defineCoordinatesForStartingPointWithoutLeftOffset() {
        return new MarkedLineCoordinates(0, this.startingPoint.topOffset, this.startingPoint.leftOffset)
    }

    _defineEndingMarkedPointBasedOncoordinatesAndLineId(coordinates, lineId) {
        this.endingMarkedPoint = new MarkedPoint(
            coordinates.top, coordinates.left, coordinates.width, lineId
        )
    }

    _colorsieForLeftWhenMouseIsOnearlinerLineThanStartingPoint(lineOfReleasingPoint, lineOfStartingPoint) {
        this._fullyColoriselinesBetweenTwoLines(lineOfReleasingPoint, lineOfStartingPoint - 1)
        let coordinates = this._calculateCoordinatesForLineAtIndex(lineOfReleasingPoint)
        this._defineStartingMarkedPointBasedOnCoordinatesAndLineId(coordinates, lineOfReleasingPoint)
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
            const lineElement = document.getElementById(String(index));
            if (lineElement != null) {
                const coordinates = this._calculateCoordinatesForLineAtIndex(lineElement)
                this.coordinatesToHighlight.set(index, coordinates)
            }
        }
    }

    /**
     * 
     * @param {HTMLElement} lineElement 
     */
    _calculateCoordinatesForLineAtIndex(lineElement) {
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

    _colorsieForLeftWhenMouseIsOnLaterLineThanStartingPoint(lineOfStartingPoint, lineOfReleasingPoint) {
        this._fullyColoriselinesBetweenTwoLines(lineOfStartingPoint + 1, lineOfReleasingPoint - 1)
        let coordinates = this._defineCoordinatesForStartingPointWithLeftOffset()
        this.coordinatesToHighlight.set(lineOfStartingPoint, coordinates)
        this._defineStartingMarkedPointBasedOnCoordinatesAndLineId(coordinates, lineOfStartingPoint)
        coordinates = this._calculateCoordinatesForLineAtIndex(lineOfReleasingPoint)
        this._defineEndingMarkedPointBasedOncoordinatesAndLineId(coordinates, lineOfReleasingPoint)
    }

    /**
     * 
     * @returns {MarkedLineCoordinates} coordinates to select
     */
    _defineCoordinatesForStartingPointWithLeftOffset() {
        const topOffset = this.startingPoint.topOffset
        const textContentOfLine = this.startingPoint.fullText
        const widthOfTextContent = calculateWidthForText(this.contentElement, textContentOfLine)
        const textToSelect = widthOfTextContent - this.startingPoint.leftOffset
        return new MarkedLineCoordinates(this.startingPoint.leftOffset, topOffset, textToSelect)
    }

    _coloriseForLeftWhenMouseIsLaterThanStartingPointNotVisible(firstVisibleLine, lineOfReleasingPoint, lineOfStartingPoint) {
        this._fullyColoriselinesBetweenTwoLines(firstVisibleLine, lineOfReleasingPoint - 1)
        let coordinates = this._defineCoordinatesForStartingPointWithLeftOffset()
        this._defineStartingMarkedPointBasedOnCoordinatesAndLineId(coordinates, lineOfStartingPoint)
        const lineElement = document.getElementById(`${lineOfReleasingPoint}`)
        coordinates = this._calculateCoordinatesForLineAtIndex(lineElement)
        this._defineEndingMarkedPointBasedOncoordinatesAndLineId(coordinates, lineOfReleasingPoint)
    }

    _coloriseForLeftWhenMouseIsOnEarlierLineThanStartingPointNotVisible(lineOfReleasingPoint, lastVisibleLine, lineOfStartingPoint) {
        this._fullyColoriselinesBetweenTwoLines(lineOfReleasingPoint, lastVisibleLine)
        const lineElement = document.getElementById(`${lineOfReleasingPoint}`)
        let coordinates = this._calculateCoordinatesForLineAtIndex(lineElement)
        this._defineStartingMarkedPointBasedOnCoordinatesAndLineId(coordinates, lineOfReleasingPoint)
        coordinates = this._defineCoordinatesForStartingPointWithoutLeftOffset()
        this._defineEndingMarkedPointBasedOncoordinatesAndLineId(coordinates, lineOfStartingPoint)
    }


    /**
     * 
     * @param {Number} firstVisibleLine 
     * @param {Number} lastVisibleLine 
     */
    displayMarker(firstVisibleLine, lastVisibleLine) {
        const lineOfStartingPoint = this.startingMarkedPoint.lineId
        const lineOfEndingPoint = this.endingMarkedPoint.lineId
        if (lineOfStartingPoint > lastVisibleLine) {
            return new Map()
        }
        else if (lineOfEndingPoint < firstVisibleLine) {
            return new Map()
        }
        this._loadCoordinatesBetweenFirstVisbleLineAndLastVisibleLine(firstVisibleLine, lastVisibleLine)
        return this.coordinatesToHighlight
    }

    /**
     * 
     * @param {Number} firstVisibleLine 
     * @param {Number} lastVisibleLine 
     */
    _loadCoordinatesBetweenFirstVisbleLineAndLastVisibleLine(firstVisibleLine, lastVisibleLine) {
        this.coordinatesToHighlight = new Map()
        for (let index = firstVisibleLine; index < lastVisibleLine; index++) {
            if (index == this.startingMarkedPoint.lineId) {
                this.coordinatesToHighlight.set(this.startingMarkedPoint.lineId, this.startingMarkedPoint)
            }
            else if (index == this.endingMarkedPoint.lineId) {
                this.coordinatesToHighlight.set(this.endingMarkedPoint.lineId, this.endingMarkedPoint)
            }
            else if (index > this.startingMarkedPoint.lineId && index < this.endingMarkedPoint.lineId) {
                const lineElement = document.getElementById(String(index))
                const coordinates = this._calculateCoordinatesForLineAtIndex(lineElement)
                this.coordinatesToHighlight.set(index, coordinates)
            }
        }
    }
}