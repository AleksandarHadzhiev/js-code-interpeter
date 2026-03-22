import { CaretLeftOffsetDTO } from "../DTOs/caretDTO.js"
import calculateWidthForText from "./WidthOfTextCalculator.js"

/**
* @param {CaretLeftOffsetDTO} leftOffsetDTO contains the data needed to calculate the total offset
* @returns {Number} The total left offset of the caret position in the line.
*/
export default function calculateTotalLeftOffsetOfCaretInTheLine(leftOffsetDTO) {
    const containerOffset = leftOffsetDTO.offsetLeft
    const caretLeftOffset = _calculateOffsetOfCaretBasedOnContainerAndOffsetInsideTheContainer(leftOffsetDTO.container, leftOffsetDTO.caretIndex)
    return containerOffset + caretLeftOffset
}

/**
 * 
 * @param {HTMLElement} container The container can be the start or end container of the range.
 * @param {Number} offset The offset is the index inside the container where the caret is.
 * @returns {Number} The width of the selected text inside the container from its starting point to the offset.
 */
function _calculateOffsetOfCaretBasedOnContainerAndOffsetInsideTheContainer(container, offset) {
    const spanText = String(container.textContent)
    const neededText = spanText.substring(0, offset)
    return calculateWidthForText(neededText)
}