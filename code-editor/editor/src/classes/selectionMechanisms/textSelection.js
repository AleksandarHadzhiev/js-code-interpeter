import Highlighter from "./highlighter.js"

const MousePosition = {
    LEFT: "left",
    RIGHT: "right",
    TOP: "top",
    BOTTOM: "bottom",
    CENTRE: "centre"
}

const WindowSection = {
    TOP: "TOP",
    BOTTOM: "BOTTOM",
    CENTRE: "CENTRE",
    LEFT: "LEFT",
    RIGHT: "RIGHT"
}


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
     * @param {Range} range 
     */
    setStartingRange(range) {
        this.highlighter.setStartingPointBasedOnRange(range)
    }

    /**
     * 
     * @param {Range} range 
     */
    setEndingRange(range) {
        this.highlighter.setEndingPointBasedOnRange(range)
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
        console.log(this.windowSectionScrollig)
        return null
    }

    /**
    * 
    * @param {MouseEvent} event 
    * @param {Number} mouseYPositionBasedOnPage 
    * @returns {String} the position of the mouse
    */
    _defineSectionOfTextSelection(event, mouseYPositionBasedOnPage) {
        const mouseXPositionBasedOnPage = event.pageX
        if (mouseYPositionBasedOnPage == 0 && this.windowSectionScrollig == WindowSection.BOTTOM) {
            return MousePosition.BOTTOM
        }
        else if (mouseYPositionBasedOnPage == 0 && this.windowSectionScrollig == WindowSection.TOP) {
            return MousePosition.TOP
        }
        else if (mouseYPositionBasedOnPage > this.heightOfElementBasedOnVisibleLinesOnTheScreen) {
            this.windowSectionScrollig = WindowSection.BOTTOM
            return MousePosition.BOTTOM
        }
        else if (mouseYPositionBasedOnPage < this.loaderOffset && mouseYPositionBasedOnPage != 0) {
            this.windowSectionScrollig = WindowSection.TOP
            return MousePosition.TOP
        }
        // LEFT AND RIGHT CONFIGURATION NEED FIXING
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
            console.log("HERE")
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