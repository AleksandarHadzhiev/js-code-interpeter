export default class ScrollbarHorizontalSizeChangesListener {
    /**
     * 
     * @param {HTMLElement} scrollbar 
     */
    constructor(scrollbar) {
        this.scrollbar = scrollbar
    }

    /**
     * 
     * @param {Number} newLeftOffsetForContent 
     */
    updateLeftOffsetWithNewOffset(newLeftOffsetForContent) {
        this.scrollbar.style = `left: ${newLeftOffsetForContent}px;`
    }
}

