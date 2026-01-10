import CustomRangeElement from "./CustomRangeElement.js"
import SingleLineSelector from "./SingleLineSelector.js"
import MultilineCodeSelector from "./MultilineCodeSelector.js"
import ScrollingSingleLineSelector from "./SingleLineSelectionWithScrolling.js"
import MultilineCodeSelectorScrolling from "./MultilineCodeSelectorScrolling.js"
/**
 * The class makes use of the CustomRangeElement class and based on the first selection of the user - the point where the user started selecting text
 * and the last selection of the user - the point where the user stopped selecting and released the mouse
 * a marker - highlighter - will be created.
 */
export default class CustomContentMarker {
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
     * @param {Event} event 
     * @param {Number} firstVisibleLine 
     * @param {Number} lastVisibleLine 
     */
    buildMarkerWithScrolling(event, firstVisibleLine, lastVisibleLine) {
        // FIRST FIND A WAY TO CHECK IF IT IS A SINGLE LINE CHECK
        if (this._checkIfEventIsTriggeredOnStartingLineOfSelection(event)) {
            const singleLineSelector = new ScrollingSingleLineSelector(this.startingPoint, this.releasingPoint)
            const coordinates = singleLineSelector.getCoordinatesForSingleLineSelection()
            console.log(coordinates)
            this._buildLineInMarkerForCoordinates(coordinates)
        }
        else {
            const multilineCodeSelector = new MultilineCodeSelectorScrolling(this.startingPoint, this.releasingPoint)
            const multilineCoordinates = multilineCodeSelector.markContent(firstVisibleLine, lastVisibleLine, event)
            multilineCoordinates.forEach((coordinates) => {
                this._buildLineInMarkerForCoordinates(coordinates)
            });
        }
    }

    /**
     * 
     * @param {Event} event 
     */
    _checkIfEventIsTriggeredOnStartingLineOfSelection(event) {
        const lineListeningToMouseMoveEvent = Number(event.currentTarget.id)
        const firstLineOfSelection = Number(this.startingPoint.lineOfStartContainer.id)
        if (lineListeningToMouseMoveEvent == firstLineOfSelection) {
            console.log("SINGLE LINE")
            return true
        }
        return false
    }

    buildMarkerWithoutScrolling() {
        if (this._checkIfTextSelectionIsOneLine()) {
            this._buildMarkerIfStartingPointAndReleasingPointAreOnTheSameLine()
        }
        else {
            this._buildMarkerForMultilineSelection()
        }
    }

    /**
     * @returns True if the selected content is on the same line. False if its on multiple lines.
     */
    _checkIfTextSelectionIsOneLine() {
        const isTheSameStartingLine = this.startingPoint.lineOfStartContainer == this.releasingPoint.lineOfStartContainer
        const isTheSameEndingLine = this.startingPoint.lineOfEndContainer == this.releasingPoint.lineOfEndContainer
        const isTheSameLine = isTheSameEndingLine && isTheSameStartingLine
        return isTheSameLine
    }

    _buildMarkerIfStartingPointAndReleasingPointAreOnTheSameLine() {
        const singleLineSelector = new SingleLineSelector(this.startingPoint, this.releasingPoint)
        const coordinates = singleLineSelector.getCoordinatesForSingleLineSelection()
        this._buildLineInMarkerForCoordinates(coordinates)
    }

    _buildMarkerForMultilineSelection() {
        const multilineCoordinates = this._findCoordinatesForMultilineSelection()
        multilineCoordinates.forEach((coordinates) => {
            this._buildLineInMarkerForCoordinates(coordinates)
        });
    }

    /**
     * The coordinates can be reached by the id of the line
     * @returns {Map} A map containing the coordinates of all lines.
     */
    _findCoordinatesForMultilineSelection() {
        const multilineCodeSelector = new MultilineCodeSelector(this.startingPoint, this.releasingPoint)
        const cooridnatesForSelectedLines = multilineCodeSelector.markContent()
        return cooridnatesForSelectedLines
    }

    /**
     * Creates a line and appends it to the marker.
     * @param {StartingPositionOfLine} coordinates 
     */
    _buildLineInMarkerForCoordinates(coordinates) {
        const marker = document.getElementById('marker')
        const lineInMarker = document.createElement('div')
        lineInMarker.style = `
            position: absolute;
            top: ${coordinates.top}px;
            left: ${coordinates.left}px;
            width: ${coordinates.width}px;
            background-color: green;
            height: 27.6px;
            color: transparent;
        `
        marker.append(lineInMarker)
    }
}