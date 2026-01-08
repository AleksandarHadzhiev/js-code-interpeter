import CustomRangeElement from "./CustomRangeElement.js";
import MarkedLineCoordinates from "./MarkedLineCoordinates.js";
import CaretLeftOffsetCalculator from "./Caclulators/CaretLeftOffsetCalculator.js";
import CaretLeftOffsetDTO from "./DTOs/caretDTO.js"


export default class SingleLineSelector {
    /**
     * @param {CustomRangeElement} startingRange
     * @param {CustomRangeElement} releasingRange
     */
    constructor(startingRange, releasingRange) {
        this.startingRange = startingRange
        this.releasingRange = releasingRange
        this.caretLeftOffsetCalculator = new CaretLeftOffsetCalculator(startingRange, releasingRange)
    }

    /**
    * The function calculates the coordinates of the line and transforms them into a StartingPositionOfLineObject.
    * @returns The coordinates of selection
    */
    getCoordinatesForSingleLineSelection() {
        let leftOffset = 0
        let widthOfSelectedText = 0
        if (this._checkIfSelectionIsTurningRightForSingleLine()) {
            leftOffset = this.caretLeftOffsetCalculator.calculateTotalLeftOffsetOfCaretInTheLine(new CaretLeftOffsetDTO(this.startingRange.startContainer, this.startingRange.startContainer.offsetLeft, this.startingRange.startOffset))
            // leftOffset = this._getOffsetLeftForSpecifiedRange(this.startingRange)
            widthOfSelectedText = this._calculateTheWidthOfTheMarkedTextForRangeByRemovingTheLeftOffset(this.releasingRange, leftOffset)
        }
        else {
            leftOffset = this.caretLeftOffsetCalculator.calculateTotalLeftOffsetOfCaretInTheLine(new CaretLeftOffsetDTO(this.releasingRange.startContainer, this.releasingRange.startContainer.offsetLeft, this.releasingRange.startOffset))
            // leftOffset = this._getOffsetLeftForSpecifiedRange(this.releasingRange)
            widthOfSelectedText = this._calculateTheWidthOfTheMarkedTextForRangeByRemovingTheLeftOffset(this.startingRange, leftOffset)
        }
        return new MarkedLineCoordinates(leftOffset, this.startingRange.offsetTopForStartingLine, widthOfSelectedText)
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
    * Calculates the full left offset of the range, by taking its initial left offset and adding the additonal pixels from the unmarked text.
    * @param {CustomRangeElement} range 
    * @returns The full left offset.
    */
    _getOffsetLeftForSpecifiedRange(range) {
        let offsetLeft = range.startContainer.offsetLeft
        const spanText = String(range.startContainer.textContent)
        const neededText = spanText.substring(0, range.startOffset)
        const leftOffsetFromUnmarkedText = this._calculateWidthOfSpecifiedText(neededText)
        offsetLeft += leftOffsetFromUnmarkedText
        return offsetLeft
    }

    // WILL NEED TO BE EXTRACTED AS IT IS A VERY REPETITIVE FUNCTION CALL
    /**
     * The function calculates the additional left offset by creating a span element from where 
     * to fetch its width, so that it is the exact width which the text takes and removes the element
     * so that there is no element polution to the DOM.
     * @param {String} text 
     * @returns The width of the element, which is used as additional left offset.
     */
    _calculateWidthOfSpecifiedText(text) {
        const editorElement = document.getElementById('editor')
        const element = document.createElement('span')
        element.textContent = text
        element.classList.add('line-content-marker')
        editorElement.prepend(element)
        const width = element.offsetWidth
        element.remove()
        return width
    }

    /**
    * Calculate the width of the selected text.
    * @param {CustomRangeElement} range  
    * @param {Number} offsetLeft 
    * @returns The width of selected text as a number
    */
    _calculateTheWidthOfTheMarkedTextForRangeByRemovingTheLeftOffset(range, leftOffset) {
        const offsetLeftOfendingPosition = this._getOffsetOfRangeBasedOnItsEndContainer(range)
        let widthOfSelectedText = offsetLeftOfendingPosition - leftOffset
        return widthOfSelectedText
    }

    /**
    * Calculates the full left offset of the position, by taking its initial left offset and adding the additonal pixels from the unmarked text.
    * @param {CustomRangeElement} range 
    * @returns The full left offset.
    */
    _getOffsetOfRangeBasedOnItsEndContainer(range) {
        let offsetLeft = range.endContainer.offsetLeft
        const spanText = String(range.endContainer.textContent)
        const neededText = spanText.substring(0, range.endOffset)
        const leftOffsetFromUnmarkedText = this._calculateWidthOfSpecifiedText(neededText)
        offsetLeft += leftOffsetFromUnmarkedText
        return offsetLeft
    }

}