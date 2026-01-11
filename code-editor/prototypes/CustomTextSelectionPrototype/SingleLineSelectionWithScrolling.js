import CustomRangeElement from "./CustomRangeElement.js";
import MarkedLineCoordinates from "./MarkedLineCoordinates.js";
import calculateTotalLeftOffsetOfCaretInTheLine from "./Caclulators/CaretLeftOffsetCalculator.js";
import calculateWidthOfSelectedText from "./Caclulators/SelectedTextWidthCalculator.js";
import { CaretLeftOffsetDTO, SelectedTextDTO } from "./DTOs/caretDTO.js";

class ScrollingReleasePoint {
    /**
     * 
     * @param {HTMLElement} container 
     * @param {Number} endOffset 
     * @param {Number} startOffset 
     */
    constructor(container, endOffset, startOffset) {
        this.container = container
        this.endOffset = endOffset
        this.startOffset = startOffset
    }
}

export default class ScrollingSingleLineSelector {
    /**
     * 
     * @param {CustomRangeElement} startingPoint 
     * @param {CustomRangeElement} releasingPoint 
     */
    constructor(startingPoint, releasingPoint) {
        this.startingPoint = startingPoint
        this.releasingPoint = releasingPoint
    }

    /**
     * 
     * @returns {ScrollingReleasePoint}
    */
    getCoordinatesForSingleLineSelection() {
        // First and foremost find if releasing point containers are on the same line
        // TODO:
        /**
         * The code needs a lot of refactoring
         *  1) First and foremost the selection when the releasing point has different lines
         *  2) Second the whole check of SAME LINE - DIFFERENT LINE
         *  3) The functions used in same line and different line are with repetitive actions - fix it to reusable functions
         *  4) The biggest problem remains the whole process of SAME LINE DIFFERENT LINE - Still feels like missing some edge case check
         *  5) Play around with the application and see what the edge case might be - there is something missing there
         *  6) Find a way to possible integrate single line selection with and without scrolling together
         *  7) Way to repetitive in how they calculate the marking
         */
        const idOfLastLineOfRelease = Number(this.releasingPoint.lineOfEndContainer.id)
        const idOfFirstLineOfRelease = Number(this.releasingPoint.lineOfStartContainer.id)
        if (idOfLastLineOfRelease == idOfFirstLineOfRelease) {
            // if i go from the bottom up - seems to be consistent in reaching this step
            console.log("SAME LINE")
            console.log(this.releasingPoint)
            console.log(this.releasingPoint.endContainer.offsetLeft)
            console.log(this.startingPoint.startContainerOffset)
            console.log(this.releasingPoint.startContainer.offsetLeft)

            const coordinates = this._calculateCoordinatesForEdgeCase()
            return coordinates
        }
        else {
            console.log("DIFFERENT LINE")
            // If they are on a different line find the container which is on the same line as the starting point
            const scrollingReleasePoint = this._getTheReleasingPointContainerWhichIsOnTheSameLineAsTheStartingPoint()
            const coordinates = this._calculateCoordinates(scrollingReleasePoint)
            console.log(coordinates)
            return coordinates
        }
    }

    /**
     * 
     * @returns {ScrollingReleasePoint}
     */
    _getTheReleasingPointContainerWhichIsOnTheSameLineAsTheStartingPoint() {
        const idOfReleasePointEndLine = Number(this.releasingPoint.lineOfEndContainer.id)
        const idOfReleasePointStartLine = Number(this.releasingPoint.lineOfStartContainer.id)
        console.log(idOfReleasePointEndLine, idOfReleasePointStartLine)
        const idOfStartPointLine = Number(this.startingPoint.lineOfStartContainer.id)
        if (idOfStartPointLine == idOfReleasePointEndLine) {
            // THERE IS ALSO THE POSSIBILITY OF THE LINE BREAKING ITS OWN START AND END OFFSET
            console.log(this.releasingPoint.endContainer.offsetLeft)
            console.log(this.releasingPoint.startContainer.offsetLeft)
            return new ScrollingReleasePoint(
                this.releasingPoint.endContainer,
                this.releasingPoint.endOffset,
                this.releasingPoint.startOffset,
            )
        }
        else {
            console.log(this.releasingPoint)
            // THERE IS ALSO THE POSSIBILITY OF THE LINE BREAKING ITS OWN START AND END OFFSET
            return new ScrollingReleasePoint(
                this.releasingPoint.startContainer,
                this.releasingPoint.endOffset,
                this.releasingPoint.startOffset,
            )
        }
    }

    _calculateCoordinatesForEdgeCase() {
        if (this.startingPoint.startContainerOffset == this.releasingPoint.endContainer.offsetLeft && this.startingPoint.startOffset < this.releasingPoint.endOffset) {
            console.log("STARTING POINT IS FIRST AT THE SAME CONTAINER AND FIRST AT THE CONTAINER")
            let leftOffset = calculateTotalLeftOffsetOfCaretInTheLine(new CaretLeftOffsetDTO(this.startingPoint.startContainer, this.startingPoint.startContainerOffset, this.startingPoint.startOffset))
            console.log(leftOffset)
            const scrollingReleasePoint = new ScrollingReleasePoint(
                this.releasingPoint.endContainer,
                this.releasingPoint.endOffset,
                this.releasingPoint.startOffset
            )
            let widthOfSelectedText = this._name(scrollingReleasePoint, leftOffset)
            return new MarkedLineCoordinates(leftOffset, this.startingPoint.offsetTopForStartingLine, widthOfSelectedText)
        }
        else if (this.startingPoint.startContainerOffset == this.releasingPoint.endContainer.offsetLeft && this.startingPoint.startOffset > this.releasingPoint.endOffset) {
            console.log("STARTING POINT IS FIRST AT THE SAME CONTAINER AND SECOND AT THE CONTAINER")
            const caretPoint = new CaretLeftOffsetDTO(this.releasingPoint.endContainer, this.releasingPoint.endContainer.offsetLeft, this.releasingPoint.endOffset)
            let leftOffset = calculateTotalLeftOffsetOfCaretInTheLine(caretPoint)
            console.log(leftOffset)
            let widthOfSelectedText = this._widthOfText(leftOffset)
            console.log(widthOfSelectedText)
            return new MarkedLineCoordinates(leftOffset, this.startingPoint.offsetTopForStartingLine, widthOfSelectedText)
        }
        else if (this.startingPoint.startContainerOffset < this.releasingPoint.endContainer.offsetLeft) {
            console.log("STARTING POINT IS FIRST DIFFERENT CONTAINERS")
            let leftOffset = calculateTotalLeftOffsetOfCaretInTheLine(new CaretLeftOffsetDTO(this.startingPoint.startContainer, this.startingPoint.startContainerOffset, this.startingPoint.startOffset))
            console.log(leftOffset)
            const scrollingReleasePoint = new ScrollingReleasePoint(
                this.releasingPoint.endContainer,
                this.releasingPoint.endOffset,
                this.releasingPoint.startOffset
            )
            const widthOfSelectedText = this._widthOfTextForWhenStartingIsFirstContainer(leftOffset, scrollingReleasePoint)
            console.log(widthOfSelectedText, leftOffset)
            return new MarkedLineCoordinates(leftOffset, this.startingPoint.offsetTopForStartingLine, widthOfSelectedText)
        }
        else if (this.startingPoint.startContainerOffset > this.releasingPoint.endContainer.offsetLeft) {
            console.log("STARTING POINT IS SECOND DIFFERENT CONTAINERS")
            const scrollingReleasePoint = new ScrollingReleasePoint(
                this.releasingPoint.endContainer,
                this.releasingPoint.endOffset,
                this.releasingPoint.startOffset
            )
            let leftOffset = calculateTotalLeftOffsetOfCaretInTheLine(new CaretLeftOffsetDTO(scrollingReleasePoint.container, scrollingReleasePoint.container.offsetLeft, scrollingReleasePoint.endOffset))
            let widthOfSelectedText = this._widthOfText(leftOffset)
            return new MarkedLineCoordinates(leftOffset, this.startingPoint.offsetTopForStartingLine, widthOfSelectedText)
        }
        else {
            console.log("RELEASE POINT IS FIRST")
            let leftOffset = calculateTotalLeftOffsetOfCaretInTheLine(new CaretLeftOffsetDTO(this.releasingPoint.startContainer, this.releasingPoint.startContainer.offsetLeft, this.releasingPoint.startOffset))
            let widthOfSelectedText = this._widthOfText(leftOffset)
            return new MarkedLineCoordinates(leftOffset, this.startingPoint.offsetTopForStartingLine, widthOfSelectedText)
        }
    }

    /**
     * 
     * @param {ScrollingReleasePoint} scrollingReleasePoint 
     * @returns {MarkedLineCoordinates}
     */
    _calculateCoordinates(scrollingReleasePoint) {
        console.log(scrollingReleasePoint)
        // console.log(this.startingPoint.startContainer.offsetLeft)
        // console.log(scrollingReleasePoint.container.offsetLeft)
        console.log(this.startingPoint.startContainerOffset)
        console.log(scrollingReleasePoint.container.offsetLeft)
        if (this.startingPoint.startContainerOffset == scrollingReleasePoint.container.offsetLeft && this.startingPoint.startOffset < scrollingReleasePoint.endOffset) {
            console.log("STARTING POINT IS FIRST AT THE SAME CONTAINER AND FIRST AT THE CONTAINER")
            // console.log(this.startingPoint)
            let leftOffset = calculateTotalLeftOffsetOfCaretInTheLine(new CaretLeftOffsetDTO(this.startingPoint.startContainer, this.startingPoint.startContainerOffset, this.startingPoint.startOffset))
            console.log(leftOffset)
            let widthOfSelectedText = this._name(scrollingReleasePoint, leftOffset)
            return new MarkedLineCoordinates(leftOffset, this.startingPoint.offsetTopForStartingLine, widthOfSelectedText)
        }
        else if (this.startingPoint.startContainerOffset == scrollingReleasePoint.container.offsetLeft && this.startingPoint.startOffset > scrollingReleasePoint.endOffset) {
            console.log("STARTING POINT IS FIRST AT THE SAME CONTAINER AND SECOND AT THE CONTAINER")
            // console.log(this.startingPoint)
            let leftOffset = calculateTotalLeftOffsetOfCaretInTheLine(new CaretLeftOffsetDTO(scrollingReleasePoint.container, scrollingReleasePoint.container.offsetLeft, scrollingReleasePoint.endOffset))
            console.log(leftOffset)
            let widthOfSelectedText = this._widthOfText(leftOffset)
            console.log(widthOfSelectedText)
            return new MarkedLineCoordinates(leftOffset, this.startingPoint.offsetTopForStartingLine, widthOfSelectedText)
        }
        else if (this.startingPoint.startContainerOffset < scrollingReleasePoint.container.offsetLeft) {
            console.log("STARTING POINT IS FIRST DIFFERENT CONTAINERS")
            console.log(scrollingReleasePoint)
            let leftOffset = calculateTotalLeftOffsetOfCaretInTheLine(new CaretLeftOffsetDTO(this.startingPoint.startContainer, this.startingPoint.startContainerOffset, this.startingPoint.startOffset))
            console.log(leftOffset)
            const widthOfSelectedText = this._widthOfTextForWhenStartingIsFirstContainer(leftOffset, scrollingReleasePoint)
            console.log(widthOfSelectedText, leftOffset)
            return new MarkedLineCoordinates(leftOffset, this.startingPoint.offsetTopForStartingLine, widthOfSelectedText)
        }
        else if (this.startingPoint.startContainerOffset > scrollingReleasePoint.container.offsetLeft) {
            console.log("STARTING POINT IS SECOND DIFFERENT CONTAINERS")
            let leftOffset = calculateTotalLeftOffsetOfCaretInTheLine(new CaretLeftOffsetDTO(scrollingReleasePoint.container, scrollingReleasePoint.container.offsetLeft, scrollingReleasePoint.endOffset))
            let widthOfSelectedText = this._widthOfText(leftOffset)
            return new MarkedLineCoordinates(leftOffset, this.startingPoint.offsetTopForStartingLine, widthOfSelectedText)
        }
        else {
            console.log("RELEASE POINT IS FIRST")
            return new MarkedLineCoordinates(0, 0, 0)
        }
    }

    /**
    * 
    * @param {ScrollingReleasePoint} scrollingReleasePoint 
    * @returns {Number}
    */
    _name(scrollingReleasePoint, offsetLeft) {
        const offset = calculateTotalLeftOffsetOfCaretInTheLine(
            new CaretLeftOffsetDTO(
                scrollingReleasePoint.container,
                scrollingReleasePoint.container.offsetLeft,
                scrollingReleasePoint.endOffset
            )
        )
        let widthOfSelectedText = offset - offsetLeft
        return widthOfSelectedText
    }

    _widthOfText(offsetLeft) {
        const offset = calculateTotalLeftOffsetOfCaretInTheLine(
            new CaretLeftOffsetDTO(
                this.startingPoint.startContainer,
                this.startingPoint.startContainerOffset,
                this.startingPoint.startOffset
            )
        )
        let widthOfSelectedText = offset - offsetLeft
        return widthOfSelectedText
    }

    /**
     * 
     * @param {Number} offsetLeft 
     * @param {ScrollingReleasePoint} scrollingReleasePoint 
     * @returns 
     */
    _widthOfTextForWhenStartingIsFirstContainer(offsetLeft, scrollingReleasePoint) {

        const offset = calculateTotalLeftOffsetOfCaretInTheLine(
            new CaretLeftOffsetDTO(
                scrollingReleasePoint.container,
                scrollingReleasePoint.container.offsetLeft,
                scrollingReleasePoint.endOffset
            )
        )
        console.log(scrollingReleasePoint.container.offsetLeft)
        console.log(offset)
        let widthOfSelectedText = offset - offsetLeft
        return widthOfSelectedText
    }

    /**
     * 
     * @param {ScrollingReleasePoint} scrollingReleasePoint 
     * @returns 
     */
    _calculateTheCoordinates(scrollingReleasePoint) {
        // console.log(this.startingPoint)
        // I need the controller, its left offset, and the caret offset, also the container used for the element used for the width of selected text calculation
        // too many arguments...
        let leftOffset = calculateTotalLeftOffsetOfCaretInTheLine(new CaretLeftOffsetDTO(this.startingPoint.startContainer, this.startingPoint.startContainerOffset, this.startingPoint.startOffset))
        console.log(leftOffset)
        let widthOfSelectedText = this._name(scrollingReleasePoint, leftOffset)
        return new MarkedLineCoordinates(leftOffset, this.startingPoint.offsetTopForStartingLine, widthOfSelectedText)

    }
}