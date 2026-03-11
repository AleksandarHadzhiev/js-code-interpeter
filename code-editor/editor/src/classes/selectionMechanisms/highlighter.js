import CustomRangeElement from "./customRangeElement.js"
import CustomContentMarker from "./custonContentMarker.js"
import { StartingPoint } from "../dtos/caretDTOs.js"

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


    _buildForRight(event) {

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
        const y = mouseYPositionBasedOnPage
        let endingPoint = null
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
        endingPoint = new StartingPoint(
            Number(lineElementBasedOnMouuse.id),
            Number(lineElementBasedOnMouuse.offsetTop),
            0,
            lineElementBasedOnMouuse.textContent
        )
        return endingPoint
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
        this.customMarker.updatePoints(this.startingPoint, this.endingPoint)
        this.customMarker.buildForMouseInEditorSection(firstVisibleLine, lastVisibleLine)
    }

    _buildReleasePointForMouseInEditorSection(mouseYPositionBasedOnPage, firstVisibleLine, lastVisibleLine) {
        console.log(this.endingRange)
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