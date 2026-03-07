import Highlighter from "./highlighter"

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
     */
    constructor(offsetTopOfContentScreen, lineNumerationScrollWidth, contentElementScrollHeight, contentElementScrollWidth) {
        this.offsetTopOfContentScreen = offsetTopOfContentScreen
        this.widhtOfLineNumerationElement = lineNumerationScrollWidth
        this.totalWidthOfScreen = contentElementScrollWidth + lineNumerationScrollWidth
        this.heightOfElementBasedOnVisibleLinesOnTheScreen = contentElementScrollHeight
        this.windowSectionScrollig = null
        this.highlighter = new Highlighter()
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

    setEndingRange(range) {
        this.highlighter.setEndingPointBasedOnRange(range)
    }

    /**
     * @param {MouseEvent} event 
     * @param {Number} firstVisibleLine 
     * @param {Number} lastVisibleLine 
     * @returns {null}
     */
    selectTextBetweenRanges(event, firstVisibleLine, lastVisibleLine) {
        this.windowSectionScrollig = WindowSection.CENTRE
        this._defineSectionOfTextSelection(event)
        this._highlightTextBasedOnMousePosition(event, firstVisibleLine, lastVisibleLine)
        console.log(this.windowSectionScrollig)
        return null
    }

    /**
    * 
    * @param {MouseEvent} event 
    * @returns {String} the position of the mouse
    */
    _defineSectionOfTextSelection(event) {
        const mouseYPositionBasedOnPage = event.pageY
        const mouseXPositionBasedOnPage = event.pageX
        if (mouseYPositionBasedOnPage == 0 && this.windowSectionScrollig == WindowSection.BOTTOM) {
            return MousePosition.BOTTOM
        }
        else if (mouseYPositionBasedOnPage == 0 && this.windowSectionScrollig == WindowSection.TOP) {
            return MousePosition.TOP
        }
        else if (mouseYPositionBasedOnPage > this.heightOfElementBasedOnVisibleLinesOnTheScreen + this.offsetTopOfContentScreen) {
            this.windowSectionScrollig = WindowSection.BOTTOM
            return MousePosition.BOTTOM
        }
        else if (mouseYPositionBasedOnPage < this.offsetTopOfContentScreen && mouseYPositionBasedOnPage != 0) {
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
     * 
     * @param {MouseEvent} event 
     */
    _highlightTextBasedOnMousePosition(event, firstVisibleLine, lastVisibleLine) {
        if (this.windowSectionScrollig == MousePosition.RIGHT) {

        }
        else if (this.windowSectionScrollig == MousePosition.LEFT) {
            this.highlighter.highlightForLeftScreenSection(event, firstVisibleLine, lastVisibleLine)
        }
        else if (this.windowSectionScrollig == MousePosition.TOP) {

        }
        else if (this.windowSectionScrollig == MousePosition.BOTTOM) {

        }
        else if (this.windowSectionScrollig == MousePosition.CENTRE) {

        }
    }

}