export default class ContentSizeChangesListener {

    /**
     * 
     * @param {HTMLElement} contentElement 
     */
    constructor(contentElement) {
        this.contentElement = contentElement
    }

    /**
     * 
     * @param {Number} newLeftOffsetForContent 
     */
    updateLeftOffsetWithNewOffset(newLeftOffsetForContent) {
        this.contentElement.style = `left: ${newLeftOffsetForContent}px;`
    }
}