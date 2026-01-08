export default class SelectionPosition {
    /**
     * 
     * @param {Number} offset
     * @param {HTMLElement} container 
     */
    constructor(offset, container) {
        this.caretOffset = offset
        this.container = container
        this.line = container.parentElement
    }
}