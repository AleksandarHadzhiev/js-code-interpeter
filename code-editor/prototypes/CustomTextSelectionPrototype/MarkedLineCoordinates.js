
/**
 * Represents the characteristics of a marked line. Its offset from the left corner, 
 * the width which is the selected text and the offset from the top corner.
 */
export default class MarkedLineCoordinates {
    /**
     * 
     * @param {Number} left 
     * @param {Number} top 
     * @param {Number} width
     */
    constructor(left, top, width) {
        this.left = left
        this.top = top
        this.width = width
    }
}
