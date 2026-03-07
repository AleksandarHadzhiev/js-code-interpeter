import CustomRangeElement from "./customRangeElement.js"
import LineColoriser from "./lineColoriser.js"

export default class CustomContentMarker {
    constructor(contentElement) {
        this.startingPoint = null
        this.releasingPoint = null
        this.algorithm = null
        this.contentElement = contentElement
    }

    /**
     * @param {CustomRangeElement} starintPoint  
     * @param {CustomRangeElement} releasignPoint
     */
    updatePoints(starintPoint, releasignPoint) {
        this.startingPoint = starintPoint
        this.releasingPoint = releasignPoint
    }

    /**
     * 
     * @param {Number} firstVisibleLine 
     * @param {Number} lastVisibleLine 
     */
    buildForLeftSection(firstVisibleLine, lastVisibleLine) {
        this.algorithm = new LineColoriser(this.startingPoint, this.releasingPoint, this.contentElement)
        const multilineCoordinates = this.algorithm.coloriseLinesforLeftBetweenFirstAndLastVisibleLine(firstVisibleLine, lastVisibleLine)
        console.log(multilineCoordinates)
    }
}