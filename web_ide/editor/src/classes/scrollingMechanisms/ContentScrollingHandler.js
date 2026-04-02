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
        this.bufferZone = 75
        this.width = width + this.bufferZone
        this.minLeftOffset = offsetFromLineNumeration
        this.leftOffset = this.minLeftOffset
        this.maxLeftOffset = this._defineMaxLeftOffset()
    }

    _defineMaxLeftOffset() {
        return (this.width + this.bufferZone - this.scrollbarWidth - this.barHorizontalWidth) * -1
    }

    updateMaxLeftOffset(scrollWidth, scrollbarWidth, barWidth) {
        this.maxLeftOffset = (scrollWidth + this.bufferZone - scrollbarWidth - barWidth) * -1
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

    scrollWithOffset(offset, lineContentElement) {
        this.updateLeftOffsetWithOffset(offset)
        lineContentElement.style = `left: ${this.leftOffset}px;`
    }

    updateLeftOffsetWithOffset(offset) {
        const newOffset = this.leftOffset - offset
        this.leftOffset = newOffset < this.maxLeftOffset ? this.maxLeftOffset : newOffset > this.minLeftOffset ? this.minLeftOffset : newOffset
    }

    getPerentageOfScroll() {
        const maxOffset = (this.maxLeftOffset - this.bufferZone) * -1
        const leftOffset = (this.leftOffset - this.bufferZone) * -1
        return (leftOffset / maxOffset) * 100
    }
}