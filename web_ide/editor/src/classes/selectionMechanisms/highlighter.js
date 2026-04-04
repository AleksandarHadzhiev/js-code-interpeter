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
    /**
     * 
     * @param {HTMLElement} contentElement 
     */
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
    setStartingPoint(point) {
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
        console.log(mouseYPositionBasedOnPage)
        this.endingPoint = this._buildReleasePoint(mouseYPositionBasedOnPage, firstVisibleLine, lastVisibleLine)
        this.customMarker.updatePoints(this.startingPoint, this.endingPoint)
        this.customMarker.buildForLeftSection(firstVisibleLine, lastVisibleLine)
    }

    /**
     * 
     * @param {Number} mouseYPositionBasedOnPage 
     * @param {Number} firstVisibleLine 
     * @param {Number} lastVisibleLine 
     * @param {Number} lastTextLine 
     * @returns {Range}
     */
    _buildReleasePoint(mouseYPositionBasedOnPage, firstVisibleLine, lastVisibleLine, lastTextLine) {
        let endingPoint = null
        if (lastVisibleLine > lastTextLine) {
            const lineElement = document.getElementById(lastTextLine)
            endingPoint = new StartingPoint(
                lastTextLine,
                Number(lineElement.offsetTop),
                0,
                lineElement.textContent
            )
        }
        else {
            let lineElementBasedOnMouuse = this._buildLineForMousePositionOnY(mouseYPositionBasedOnPage, lastVisibleLine, firstVisibleLine)
            endingPoint = new StartingPoint(
                Number(lineElementBasedOnMouuse.id),
                Number(lineElementBasedOnMouuse.offsetTop),
                0,
                lineElementBasedOnMouuse.textContent
            )
        }
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
     * @param {Number} lastTextLine
     */
    highlightForBottomScreenSection(mouseYPositionBasedOnPage, firstVisibleLine, lastVisibleLine, lastTextLine) {
        this.endingPoint = this._buildReleasePoint(mouseYPositionBasedOnPage, firstVisibleLine, lastVisibleLine, lastTextLine)
        this.customMarker.updatePoints(this.startingPoint, this.endingPoint)
        this.customMarker.buildForBottomSection(firstVisibleLine, lastVisibleLine, lastTextLine)
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

    highlightForMouseInEditorSection(mouseYPositionBasedOnPage, firstVisibleLine, lastVisibleLine, mouseXPosition) {
        this.endingPoint = this._buildReleasePointForMouseInEditorSection(mouseYPositionBasedOnPage, mouseXPosition)
        if (this.endingPoint != null) {
            this.customMarker.updatePoints(this.startingPoint, this.endingPoint)
            this.customMarker.buildForMouseInEditorSection(firstVisibleLine, lastVisibleLine)
        }
    }

    _buildReleasePointForMouseInEditorSection(mouseYPositionBasedOnPage, mouseXPosition) {
        let endingPoint = null
        const commonContainer = this.endingRange.commonAncestorContainer
        const lineForEndContainer = this.endingRange.endContainer.parentElement.parentElement
        const lineForStartContainer = this.endingRange.startContainer.parentElement.parentElement
        let isSelectable = true

        if (isNaN(Number(lineForStartContainer.id)) == false && isNaN(Number(lineForEndContainer.id)) == false) {
            isSelectable = true
        }
        else if (commonContainer.id !== "line-content") {
            if (isNaN(Number(commonContainer.id)) || commonContainer.id == "") {
                isSelectable = false
            }
        }
        if (isSelectable) {
            const endContainerPoint = this._buildPointBasedOnContainerAndOffset(this.endingRange.endContainer, this.endingRange.endOffset)
            const startContainerPoint = this._buildPointBasedOnContainerAndOffset(this.endingRange.startContainer, this.endingRange.startOffset)
            const distanceBetweenMouseLineIdAndIdOfEndLine = mouseYPositionBasedOnPage > endContainerPoint.topOffset ? mouseYPositionBasedOnPage - endContainerPoint.topOffset : endContainerPoint.topOffset - mouseYPositionBasedOnPage
            const distanceBetweenMouseLineIdAndIdOfStartLine = mouseYPositionBasedOnPage > startContainerPoint.topOffset ? mouseYPositionBasedOnPage - startContainerPoint.topOffset : startContainerPoint.topOffset - mouseYPositionBasedOnPage
            const distanceBetweenMouseXAndStartContainerX = mouseXPosition > startContainerPoint.leftOffset ? mouseXPosition - startContainerPoint.leftOffset : startContainerPoint.leftOffset - mouseXPosition
            const distanceBetweenMouseXAndEndContainerX = mouseXPosition > endContainerPoint.leftOffset ? mouseXPosition - endContainerPoint.leftOffset : endContainerPoint.leftOffset - mouseXPosition
            if (Number(lineForStartContainer.id) < Number(lineForEndContainer.id) && this.startingPoint.lineId == Number(lineForEndContainer.id)) {
                endingPoint = startContainerPoint
            }
            else if (distanceBetweenMouseLineIdAndIdOfEndLine < distanceBetweenMouseLineIdAndIdOfStartLine) {
                endingPoint = endContainerPoint
            }
            else if (distanceBetweenMouseLineIdAndIdOfEndLine > distanceBetweenMouseLineIdAndIdOfStartLine) {
                endingPoint = startContainerPoint
            }
            else {
                if (distanceBetweenMouseXAndEndContainerX < distanceBetweenMouseXAndStartContainerX) {
                    endingPoint = endContainerPoint
                }
                else {
                    endingPoint = startContainerPoint
                }
            }
        }
        return endingPoint
    }

    /**
     * 
     * @param {HTMLElement} container 
     * @param {Number} offset 
     * @returns {StartingPoint}
     */
    _buildPointBasedOnContainerAndOffset(container, offset) {
        let leftOffsetDTO = new CaretLeftOffsetDTO(container.parentElement, container.parentElement.offsetLeft, offset)
        let id = container.parentElement.parentElement.id
        let topOffset = container.parentElement.parentElement.offsetTop
        let fullText = container.parentElement.parentElement.textContent
        if (isNaN(container.id) == false) {
            leftOffsetDTO = new CaretLeftOffsetDTO(container, 0, offset)
            id = container.id
            topOffset = container.offsetTop
            fullText = container.textContent
        }
        const leftOffset = calculateTotalLeftOffsetOfCaretInTheLine(leftOffsetDTO, this.contentElement)
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