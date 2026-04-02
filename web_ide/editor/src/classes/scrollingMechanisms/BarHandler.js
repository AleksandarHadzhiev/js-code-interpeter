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

}