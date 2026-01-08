
/**
 * The class takes only the most important characteristics of the Range object, and stores them.
 */
export default class CustomRangeElement {
    /**
     * 
     * @param {Range} range 
     */
    constructor(range) {
        this.lineOfStartContainer = range.startContainer.parentElement.parentElement
        this.startContainer = range.startContainer.parentElement
        this.startOffset = range.startOffset
        this.lineOfEndContainer = range.endContainer.parentElement.parentElement
        this.endContainer = range.endContainer.parentElement
        this.endOffset = range.endOffset
    }
}