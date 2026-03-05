import CustomRangeElement from "./CustomRangeElement.js";
import calculateWidthOfSelectedText from "./Caclulators/SelectedTextWidthCalculator.js";
import calculateTotalLeftOffsetOfCaretInTheLine from "./Caclulators/CaretLeftOffsetCalculator.js";
import { CaretLeftOffsetDTO, SelectedTextDTO } from "./DTOs/caretDTO.js";
import MarkedLineCoordinates from "./MarkedLineCoordinates.js";
import calculateWidthForText from "./Caclulators/WidthOfTextCalculator.js";

class CustomMultiLineRange {
    /**
     * 
     * @param {Number} offsetTopOfReleaseRangeLine
     * @param {Number} leftOffsetOfReleaseRangeLine 
     * @param {Number} topOffsetOfStartingRangeLine
     * @param {Number} offsetLeftofStartingRangeLine
     * @param {Number} lineIdOfStartingRangeLine
     * @param {Number} lineIdOfReleaseRangeLine
     */
    constructor(offsetTopOfReleaseRangeLine, leftOffsetOfReleaseRangeLine, topOffsetOfStartingRangeLine, offsetLeftofStartingRangeLine, lineIdOfStartingRangeLine, lineIdOfReleaseRangeLine) {
        this.offsetTopOfReleaseRangeLine = offsetTopOfReleaseRangeLine
        this.leftOffsetOfReleaseRangeLine = leftOffsetOfReleaseRangeLine
        this.topOffsetOfStartingRangeLine = topOffsetOfStartingRangeLine
        this.offsetLeftofStartingRangeLine = offsetLeftofStartingRangeLine
        this.lineIdOfStartingRangeLine = lineIdOfStartingRangeLine
        this.lineIdOfReleaseRangeLine = lineIdOfReleaseRangeLine
    }
}

class MArkedPoint {
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

class SelectedPoint {
    /**
     * 
     * @param {HTMLElement} container 
     * @param {Number} containerOffset 
     * @param {Number} caretOffset 
     * @param {Number} leftOffset 
     * @param {Number} topOffset 
     */
    constructor(container, containerOffset, caretOffset, leftOffset, topOffset) {
        this.container = container
        this.containerOffset = containerOffset
        this.caretOffset = caretOffset
        this.leftOffset = leftOffset
        this.topOffset = topOffset
    }
}

export default class NewAlgorithm {
    /**
     * 
     * @param {CustomRangeElement} startingRange 
     * @param {CustomRangeElement} releasingRange 
     */
    constructor(startingRange, releasingRange) {
        this.startingRange = startingRange
        this.releasingRange = releasingRange
        this.startingRangeLine = Number(startingRange.lineOfStartContainer.id)
        this.startingRangeLeftOffset = startingRange.startContainerOffset
        this.startingRangeCaretOffset = startingRange.startOffset
        this.startingRangeTopOffset = startingRange.offsetTopForStartingLine
        this.coordinatesToHighlight = new Map()
        this.startingLineWidth = calculateTotalLeftOffsetOfCaretInTheLine(new CaretLeftOffsetDTO(this.startingRange.startContainer, this.startingRangeLeftOffset, this.startingRangeCaretOffset))
        this.startingMarkedPoint = null
        this.endingMarkedPoint = null
    }

    /**
     * 
     * @param {MouseEvent} mouseMoveEvent 
     * @param {Number} firstVisibleLine 
     * @param {Number} lastVisibleLine 
     * @returns {Map} the coordinates which should be highlighted as selected
     */
    markContent(mouseMoveEvent, firstVisibleLine, lastVisibleLine) {
        const mouseLineId = Number(mouseMoveEvent.currentTarget.id)
        const idOfLineForEndingContainerForRelease = Number(this.releasingRange.lineOfEndContainer.id)
        const idOfLineForStartingContainerForRelease = Number(this.releasingRange.lineOfStartContainer.id)

        if (isNaN(idOfLineForEndingContainerForRelease) || isNaN(idOfLineForStartingContainerForRelease)) {
            return this.coordinatesToHighlight
        }
        if (this._isTextSelectionOnOneLine(mouseLineId)) {
            this._handleSingleLineTextSelection(mouseMoveEvent)
        }
        else {
            this._handleMultilineTextSelection(mouseMoveEvent, firstVisibleLine, lastVisibleLine)
        }
        // console.log(this.coordinatesToHighlight)
        return this.coordinatesToHighlight
    }

    colorizeAllLines(firstVisibleLine, lastVisibleLine) {
        this._calculateCoordinatesForInBetweenLines(firstVisibleLine, lastVisibleLine)
        return this.coordinatesToHighlight
    }

    /**
     * @param {Number} mouseLineId
     */
    _isTextSelectionOnOneLine(mouseLineId) {
        if (mouseLineId == this.startingRangeLine) {
            return true
        }
        return false
    }

    /**
     * @param {MouseEvent} mouseMoveEvent
     */
    _handleSingleLineTextSelection(mouseMoveEvent) {
        // console.log("SINGLE LINE TEXT SELECTION")
        const widthOfStartingLineOfReleaseRange = calculateTotalLeftOffsetOfCaretInTheLine(new CaretLeftOffsetDTO(this.releasingRange.startContainer, this.releasingRange.startContainerOffset, this.releasingRange.startOffset))
        const widthOfEndingLineOfReleaseRange = calculateTotalLeftOffsetOfCaretInTheLine(new CaretLeftOffsetDTO(this.releasingRange.endContainer, this.releasingRange.endContainerOffset, this.releasingRange.endOffset))
        // console.log(widthOfStartingLineOfReleaseRange)
        // console.log(widthOfEndingLineOfReleaseRange)
        // console.log(mouseMoveEvent.offsetX)
        const mouseXPosition = mouseMoveEvent.offsetX
        const differenseInXPositionOfEndingReleaseLineFromMouseX = mouseXPosition > widthOfEndingLineOfReleaseRange ? mouseXPosition - widthOfEndingLineOfReleaseRange : widthOfEndingLineOfReleaseRange - mouseXPosition
        const differenseInXPositionOfStartingReleaseLineFromMouseX = mouseXPosition > widthOfStartingLineOfReleaseRange ? mouseXPosition - widthOfStartingLineOfReleaseRange : widthOfStartingLineOfReleaseRange - mouseXPosition
        // console.log(differenseInXPositionOfEndingReleaseLineFromMouseX)
        // console.log(differenseInXPositionOfStartingReleaseLineFromMouseX)
        if (differenseInXPositionOfEndingReleaseLineFromMouseX < differenseInXPositionOfStartingReleaseLineFromMouseX) {
            // console.log("Working with ending line")
            this._calculateCoordinatesForEndingContainerAndStartingLine(widthOfEndingLineOfReleaseRange)
        }
        else {
            // console.log("Working with sarting line")
            this._calculateCoordinatesForStartingContainerAndStartingLine(widthOfStartingLineOfReleaseRange)
        }
    }

    /**
     * @param {Number} widthOfEndingLineOfReleaseRange 
     */
    _calculateCoordinatesForEndingContainerAndStartingLine(widthOfEndingLineOfReleaseRange) {
        if (widthOfEndingLineOfReleaseRange > this.startingLineWidth) {
            this._goingLeftToRightWithEndContainerForReleaseRangeForSingleLine()
        }
        else {
            this._goingRightToLeftWithEndContainerForSingleLine()
        }
    }

    _goingLeftToRightWithEndContainerForReleaseRangeForSingleLine() {
        // console.log("GOING LEFT TO RIGHT")
        const leftOffsetPoint = new SelectedPoint(
            this.startingRange.startContainer,
            this.startingRange.startContainerOffset,
            this.startingRange.startOffset,
            this.startingRange.startContainerOffset,
            this.startingRange.offsetTopForStartingLine
        )
        const rightOffsetPoint = new SelectedPoint(
            this.releasingRange.endContainer,
            this.releasingRange.endContainerOffset,
            this.releasingRange.endOffset,
            this.releasingRange.endContainerOffset,
            this.releasingRange.offsetTopForEndingLine
        )
        const coordinates = this._calculateCoordinatesForPoints(leftOffsetPoint, rightOffsetPoint)
        this.coordinatesToHighlight.set(this.startingRangeLine, coordinates)
    }

    /**
     * @param {SelectedPoint} pointForLeftOffset 
     * @param {SelectedPoint} pointForRightOffset 
     * @returns {Number} width of the selected text
     */
    _calculateCoordinatesForPoints(pointForLeftOffset, pointForRightOffset) {
        let leftOffset = calculateTotalLeftOffsetOfCaretInTheLine(new CaretLeftOffsetDTO(pointForLeftOffset.container, pointForLeftOffset.containerOffset, pointForLeftOffset.caretOffset))
        pointForRightOffset.leftOffset = leftOffset
        const widthOfTheSelectedText = this._calculateWidthOfSelectedText(pointForRightOffset)
        const topOffset = this.startingRange.offsetTopForStartingLine
        const coorindates = new MarkedLineCoordinates(leftOffset, topOffset, widthOfTheSelectedText)
        return coorindates
    }

    /**
     * @param {SelectedPoint} point 
     * @returns {Number} width of the selected text
     */
    _calculateWidthOfSelectedText(point) {
        const offset = calculateTotalLeftOffsetOfCaretInTheLine(
            new CaretLeftOffsetDTO(
                point.container,
                point.containerOffset,
                point.caretOffset
            )
        )
        let widthOfSelectedText = offset - point.leftOffset
        return widthOfSelectedText
    }

    _goingRightToLeftWithEndContainerForSingleLine() {
        // console.log("GOING RIGHT TO LEFT")
        const leftOffsetPoint = new SelectedPoint(
            this.releasingRange.endContainer,
            this.releasingRange.endContainerOffset,
            this.releasingRange.endOffset,
            this.releasingRange.endContainerOffset,
            this.releasingRange.offsetTopForEndingLine
        )
        const rightOffsetPoint = new SelectedPoint(
            this.startingRange.startContainer,
            this.startingRange.startContainerOffset,
            this.startingRange.startOffset,
            this.startingRange.startContainerOffset,
            this.startingRange.offsetTopForStartingLine
        )
        const coordinates = this._calculateCoordinatesForPoints(leftOffsetPoint, rightOffsetPoint)
        this.coordinatesToHighlight.set(this.startingRangeLine, coordinates)
    }

    /**
     * 
     * @param {Number} widthOfStartingLineOfReleaseRange
     */
    _calculateCoordinatesForStartingContainerAndStartingLine(widthOfStartingLineOfReleaseRange) {
        if (widthOfStartingLineOfReleaseRange > this.startingLineWidth) {
            this._goingLeftToRightWithStartContainerForReleaseRangeForSingleLine()
        }
        else {
            this._goingRightToLeftWithStartContainerForSingleLine()
        }
    }

    _goingLeftToRightWithStartContainerForReleaseRangeForSingleLine() {
        // console.log("GOING LEFT TO RIGHT")
        const leftOffsetPoint = new SelectedPoint(
            this.startingRange.startContainer,
            this.startingRange.startContainerOffset,
            this.startingRange.startOffset,
            this.startingRange.startContainerOffset,
            this.startingRange.offsetTopForStartingLine
        )
        const rightOffsetPoint = new SelectedPoint(
            this.releasingRange.startContainer,
            this.releasingRange.startContainerOffset,
            this.releasingRange.startOffset,
            this.releasingRange.startContainerOffset,
            this.releasingRange.offsetTopForStartingLine
        )
        const coordinates = this._calculateCoordinatesForPoints(leftOffsetPoint, rightOffsetPoint)
        this.coordinatesToHighlight.set(this.startingRangeLine, coordinates)
    }

    _goingRightToLeftWithStartContainerForSingleLine() {
        // console.log("GOING RIGTH TO LEFT")
        const leftOffsetPoint = new SelectedPoint(
            this.releasingRange.startContainer,
            this.releasingRange.startContainerOffset,
            this.releasingRange.startOffset,
            this.releasingRange.startContainerOffset,
            this.releasingRange.offsetTopForStartingLine
        )
        const rightOffsetPoint = new SelectedPoint(
            this.startingRange.startContainer,
            this.startingRange.startContainerOffset,
            this.startingRange.startOffset,
            this.startingRange.startContainerOffset,
            this.startingRange.offsetTopForStartingLine
        )
        const coordinates = this._calculateCoordinatesForPoints(leftOffsetPoint, rightOffsetPoint)
        this.coordinatesToHighlight.set(this.startingRangeLine, coordinates)
    }

    /**
     * @param {MouseEvent} mouseMoveEvent
     * @param {Number} firstVisibleLine 
     * @param {Number} lastVisibleLine 
     */
    _handleMultilineTextSelection(mouseMoveEvent, firstVisibleLine, lastVisibleLine) {
        // agan and again wrong text selection when it tries to handle all possibilities with one function
        // or one algorithm more precisely...
        // console.log("MULTILINE TEXT SELECTION")
        // console.log(this.releasingRange)
        const lineOfEndContainer = this.releasingRange.lineOfEndContainer
        const lineOfStartContainer = this.releasingRange.lineOfStartContainer
        // console.log(lineOfEndContainer, lineOfStartContainer)

        if (this.startingRangeLine >= firstVisibleLine && this.startingRangeLine <= lastVisibleLine) {
            // console.log("STARTING LINE IS BETWEEN VISIBLE LINES")
            this._handleStartingRangeIsBetweenVisibleLines(mouseMoveEvent) // SEEMS TO BE WORKING
        }
        else if (this.startingRangeLine < firstVisibleLine) {
            // console.log("STARTING LINE IS THE VERY TOP OF TEXT SELECTION, BUT IS NO LONGER VISIBLE")
            let lineElement = document.getElementById(firstVisibleLine)
            while (lineElement == null) {
                firstVisibleLine += 1
                lineElement = document.getElementById(firstVisibleLine)
            }
            this._handleMultilineTextSelectionWithStartignRangeNotVisibleOnTheScreen(mouseMoveEvent, firstVisibleLine)
        }
        else if (this.startingRangeLine > lastVisibleLine) {
            // console.log("STARTING LINE IS THE VERY END OF TEXT SELECTION, BUT IS NO LONGER VISIBLE")
            let lineElement = document.getElementById(lastVisibleLine)
            while (lineElement == null) {
                lastVisibleLine -= 1
                lineElement = document.getElementById(lastVisibleLine)
            }
            this._handleMultilineTextSelectionWithStartignRangeNotVisibleOnTheScreen(mouseMoveEvent, lastVisibleLine)
        }
    }

    /**
     * @param {MouseEvent} mouseMoveEvent
     * 
     */
    _handleStartingRangeIsBetweenVisibleLines(mouseMoveEvent) {
        const mouseYPosition = mouseMoveEvent.currentTarget.offsetTop
        const startingLineReleaseRangeOffsetY = this.releasingRange.offsetTopForStartingLine
        const endingLineReleaseRangeOffsetY = this.releasingRange.offsetTopForEndingLine

        // console.log(startingLineReleaseRangeOffsetY)
        // console.log(endingLineReleaseRangeOffsetY)

        const differenseInYPositionOfEndingReleaseLineFromMouseY = mouseYPosition > endingLineReleaseRangeOffsetY ? mouseYPosition - endingLineReleaseRangeOffsetY : endingLineReleaseRangeOffsetY - mouseYPosition
        const differenseInYPositionOfStartingReleaseLineFromMouseY = mouseYPosition > startingLineReleaseRangeOffsetY ? mouseYPosition - startingLineReleaseRangeOffsetY : startingLineReleaseRangeOffsetY - mouseYPosition

        if (differenseInYPositionOfEndingReleaseLineFromMouseY < differenseInYPositionOfStartingReleaseLineFromMouseY) {
            // console.log("USING ENDING LINE OFFSET TOP")
            this._calculateCoordinates(mouseMoveEvent, endingLineReleaseRangeOffsetY)
        }
        else {
            // console.log("USING STARTING LINE OFFSET TOP")
            this._calculateCoordinates(mouseMoveEvent, startingLineReleaseRangeOffsetY)
        }

    }

    /**
    * @param {MouseEvent} mouseMoveEvent
    * @param { Number} offsetTop
    */
    _calculateCoordinates(mouseMoveEvent, offsetTop) {
        const widthOfStartingLineOfReleaseRange = calculateTotalLeftOffsetOfCaretInTheLine(new CaretLeftOffsetDTO(this.releasingRange.startContainer, this.releasingRange.startContainerOffset, this.releasingRange.startOffset))
        const widthOfEndingLineOfReleaseRange = calculateTotalLeftOffsetOfCaretInTheLine(new CaretLeftOffsetDTO(this.releasingRange.endContainer, this.releasingRange.endContainerOffset, this.releasingRange.endOffset))
        const mouseXPosition = mouseMoveEvent.offsetX
        const differenseInXPositionOfEndingReleaseLineFromMouseX = mouseXPosition > widthOfEndingLineOfReleaseRange ? mouseXPosition - widthOfEndingLineOfReleaseRange : widthOfEndingLineOfReleaseRange - mouseXPosition
        const differenseInXPositionOfStartingReleaseLineFromMouseX = mouseXPosition > widthOfStartingLineOfReleaseRange ? mouseXPosition - widthOfStartingLineOfReleaseRange : widthOfStartingLineOfReleaseRange - mouseXPosition

        let selection = new CustomMultiLineRange(
            offsetTop, widthOfStartingLineOfReleaseRange,
            this.startingRangeTopOffset, this.startingLineWidth,
            this.startingRangeLine,
            Number(this.releasingRange.lineOfStartContainer.id)
        )
        if (widthOfStartingLineOfReleaseRange == this.startingLineWidth && this.startingRangeTopOffset == this.releasingRange.offsetTopForStartingLine) {
            selection = new CustomMultiLineRange(
                offsetTop, widthOfEndingLineOfReleaseRange,
                this.releasingRange.offsetTopForStartingLine, widthOfStartingLineOfReleaseRange,
                Number(this.releasingRange.lineOfStartContainer.id),
                Number(this.releasingRange.lineOfEndContainer.id)
            )
        }
        else if (differenseInXPositionOfEndingReleaseLineFromMouseX <= differenseInXPositionOfStartingReleaseLineFromMouseX && this.releasingRange.offsetTopForEndingLine == offsetTop) {
            // console.log('IN THE ELSE IF')
            selection = new CustomMultiLineRange(
                offsetTop, widthOfEndingLineOfReleaseRange,
                this.startingRangeTopOffset, this.startingLineWidth,
                this.startingRangeLine,
                Number(this.releasingRange.lineOfEndContainer.id)
            )
        }
        console.log(selection)
        this._calculateCoordinatesForSelection(selection)
    }

    /**
     * 
     * @param {CustomMultiLineRange} multilineRange 
     */
    _calculateCoordinatesForSelection(multilineRange) {
        // console.log("CALCULATE COORDINATES FOR SELECTION: ")
        // console.log(multilineRange)
        if (multilineRange.topOffsetOfStartingRangeLine < multilineRange.offsetTopOfReleaseRangeLine) {
            console.log("START WITH STARTING RANGE")
            this._calculateCoordinatesWithStartingRangeFirst(multilineRange)
        } else {
            console.log("START WITH RELEASE RANGE")
            this._calculateCoordinatesWithReleasingRangeFirst(multilineRange)
        }
    }

    /**
     * 
     * @param {CustomMultiLineRange} multilineRange 
     */
    _calculateCoordinatesWithStartingRangeFirst(multilineRange) {
        this._calculateCoordinatesForFirstLine(
            multilineRange.offsetLeftofStartingRangeLine,
            multilineRange.topOffsetOfStartingRangeLine,
            multilineRange.lineIdOfStartingRangeLine
        )
        const firstLine = multilineRange.lineIdOfStartingRangeLine + 1
        const lastLine = multilineRange.lineIdOfReleaseRangeLine
        this._calculateCoordinatesForInBetweenLines(firstLine, lastLine)
        this._calculateCoordinatesForLastLine(
            multilineRange.leftOffsetOfReleaseRangeLine,
            multilineRange.offsetTopOfReleaseRangeLine,
            multilineRange.lineIdOfReleaseRangeLine
        )
    }

    /**
     * @param {Number} leftOffset 
     * @param {Number} topOffset
     * @param {Number} lineId  
     */
    _calculateCoordinatesForFirstLine(leftOffset, topOffset, lineId) {
        const textContentOfLine = document.getElementById(String(lineId)).textContent
        const widthOfTextContent = calculateWidthForText(textContentOfLine)
        const widthOfSelectedText = widthOfTextContent - leftOffset
        const coordinates = new MarkedLineCoordinates(leftOffset, topOffset, widthOfSelectedText)
        this.coordinatesToHighlight.set(lineId, coordinates)
        if (lineId >= this.startingRangeLine) {
            this.startingMarkedPoint = new MArkedPoint(
                this.startingRangeTopOffset,
                this.startingLineWidth,
                widthOfSelectedText,
                this.startingRangeLine
            )
        }
        else {
            this.startingMarkedPoint = new MArkedPoint(
                topOffset, leftOffset, widthOfSelectedText, lineId
            )

        }
    }

    /**
     * 
     * @param {Number} firstLine 
     * @param {Number} lastLine 
     */
    _calculateCoordinatesForInBetweenLines(firstLine, lastLine) {
        let lineElement = document.getElementById(String(lastLine))
        while (lineElement == null) {
            lastLine -= 1
            lineElement = document.getElementById(String(lastLine))
        }
        for (let index = firstLine; index <= lastLine; index++) {
            this._calculateCoordinatesForLineAtIndex(index)
        }
    }

    /**
     * 
     * @param {Number} index 
     */
    _calculateCoordinatesForLineAtIndex(index) {
        const lineElement = document.getElementById(String(index));
        const textContentOfLine = lineElement.textContent
        const widthOfTextContent = calculateWidthForText(textContentOfLine)
        const topOffset = lineElement.offsetTop
        const coordinates = new MarkedLineCoordinates(0, topOffset, widthOfTextContent)
        this.coordinatesToHighlight.set(index, coordinates)
    }

    /**
     * @param {Number} leftOffset 
     * @param {Number} topOffset
     * @param {Number} lineId  
     */
    _calculateCoordinatesForLastLine(leftOffset, topOffset, lineId) {
        const coordinates = new MarkedLineCoordinates(0, topOffset, leftOffset)
        this.coordinatesToHighlight.set(lineId, coordinates)
        console.log(leftOffset)
        if (lineId >= this.startingRangeLine) {

            this.endingMarkedPoint = new MArkedPoint(
                topOffset, 0, leftOffset, lineId
            )
        }
        else {
            this.endingMarkedPoint = new MArkedPoint(
                this.startingRangeTopOffset,
                0,
                this.startingLineWidth,
                this.startingRangeLine
            )
        }
    }

    /**
     * 
     * @param {CustomMultiLineRange} multilineRange 
     */
    _calculateCoordinatesWithReleasingRangeFirst(multilineRange) {
        this._calculateCoordinatesForFirstLine(
            multilineRange.leftOffsetOfReleaseRangeLine,
            multilineRange.offsetTopOfReleaseRangeLine,
            multilineRange.lineIdOfReleaseRangeLine
        )
        const firstLine = multilineRange.lineIdOfReleaseRangeLine + 1
        const lastLine = multilineRange.lineIdOfStartingRangeLine
        this._calculateCoordinatesForInBetweenLines(firstLine, lastLine)
        this._calculateCoordinatesForLastLine(
            multilineRange.offsetLeftofStartingRangeLine,
            multilineRange.topOffsetOfStartingRangeLine,
            multilineRange.lineIdOfStartingRangeLine
        )
    }

    /**
     * @param {MouseEvent} mouseMoveEvent
     * @param {Number} line 
     */
    _handleMultilineTextSelectionWithStartignRangeNotVisibleOnTheScreen(mouseMoveEvent, line) {
        // console.log("BEFORE VISIBLE LINES")
        this._handleStartingRangeIsNotVisible(mouseMoveEvent, line)
    }


    /**
     * @param {MouseEvent} mouseMoveEvent
     * @param {Number} line 
    */
    _handleStartingRangeIsNotVisible(mouseMoveEvent, line) {
        const mouseYPosition = mouseMoveEvent.currentTarget.offsetTop
        const startingLineReleaseRangeOffsetY = this.releasingRange.offsetTopForStartingLine
        const endingLineReleaseRangeOffsetY = this.releasingRange.offsetTopForEndingLine

        const differenseInYPositionOfEndingReleaseLineFromMouseX = mouseYPosition > endingLineReleaseRangeOffsetY ? mouseYPosition - endingLineReleaseRangeOffsetY : endingLineReleaseRangeOffsetY - mouseYPosition
        const differenseInYPositionOfStartingReleaseLineFromMouseX = mouseYPosition > startingLineReleaseRangeOffsetY ? mouseYPosition - startingLineReleaseRangeOffsetY : startingLineReleaseRangeOffsetY - mouseYPosition
        if (differenseInYPositionOfEndingReleaseLineFromMouseX < differenseInYPositionOfStartingReleaseLineFromMouseX) {
            console.log("HERE")
            this._calculateCoordinatesForStartingRangeNotVisible(mouseMoveEvent, line, endingLineReleaseRangeOffsetY)
        }
        else {
            console.log("THERE")
            this._calculateCoordinatesForStartingRangeNotVisible(mouseMoveEvent, line, startingLineReleaseRangeOffsetY)
        }
    }

    /**
     * 
     * @param {MouseEvent} mouseMoveEvent 
     * @param {Number} line 
     * @param {Number} offsetTop 
     */
    _calculateCoordinatesForStartingRangeNotVisible(mouseMoveEvent, line, offsetTop) {
        // Completely broken and unreliable, when it is with top or bottom scrolling.
        const widthOfStartingLineOfReleaseRange = calculateTotalLeftOffsetOfCaretInTheLine(new CaretLeftOffsetDTO(this.releasingRange.startContainer, this.releasingRange.startContainerOffset, this.releasingRange.startOffset))
        const widthOfEndingLineOfReleaseRange = calculateTotalLeftOffsetOfCaretInTheLine(new CaretLeftOffsetDTO(this.releasingRange.endContainer, this.releasingRange.endContainerOffset, this.releasingRange.endOffset))
        console.log(widthOfStartingLineOfReleaseRange)
        console.log(widthOfEndingLineOfReleaseRange)
        const mouseXPosition = mouseMoveEvent.offsetX
        const differenseInXPositionOfEndingReleaseLineFromMouseX = mouseXPosition > widthOfEndingLineOfReleaseRange ? mouseXPosition - widthOfEndingLineOfReleaseRange : widthOfEndingLineOfReleaseRange - mouseXPosition
        const differenseInXPositionOfStartingReleaseLineFromMouseX = mouseXPosition > widthOfStartingLineOfReleaseRange ? mouseXPosition - widthOfStartingLineOfReleaseRange : widthOfStartingLineOfReleaseRange - mouseXPosition
        console.log(differenseInXPositionOfEndingReleaseLineFromMouseX)
        console.log(differenseInXPositionOfStartingReleaseLineFromMouseX)

        const lineOffsetTop = document.getElementById(String(line)).offsetTop
        let selection = new CustomMultiLineRange(
            offsetTop, widthOfStartingLineOfReleaseRange,
            lineOffsetTop, 0,
            line,
            Number(this.releasingRange.lineOfStartContainer.id)
        )
        if (differenseInXPositionOfEndingReleaseLineFromMouseX <= differenseInXPositionOfStartingReleaseLineFromMouseX && this.releasingRange.offsetTopForEndingLine == offsetTop) {
            selection = new CustomMultiLineRange(
                offsetTop, widthOfEndingLineOfReleaseRange,
                lineOffsetTop, 0,
                line,
                Number(this.releasingRange.lineOfEndContainer.id)
            )
        }
        else if (differenseInXPositionOfEndingReleaseLineFromMouseX > differenseInXPositionOfStartingReleaseLineFromMouseX && this.releasingRange.offsetTopForEndingLine == offsetTop) {
            console.log("IS HERE")
            selection = new CustomMultiLineRange(
                offsetTop, 0,
                lineOffsetTop, widthOfEndingLineOfReleaseRange,
                line,
                Number(this.releasingRange.lineOfEndContainer.id)
            )
        }
        else if (false) {
            selection = new CustomMultiLineRange(
                offsetTop, 0,
                lineOffsetTop, widthOfEndingLineOfReleaseRange,
                line,
                Number(this.releasingRange.lineOfEndContainer.id)
            )
        }
        console.log(selection)
        this._calculateCoordinatesForSelection(selection)
    }

    /**
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
                this._calculateCoordinatesForLineAtIndex(index)
            }
        }
    }
}
