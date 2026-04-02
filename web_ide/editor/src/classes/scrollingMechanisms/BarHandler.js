export class BarVerticalHandler {
    /**
     * 
     * @param {Number} scrollbarHeight 
     * @param {Number} barHeight 
     * @param {HTMLElement} bar 
     */
    constructor(scrollbarHeight, barHeight, bar) {
        this.topOffset = 0
        this.scrollbarHeight = scrollbarHeight
        this.barHeight = barHeight
        this.maxTopOffset = this._defineMaxTopOffsetForBar()
        this.minTopOffset = 0
        this.bar = bar
        this.percentageOfScroll = 0
    }

    updateHeights(scrollbarHeight, barHeight) {
        this.scrollbarHeight = scrollbarHeight
        this.barHeight = barHeight
        this.percentageOfScroll = (this.topOffset / this.maxTopOffset) * 100
        this.maxTopOffset = this._defineMaxTopOffsetForBar()
        this.scrollBasedOnPercentage(this.percentageOfScroll)
    }

    getPercentageOfScroll() {
        this.percentageOfScroll = (this.topOffset / this.maxTopOffset) * 100
        return this.percentageOfScroll
    }

    _defineMaxTopOffsetForBar() {
        return this.scrollbarHeight - this.barHeight
    }

    /**
     * 
     * @param {Number} percentage 
     */
    scrollBasedOnPercentage(percentage) {
        const offset = this._calculateTopOffsetBasedOnPercentage(percentage)
        this.scrollWithOffset(offset)
    }

    /**
     * 
     * @param {Number} offset 
     */
    scrollWithOffset(offset) {
        this.topOffset = offset > this.maxTopOffset ? this.maxTopOffset : offset < this.minTopOffset ? this.minTopOffset : offset
        this.bar.style = `top: ${this.topOffset}px;`
    }

    /**
     * 
     * @param {Number} percentage 
     */
    _calculateTopOffsetBasedOnPercentage(percentage) {
        const offset = this.maxTopOffset * (percentage / 100)
        return offset
    }
}

export class BarHorizontalHandler {

    /**
     * 
     * @param {Number} scrollbarWidth 
     * @param {Number} barWidth
     * @param {HTMLElement} bar 
     */
    constructor(scrollbarWidth, barWidth, bar) {
        this.leftOffset = 0
        this.scrollbarWidth = scrollbarWidth
        this.barWidth = barWidth
        this.bar = bar
        this.minLeftOffset = 0
        this.percentageOfScroll = 0
        this.maxLeftOffset = this._defineMaxLeftOffsetForBar()
    }

    _defineMaxLeftOffsetForBar() {
        return this.scrollbarWidth - this.barWidth
    }

    /**
     * 
     * @param {Number} scrollbarWidth 
     * @param {Number} barWidth 
     */
    _updateWidths(scrollbarWidth, barWidth) {
        this.scrollbarWidth = scrollbarWidth
        this.barWidth = barWidth
        this.percentageOfScroll = (this.leftOffset / this.maxLeftOffset) * 100
        this.maxLeftOffset = this._defineMaxLeftOffsetForBar()
        this.scrollBasedOnPercentage(this.percentageOfScroll)
    }

    /**
     * 
     * @param {Number} percentage 
     */
    scrollBasedOnPercentage(percentage) {
        const offset = this._calculateLeftOffsetBasedOnPercentage(percentage)
        this.scrollWithOffset(offset)
    }

    /**
     * 
     * @param {Number} percentage 
     */
    _calculateLeftOffsetBasedOnPercentage(percentage) {
        const offset = this.maxLeftOffset * (percentage / 100)
        return offset
    }

    /**
     * 
     * @param {Number} offset 
     */
    scrollWithOffset(offset) {
        this.leftOffset = offset > this.maxLeftOffset ? this.maxLeftOffset : offset < this.minLeftOffset ? this.minLeftOffset : offset
        this.bar.style = `left: ${this.leftOffset}px;`
    }

    getPercentageOfScroll() {
        this.percentageOfScroll = (this.leftOffset / this.maxLeftOffset) * 100
        return this.percentageOfScroll
    }
}