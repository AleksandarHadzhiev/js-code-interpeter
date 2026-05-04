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
        const marker = document.getElementById('marker')

        this.algorithm = new LineColoriser(this.startingPoint, this.releasingPoint, this.contentElement)
        const multilineCoordinates = this.algorithm.coloriseLinesForWholeTextSelection(firstVisibleLine, lastVisibleLine, lines)
        multilineCoordinates.forEach((coordinates) => {
            this._buildLineInMarkerForCoordinates(coordinates, marker)
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
        const marker = document.getElementById('marker')

        this.algorithm = new LineColoriser(this.startingPoint, this.releasingPoint, this.contentElement)
        const multilineCoordinates = this.algorithm.coloriseLinesforLeftBetweenFirstAndLastVisibleLine(firstVisibleLine, lastVisibleLine)
        multilineCoordinates.forEach((coordinates) => {
            this._buildLineInMarkerForCoordinates(coordinates, marker)
        });
    }

    /**
     * 
     * @param {Number} firstVisibleLine 
     * @param {Number} lastVisibleLine 
     */
    buildForTopSection(firstVisibleLine, lastVisibleLine) {
        const marker = document.getElementById('marker')

        this.algorithm = new LineColoriser(this.startingPoint, this.releasingPoint, this.contentElement)
        const multilineCoordinates = this.algorithm.coloriseLinesForTopInBetweenFirstAndLastVisibleLines(firstVisibleLine, lastVisibleLine)
        multilineCoordinates.forEach((coordinates) => {
            this._buildLineInMarkerForCoordinates(coordinates, marker)
        });
    }


    /**
     * 
     * @param {Number} firstVisibleLine 
     * @param {Number} lastVisibleLine 
     * @param {Number} lastTextLine 
     */
    buildForBottomSection(firstVisibleLine, lastVisibleLine, lastTextLine) {
        const marker = document.getElementById('marker')
        this.algorithm = new LineColoriser(this.startingPoint, this.releasingPoint, this.contentElement)
        const multilineCoordinates = this.algorithm.coloriseLinesForBottomInBetweenFirstAndLastVisibleLines(firstVisibleLine, lastVisibleLine, lastTextLine)
        multilineCoordinates.forEach((coordinates) => {
            this._buildLineInMarkerForCoordinates(coordinates, marker)
        });
    }

    /**
 * 
 * @param {Number} firstVisibleLine 
 * @param {Number} lastVisibleLine 
 */
    buildForRightSection(firstVisibleLine, lastVisibleLine) {
        const marker = document.getElementById('marker')
        this.algorithm = new LineColoriser(this.startingPoint, this.releasingPoint, this.contentElement)
        const multilineCoordinates = this.algorithm.coloriseLinesforRightBetweenFirstAndLastVisibleLine(firstVisibleLine, lastVisibleLine)
        multilineCoordinates.forEach((coordinates) => {
            this._buildLineInMarkerForCoordinates(coordinates, marker)
        });
    }

    buildForMouseInEditorSection(firstVisibleLine, lastVisibleLine) {
        const marker = document.getElementById('marker')
        this.algorithm = new LineColoriser(this.startingPoint, this.releasingPoint, this.contentElement)
        const multilineCoordinates = this.algorithm.coloriseForMouseInEditorSection(firstVisibleLine, lastVisibleLine)
        multilineCoordinates.forEach((coordinates) => {
            this._buildLineInMarkerForCoordinates(coordinates, marker)
        });
    }

    /**
     * 
     * @param {Number} firstVisibleLine 
     * @param {Number} lastVisibleLine 
     */
    display(firstVisibleLine, lastVisibleLine) {
        const marker = document.getElementById('marker')
        if (this.algorithm) {
            const multilineCoordinates = this.algorithm.displayMarker(firstVisibleLine, lastVisibleLine)
            multilineCoordinates.forEach((coordinates) => {
                this._buildLineInMarkerForCoordinates(coordinates, marker)
            });
        }
    }

    /**
     * Creates a line and appends it to the marker.
     * @param {StartingPositionOfLine} coordinates 
     * @param {HTMLElement} marker 
     */
    _buildLineInMarkerForCoordinates(coordinates, marker) {
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