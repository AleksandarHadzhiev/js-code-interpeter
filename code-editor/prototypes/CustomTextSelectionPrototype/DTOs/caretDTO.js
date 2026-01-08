
/**
 * This DTO transfers the data needed to calculate the total left offset of the caret position on the line.
 */
export default class CaretLeftOffsetDTO {
    container;
    offsetLeft;
    caretIndex;

    /**
     * 
     * @param {HTMLElement} container 
     * @param {Number} offsetLeft 
     * @param {Number} caretIndex 
     */
    constructor(container, offsetLeft, caretIndex) {
        this.container = container
        this.offsetLeft = offsetLeft
        this.caretIndex = caretIndex
    }
}