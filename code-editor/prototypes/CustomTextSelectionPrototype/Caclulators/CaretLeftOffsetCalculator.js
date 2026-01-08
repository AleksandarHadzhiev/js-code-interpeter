import CustomRangeElement from "../CustomRangeElement.js"
import CaretLeftOffsetDTO from "../DTOs/caretDTO.js"
import calculateWidthForText from "./WidthOfTextCalculator.js"

export default class CaretLeftOffsetCalculator {
    /**
     * @param {CustomRangeElement} startingRange
     * @param {CustomRangeElement} releasingRange
     */

    constructor(startingRange, releasingRange) {
        this.startingRange = startingRange
        this.releasingRange = releasingRange
    }

    /**
     * @param {CaretLeftOffsetDTO} leftOffsetDTO contains the data needed to calculate the total offset
     * @returns {Number} The total left offset of the caret position in the line.
     */
    calculateTotalLeftOffsetOfCaretInTheLine(leftOffsetDTO) {
        const totalLeftOffset = leftOffsetDTO.offsetLeft
        const caretLeftOffset = this._calculateOffsetOfCaretBasedOnContainerAndOffsetInsideTheContainer(leftOffsetDTO.container, leftOffsetDTO.caretIndex)
        return totalLeftOffset + caretLeftOffset
    }

    /**
     * 
     * @param {HTMLElement} container The container can be the start or end container of the range.
     * @param {Number} offset The offset is the index inside the container where the caret is.
     * @returns {Number} The width of the selected text inside the container from its starting point to the offset.
     */
    _calculateOffsetOfCaretBasedOnContainerAndOffsetInsideTheContainer(container, offset) {
        const spanText = String(container.textContent)
        const neededText = spanText.substring(0, offset)
        return calculateWidthForText(neededText)
    }
}
