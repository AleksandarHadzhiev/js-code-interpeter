import calculateWidthForText from "./widthOfTextCalculator.js"
import { CaretLeftOffsetDTO } from "../dtos/caretDTOs.js"
import turnWidthToIndexForText from "../calculators/offsetToTextCalculator.js";

/**
* @param {CaretLeftOffsetDTO} leftOffsetDTO contains the data needed to calculate the total offset
* @returns {Number} The total left offset of the caret position in the line.
*/
export default function calculateTotalLeftOffsetOfCaretInTheLine(leftOffsetDTO, contentElement) {
    const containerOffset = leftOffsetDTO.offsetLeft
    const caretLeftOffset = _calculateOffsetOfCaretBasedOnContainerAndOffsetInsideTheContainer(contentElement, leftOffsetDTO.container, leftOffsetDTO.caretIndex)
    return containerOffset + caretLeftOffset
}

/**
 * 
 * @param {HTMLElement} container The container can be the start or end container of the range.
 * @param {Number} offset The offset is the index inside the container where the caret is.
 * @returns {Number} The width of the selected text inside the container from its starting point to the offset.
 */
function _calculateOffsetOfCaretBasedOnContainerAndOffsetInsideTheContainer(contentElement, container, offset) {
    const spanText = String(container.textContent)
    const neededText = spanText.substring(0, offset)
    return calculateWidthForText(contentElement, neededText)
}

/**
 * 
 * @param {HTMLElement} caret 
 * @param {String} textToWorkWith 
 * @param {HTMLElement} content
 */
export function findCaretCurrentPositionInText(caret, textToWorkWith, content) {
    const topOffset = caret.offsetTop
    const leftOffset = caret.offsetLeft
    let index = 0
    const isZero = topOffset == 0 && leftOffset == 0
    if (isZero == false) {
        const lineId = Math.round(topOffset / 28.8)
        if (lineId != 0) {
            const lines = textToWorkWith.split('\n')
            const leftLines = lines.splice(0, lineId)
            const text = leftLines.join('\n')
            index = text.length
        }
        const lineElement = document.getElementById(`${lineId}`)
        const fullTextWidth = calculateWidthForText(content, lineElement.textContent)
        const indexInLine = turnWidthToIndexForText(leftOffset, fullTextWidth, lineElement.textContent.length)
        index += indexInLine + 1
    }
    return index
}
