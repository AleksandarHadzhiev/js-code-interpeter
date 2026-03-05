import CustomRangeElement from "./CustomRangeElement.js";
import MarkedLineCoordinates from "./MarkedLineCoordinates.js";
import calculateTotalLeftOffsetOfCaretInTheLine from "./Caclulators/CaretLeftOffsetCalculator.js";
import { CaretLeftOffsetDTO, SelectedTextDTO } from "./DTOs/caretDTO.js";
import calculateWidthOfSelectedText from "./Caclulators/SelectedTextWidthCalculator.js";

export default class SingleLineSelector {
    /**
     * @param {CustomRangeElement} startingRange
     * @param {CustomRangeElement} releasingRange
     */
    constructor(startingRange, releasingRange) {
        this.startingRange = startingRange
        this.releasingRange = releasingRange
    }

    /**
     * 
     * @returns the coordinates of the selected text from the line
     */
    getCoordinatesForSingleLineSelection() {
        if (this._checkIfSelectionIsTurningRightForSingleLine()) {
            return this._calculateSelectionFromStartingPointToEndingPoint(this.startingRange, this.releasingRange)
        }
        return this._calculateSelectionFromStartingPointToEndingPoint(this.releasingRange, this.startingRange)
    }

    /**
 * This functions checks the starting positions of the starting point and releasing point, so that it can confirm if the user is selecting left to right or right to left direction.
 * @returns True if the user is selecting form left to right and false if the user is selecting from right to left
 */
    _checkIfSelectionIsTurningRightForSingleLine() {
        const startingContainerOfstartingRangeIsFirst = this.startingRange.startContainer.offsetLeft < this.releasingRange.startContainer.offsetLeft
        const isSameStartingElement = this.startingRange.startContainer.offsetLeft == this.releasingRange.startContainer.offsetLeft
        const startOffsetOfstartingRangeIsFIrst = isSameStartingElement && this.startingRange.startOffset == this.releasingRange.startOffset
        const startingRangeIsFirst = startingContainerOfstartingRangeIsFirst || startOffsetOfstartingRangeIsFIrst
        return startingRangeIsFirst
    }

    /**
     * 
     * @param {CustomRangeElement} startingPoint 
     * @param {CustomRangeElement} endingPoinnt 
     * @returns the coordinates between the starting point and ending point
     */
    _calculateSelectionFromStartingPointToEndingPoint(startingPoint, endingPoinnt) {
        let leftOffset = calculateTotalLeftOffsetOfCaretInTheLine(new CaretLeftOffsetDTO(startingPoint.startContainer, startingPoint.startContainer.offsetLeft, startingPoint.startOffset))
        let widthOfSelectedText = calculateWidthOfSelectedText(new SelectedTextDTO(endingPoinnt, leftOffset))
        console.log(startingPoint.offsetTopForStartingLine)
        console.log(startingPoint.offsetTopForEndingLine)
        return new MarkedLineCoordinates(leftOffset, startingPoint.offsetTopForStartingLine, widthOfSelectedText)
    }
}