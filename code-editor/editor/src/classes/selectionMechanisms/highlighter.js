import CustomContentMarker from "./custonContentMarker.js"
import { StartingPoint } from "../dtos/caretDTOs.js"
import { CaretLeftOffsetDTO } from "../dtos/caretDTOs.js"
import calculateTotalLeftOffsetOfCaretInTheLine from "../calculators/caretLeftOffsetCalculator.js"

const Operation = {
    ADD: "+",
    SUBSTRACT: "-"
}

const StartingPointVisibility = {
    VISIBLE: "VISIBLE",
    EARLIER_ROW_THAN_FIRST_VISIBLE_ON_THE_SCREEN: "EARLIER_ROW_THAN_FIRST_VISIBLE_ON_THE_SCREEN",
    LAIER_ROW_THAN_LAST_VISIBLE_ON_THE_SCREEN: "LAIER_ROW_THAN_LAST_VISIBLE_ON_THE_SCREEN"
}

export default class Highlighter {
    constructor(contentElement) {
        this.startingPoint = null
        this.endingRange = null
        this.endingPoint = null
        this.customMarker = new CustomContentMarker(contentElement)
        this.contentElement = contentElement
    }


    /**
     * 
     * @param {Number} firstVisibleLine 
     * @param {Number} lastVisibleLine 
     */
    display(firstVisibleLine, lastVisibleLine) {
        this.customMarker.display(firstVisibleLine, lastVisibleLine)
    }

    /**
     * @param {StartingPoint} point 
     */
    setStartingPointBasedOnRange(point) {
        this.startingPoint = point
    }

    /**
     * @param {Range} range 
     */
    setEndingRangeBasedOnRange(range) {
        this.endingRange = range
    }

    /**
     * @param {Number} mouseYPositionBasedOnPage 
     * @param {Number} firstVisibleLine 
     * @param {Number} lastVisibleLine 
     */
    highlightForLeftScreenSection(mouseYPositionBasedOnPage, firstVisibleLine, lastVisibleLine) {
        this.endingPoint = this._buildReleasePoint(mouseYPositionBasedOnPage, firstVisibleLine, lastVisibleLine)
        this.customMarker.updatePoints(this.startingPoint, this.endingPoint)
        this.customMarker.buildForLeftSection(firstVisibleLine, lastVisibleLine)
    }

    /**
 * 
 * @param {Number} mouseYPositionBasedOnPage 
 * @param {Number} firstVisibleLine 
 * @param {Number} lastVisibleLine 
 * @returns {Range}
 */
    _buildReleasePoint(mouseYPositionBasedOnPage, firstVisibleLine, lastVisibleLine) {
        let endingPoint = null
        let lineElementBasedOnMouuse = this._buildLineForMousePositionOnY(mouseYPositionBasedOnPage, lastVisibleLine, firstVisibleLine)
        endingPoint = new StartingPoint(
            Number(lineElementBasedOnMouuse.id),
            Number(lineElementBasedOnMouuse.offsetTop),
            0,
            lineElementBasedOnMouuse.textContent
        )
        return endingPoint
    }

    _buildLineForMousePositionOnY(mouseYPositionBasedOnPage, lastVisibleLine, firstVisibleLine) {
        const y = mouseYPositionBasedOnPage
        let rowBasedOnMouseYPosition = Math.floor(y / 28.8)
        let lineElementBasedOnMouuse = document.getElementById(String(rowBasedOnMouseYPosition))
        while (lineElementBasedOnMouuse == null) {
            if (rowBasedOnMouseYPosition >= lastVisibleLine) {
                rowBasedOnMouseYPosition -= 1
            }
            else if (rowBasedOnMouseYPosition <= firstVisibleLine) {
                rowBasedOnMouseYPosition += 1
            }
            else { console.log("EDGE CASE") }
            lineElementBasedOnMouuse = document.getElementById(String(rowBasedOnMouseYPosition))
        }
        return lineElementBasedOnMouuse
    }

    /**
     * @param {Number} mouseYPositionBasedOnPage 
     * @param {Number} firstVisibleLine 
     * @param {Number} lastVisibleLine 
     */
    highlightForTopScreenSection(mouseYPositionBasedOnPage, firstVisibleLine, lastVisibleLine) {
        this.endingPoint = this._buildReleasePoint(mouseYPositionBasedOnPage, firstVisibleLine, lastVisibleLine)
        this.customMarker.updatePoints(this.startingPoint, this.endingPoint)
        this.customMarker.buildForTopSection(firstVisibleLine, lastVisibleLine)
    }

    /**
     * @param {Number} mouseYPositionBasedOnPage 
     * @param {Number} firstVisibleLine 
     * @param {Number} lastVisibleLine 
     */
    highlightForBottomScreenSection(mouseYPositionBasedOnPage, firstVisibleLine, lastVisibleLine) {
        this.endingPoint = this._buildReleasePoint(mouseYPositionBasedOnPage, firstVisibleLine, lastVisibleLine)
        this.customMarker.updatePoints(this.startingPoint, this.endingPoint)
        this.customMarker.buildForBottomSection(firstVisibleLine, lastVisibleLine)
    }

    /**
     * @param {Number} mouseYPositionBasedOnPage 
     * @param {Number} firstVisibleLine 
     * @param {Number} lastVisibleLine 
     */
    highlightForRightScreenSection(mouseYPositionBasedOnPage, firstVisibleLine, lastVisibleLine) {
        this.endingPoint = this._buildReleasePoint(mouseYPositionBasedOnPage, firstVisibleLine, lastVisibleLine)
        this.customMarker.updatePoints(this.startingPoint, this.endingPoint)
        this.customMarker.buildForRightSection(firstVisibleLine, lastVisibleLine)
    }

    highlightForMouseInEditorSection(mouseYPositionBasedOnPage, firstVisibleLine, lastVisibleLine) {
        this.endingPoint = this._buildReleasePointForMouseInEditorSection(mouseYPositionBasedOnPage, firstVisibleLine, lastVisibleLine)
        console.log(this.endingPoint)
        this.customMarker.updatePoints(this.startingPoint, this.endingPoint)
        this.customMarker.buildForMouseInEditorSection(firstVisibleLine, lastVisibleLine)
    }

    _buildReleasePointForMouseInEditorSection(mouseYPositionBasedOnPage, firstVisibleLine, lastVisibleLine) {
        const lineElementBasedOnMouuse = this._buildLineForMousePositionOnY(mouseYPositionBasedOnPage, lastVisibleLine, firstVisibleLine)
        const mouseLineId = Number(lineElementBasedOnMouuse.id)
        console.log(lineElementBasedOnMouuse)
        const lineForEndContainer = this.endingRange.endContainer.parentElement.parentElement
        const lineForStartContainer = this.endingRange.startContainer.parentElement.parentElement
        const idOfEndLine = Number(lineForEndContainer.id)
        const idOfStartLine = Number(lineForStartContainer.id)

        if (mouseLineId == idOfEndLine && mouseLineId == idOfStartLine) {
            // SPECIAL CASE
            const endContainerPoint = this._buildPointBasedOnContainerAndOffset(this.endingRange.endContainer, this.endingRange.endOffset)
            const startContainerPoint = this._buildPointBasedOnContainerAndOffset(this.endingRange.startContainer, this.endingRange.startOffset)
            if (this.startingPoint.leftOffset == endContainerPoint.leftOffset) {
                return startContainerPoint
            }
            else if (this.startingPoint.leftOffset == startContainerPoint.leftOffset) {
                return endContainerPoint
            }
        }
        else if (mouseLineId == idOfEndLine) {
            return this._buildPointBasedOnContainerAndOffset(this.endingRange.endContainer, this.endingRange.endOffset)
        }
        else if (mouseLineId == idOfStartLine) {
            return this._buildPointBasedOnContainerAndOffset(this.endingRange.startContainer, this.endingRange.startOffset)
        }
        else console.log(idOfEndLine, idOfStartLine, mouseLineId)
        return null
    }

    /**
     * 
     * @param {HTMLElement} container 
     * @param {Number} offset 
     * @returns {StartingPoint}
     */
    _buildPointBasedOnContainerAndOffset(container, offset) {
        const leftOffsetDTO = new CaretLeftOffsetDTO(container.parentElement, container.parentElement.offsetLeft, offset)
        const leftOffset = calculateTotalLeftOffsetOfCaretInTheLine(leftOffsetDTO, this.contentElement)
        const id = container.parentElement.parentElement.id
        const topOffset = container.parentElement.parentElement.offsetTop
        const fullText = container.parentElement.parentElement.textContent
        return new StartingPoint(Number(id), topOffset, leftOffset, fullText)
    }

    /**
     * 
     * @param {Number} firstVisibleLine 
     * @param {Number} lastVisibleLine 
     * @returns {String}
     */
    _getStartingPointLinePositionBasedOnVisibleLines(firstVisibleLine, lastVisibleLine) {
        const idOfLineOfStartingPoint = this.startingPoint.lineId
        if (idOfLineOfStartingPoint >= firstVisibleLine && idOfLineOfStartingPoint < lastVisibleLine) {
            return StartingPointVisibility.VISIBLE
        }
        else if (idOfLineOfStartingPoint < firstVisibleLine) {
            return StartingPointVisibility.EARLIER_ROW_THAN_FIRST_VISIBLE_ON_THE_SCREEN
        }
        else if (idOfLineOfStartingPoint >= lastVisibleLine) {
            return StartingPointVisibility.LAIER_ROW_THAN_LAST_VISIBLE_ON_THE_SCREEN
        }
        else {
            alert("THIS IS A BUG")
        }
    }

    _getElementForVisibleLineAndOperationToExecute(visibleLine, operation) {
        let elementForVisibleLine = document.getElementById(String(visibleLine))
        while (elementForVisibleLine == null) {
            visibleLine = operation == Operation.ADD ? visibleLine + 1 : visibleLine - 1
            elementForVisibleLine = document.getElementById(String(visibleLine))
        }
        return elementForVisibleLine
    }
}