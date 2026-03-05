import CustomRangeElement from "../CustomRangeElement.js";

/**
 * This DTO transfers the data needed to calculate the total left offset of the caret position on the line.
 */
export class CaretLeftOffsetDTO {
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
export class SelectedTextDTO {
    range;
    offsetLeft;
    /**
     * 
     * @param {CustomRangeElement} range 
     * @param {Number} offsetLeft 
     */
    constructor(range, offsetLeft) {
        this.range = range
        this.offsetLeft = offsetLeft
    }
}