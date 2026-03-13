import { SelectedTextDTO, CaretLeftOffsetDTO } from "../DTOs/caretDTO.js"
import calculateTotalLeftOffsetOfCaretInTheLine from "./CaretLeftOffsetCalculator.js"

/**
* Calculate the width of the selected text.
* @param {SelectedTextDTO} selectedTextDTO
* @returns {Number} The width of the whole text selection as a number
*/
export default function calculateWidthOfSelectedText(selectedTextDTO) {
    const offset = calculateTotalLeftOffsetOfCaretInTheLine(
        new CaretLeftOffsetDTO(
            selectedTextDTO.range.endContainer,
            selectedTextDTO.range.endContainer.offsetLeft,
            selectedTextDTO.range.endOffset
        )
    )
    let widthOfSelectedText = offset - selectedTextDTO.offsetLeft
    return widthOfSelectedText
}