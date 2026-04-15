import LineColoriser from "./lineColoriser.js"
import { StartingPoint } from "../dtos/caretDTOs.js"

export default class CustomContentMarker {
    constructor(contentElement) {
        this.startingPoint = null
        this.releasingPoint = null
        this.algorithm = null
        this.contentElement = contentElement
    }

    /**
     * 
     * @param {Number} firstVisibleLine 
     * @param {Number} lastVisibleLine 
     * @param {Array} lines
     */
    buildForWholeTextSelection(firstVisibleLine, lastVisibleLine, lines) {
        this.algorithm = new LineColoriser(this.startingPoint, this.releasingPoint, this.contentElement)
        const multilineCoordinates = this.algorithm.coloriseLinesForWholeTextSelection(firstVisibleLine, lastVisibleLine, lines)
        multilineCoordinates.forEach((coordinates) => {
            this._buildLineInMarkerForCoordinates(coordinates)
        });
    }

    /**
     * @param {StartingPoint} starintPoint  
     * @param {StartingPoint} releasignPoint
     */
    updatePoints(starintPoint, releasignPoint) {
        this.startingPoint = starintPoint
        this.releasingPoint = releasignPoint
    }

    /**
     * 
     * @param {Number} firstVisibleLine 
     * @param {Number} lastVisibleLine 
     */
    buildForLeftSection(firstVisibleLine, lastVisibleLine) {
        this.algorithm = new LineColoriser(this.startingPoint, this.releasingPoint, this.contentElement)
        const multilineCoordinates = this.algorithm.coloriseLinesforLeftBetweenFirstAndLastVisibleLine(firstVisibleLine, lastVisibleLine)
        multilineCoordinates.forEach((coordinates) => {
            this._buildLineInMarkerForCoordinates(coordinates)
        });
    }

    /**
     * 
     * @param {Number} firstVisibleLine 
     * @param {Number} lastVisibleLine 
     */
    buildForTopSection(firstVisibleLine, lastVisibleLine) {
        this.algorithm = new LineColoriser(this.startingPoint, this.releasingPoint, this.contentElement)
        const multilineCoordinates = this.algorithm.coloriseLinesForTopInBetweenFirstAndLastVisibleLines(firstVisibleLine, lastVisibleLine)
        multilineCoordinates.forEach((coordinates) => {
            this._buildLineInMarkerForCoordinates(coordinates)
        });
    }


    /**
     * 
     * @param {Number} firstVisibleLine 
     * @param {Number} lastVisibleLine 
     * @param {Number} lastTextLine 
     */
    buildForBottomSection(firstVisibleLine, lastVisibleLine, lastTextLine) {
        this.algorithm = new LineColoriser(this.startingPoint, this.releasingPoint, this.contentElement)
        const multilineCoordinates = this.algorithm.coloriseLinesForBottomInBetweenFirstAndLastVisibleLines(firstVisibleLine, lastVisibleLine, lastTextLine)
        multilineCoordinates.forEach((coordinates) => {
            this._buildLineInMarkerForCoordinates(coordinates)
        });
    }

    /**
 * 
 * @param {Number} firstVisibleLine 
 * @param {Number} lastVisibleLine 
 */
    buildForRightSection(firstVisibleLine, lastVisibleLine) {
        this.algorithm = new LineColoriser(this.startingPoint, this.releasingPoint, this.contentElement)
        const multilineCoordinates = this.algorithm.coloriseLinesforRightBetweenFirstAndLastVisibleLine(firstVisibleLine, lastVisibleLine)
        multilineCoordinates.forEach((coordinates) => {
            this._buildLineInMarkerForCoordinates(coordinates)
        });
    }

    buildForMouseInEditorSection(firstVisibleLine, lastVisibleLine) {
        this.algorithm = new LineColoriser(this.startingPoint, this.releasingPoint, this.contentElement)
        const multilineCoordinates = this.algorithm.coloriseForMouseInEditorSection(firstVisibleLine, lastVisibleLine)
        multilineCoordinates.forEach((coordinates) => {
            this._buildLineInMarkerForCoordinates(coordinates)
        });
    }

    /**
     * 
     * @param {Number} firstVisibleLine 
     * @param {Number} lastVisibleLine 
     */
    display(firstVisibleLine, lastVisibleLine) {
        const multilineCoordinates = this.algorithm.displayMarker(firstVisibleLine, lastVisibleLine)
        multilineCoordinates.forEach((coordinates) => {
            this._buildLineInMarkerForCoordinates(coordinates)
        });
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