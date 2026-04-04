export default class ContentScrollingHandler {
    /**
     * @param {Number} lineContentWidth
     * @param {Number} scrollbarHorizontalLeftOffset
     * @param {Number} offsetFromLineNumeration
     * @param {Number} barVerticalWidth 
     * @param {HTMLElement} lineContentElement 
     */
    constructor(lineContentWidth, scrollbarHorizontalLeftOffset, offsetFromLineNumeration, barVerticalWidth, lineContentElement) {
        this.scrollbarLeftOffset = scrollbarHorizontalLeftOffset
        this.barVerticalWidth = barVerticalWidth
        this.bufferZone = 75
        this.width = lineContentWidth + this.bufferZone
        this.minLeftOffset = offsetFromLineNumeration
        this.leftOffset = this.minLeftOffset
        this.maxLeftOffset = this._defineMaxLeftOffset()
        this.caretPlacer = document.getElementById('caret-placer')
        this.lineContentElement = lineContentElement
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
     */
    scrollWithPercentage(percentage) {
        const newOffset = (this.maxLeftOffset * (percentage / 100)) + this.minLeftOffset
        this.leftOffset = newOffset < this.maxLeftOffset ? this.maxLeftOffset : newOffset > this.minLeftOffset ? this.minLeftOffset : newOffset
        this.lineContentElement.style = `left: ${this.leftOffset}px;`
        this.caretPlacer.style = `left: ${this.leftOffset}px;`
    }

    scrollWithOffset(offset) {
        this.updateLeftOffsetWithOffset(offset)
        this.lineContentElement.style = `left: ${this.leftOffset}px;`
        this.caretPlacer.style = `left: ${this.leftOffset}px;`
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