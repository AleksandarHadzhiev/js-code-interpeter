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
        console.log(firstLine)
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
    coloriseLinesForTopInBetweenFirstAndLastVisibleLines(firstVisibleLine, lastVisibleLine) {
        this.coordinatesToHighlight.clear()
        const lineOfStartingPoint = Number(this.startingPoint.lineId)
        const lineOfEndingPoint = Number(this.endingPoint.lineId)
        console.log(`Line Of Ending Point: ${lineOfEndingPoint}`)
        console.log(`Line Of Starting Point: ${lineOfStartingPoint}`)
        console.log(firstVisibleLine, lastVisibleLine)
        if (lineOfStartingPoint >= firstVisibleLine && lineOfStartingPoint <= lastVisibleLine) {
            this._coloriseForStartingPointVisible(firstVisibleLine, lineOfStartingPoint)
            this._defineMarkedPointsForFirstVisibleLineAndStartingPointWithoutLeftOffset(firstVisibleLine, lineOfStartingPoint)
        }
        else if (lineOfStartingPoint > lineOfEndingPoint) {
            console.log(firstVisibleLine)
            this._fullyColoriselinesBetweenTwoLines(firstVisibleLine, lastVisibleLine)
            this._defineMarkedPointsForFirstVisibleLineAndStartingPointWithoutLeftOffset(firstVisibleLine, lineOfStartingPoint)
        }
        else if (lineOfStartingPoint < lineOfEndingPoint) {
            this._defineStartingPointMarkerForStartingPointNotVisibleButEarlierThanReleasePoint(lineOfStartingPoint)
            this._defineEndingPointMarkerForStartingPointNotVisibleButEarlierThanReleasePoint(firstVisibleLine)
        }
        return this.coordinatesToHighlight
    }


    /**
 * 
 * @param {Number} firstVisibleLine 
 * @param {Number} lineOfStartingPoint 
 */
    _coloriseForStartingPointVisible(firstVisibleLine, lineOfStartingPoint) {
        const lineBeforeStartingPoint = lineOfStartingPoint - 1
        this._fullyColoriselinesBetweenTwoLines(firstVisibleLine, lineBeforeStartingPoint)
        const coordinates = this._defineCoordinatesForStartingPointWithoutLeftOffset()
        this.coordinatesToHighlight.set(lineOfStartingPoint, coordinates)
    }

    /**
     * 
     * @param {Number} firstVisibleLine 
     * @param {Number} lineOfStartingPoint 
     */
    _defineMarkedPointsForFirstVisibleLineAndStartingPointWithoutLeftOffset(firstVisibleLine, lineOfStartingPoint) {
        const lineElement = document.getElementById(String(firstVisibleLine))
        let coordinates = this._calculateCoordinatesForLineAtIndex(lineElement)
        this._defineStartingMarkedPointBasedOnCoordinatesAndLineId(coordinates, firstVisibleLine)
        coordinates = this._defineCoordinatesForStartingPointWithoutLeftOffset()
        this._defineEndingMarkedPointBasedOncoordinatesAndLineId(coordinates, lineOfStartingPoint)
    }


    /**
 * 
 * @param {Number} lineOfStartingPoint 
 */
    _defineStartingPointMarkerForStartingPointNotVisibleButEarlierThanReleasePoint(lineOfStartingPoint) {
        const coordinates = this._defineCoordinatesForStartingPointWithLeftOffset()
        this.startingMarkedPoint = new MarkedPoint(
            coordinates.top,
            coordinates.left,
            coordinates.width,
            lineOfStartingPoint
        )
    }

    /**
     * 
     * @param {Number} firstVisibleLine 
     */
    _defineEndingPointMarkerForStartingPointNotVisibleButEarlierThanReleasePoint(firstVisibleLine) {
        const line = document.getElementById(String(firstVisibleLine))
        this.endingMarkedPoint = new MarkedPoint(
            line.offsetTop,
            0,
            0,
            Number(line.id)
        )
    }

    coloriseLinesForBottomInBetweenFirstAndLastVisibleLines(firstVisibleLine, lastVisibleLine) {
        this.coordinatesToHighlight.clear()
        const lineOfStartingPoint = Number(this.startingPoint.lineId)
        const lineOfEndingPoint = Number(this.endingPoint.lineId)
        console.log(`Line Of Ending Point: ${lineOfEndingPoint}`)
        console.log(`Line Of Starting Point: ${lineOfStartingPoint}`)
        console.log(firstVisibleLine, lastVisibleLine)
        // - starting point is visible on the screen
        if (lineOfStartingPoint >= firstVisibleLine && lineOfStartingPoint <= lastVisibleLine) {
            this._defineStartingPointMarkerForStartingPointNotVisibleButEarlierThanReleasePoint(lineOfStartingPoint)
            this._coloriseFirstLine(lineOfStartingPoint)
            lastVisibleLine = this._filterLastVisibleLine(lastVisibleLine)
            this._coloriseBetweenTwoLines(lineOfStartingPoint + 1, lastVisibleLine)
        }
        // - starting point is earlier than current mouse line
        else if (lineOfStartingPoint < lineOfEndingPoint) {
            lastVisibleLine = this._filterLastVisibleLine(lastVisibleLine)
            this._defineStartingPointMarkerForStartingPointNotVisibleButEarlierThanReleasePoint(lineOfStartingPoint)
            this._coloriseBetweenTwoLines(firstVisibleLine, lastVisibleLine)
        }
        // - starting point is later than current mouse line
        else if (lineOfStartingPoint > lineOfEndingPoint) {
            // Do not colorise, just build starting and ending marked point
            lastVisibleLine = this._filterLastVisibleLine(lastVisibleLine)
            this._defineStartingPointMarkerForBottomTextSelection(lastVisibleLine)
            this._defineEndingPointMarkerForBottomTextSelection(lineOfStartingPoint)
        }
        return this.coordinatesToHighlight
    }

    _coloriseFirstLine(lineOfStartingPoint) {
        const widthOfTextToSelect = this.startingPoint.leftOffset
        const widthOfText = calculateWidthForText(this.contentElement, this.startingPoint.fullText)
        const width = widthOfText - widthOfTextToSelect
        const topOffset = this.startingPoint.topOffset
        const coordinates = new MarkedLineCoordinates(widthOfTextToSelect, topOffset, width)
        this.coordinatesToHighlight.set(lineOfStartingPoint, coordinates)
    }

    _coloriseBetweenTwoLines(firstLine, lastLine) {
        for (let index = firstLine; index <= lastLine; index++) {
            const lineElement = document.getElementById(String(index))
            const coordinates = this._calculateCoordinatesForLineAtIndex(lineElement)
            this.coordinatesToHighlight.set(index, coordinates)
            if (index == lastLine) {
                this.endingMarkedPoint = new MarkedPoint(
                    coordinates.top,
                    0,
                    coordinates.width,
                    index
                )
            }
        }
    }

    _filterLastVisibleLine(lastVisibleLine) {
        let lastVisibleLineElement = document.getElementById(String(lastVisibleLine))
        while (lastVisibleLineElement == null) {
            lastVisibleLine -= 1
            lastVisibleLineElement = document.getElementById(String(lastVisibleLine))
        }
        return lastVisibleLine
    }

    /**
     * 
     * @param {Number} lastVisibleLine 
     */
    _defineStartingPointMarkerForBottomTextSelection(lastVisibleLine) {
        const line = document.getElementById(String(lastVisibleLine))
        this.startingMarkedPoint = new MarkedPoint(
            line.offsetTop,
            0,
            0,
            Number(line.id)
        )
    }

    /**
     * 
     * @param {Number} lineOfStartingPoint 
     */
    _defineEndingPointMarkerForBottomTextSelection(lineOfStartingPoint) {
        const topOffset = this.startingPoint.topOffset
        this.endingMarkedPoint = new MarkedPoint(
            topOffset,
            0,
            this.startingPoint.leftOffset,
            lineOfStartingPoint
        )
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