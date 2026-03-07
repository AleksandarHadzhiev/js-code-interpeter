class MarkedPoint {
    /**
 * 
 * @param {Number} top 
 * @param {Number} left 
 * @param {Number} width 
 * @param {Number} lineId 
 */
    constructor(top, left, width, lineId) {
        this.top = top
        this.left = left
        this.lineId = lineId
        this.width = width
    }
}

export default class LineColoriser {
    /**
     * 
     * @param {CustomRangeElement} startingPoint 
     * @param {CustomRangeElement} endingPoint 
     */
    constructor(startingPoint, endingPoint) {
        this.startingPoint = startingPoint
        this.endingPoint = endingPoint
        this.coordinatesToHighlight = new Map()
        this.startingMarkedPoint = null
        this.endingMarkedPoint = null
    }

    /**
     * 
     * @param {Number} firstVisibleLine 
     * @param {Number} lastVisibleLine 
     */
    coloriseLinesforLeftBetweenFirstAndLastVisibleLine(firstVisibleLine, lastVisibleLine) {
        this.coordinatesToHighlight.clear()
        const lineOfStartingPoint = Number(this.startingPoint.lineOfStartContainer.id)
        const startingLineOfEndingPoint = Number(this.endingPoint.lineOfStartContainer.id)
        const endingLineOfEndingPoint = Number(this.endingPoint.lineOfEndContainer.id)

        if (lineOfStartingPoint >= firstVisibleLine && lineOfStartingPoint <= lastVisibleLine) {
            if (endingLineOfEndingPoint == lineOfStartingPoint) {

            }
            else if (endingLineOfEndingPoint < lineOfStartingPoint) {

            }
            else if (endingLineOfEndingPoint > lineOfStartingPoint) {

            }
        }

        else if (startingLineOfEndingPoint > lineOfStartingPoint) {

        }

        else if (startingLineOfEndingPoint < lineOfStartingPoint)

            return this.coordinatesToHighlight
    }
}