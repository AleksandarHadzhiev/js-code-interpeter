import CodeLoader from "./codeLoader.js"
import { BarHorizontalHandler } from "./scrollingMechanisms/BarHandler.js"
import ContentScrollingHandler from "./scrollingMechanisms/ContentScrollingHandler.js"

export default class HorizontalScroller {
    /**
     * @param {Number} menuWidth
     * @param {Number} screenWidth 
     * @param {Number} lineContentWidth 
     * @param {Number} leftOffset 
     * @param {Number} lineNumerationWidth 
     * @param {HTMLElement} lineContentElement 
     * @param {Number} barVerticalWidth
     */
    constructor(menuWidth, screenWidth, lineContentWidth, leftOffset, lineNumerationWidth, lineContentElement, barVerticalWidth) {
        this.scrollbarAreaElement = document.getElementById('scrollable-area-horizontal')
        this.scrollbar = document.getElementById('scrollbar-horizontal')
        this.scrollbarWidth = this.scrollbar.offsetWidth
        this.barElement = document.getElementById('bar-horizontal')
        this.barWidth = this.barElement.offsetWidth
        this.screenWidth = screenWidth
        this.isScrolling = false
        this.leftOffset = leftOffset
        this.lineNumerationWidth = lineNumerationWidth
        this.offseLeftForScrollbar = menuWidth + barVerticalWidth
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
        this.scrollbarWidth = this.screenWidth - this.leftOffset - this.offseLeftForScrollbar
        this.scrollbarAreaElement.style = `left: ${this.leftOffset}px; width: ${this.scrollbarWidth}px;`
        this.barHorizontalHandler.updateWidths(this.scrollbarWidth, this.barWidth)
        this.contentScrollingHandler.leftOffset = this.leftOffset
    }

    updateProportionsOnResize(newWidth) {
        this.screenWidth = newWidth
        this.scrollbarWidth = this.screenWidth - this.leftOffset - this.offseLeftForScrollbar
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