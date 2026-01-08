import { CaretLeftOffsetDTO } from "../DTOs/caretDTO.js";
import MarkedLineCoordinates from "../MarkedLineCoordinates.js";
import SelectionPosition from "../SelectionPosition.js";
import calculateTotalLeftOffsetOfCaretInTheLine from "./CaretLeftOffsetCalculator.js";
import calculateWidthForText from "./WidthOfTextCalculator.js";

/**
 * 
 * @param {SelectionPosition} selectionPosition 
 * @returns {MarkedLineCoordinates} the coordinates of the marked text
 */
export function calculateCoordinatesOfFirstSelectedLine(selectionPosition) {
    console.log(selectionPosition)
    const leftOffset = calculateTotalLeftOffsetOfCaretInTheLine(
        new CaretLeftOffsetDTO(selectionPosition.container, selectionPosition.container.offsetLeft, selectionPosition.caretOffset)
    )
    const totalTextWidth = calculateWidthForText(selectionPosition.line.textContent)
    const widthOfMarkedText = totalTextWidth - leftOffset
    const topOffset = selectionPosition.line.offsetTop
    return new MarkedLineCoordinates(leftOffset, topOffset, widthOfMarkedText)
}

/**
 * 
 * @param {SelectionPosition} selectionPosition 
 * @returns {MarkedLineCoordinates} the coordinates of the marked text
 */
export function calculateCoordinatesOfLastSelectedLine(selectionPosition) {
    const leftOffset = 0 // the last line doesn't have offset
    const widthOfMarkedText = calculateTotalLeftOffsetOfCaretInTheLine(
        new CaretLeftOffsetDTO(selectionPosition.container, selectionPosition.container.offsetLeft, selectionPosition.caretOffset)
    )
    const topOffset = selectionPosition.line.offsetTop
    return new MarkedLineCoordinates(leftOffset, topOffset, widthOfMarkedText)
}

/**
 * 
 * @param {HTMLElement} line 
 * @returns {MarkedLineCoordinates} the coordinates of the marked text
 */
export function calculateCoordinatesOfLineInBetweenFirstAndLast(line) {
    const leftOffset = 0 // the last between first and last doesn't have offset
    const topOffset = line.offsetTop
    const width = calculateWidthForText(line.textContent) // The in between line is fully selected
    return new MarkedLineCoordinates(leftOffset, topOffset, width)
}