import CustomRangeElement from "./customRangeElement"

export default class CustomContentMarker {
    constructor() {
        this.startingPoint = null
        this.releasingPoint = null
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

    }
}