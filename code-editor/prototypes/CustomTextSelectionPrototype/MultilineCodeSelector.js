import CustomRangeElement from "./CustomRangeElement.js";
import MarkedLineCoordinates from "./MarkedLineCoordinates.js";

export default class MultilineCodeSelector {
    /**
     * 
     * @param {CustomRangeElement} startingRange 
     * @param {CustomRangeElement} releasingRange 
     */
    constructor(startingRange, releasingRange) {
        this.startingRange = startingRange
        this.releasingRange = releasingRange
    }


}