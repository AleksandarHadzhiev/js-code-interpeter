import Highlighter from "./highlighter.js"
import { MousePosition, WindowSection } from "./enums.js"
import { StartingPoint } from "../dtos/caretDTOs.js"


export default class TextSelection {
    /**
     * 
     * @param {Number} offsetTopOfContentScreen 
     * @param {Number} lineNumerationScrollWidth 
     * @param {Number} contentElementScrollHeight 
     * @param {Number} contentElementScrollWidth
     * @param {HTMLElement} contentElement 
     */
    constructor(offsetTopOfContentScreen, lineNumerationScrollWidth, contentElementScrollHeight, contentElementScrollWidth, contentElement) {
        this.offsetTopOfContentScreen = offsetTopOfContentScreen
        this.widhtOfLineNumerationElement = lineNumerationScrollWidth
        this.totalWidthOfScreen = contentElementScrollWidth + lineNumerationScrollWidth
        this.heightOfElementBasedOnVisibleLinesOnTheScreen = contentElementScrollHeight
        this.windowSectionScrollig = null
        this.mousePosition = null
        this.highlighter = new Highlighter(contentElement)
        this.loaderOffset = 0
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
    setStartingRange(startingPoint) {
        this.highlighter.setStartingPointBasedOnRange(startingPoint)
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
     * @param {Number} firstVisibleLine 
     * @param {Number} lastVisibleLine 
     * @returns {null}
     */
    selectTextBetweenRanges(event, firstVisibleLine, lastVisibleLine) {
        this.windowSectionScrollig = WindowSection.CENTRE
        const mouseYPositionBasedOnPage = event.pageY + this.loaderOffset - this.offsetTopOfContentScreen
        this.mousePosition = this._defineSectionOfTextSelection(event, mouseYPositionBasedOnPage)
        this._highlightTextBasedOnMousePosition(mouseYPositionBasedOnPage, firstVisibleLine, lastVisibleLine)
        return this.mousePosition
    }

    /**
    * 
    * @param {MouseEvent} event 
    * @param {Number} mouseYPositionBasedOnPage 
    * @returns {String} the position of the mouse
    */
    _defineSectionOfTextSelection(event, mouseYPositionBasedOnPage) {
        const mouseXPositionBasedOnPage = event.pageX
        const pointWhenBottomBegins = this.heightOfElementBasedOnVisibleLinesOnTheScreen + this.loaderOffset
        if (mouseYPositionBasedOnPage == 0 && this.windowSectionScrollig == WindowSection.BOTTOM) {
            return MousePosition.BOTTOM
        }
        else if (mouseYPositionBasedOnPage == 0 && this.windowSectionScrollig == WindowSection.TOP) {
            return MousePosition.TOP
        }
        else if (mouseYPositionBasedOnPage > pointWhenBottomBegins) {
            this.windowSectionScrollig = WindowSection.BOTTOM
            return MousePosition.BOTTOM
        }
        else if (mouseYPositionBasedOnPage < this.loaderOffset && mouseYPositionBasedOnPage != 0) {
            this.windowSectionScrollig = WindowSection.TOP
            return MousePosition.TOP
        }
        else if (mouseXPositionBasedOnPage < this.widhtOfLineNumerationElement) {
            this.windowSectionScrollig = WindowSection.LEFT
            return MousePosition.LEFT
        }
        else if (mouseXPositionBasedOnPage > this.totalWidthOfScreen) {
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

        }
        else if (this.mousePosition == MousePosition.LEFT) {
            this.highlighter.highlightForLeftScreenSection(mouseYPositionBasedOnPage, firstVisibleLine, lastVisibleLine)
        }
        else if (this.mousePosition == MousePosition.TOP) {

        }
        else if (this.mousePosition == MousePosition.BOTTOM) {

        }
        else if (this.mousePosition == MousePosition.CENTRE) {

        }
    }

}