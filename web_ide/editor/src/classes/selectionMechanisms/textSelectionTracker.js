import calculateTotalLeftOffsetOfCaretInTheLine from "../calculators/caretLeftOffsetCalculator.js"
import { CaretLeftOffsetDTO } from "../dtos/caretDTOs.js"

export default class TextSelectionTracker {
    constructor() {
        this.startingRange = null
        this.yMousePosition = 0
        this.isTextSelecting = false
        this.contentElement = document.getElementById('content')

        this.contentElement.addEventListener('mousedown', () => {
            this.isTextSelecting = true
        })

        window.addEventListener('mousemove', (event) => {
            if (this.isTextSelecting) {
                const range = document.getSelection().getRangeAt(0)
                if (this.startingRange == null)
                    this._buildStartingRangeForRange(range)
                else {
                    console.log(this.startingRange)
                    console.log(range)
                }
            }
        })

        window.addEventListener('mouseup', () => {
            this.isTextSelecting = false
            this.startingRange = null
        })
    }

    _buildStartingRangeForRange(range) {
        this.startingRange = range
        const leftOffsetDTO = new CaretLeftOffsetDTO(range.endContainer.parentElement, range.endContainer.parentElement.offsetLeft, range.endOffset)
        const offset = calculateTotalLeftOffsetOfCaretInTheLine(leftOffsetDTO, this.contentElement)
        const id = range.startContainer.parentElement.parentElement.id
        const topOffset = range.startContainer.parentElement.parentElement.offsetTop
        this.startingRange = {
            lineId: Number(id),
            topOffset: topOffset,
            leftOffset: offset,
            fullText: range.startContainer.parentElement.parentElement.textContent
        }
        // this.textSelector.setStartingPoint(this.startingRange)
    }

    updateLeftOffsetWithNewOffset(leftOffsetForContent, widthForContent) {
        console.log("PASS for NOW")
    }
}