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

const StartingPointVisibility = {
    VISIBLE: "VISIBLE",
    EARLIER_ROW_THAN_FIRST_VISIBLE_ON_THE_SCREEN: "EARLIER_ROW_THAN_FIRST_VISIBLE_ON_THE_SCREEN",
    LAIER_ROW_THAN_LAST_VISIBLE_ON_THE_SCREEN: "LAIER_ROW_THAN_LAST_VISIBLE_ON_THE_SCREEN"
}

export default class TextSelection {
    constructor(lineNumerationScrollWidth, contentElementScrollHeight, contentElementScrollWidth) {
        this.startingRange = null
        this.endingRange = null
        this.widhtOfLineNumerationElement = lineNumerationScrollWidth
        this.totalWidthOfScreen = contentElementScrollWidth + lineNumerationScrollWidth
        this.heightOfElementBasedOnVisibleLinesOnTheScreen = contentElementScrollHeight
        this.windowSectionScrollig = null
    }

    /**
     * 
     * @param {Range} range 
     */
    setStartingRange(range) {
        this.startingRange = range
    }

    setEndingRange(range) {
        this.endingRange = range
    }

    /**
     * @param {MouseEvent} event 
     * @param {Number} firstVisibleLine 
     * @returns {null}
     */
    selectTextBetweenRanges(event, firstVisibleLine) {
        this.windowSectionScrollig = WindowSection.CENTRE
        this._defineSectionOfTextSelection(event, firstVisibleLine)
        console.log(this.windowSectionScrollig)
        return null
    }

    /**
    * 
    * @param {MouseEvent} event 
    * @param {Number} firstVisibleLine
    * @returns {String} the position of the mouse
    */
    _defineSectionOfTextSelection(event, firstVisibleLine) {
        const firstVisibleLineOnTheScreen = document.getElementById(String(firstVisibleLine))
        const topOffsetOfTheFirstVisibleLineOnTheScreen = firstVisibleLineOnTheScreen.offsetTop
        const mouseYPositionBasedOnPage = event.pageY
        const mouseXPositionBasedOnPage = event.pageX
        // INCORRECT CHECK
        // The left and right section can be triggered although it is either top or bottom scrolling
        // thats why they are commented out for now.
        // the goal is to make top and bottom text selection work
        // before working on the rest.
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
        else if (mouseYPositionBasedOnPage < topOffsetOfTheFirstVisibleLineOnTheScreen && mouseYPositionBasedOnPage != 0) {
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
}