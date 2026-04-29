import Highlighter from "./highlighter.js"
import { MousePosition, WindowSection } from "./enums.js"
import { StartingPoint } from "../dtos/caretDTOs.js"
import CaretBuilder from "./caretBuilder.js"
import MarkedPoint from "./MarkedPoint.js"
import ContentScrollingHandler from "../scrollingMechanisms/ContentScrollingHandler.js"
import TextFetcher from "./textFetcher.js"


export default class TextSelector { // rename to CodeSelector
    /**
     * 
     * @param {Number} offsetTopOfContentScreen 
     * @param {HTMLElement} contentElement 
     * @param {Number} lastTextLine
     */
    constructor(offsetTopOfContentScreen, contentElement, lastTextLine) {
        this.offsetTopOfContentScreen = offsetTopOfContentScreen
        this.windowSectionScrollig = null
        this.mousePosition = null
        this.highlighter = new Highlighter(contentElement)
        this.contentElement = contentElement
        this.loaderOffset = 0
        this.mouseXPosition = 0
        this.lastTextLine = lastTextLine
        this.selectedText = ""
        this.mouseXPosition = 0
        this.textFetcher = new TextFetcher(this.highlighter, this.contentElement)
    }

    /**
     * 
     * @param {Number} firstVisibleLine 
     * @param {Number} lastVisibleLine 
     * @param {String} text 
     */
    selectWholeText(firstVisibleLine, lastVisibleLine, text) {
        const lines = text.split('\n')
        this.highlighter.selectWholeText(firstVisibleLine, lastVisibleLine, lines)
    }

    /**
     * @param {String} fullText 
     */
    selectTextOnCopyCommand(fullText) { // not responsibility of the TextSelector to know the copy command
        const fetchedText = this.textFetcher.selectTextFromFullText(fullText)
        this.selectedText = fetchedText.text
        navigator.clipboard.writeText(this.selectedText)
        return fetchedText
    }

    /**
     * 
     * @param {StartingPoint} startingPoint 
     */
    setStartingPoint(startingPoint) {
        this.highlighter.setStartingPoint(startingPoint)
    }

    /**
     * 
     * @param {Range} range 
     */
    setEndingRange(range) {
        this.highlighter.setEndingRangeBasedOnRange(range)
    }

    /**
     * 
     * @param {Number} pageYMousePosition 
     * @param {Number} firstVisibleLine 
     * @param {Number} lastVisibleLine 
     * @param {String} mousePosition 
     * @param {MouseEvent} event 
     */
    selectText(pageYMousePosition, firstVisibleLine, lastVisibleLine, mousePosition, event) {
        this.mouseXPosition = event.pageX
        this.mousePosition = mousePosition
        const mouseYPositionBasedOnPage = pageYMousePosition + this.loaderOffset - this.offsetTopOfContentScreen
        this._highlightTextBasedOnMousePosition(mouseYPositionBasedOnPage, firstVisibleLine, lastVisibleLine)
        this._buildCaretForTextSelection(mouseYPositionBasedOnPage)
    }

    /**
     * @param {Number} mouseYPositionBasedOnPage 
     * @param {Number} firstVisibleLine 
     * @param {Number} lastVisibleLine 
     */
    _highlightTextBasedOnMousePosition(mouseYPositionBasedOnPage, firstVisibleLine, lastVisibleLine) {
        if (this.mousePosition == MousePosition.RIGHT) {
            this.highlighter.highlightForRightScreenSection(mouseYPositionBasedOnPage, firstVisibleLine, lastVisibleLine)
        }
        else if (this.mousePosition == MousePosition.LEFT) {
            this.highlighter.highlightForLeftScreenSection(mouseYPositionBasedOnPage, firstVisibleLine, lastVisibleLine)
        }
        else if (this.mousePosition == MousePosition.TOP) {
            this.highlighter.highlightForTopScreenSection(mouseYPositionBasedOnPage, firstVisibleLine, lastVisibleLine)
        }
        else if (this.mousePosition == MousePosition.BOTTOM) {
            this.highlighter.highlightForBottomScreenSection(mouseYPositionBasedOnPage, firstVisibleLine, lastVisibleLine, this.lastTextLine)
        }
        else if (this.mousePosition == MousePosition.CENTRE) {
            this.highlighter.highlightForMouseInEditorSection(mouseYPositionBasedOnPage, firstVisibleLine, lastVisibleLine, this.xForMouseInEditor)
        }
    }


    /**
     * 
     * @param {Number} mouseYPositionBasedOnPage 
     */
    _buildCaretForTextSelection(mouseYPositionBasedOnPage) {
        const caretBuilder = new CaretBuilder()
        if (this.highlighter.endingPoint != null)
            this._buildCaret(caretBuilder, mouseYPositionBasedOnPage)
    }

    /**
     * 
     * @param {CaretBuilder} caretBuilder 
     * @param {Number} mouseYPositionBasedOnPage 
     */
    _buildCaret(caretBuilder, mouseYPositionBasedOnPage) {
        const lineId = Math.floor(mouseYPositionBasedOnPage / 28.8)
        const startingPoint = this.highlighter.customMarker.algorithm.startingMarkedPoint
        const endingPoint = this.highlighter.customMarker.algorithm.endingMarkedPoint

        if (lineId == endingPoint.lineId && endingPoint.lineId == startingPoint.lineId)
            this._handleCaretPositioningWhenCaretIsOnSameLineAsStartingAndEndingPoints(caretBuilder, startingPoint, endingPoint, lineId)
        else if (lineId == endingPoint.lineId)
            caretBuilder.buildCaretForTextSelection(endingPoint, this.mousePosition, this.xForMouseInEditor)
        else if (lineId == startingPoint.lineId)
            caretBuilder.buildCaretForTextSelection(startingPoint, this.mousePosition, this.xForMouseInEditor)
        else {
            this._handleCaretForWhenOnDifferentLines(caretBuilder, endingPoint, startingPoint, mouseYPositionBasedOnPage)
        }
    }

    /**
     * 
     * @param {CaretBuilder} caretBuilder 
     * @param {MarkedPoint} startingPoint 
     * @param {MarkedPoint} endingPoint 
     * @param {Number} lineId 
     */
    _handleCaretPositioningWhenCaretIsOnSameLineAsStartingAndEndingPoints(caretBuilder, startingPoint, endingPoint, lineId) {
        const differenceBetweenEndingPointLeftOffsetAndMouseX = this.xForMouseInEditor > endingPoint.left ? this.xForMouseInEditor - endingPoint.left : endingPoint.left - this.xForMouseInEditor
        const differenceBetweenStartingPointLeftOffsetAndMouseX = this.xForMouseInEditor > startingPoint.left ? this.xForMouseInEditor - startingPoint.left : startingPoint.left - this.xForMouseInEditor
        if (differenceBetweenEndingPointLeftOffsetAndMouseX < differenceBetweenStartingPointLeftOffsetAndMouseX)
            caretBuilder.buildCaretForTextSelection(endingPoint, this.mousePosition, this.xForMouseInEditor)
        else if (differenceBetweenStartingPointLeftOffsetAndMouseX < differenceBetweenEndingPointLeftOffsetAndMouseX)
            caretBuilder.buildCaretForTextSelection(startingPoint, this.mousePosition, this.xForMouseInEditor)
        else
            this._handleCaretPositioningWhenHorizontalDistanceIsEqualBetweenPointsAndMouse(caretBuilder, lineId, endingPoint, startingPoint)
    }

    /**
     * @param {CaretBuilder} caretBuilder 
     * @param {Number} lineId 
     * @param {MarkedPoint} endingPoint 
     * @param {MarkedPoint} startingPoint 
     */
    _handleCaretPositioningWhenHorizontalDistanceIsEqualBetweenPointsAndMouse(caretBuilder, lineId, endingPoint, startingPoint) {
        let point = new MarkedPoint(lineId * 28.8, endingPoint.left, endingPoint.width, lineId)
        if (this.mousePosition == MousePosition.LEFT)
            point = new MarkedPoint(lineId * 28.8, startingPoint.left, startingPoint.width, lineId)
        else if (this.mousePosition == MousePosition.RIGHT)
            point = new MarkedPoint(lineId * 28.8, endingPoint.left + endingPoint.width, 0, lineId)
        caretBuilder.buildCaretForTextSelection(point, this.mousePosition, this.xForMouseInEditor)
    }

    /**
     * 
     * @param {CaretBuilder} caretBuilder 
     * @param {MarkedPoint} endingPoint 
     * @param {MarkedPoint} startingPoint 
     * @param {MarkedPoint} mouseYPositionBasedOnPage 
     */
    _handleCaretForWhenOnDifferentLines(caretBuilder, endingPoint, startingPoint, mouseYPositionBasedOnPage) {
        const differenceBetweenEndingPointTopAndMouseYPositon = mouseYPositionBasedOnPage > endingPoint.top ? mouseYPositionBasedOnPage - endingPoint.top : endingPoint.top - mouseYPositionBasedOnPage
        const differenceBetweenStartingPointTopAndMouseYPositon = mouseYPositionBasedOnPage > startingPoint.top ? mouseYPositionBasedOnPage - startingPoint.top : startingPoint.top - mouseYPositionBasedOnPage
        if (differenceBetweenEndingPointTopAndMouseYPositon > differenceBetweenStartingPointTopAndMouseYPositon)
            caretBuilder.buildCaretForTextSelection(startingPoint, this.mousePosition, this.xForMouseInEditor)
        else if (differenceBetweenEndingPointTopAndMouseYPositon < differenceBetweenStartingPointTopAndMouseYPositon)
            caretBuilder.buildCaretForTextSelection(endingPoint, this.mousePosition, this.xForMouseInEditor)
        else if (this.mousePosition == MousePosition.LEFT || this.mousePosition == MousePosition.RIGHT)
            this._handleCaretPositioniningForOutsideTheScreenOnY(caretBuilder, startingPoint, endingPoint)
        else if (this.mousePosition == MousePosition.TOP)
            caretBuilder.buildCaretForTextSelection(startingPoint, this.mousePosition, this.xForMouseInEditor)
    }

    /**
     * 
     * @param {CaretBuilder} caretBuilder 
     * @param {MarkedPoint} startingPoint 
     * @param {MarkedPoint} endingPoint 
     */
    _handleCaretPositioniningForOutsideTheScreenOnY(caretBuilder, startingPoint, endingPoint) {
        let point = startingPoint
        if (this.mousePosition == MousePosition.BOTTOM)
            point = endingPoint
        caretBuilder.buildCaretForTextSelection(point, this.mousePosition, this.xForMouseInEditor)
    }

}