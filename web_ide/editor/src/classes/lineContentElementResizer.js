export default class LineContentElementResizer {
    /**
     * @param {HTMLElement} lineContentElement 
     */
    constructor(lineContentElement) {
        this.lineContentElement = lineContentElement
    }

    /**
     * 
     * @param {Number} newWidth 
     */
    updateLineContentWidth(newWidth) {
        this.lineContentElement.style = `width: ${newWidth}px;`
    }
}