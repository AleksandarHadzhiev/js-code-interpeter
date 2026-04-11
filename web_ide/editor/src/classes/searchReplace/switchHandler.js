export default class SwitchHandler {
    constructor() {
        this.startingPosition = 0
        this.currentPosition = 0
        this.endingPosition = 0
    }

    /**
     * 
     * @param {Number} newCurrentPosition 
     * @param {Number} newEndingPosition 
     */
    updatePositions(newCurrentPosition, newEndingPosition) {
        this.currentPosition = newCurrentPosition
        this.endingPosition = newEndingPosition
        console.log(this)
    }

    goUp() {
        this._updateCurrentPosition(this.currentPosition)
    }

    goDown() {
        this._updateCurrentPosition(this.currentPosition)
    }
    /**
     * 
     * @param {Number} newCurrentPosition 
     */
    _updateCurrentPosition(newCurrentPosition) {
        this.currentPosition = newCurrentPosition
    }
}