import CodeLoader from "./codeLoader.js"
import { BarHorizontalHandler } from "./scrollingMechanisms/BarHandler.js"
import ContentScrollingHandler from "./scrollingMechanisms/ContentScrollingHandler.js"

export default class HorizontalScroller {
    /**
     * 
     * @param {Number} screenHeight 
     * @param {Number} screenWidth 
     * @param {Number} lineContentWidth 
     * @param {Number} leftOffset 
     * @param {Number} lineNumerationWidth 
     * @param {HTMLElement} lineContentElement 
     * @param {CodeLoader} codeLoader
     */
    constructor(screenHeight, screenWidth, lineContentWidth, leftOffset, lineNumerationWidth, lineContentElement, codeLoader) {
        this.height = screenHeight
        this.scrollbarAreaElement = document.getElementById('scrollable-area-horizontal')
        this.scrollableAreaWidth = this.scrollbarAreaElement.offsetWidth
        this.barElement = document.getElementById('bar-horizontal')
        this.barWidth = this.barElement.offsetWidth
        this.codeLoader = codeLoader
        this.screenWidth = screenWidth
        this.isScrolling = false
        this.lineContentWidth = lineContentWidth
        this.leftOffset = leftOffset
        this.lineNumerationWidth = lineNumerationWidth
        this.lineContentElement = lineContentElement
        this.barHorizontalHandler = new BarHorizontalHandler(
            this.scrollableAreaWidth, this.barWidth, this.barElement
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
        console.log(newWidth)
        this.leftOffset = newWidth
        const scrollbarWidth = this.screenWidth - this.leftOffset - this.lineNumerationWidth
        this.scrollbarAreaElement.style = `width: ${scrollbarWidth}px; left: ${newWidth}px;`
        this.barHorizontalHandler.scrollbarWidth = scrollbarWidth
        this.contentScrollingHandler.leftOffset = this.leftOffset
    }

    /**
     * 
     * @param {Number} deltaX 
     */
    scroll(deltaX) {
        this.contentScrollingHandler.updateMaxLeftOffset(1050, this.leftOffset, this.barWidth)
        this.contentScrollingHandler.scrollWithOffset(deltaX)
        const percentage = this.contentScrollingHandler.getPerentageOfScroll()
        this.barHorizontalHandler.scrollBasedOnPercentage(percentage)
    }
}