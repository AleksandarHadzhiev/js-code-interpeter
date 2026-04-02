export default class LoaderHandler {
    /**
     * @param {Number} height
     * @param {Number} scrollbarHeight
     * @param {HTMLElement} loaderElement 
     */
    constructor(height, scrollbarHeight, loaderElement) {
        this.height = height
        this.scrollbarHeight = scrollbarHeight
        this.maxTopOffset = this._defineMaxTopOffset()
        this.topOffset = 0
        this.minTopOffset = 0
        this.loaderElement = loaderElement
    }

    updateHeights(loaderHeight, scrollbarHeight) {
        this.height = loaderHeight
        this.scrollbarHeight = scrollbarHeight
        this.maxTopOffset = this._defineMaxTopOffset()
    }

    scrollWithOffset(offset) {
        this.updateTopOffsetWithOffset(offset)
        this.loaderElement.style = `height: ${this.height}px; top: -${this.topOffset}px;`
    }

    scrollWithPercentage(percentage) {
        const newOffset = this.maxTopOffset * (percentage / 100)
        this.topOffset = newOffset > this.maxTopOffset ? this.maxTopOffset : newOffset < this.minTopOffset ? this.minTopOffset : newOffset
        this.loaderElement.style = `height: ${this.height}px; top: -${this.topOffset}px;`
    }

    updateTopOffsetWithOffset(offset) {
        const newOffset = this.topOffset + offset
        this.topOffset = newOffset > this.maxTopOffset ? this.maxTopOffset : newOffset < this.minTopOffset ? this.minTopOffset : newOffset
    }

    _defineMaxTopOffset() {
        return this.height - this.scrollbarHeight
    }


    getPercentageOfScroll() {
        return (this.topOffset / this.height) * 100
    }
}