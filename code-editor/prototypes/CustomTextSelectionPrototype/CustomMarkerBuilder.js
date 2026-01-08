import CustomRangeElement from "./CustomRangeElement.js"
import SingleLineSelector from "./SingleLineSelector.js"
import MultilineCodeSelector from "./MultilineCodeSelector.js"

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
     * Buids marker based on the first and last selections of the user.
     * @param {Number} firstVisibleLine Contains the id of the first visible line on the screen
     */
    buildMarker(firstVisibleLine) {
        if (this._checkIfTextSelectionIsOneLine()) {
            this._buildMarkerIfStartingPointAndReleasingPointAreOnTheSameLine()
        }
        else {
            this._buildMarkerForMultilineSelection(firstVisibleLine)
        }
    }

    /**
     * 
     * @returns True if the selected content is on the same line. False if its on multiple lines.
     */
    _checkIfTextSelectionIsOneLine() {
        const isTheSameStartingLine = this.startingPoint.lineOfStartContainer == this.releasingPoint.lineOfStartContainer
        const isTheSameEndingLine = this.startingPoint.lineOfEndContainer == this.releasingPoint.lineOfEndContainer
        const isTheSameLine = isTheSameEndingLine && isTheSameStartingLine
        return isTheSameLine
    }

    /**
     * Build the marker only if the startingPoint and Releasing point are on the same line
     */
    _buildMarkerIfStartingPointAndReleasingPointAreOnTheSameLine() {
        const singleLineSelector = new SingleLineSelector(this.startingPoint, this.releasingPoint)
        const coordinates = singleLineSelector.getCoordinatesForSingleLineSelection()
        this._buildLineInMarkerForCoordinates(coordinates)
    }

    /**
     * 
     * @param {Number} firstVisibleLine Contains the id of the first visible line 
     */
    _buildMarkerForMultilineSelection(firstVisibleLine) {
        const multilineCoordinates = this._findCoordinatesForMultilineSelection(firstVisibleLine)
        multilineCoordinates.forEach((coordinates) => {
            this._buildLineInMarkerForCoordinates(coordinates)
        });
    }

    /**
     * The coordinates can be reached by the id of the line
     * @param {Number} firstVisibleLine Contains the id of the first visible line 
     * @returns {Map} A map containing the coordinates of all lines.
     */
    _findCoordinatesForMultilineSelection(firstVisibleLine) {
        const multilineCodeSelector = new MultilineCodeSelector(this.startingPoint, this.releasingPoint)
        const cooridnatesForSelectedLines = multilineCodeSelector.markContent(firstVisibleLine)
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
            height: 28.8px;
            color: transparent;
        `
        marker.append(lineInMarker)
    }
}