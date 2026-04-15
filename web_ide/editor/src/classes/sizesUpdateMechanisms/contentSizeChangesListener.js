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
     * @param {*} width 
     */
    updateLeftOffsetWithNewOffset(newLeftOffsetForContent, width) {
        this.contentElement.style = `
        left: ${newLeftOffsetForContent}px;
        width:${width}px;
        `
    }
}