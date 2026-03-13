export default class OffsetCalculator {

    constructor() {
        this.pixelsToScroll = 150
        this.scrollingPowerInPixelsForEdge = 149.99999284744297
        this.scrollingPowerInPixelsForChrome = 100
    }

    /**
     * @param {Number} deltaY
     */
    calculateOffsetBasedOnDeltaYOfMouseEvent(deltaY) {
        const scrollingPower = this._calculateScrollingPowerForDeltaY(deltaY)
        return scrollingPower * this.pixelsToScroll
    }

    _calculateScrollingPowerForDeltaY(deltaY) {
        if (deltaY % this.scrollingPowerInPixelsForEdge == 0) {
            return deltaY / this.scrollingPowerInPixelsForEdge
        }
        else if (deltaY % this.scrollingPowerInPixelsForChrome == 0) {
            return deltaY / this.scrollingPowerInPixelsForChrome
        }
        else {
            return deltaY / this.scrollingPowerInPixelsForEdge
        }
    }
}