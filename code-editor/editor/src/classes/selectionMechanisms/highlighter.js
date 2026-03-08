import CustomRangeElement from "./customRangeElement.js"
import CustomContentMarker from "./custonContentMarker.js"

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
        this.endingPoint = null
        this.customMarker = new CustomContentMarker(contentElement)
    }

    /**
     * @param {Range} range 
     */
    setStartingPointBasedOnRange(range) {
        this.startingPoint = new CustomRangeElement(range)
    }

    /**
     * @param {Range} range 
     */
    setEndingPointBasedOnRange(range) {
        this.endingPoint = new CustomRangeElement(range)
    }


    _buildForRight(event) {

    }

    /**
     * @param {Number} mouseYPositionBasedOnPage 
     * @param {Number} firstVisibleLine 
     * @param {Number} lastVisibleLine 
     */
    highlightForLeftScreenSection(mouseYPositionBasedOnPage, firstVisibleLine, lastVisibleLine) {
        const range = this._buildReleaseRangeForLeft(mouseYPositionBasedOnPage, firstVisibleLine, lastVisibleLine)
        this.setEndingPointBasedOnRange(range)
        this.customMarker.updatePoints(this.startingPoint, this.endingPoint)
        console.log(this.customMarker)
        this.customMarker.buildForLeftSection(firstVisibleLine, lastVisibleLine)
    }

    /**
     * 
     * @param {Number} mouseYPositionBasedOnPage 
     * @param {Number} firstVisibleLine 
     * @param {Number} lastVisibleLine 
     * @returns {Range}
     */
    _buildReleaseRangeForLeft(mouseYPositionBasedOnPage, firstVisibleLine, lastVisibleLine) {
        const y = mouseYPositionBasedOnPage
        let rowBasedOnMouseYPosition = Math.floor(y / 28.8)
        let lineElementBasedOnMouuse = document.getElementById(String(rowBasedOnMouseYPosition))
        while (lineElementBasedOnMouuse == null) {
            if (rowBasedOnMouseYPosition > lastVisibleLine + 2) {
                rowBasedOnMouseYPosition -= 1
            }
            else if (rowBasedOnMouseYPosition < firstVisibleLine + 2) {
                rowBasedOnMouseYPosition += 1
            }
            else { console.log("EDGE CASE") }
            lineElementBasedOnMouuse = document.getElementById(String(rowBasedOnMouseYPosition))
        }
        const startingPointLineVisibility = this._getStartingPointLinePositionBasedOnVisibleLines(firstVisibleLine, lastVisibleLine)
        const firstVisibleLineElement = document.getElementById(String(firstVisibleLine))
        const lastVisibleLineElement = this._getElementForVisibleLineAndOperationToExecute(lastVisibleLine, Operation.SUBSTRACT)
        const range = new Range()
        if (startingPointLineVisibility == StartingPointVisibility.VISIBLE) {
            const startingLine = Number(this.startingPoint.lineOfStartContainer.id)
            if (startingLine > rowBasedOnMouseYPosition) {
                range.setStart(lineElementBasedOnMouuse.lastChild.firstChild, lineElementBasedOnMouuse.lastChild.firstChild.textContent.length)
                range.setEnd(lineElementBasedOnMouuse.lastChild.firstChild, lineElementBasedOnMouuse.lastChild.firstChild.textContent.length)
            }
            else {
                range.setStart(lineElementBasedOnMouuse.firstChild.firstChild, 0)
                range.setEnd(lineElementBasedOnMouuse.firstChild.firstChild, 0)
            }
        }
        else if (startingPointLineVisibility == StartingPointVisibility.EARLIER_ROW_THAN_FIRST_VISIBLE_ON_THE_SCREEN) {
            range.setStart(firstVisibleLineElement.lastChild.firstChild, firstVisibleLineElement.lastChild.firstChild.textContent.length)
            range.setEnd(lineElementBasedOnMouuse.firstChild.firstChild, 0)
        }
        else if (startingPointLineVisibility == StartingPointVisibility.LAIER_ROW_THAN_LAST_VISIBLE_ON_THE_SCREEN) {
            range.setEnd(lineElementBasedOnMouuse.lastChild.firstChild, lineElementBasedOnMouuse.lastChild.firstChild.textContent.length)
            range.setStart(lastVisibleLineElement.lastChild.firstChild, lastVisibleLineElement.lastChild.firstChild.textContent.length)
        }
        return range
    }

    /**
     * 
     * @param {Number} firstVisibleLine 
     * @param {Number} lastVisibleLine 
     * @returns {String}
     */
    _getStartingPointLinePositionBasedOnVisibleLines(firstVisibleLine, lastVisibleLine) {
        const lineOfStartingPoint = this.startingPoint.lineOfStartContainer
        const idOfLineOfStartingPoint = lineOfStartingPoint.id

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