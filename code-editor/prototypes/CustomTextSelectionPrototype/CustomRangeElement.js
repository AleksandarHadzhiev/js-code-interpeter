
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
        this.startContainerOffset = this.startContainer.parentElement.offsetLeft
        this.offsetTopForStartingLine = this.lineOfStartContainer.offsetTop
        this.lineOfEndContainer = range.endContainer.parentElement.parentElement
        this.endContainer = range.endContainer.parentElement
        this.endContainerOffset = this.endContainer.parentElement.offsetLeft
        this.endOffset = range.endOffset
        this.offsetTopForEndingLine = this.lineOfEndContainer.offsetTop
    }
}
