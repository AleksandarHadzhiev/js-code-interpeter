export default class ContentScrollingHandler {
    /**
     * @param {Number} lineContentWidth
     * @param {Number} scrollbarHorizontalLeftOffset
     * @param {Number} offsetFromLineNumeration
     * @param {Number} barVerticalWidth 
     */
    constructor(lineContentWidth, scrollbarHorizontalLeftOffset, offsetFromLineNumeration, barVerticalWidth) {
        this.scrollbarLeftOffset = scrollbarHorizontalLeftOffset
        this.barVerticalWidth = barVerticalWidth
        this.bufferZone = 75
        this.width = lineContentWidth + this.bufferZone
        this.minLeftOffset = offsetFromLineNumeration
        this.leftOffset = this.minLeftOffset
        this.maxLeftOffset = this._defineMaxLeftOffset()
    }

    _defineMaxLeftOffset() {
        return (this.width - this.scrollbarLeftOffset - this.barVerticalWidth) * -1
    }

    updateMaxLeftOffset(scrollWidth, scrollBarLeftOffset, barWidth) {
        this.maxLeftOffset = (scrollWidth + this.bufferZone - scrollBarLeftOffset - barWidth) * -1
    }

    /**
     * 
     * @param {Number} percentage 
     * @param {HTMLElement} contentElement 
     */
    scrollWithPercentage(percentage, contentElement) {
        console.log(this.width)
        const newOffset = (this.maxLeftOffset * (percentage / 100)) + this.minLeftOffset
        console.log(this.minLeftOffset, this.maxLeftOffset, newOffset)
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