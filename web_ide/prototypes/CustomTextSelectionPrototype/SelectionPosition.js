export default class SelectionPosition {
    /**
     * 
     * @param {Number} offset
     * @param {HTMLElement} container 
     * @param {Number} offsetLeft 
     * @param {Number} offsetTop 
     */
    constructor(offset, container, offsetLeft, offsetTop) {
        this.caretOffset = offset
        this.offsetLeft = offsetLeft
        this.offsetTop = offsetTop
        this.container = container
        this.line = container.parentElement
    }
}