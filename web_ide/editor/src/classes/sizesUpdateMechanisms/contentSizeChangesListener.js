import SizeChangesHandler from "./sizeChangesHandler.js"

export default class ContentSizeChangesListener {
    /**
     * @param {SizeChangesHandler} sizeChangesHandler 
     */
    constructor(sizeChangesHandler) {
        this.contentElement = sizeChangesHandler.contentElement
        this.left = sizeChangesHandler.leftOffsetForContent
        this.width = sizeChangesHandler.widthForContent
        this.height = this.contentElement.offsetHeight
    }

    /**
     * 
     * @param {Number} newLeftOffsetForContent 
     * @param {*} width 
     */
    updateLeftOffsetWithNewOffset(newLeftOffsetForContent, width) {
        this.left = newLeftOffsetForContent
        this.width = width
        this.contentElement.style = `
        left: ${newLeftOffsetForContent}px;
        width: ${this.width}px;
        `
    }

    fullResize(width, height) {
        console.log(height)
        this.width = width
        this.height = height
        this.contentElement.style = `
        left: ${this.left}px;
        width:${width}px;
        `
    }
}