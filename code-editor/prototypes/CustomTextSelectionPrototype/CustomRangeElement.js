
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
        this.lineOfEndContainer = this._defineLineOfEndContainer(range)
        this.endContainer = this._defineEndContainer(range)
        this.endContainerOffset = this._defineEndContainerOffset(range)
        this.endOffset = range.endOffset
        this.offsetTopForEndingLine = this._defineOffsetTopForLineOfEndContainer(range)
    }

    /**
     * 
     * @param {Range} range 
     */
    _defineEndContainer(range) {
        if (isNaN(Number(range.endContainer.id)) == false)
            return range.endContainer
        else {
            return range.endContainer.parentElement
        }
    }

    /**
     * 
     * @param {Range} range 
     */
    _defineLineOfEndContainer(range) {
        if (isNaN(Number(range.endContainer.id)) == false)
            return range.endContainer
        else {
            return range.endContainer.parentElement.parentElement
        }
    }

    /**
     * 
     * @param {Range} range 
     */
    _defineEndContainerOffset(range) {
        if (isNaN(Number(range.endContainer.id)) == false)
            return range.endContainer.offsetLeft
        else {
            return range.endContainer.parentElement.offsetLeft
        }
    }

    /**
     * 
     * @param {Range} range 
     */
    _defineOffsetTopForLineOfEndContainer(range) {
        if (isNaN(Number(range.endContainer.id)) == false)
            return range.endContainer.offsetTop
        else {
            return range.endContainer.parentElement.parentElement.offsetTop
        }
    }
}
