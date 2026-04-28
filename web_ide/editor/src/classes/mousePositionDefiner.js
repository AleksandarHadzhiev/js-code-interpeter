import { WindowSection, MousePosition } from "./selectionMechanisms/enums.js"

export default class MousePositionDefiner {
    /**
     * 
     * @param {Number} lineNumerationWidth 
     * @param {Number} menuWidth 
     * @param {HTMLElement} screen 
     * @param {Number} screenHeight 
     */
    constructor(lineNumerationWidth, menuWidth, screen, screenHeight) {
        this.navigationHeight = document.getElementById('navigation').offsetHeight
        this.lineNumerationWidth = lineNumerationWidth
        this.defaultLeftOffset = this.lineNumerationWidth + menuWidth
        this.leftOffset = this.defaultLeftOffset
        this.widthOfScreen = screen.offsetWidth
        this.height = screenHeight
        this.lastTextLine = 2000
        this.topOffset = this.navigationHeight
        this.windowSectionScrolling = null
        this.mousePosition = null
        this.totalWidthOfScreen = this.leftOffset + this.widthOfScreen
    }
    /**
     * 
     * @param {Number} width 
     */
    updateProportions(width) {
        this.leftOffset = width + this.defaultLeftOffset
    }

    /**
     * 
     * @param {Number} newWidth 
     * @param {Number} newHeight 
     */
    updateScreenSizes(newWidth, newHeight) {
        this.widthOfScreen = newWidth
        this.height = newHeight
        this.totalWidthOfScreen = this.leftOffset + this.widthOfScreen
    }

    /**
     * 
     * @param {Number} width 
     * @param {Number} height 
     */
    fullResize(width, height) {
        this.widthOfScreen = width
        this.height = height
        this.totalWidthOfScreen = this.leftOffset + this.widthOfScreen
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
        else if (mouseXPosition > this.widthOfScreen) {
            this.windowSectionScrollig = WindowSection.RIGHT
            return MousePosition.RIGHT
        }
        this.windowSectionScrollig = WindowSection.CENTRE
        return MousePosition.CENTRE
    }
}