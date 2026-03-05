import calculateTotalLeftOffsetOfCaretInTheLine from "./Caclulators/CaretLeftOffsetCalculator.js"
import { CaretLeftOffsetDTO } from "./DTOs/caretDTO.js"

export default class CaretBuilder {
    /**
     * 
     * @param {Range} range 
     */
    constructor(range) {
        this.range = range
    }

    /**
     * @param {MouseEvent} mouseEvent 
     */
    buildCaretBasedOnMousePosition(mouseEvent) {
        console.log(mouseEvent.offsetX)
        const mouseYPosition = mouseEvent.currentTarget.offsetTop

        const offsetTopForStartingContainer = this.range.startContainer.parentElement.parentElement.offsetTop
        console.log(offsetTopForStartingContainer)
        const offsetTopForEndingContainer = this.range.endContainer.parentElement.parentElement.offsetTop
        console.log(offsetTopForEndingContainer)

        const differenseInYPositionOfEndingReleaseLineFromMouseY = mouseYPosition > offsetTopForEndingContainer ? mouseYPosition - offsetTopForEndingContainer : offsetTopForEndingContainer - mouseYPosition
        const differenseInYPositionOfStartingReleaseLineFromMouseY = mouseYPosition > offsetTopForStartingContainer ? mouseYPosition - offsetTopForStartingContainer : offsetTopForStartingContainer - mouseYPosition

        let caret = document.getElementById('caret')
        if (caret == null) {
            caret = document.createElement('div')
            caret.classList.add('caret')
            caret.setAttribute('id', 'caret')
        }


        if (differenseInYPositionOfEndingReleaseLineFromMouseY < differenseInYPositionOfStartingReleaseLineFromMouseY) {
            const left = calculateTotalLeftOffsetOfCaretInTheLine(new CaretLeftOffsetDTO(
                this.range.endContainer,
                this.range.endContainer.parentElement.offsetLeft,
                this.range.endOffset
            ))
            console.log(left)
            caret.style =
                `
                top: ${offsetTopForEndingContainer}px;
                left: ${left}px;
            `
        }
        else {
            const left = calculateTotalLeftOffsetOfCaretInTheLine(new CaretLeftOffsetDTO(
                this.range.startContainer,
                this.range.startContainer.parentElement.offsetLeft,
                this.range.startOffset
            ))
            caret.style =
                `
                top: ${offsetTopForStartingContainer}px;
                left: ${left}px;
            `
        }
        return caret
    }
}