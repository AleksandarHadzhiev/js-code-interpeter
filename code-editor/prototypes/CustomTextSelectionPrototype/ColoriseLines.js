import CustomRangeElement from "./CustomRangeElement.js";
import calculateWidthForText from "./Caclulators/WidthOfTextCalculator.js";
import MarkedLineCoordinates from "./MarkedLineCoordinates.js";
import calculateTotalLeftOffsetOfCaretInTheLine from "./Caclulators/CaretLeftOffsetCalculator.js";
import { CaretLeftOffsetDTO } from "./DTOs/caretDTO.js";

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
     */
    constructor(startingPoint, endingPoint) {
        this.startingPoint = startingPoint
        this.endingPoint = endingPoint
        this.coordinatesToHighlight = new Map()
        this.startingMarkedPoint = null
        this.endingMarkedPoint = null
    }

    ////// HELPER FUNCTIONS TO BE REDISTRIBUTED AROUND THE CODE

    /**
     * 
     * @returns {MarkedLineCoordinates} coordinates to select
     */
    _defineCoordinatesForStartingPointWithoutLeftOffset() {
        const widthOfTextToSelect = calculateTotalLeftOffsetOfCaretInTheLine(
            new CaretLeftOffsetDTO(
                this.startingPoint.startContainer,
                this.startingPoint.startContainerOffset,
                this.startingPoint.startOffset
            )
        )
        const topOffset = this.startingPoint.offsetTopForStartingLine
        return new MarkedLineCoordinates(0, topOffset, widthOfTextToSelect)
    }

    /**
     * 
     * @returns {MarkedLineCoordinates} coordinates to select
     */
    _defineCoordinatesForStartingPointWithLeftOffset() {
        const widthOfTextToSelect = calculateTotalLeftOffsetOfCaretInTheLine(
            new CaretLeftOffsetDTO(
                this.startingPoint.startContainer,
                this.startingPoint.startContainerOffset,
                this.startingPoint.startOffset
            )
        )
        const topOffset = this.startingPoint.offsetTopForStartingLine
        const textContentOfLine = this.startingPoint.lineOfStartContainer.textContent
        const widthOfTextContent = calculateWidthForText(textContentOfLine)
        const textToSelect = widthOfTextContent - widthOfTextToSelect
        return new MarkedLineCoordinates(widthOfTextToSelect, topOffset, textToSelect)
    }

    /**
     * 
     * @param {MarkedLineCoordinates} coordinates 
     * @param {Number} lineId 
     */
    _defineEndingMarkedPointBasedOnCoordinatesAndLineId(coordinates, lineId) {
        this.endingMarkedPoint = new MarkedPoint(
            coordinates.top, coordinates.left, coordinates.width, lineId
        )
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


    /**
     * 
     * @param {Number} firstVisibleLine 
     * @param {Number} lineOfStartingPoint 
     */
    _defineMarkedPointsForFirstVisibleLineAndStartingPointWithoutLeftOffset(firstVisibleLine, lineOfStartingPoint) {
        let coordinates = this._calculateCoordinatesForLineAtIndex(firstVisibleLine)
        this._defineStartingMarkedPointBasedOnCoordinatesAndLineId(coordinates, firstVisibleLine)
        coordinates = this._defineCoordinatesForStartingPointWithoutLeftOffset()
        this._defineEndingMarkedPointBasedOnCoordinatesAndLineId(coordinates, lineOfStartingPoint)
    }

    //////
    /**
     * 
     * @param {Number} firstVisibleLine 
     * @param {Number} lastVisibleLine 
     */
    coloriseLinesForLeftBetweeenFirsAndLastVisibleLines(firstVisibleLine, lastVisibleLine) {
        this.coordinatesToHighlight.clear()
        const lineOfStartingPoint = Number(this.startingPoint.lineOfStartContainer.id)
        const startingLineOfEndingPoint = Number(this.endingPoint.lineOfStartContainer.id)
        const endingLineOfEndingPoint = Number(this.endingPoint.lineOfEndContainer.id)
        if (lineOfStartingPoint >= firstVisibleLine && lineOfStartingPoint <= lastVisibleLine) {
            if (endingLineOfEndingPoint == lineOfStartingPoint) {
                const coordinates = this._defineCoordinatesForStartingPointWithoutLeftOffset()
                this.coordinatesToHighlight.set(lineOfStartingPoint, coordinates)
                this.startingMarkedPoint = new MarkedPoint(coordinates.top, coordinates.left, 0, lineOfStartingPoint)
                this._defineEndingMarkedPointBasedOnCoordinatesAndLineId(coordinates, lineOfStartingPoint)
            }
            else if (endingLineOfEndingPoint < lineOfStartingPoint) {
                this._fullyColoriselinesBetweenTwoLines(endingLineOfEndingPoint, lineOfStartingPoint - 1)
                let coordinates = this._calculateCoordinatesForLineAtIndex(endingLineOfEndingPoint)
                this._defineStartingMarkedPointBasedOnCoordinatesAndLineId(coordinates, endingLineOfEndingPoint)
                coordinates = this._defineCoordinatesForStartingPointWithoutLeftOffset()
                this.coordinatesToHighlight.set(lineOfStartingPoint, coordinates)
                this._defineEndingMarkedPointBasedOnCoordinatesAndLineId(coordinates, lineOfStartingPoint)
            }
            else if (endingLineOfEndingPoint > lineOfStartingPoint) {
                this._fullyColoriselinesBetweenTwoLines(lineOfStartingPoint + 1, endingLineOfEndingPoint - 1)
                let coordinates = this._defineCoordinatesForStartingPointWithLeftOffset()
                this.coordinatesToHighlight.set(lineOfStartingPoint, coordinates)
                this._defineStartingMarkedPointBasedOnCoordinatesAndLineId(coordinates, lineOfStartingPoint)
                coordinates = this._calculateCoordinatesForLineAtIndex(endingLineOfEndingPoint)
                this._defineEndingMarkedPointBasedOnCoordinatesAndLineId(coordinates, endingLineOfEndingPoint)
            }
        }
        else if (startingLineOfEndingPoint > lineOfStartingPoint) {
            this._fullyColoriselinesBetweenTwoLines(firstVisibleLine, endingLineOfEndingPoint - 1)
            let coordinates = this._defineCoordinatesForStartingPointWithLeftOffset()
            this._defineStartingMarkedPointBasedOnCoordinatesAndLineId(coordinates, lineOfStartingPoint)
            coordinates = this._calculateCoordinatesForLineAtIndex(endingLineOfEndingPoint)
            this._defineEndingMarkedPointBasedOnCoordinatesAndLineId(coordinates, endingLineOfEndingPoint)
        }
        else if (startingLineOfEndingPoint < lineOfStartingPoint) {
            this._fullyColoriselinesBetweenTwoLines(endingLineOfEndingPoint, lastVisibleLine)
            let coordinates = this._calculateCoordinatesForLineAtIndex(endingLineOfEndingPoint)
            this._defineStartingMarkedPointBasedOnCoordinatesAndLineId(coordinates, endingLineOfEndingPoint)
            coordinates = this._defineCoordinatesForStartingPointWithoutLeftOffset()
            this._defineEndingMarkedPointBasedOnCoordinatesAndLineId(coordinates, lineOfStartingPoint)
        }
        return this.coordinatesToHighlight
    }



    /**
     * 
     * @param {Number} firstVisibleLine 
     * @param {Number} lastVisibleLine 
     */
    coloriseLinesForTopInBetweenFirstAndLastVisibleLines(firstVisibleLine, lastVisibleLine) {
        this.coordinatesToHighlight.clear()
        const lineOfStartingPoint = Number(this.startingPoint.lineOfStartContainer.id)
        const startingLineOfEndingPoint = Number(this.endingPoint.lineOfStartContainer.id)
        const endingLineOfEndingPoint = Number(this.endingPoint.lineOfEndContainer.id)
        if (startingLineOfEndingPoint == endingLineOfEndingPoint) {
            if (lineOfStartingPoint >= firstVisibleLine && lineOfStartingPoint <= lastVisibleLine) {
                this._coloriseForStartingPointVisible(firstVisibleLine, lineOfStartingPoint)
                this._defineMarkedPointsForFirstVisibleLineAndStartingPointWithoutLeftOffset(firstVisibleLine, lineOfStartingPoint)
            }
            else {
                this._defineStartingPointMarkerForStartingPointNotVisibleButEarlierThanReleasePoint(lineOfStartingPoint)
                this._defineEndingPointMarkerForStartingPointNotVisibleButEarlierThanReleasePoint(firstVisibleLine)
            }
        }
        else {
            this._fullyColoriselinesBetweenTwoLines(firstVisibleLine, lastVisibleLine)
            this._defineMarkedPointsForFirstVisibleLineAndStartingPointWithoutLeftOffset(firstVisibleLine, lineOfStartingPoint)

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
        const widthOfTextContent = calculateWidthForText(textContentOfLine)
        const topOffset = lineElement.offsetTop
        const coordinates = new MarkedLineCoordinates(0, topOffset, widthOfTextContent)
        return coordinates
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
        const lineOfStartingPoint = Number(this.startingPoint.lineOfStartContainer.id)
        const startingLineOfEndingPoint = Number(this.endingPoint.lineOfStartContainer.id)
        const endingLineOfEndingPoint = Number(this.endingPoint.lineOfEndContainer.id)


        // - starting point is visible on the screen
        if (lineOfStartingPoint >= firstVisibleLine && lineOfStartingPoint <= lastVisibleLine) {
            this._defineStartingPointMarkerForStartingPointNotVisibleButEarlierThanReleasePoint(lineOfStartingPoint)
            this._coloriseFirstLine(lineOfStartingPoint)
            lastVisibleLine = this._filterLastVisibleLine(lastVisibleLine)
            this._coloriseBetweenTwoLines(lineOfStartingPoint + 1, lastVisibleLine)
        }
        // - starting point is earlier than current mouse line
        else if (startingLineOfEndingPoint != endingLineOfEndingPoint) {
            lastVisibleLine = this._filterLastVisibleLine(lastVisibleLine)
            this._defineStartingPointMarkerForStartingPointNotVisibleButEarlierThanReleasePoint(lineOfStartingPoint)
            this._coloriseBetweenTwoLines(firstVisibleLine, lastVisibleLine)
        }
        // - starting point is later than current mouse line
        else {
            // Do not colorise, just build starting and ending marked point
            lastVisibleLine = this._filterLastVisibleLine(lastVisibleLine)
            this._defineStartingPointMarkerForBottomTextSelection(lastVisibleLine)
            this._defineEndingPointMarkerForBottomTextSelection(lineOfStartingPoint)
        }
        return this.coordinatesToHighlight
    }


    _filterLastVisibleLine(lastVisibleLine) {
        let lastVisibleLineElement = document.getElementById(String(lastVisibleLine))
        while (lastVisibleLineElement == null) {
            lastVisibleLine -= 1
            lastVisibleLineElement = document.getElementById(String(lastVisibleLine))
        }
        return lastVisibleLine
    }

    _coloriseBetweenTwoLines(firstLine, lastLine) {
        for (let index = firstLine; index <= lastLine; index++) {
            const coordinates = this._calculateCoordinatesForLineAtIndex(index, firstLine)
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


    _coloriseFirstLine(lineOfStartingPoint) {
        const widthOfTextToSelect = calculateTotalLeftOffsetOfCaretInTheLine(
            new CaretLeftOffsetDTO(
                this.startingPoint.startContainer,
                this.startingPoint.startContainerOffset,
                this.startingPoint.startOffset
            )
        )
        const widthOfText = calculateWidthForText(this.startingPoint.lineOfStartContainer.textContent)
        const width = widthOfText - widthOfTextToSelect
        const topOffset = this.startingPoint.offsetTopForStartingLine
        const coordinates = new MarkedLineCoordinates(widthOfTextToSelect, topOffset, width)
        this.coordinatesToHighlight.set(lineOfStartingPoint, coordinates)
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
        const widthOfTextToSelect = calculateTotalLeftOffsetOfCaretInTheLine(
            new CaretLeftOffsetDTO(
                this.startingPoint.startContainer,
                this.startingPoint.startContainerOffset,
                this.startingPoint.startOffset
            )
        )
        const topOffset = this.startingPoint.offsetTopForStartingLine
        const textContentOfLine = this.startingPoint.lineOfStartContainer.textContent
        const widthOfTextContent = calculateWidthForText(textContentOfLine)
        const textToSelect = widthOfTextContent - widthOfTextToSelect
        this.endingMarkedPoint = new MarkedPoint(
            topOffset,
            widthOfTextToSelect,
            textToSelect,
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
                const coordinates = this._calculateCoordinatesForLineAtIndex(index)
                this.coordinatesToHighlight.set(index, coordinates)
            }
        }
    }
}

