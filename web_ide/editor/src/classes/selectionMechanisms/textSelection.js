import Highlighter from "./highlighter.js"
import { MousePosition, WindowSection } from "./enums.js"
import { StartingPoint } from "../dtos/caretDTOs.js"
import CaretBuilder from "./caretBuilder.js"


export default class TextSelection {
    /**
     * 
     * @param {Number} offsetTopOfContentScreen 
     * @param {Number} lineNumerationScrollWidth 
     * @param {Number} contentElementScrollHeight 
     * @param {Number} contentElementScrollWidth
     * @param {HTMLElement} contentElement 
     * @param {Number} contentElementOffsetLeft 
     * @param {Number} maxLines 
     */
    constructor(offsetTopOfContentScreen, lineNumerationScrollWidth, contentElementScrollHeight, contentElementScrollWidth, contentElement, contentElementOffsetLeft, maxLines) {
        this.offsetTopOfContentScreen = offsetTopOfContentScreen
        this.totalWidthOfScreen = contentElementScrollWidth + lineNumerationScrollWidth
        this.heightOfElementBasedOnVisibleLinesOnTheScreen = contentElementScrollHeight
        this.windowSectionScrollig = null
        this.mousePosition = null
        this.highlighter = new Highlighter(contentElement)
        this.contentElement = contentElement
        this.loaderOffset = 0
        this.mouseXPosition = 0
        this.contentElementOffsetLeft = contentElementOffsetLeft
        this.lastTextLine = maxLines
    }

    /**
     * 
     * @param {Number} height 
     */
    updateHeightOfElementBasedOnVisibleLinesOnTheScreen(height) {
        this.heightOfElementBasedOnVisibleLinesOnTheScreen = height
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
     * @param {Number} offset 
     */
    setLoaderOffset(offset) {
        this.loaderOffset = offset
    }

    /**
     * @param {MouseEvent} event 
     * @returns {null}
     */
    defineMousePosition(event) {
        this.windowSectionScrollig = WindowSection.CENTRE
        const mouseYPositionBasedOnPage = event.pageY + this.loaderOffset - this.offsetTopOfContentScreen
        this.mousePosition = this._defineSectionOfTextSelection(event, mouseYPositionBasedOnPage)
        return this.mousePosition
    }

    /**
     * 
     * @param {MouseEvent} event 
     * @param {Number} firstVisibleLine 
     * @param {Number} lastVisibleLine 
     */
    selectText(event, firstVisibleLine, lastVisibleLine) {
        const mouseYPositionBasedOnPage = event.pageY + this.loaderOffset - this.offsetTopOfContentScreen
        this._highlightTextBasedOnMousePosition(mouseYPositionBasedOnPage, firstVisibleLine, lastVisibleLine)
        this._buildCaretForTextSelection(mouseYPositionBasedOnPage)
    }

    /**
    * 
    * @param {MouseEvent} event 
    * @param {Number} mouseYPositionBasedOnPage 
    * @returns {String} the position of the mouse
    */
    _defineSectionOfTextSelection(event, mouseYPositionBasedOnPage) {
        this.mouseXPosition = event.pageX
        const maxTopOffsetForSelection = this.lastTextLine * 28.8
        this.xForMouseInEditor = this.mouseXPosition - this.contentElementOffsetLeft
        const pointWhenBottomBegins = this.heightOfElementBasedOnVisibleLinesOnTheScreen + this.loaderOffset
        if (mouseYPositionBasedOnPage > maxTopOffsetForSelection) {
            return MousePosition.BOTTOM
        }
        else if (mouseYPositionBasedOnPage == 0 && this.windowSectionScrollig == WindowSection.BOTTOM) {
            return MousePosition.BOTTOM
        }
        else if (mouseYPositionBasedOnPage == 0 && this.windowSectionScrollig == WindowSection.TOP) {
            return MousePosition.TOP
        }
        else if (mouseYPositionBasedOnPage > pointWhenBottomBegins || pointWhenBottomBegins - mouseYPositionBasedOnPage <= 12.4) {
            this.windowSectionScrollig = WindowSection.BOTTOM
            return MousePosition.BOTTOM
        }
        else if (mouseYPositionBasedOnPage == this.loaderOffset && mouseYPositionBasedOnPage == 0) {
            this.windowSectionScrollig = WindowSection.TOP
            return MousePosition.TOP
        }
        else if (mouseYPositionBasedOnPage < this.loaderOffset && mouseYPositionBasedOnPage != 0) {
            this.windowSectionScrollig = WindowSection.TOP
            return MousePosition.TOP
        }
        else if (this.mouseXPosition < this.contentElementOffsetLeft) {
            this.windowSectionScrollig = WindowSection.LEFT
            return MousePosition.LEFT
        }
        else if (this.mouseXPosition > this.totalWidthOfScreen) {
            this.windowSectionScrollig = WindowSection.RIGHT
            return MousePosition.RIGHT
        }
        this.windowSectionScrollig = WindowSection.CENTRE
        return MousePosition.CENTRE
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
        if (this.highlighter.endingPoint != null) {
            const startingPoint = this.highlighter.customMarker.algorithm.startingMarkedPoint
            const endingPoint = this.highlighter.customMarker.algorithm.endingMarkedPoint
            const differenceBetweenEndingPointTopOffsetAndMouseY = mouseYPositionBasedOnPage > endingPoint.top ? mouseYPositionBasedOnPage - endingPoint.top : endingPoint.top - mouseYPositionBasedOnPage
            const differenceBetweenStartingPointTopOffsetAndMouseY = mouseYPositionBasedOnPage > startingPoint.top ? mouseYPositionBasedOnPage - startingPoint.top : startingPoint.top - mouseYPositionBasedOnPage
            if (differenceBetweenEndingPointTopOffsetAndMouseY < differenceBetweenStartingPointTopOffsetAndMouseY)
                caretBuilder.buildCaretForTextSelection(this.contentElement, endingPoint, this.mousePosition, this.xForMouseInEditor)
            else if (differenceBetweenEndingPointTopOffsetAndMouseY > differenceBetweenStartingPointTopOffsetAndMouseY)
                caretBuilder.buildCaretForTextSelection(this.contentElement, startingPoint, this.mousePosition, this.xForMouseInEditor)
            else {
                const differenceBetweenEndingPointLeftOffsetAndMouseX = this.xForMouseInEditor > endingPoint.left ? this.xForMouseInEditor - endingPoint.left : endingPoint.left - this.xForMouseInEditor
                const differenceBetweenStartingPointLeftOffsetAndMouseX = this.xForMouseInEditor > startingPoint.left ? this.xForMouseInEditor - startingPoint.left : startingPoint.left - this.xForMouseInEditor
                if (differenceBetweenEndingPointLeftOffsetAndMouseX < differenceBetweenStartingPointLeftOffsetAndMouseX) {
                    caretBuilder.buildCaretForTextSelection(this.contentElement, endingPoint, this.mousePosition, this.xForMouseInEditor)
                }
                else if (differenceBetweenStartingPointLeftOffsetAndMouseX < differenceBetweenEndingPointLeftOffsetAndMouseX) {
                    caretBuilder.buildCaretForTextSelection(this.contentElement, startingPoint, this.mousePosition, this.xForMouseInEditor)
                }
            }
        }
    }

    /**
     * 
     * @param {Number} firstVisibleLine 
     * @param {Number} lastVisibleLine 
     */
    display(firstVisibleLine, lastVisibleLine) {
        this.highlighter.display(firstVisibleLine, lastVisibleLine)
    }
}