import CustomRangeElement from "./customRangeElement"


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
    constructor() {
        this.startingPoint = null
        this.endingPoint = null
        this.customMarker = null
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
     * @param {MouseEvent} event 
     * @param {Number} firstVisibleLine 
     * @param {Number} lastVisibleLine 
     */
    highlightForLeftScreenSection(event, firstVisibleLine, lastVisibleLine) {
        const range = this._buildForLeft(event, firstVisibleLine, lastVisibleLine)
        this.setEndingPointBasedOnRange(range)
        this.customMarker.updatePoints(this.startingPoint, this.endingPoint)
        this.customMarker.buildForLeftSection(firstVisibleLine, lastVisibleLine)
    }

    /**
     * 
     * @param {MouseEvent} event 
     * @param {Number} firstVisibleLine 
     * @param {Number} lastVisibleLine 
     * @returns {Range}
     */
    _buildForLeft(event, firstVisibleLine, lastVisibleLine) {
        const y = event.pageY
        let rowBasedOnMouseYPosition = Math.floor(y / 27.6)
        let lineElementBasedOnMouuse = document.getElementById(String(rowBasedOnMouseYPosition))
        while (lineElementBasedOnMouuse == null) {
            if (rowBasedOnMouseYPosition > lastVisibleLine)
                rowBasedOnMouseYPosition - 1
            else if (rowBasedOnMouseYPosition < firstVisibleLine)
                rowBasedOnMouseYPosition + 1
            lineElementBasedOnMouuse = document.getElementById(String(rowBasedOnMouseYPosition))
        }
        const startingPointLineVisibility = this._getStartingPointLinePositionBasedOnVisibleLines()
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

    _getStartingPointLinePositionBasedOnVisibleLines() {
        const lineOfStartingPoint = startingPoint.lineOfStartContainer
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