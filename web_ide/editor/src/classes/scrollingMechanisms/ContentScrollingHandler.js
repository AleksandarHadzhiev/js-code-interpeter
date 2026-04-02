export default class ContentScrollingHandler {
    /**
     * @param {Number} width
     * @param {Number} scrollbarWidth
     * @param {Number} offsetFromLineNumeration
     * @param {Number} barHorizontalWidth 
     * @param {Number} barVerticalWidth 
     */
    constructor(width, scrollbarWidth, offsetFromLineNumeration, barHorizontalWidth, barVerticalWidth) {
        this.scrollbarWidth = scrollbarWidth
        this.barHorizontalWidth = barHorizontalWidth
        this.barVerticalWidth = barVerticalWidth
        this.width = width + 75
        this.minLeftOffset = offsetFromLineNumeration
        this.leftOffset = 0
        this.maxLeftOffset = this._defineMaxLeftOffset()
    }

    _defineMaxLeftOffset() {
        console.log(this.width)
        console.log(this.scrollbarWidth)
        console.log(this.barHorizontalWidth)
        return (this.width - this.scrollbarWidth - this.barHorizontalWidth) * -1
    }

    updateMaxLeftOffset(scrollWidth, scrollbarWidth, barWidth) {
        this.maxLeftOffset = (scrollWidth + 75 - scrollbarWidth - barWidth) * -1
    }

    /**
     * 
     * @param {Number} percentage 
     * @param {HTMLElement} contentElement 
     */
    scrollWithPercentage(percentage, contentElement) {
        const newOffset = (this.maxLeftOffset * (percentage / 100)) + this.minLeftOffset
        console.log(this.minLeftOffset, newOffset)
        this.leftOffset = newOffset < this.maxLeftOffset ? this.maxLeftOffset : newOffset > this.minLeftOffset ? this.minLeftOffset : newOffset
        contentElement.style = `left: ${this.leftOffset}px;`
    }
}