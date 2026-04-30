import CodeLoader from "./codeLoader.js"
import { BarHorizontalHandler } from "./scrollingMechanisms/BarHandler.js"
import ContentScrollingHandler from "./scrollingMechanisms/ContentScrollingHandler.js"
export default class HorizontalScroller {
    /**
     * @param {Number} screenHeight 
     * @param {Number} screenWidth 
     * @param {Number} lineContentWidth 
     * @param {Number} leftOffset 
     * @param {Number} lineNumerationWidth 
     * @param {HTMLElement} lineContentElement 
     * @param {CodeLoader} codeLoader
     * @param {Number} barVerticalWidth
     */
    constructor(screenHeight, screenWidth, lineContentWidth, leftOffset, lineNumerationWidth, lineContentElement, codeLoader, barVerticalWidth) {
        this.height = screenHeight
        this.scrollbarAreaElement = document.getElementById('scrollable-area-horizontal')
        this.scrollbar = document.getElementById('scrollbar-horizontal')
        this.scrollbarWidth = this.scrollbar.offsetWidth - barVerticalWidth
        this.scrollableAreaWidth = this.scrollbarAreaElement.offsetWidth - lineNumerationWidth
        this.barElement = document.getElementById('bar-horizontal')
        this.barWidth = this.barElement.offsetWidth
        this.codeLoader = codeLoader
        this.screenWidth = screenWidth
        this.isScrolling = false
        this.lineContentWidth = lineContentWidth
        this.leftOffset = leftOffset
        this.lineNumerationWidth = lineNumerationWidth
        this.lineContentElement = lineContentElement
        this.widthNotAllowedForScrollbar = barVerticalWidth
        console.log(this.scrollableAreaWidth)
        this.barHorizontalHandler = new BarHorizontalHandler(
            this.scrollbarWidth, this.barWidth, this.barElement
        )
        this.contentScrollingHandler = new ContentScrollingHandler(
            lineContentWidth,
            leftOffset,
            lineNumerationWidth,
            this.barWidth,
            lineContentElement
        )
    }

    updateProportions(newWidth) {
        this.leftOffset = newWidth + this.lineNumerationWidth
        this.scrollbarWidth = this.screenWidth - this.leftOffset
        this.scrollbarAreaElement.style = `left: ${this.leftOffset}px; width: ${this.scrollbarWidth}px;`
        this.barHorizontalHandler.updateWidths(this.scrollbarWidth, this.barWidth)
        this.contentScrollingHandler.leftOffset = this.leftOffset
    }

    updateProportionsOnResize(newWidth) {
        this.screenWidth = newWidth
        this.scrollbarWidth = this.screenWidth - this.leftOffset - this.lineContentWidth
        this.scrollbarAreaElement.style = `left: ${this.leftOffset}px; width: ${this.scrollbarWidth}px;`
        this.barHorizontalHandler.updateWidths(this.scrollbarWidth, this.barWidth)
        this.contentScrollingHandler.leftOffset = this.leftOffset
    }

    /**
     * 
     * @param {Number} deltaX 
     */
    scroll(deltaX) {
        this.contentScrollingHandler.scrollWithOffset(deltaX)
        const percentage = this.contentScrollingHandler.getPerentageOfScroll()
        this.barHorizontalHandler.scrollBasedOnPercentage(percentage)
    }

    /**
     * 
     * @param {Number} newWidth 
     */
    updateLineContentWidth(newWidth) {
        this.contentScrollingHandler.updateMaxLeftOffset(newWidth, this.leftOffset + this.lineNumerationWidth, this.barWidth)
    }
}