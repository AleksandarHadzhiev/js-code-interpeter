import { WindowSection, MousePosition } from "./selectionMechanisms/enums.js"

export default class MousePositionDefiner {
    /**
     * @param {Number} leftOffset
     * @param {Number} widthOfScreen  
     * @param {Number} height 
     * @param {Number} topOffset
     * @param {Number} maxLines
     */
    constructor(leftOffset, widthOfScreen, height, topOffset, maxLines) {
        this.navigationHeight = document.getElementById('navigation').offsetHeight
        this.lineNumerationWidth = 75
        this.leftOffset = leftOffset
        this.widthOfScreen = widthOfScreen
        this.height = height
        this.lastTextLine = maxLines
        this.topOffset = topOffset
        this.windowSectionScrolling = null
        this.mousePosition = null
        this.totalWidthOfScreen = this.leftOffset + this.widthOfScreen
    }

    /**
     * 
     * @param {Number} newLeftOffsetForContent 
     * @param {Number} width 
     */
    updateLeftOffsetWithNewOffset(newLeftOffsetForContent, width) {
        this.leftOffset = newLeftOffsetForContent + 75
        this.widthOfScreen = width - 75
        this.totalWidthOfScreen = this.leftOffset + this.widthOfScreen
    }

    /**
     * 
     * @param {Number} leftOffset 
     * @param {Number} width 
     * @param {Number} height 
     * @param {Number} topOffset 
     */
    updateOnResize(leftOffset, width, height, topOffset) {
        this.leftOffset = leftOffset
        this.widthOfScreen = width
        this.height = height
        this.topOffset = topOffset
    }

    /**
     * @param {MouseEvent} event 
     */
    defineMousePosition(event) {
        this.windowSectionScrolling = WindowSection.CENTRE
        const mouseYPositionBasedOnPage = event.pageY + this.topOffset - this.navigationHeight
        this.mousePosition = this._defineSectionOfTextSelection(event, mouseYPositionBasedOnPage)
        return this.mousePosition
    }

    /**
    * 
    * @param {MouseEvent} event 
    * @param {Number} mouseYPositionBasedOnPage 
    * @returns {String} the position of the mouse
    */
    _defineSectionOfTextSelection(event, mouseYPositionBasedOnPage) {
        const mouseXPosition = event.pageX
        const maxTopOffsetForSelection = this.lastTextLine * 28.8
        const pointWhenBottomBegins = this.height + this.topOffset
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
        else if (mouseYPositionBasedOnPage == this.topOffset && mouseYPositionBasedOnPage == 0) {
            this.windowSectionScrollig = WindowSection.TOP
            return MousePosition.TOP
        }
        else if (mouseYPositionBasedOnPage < this.topOffset && mouseYPositionBasedOnPage != 0) {
            this.windowSectionScrollig = WindowSection.TOP
            return MousePosition.TOP
        }
        else if (mouseXPosition < this.leftOffset) {
            this.windowSectionScrollig = WindowSection.LEFT
            return MousePosition.LEFT
        }
        else if (mouseXPosition > this.totalWidthOfScreen) {
            this.windowSectionScrollig = WindowSection.RIGHT
            return MousePosition.RIGHT
        }
        this.windowSectionScrollig = WindowSection.CENTRE
        return MousePosition.CENTRE
    }
}